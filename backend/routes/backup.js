const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { dbConfig } = require('../config/db');
const verifyToken = require('../middleware/authMiddleware');
const adminOnlyGuard = require('../middleware/admin.guard.js');

router.get('/create', verifyToken, adminOnlyGuard, (req, res) => {
    
    console.log('Solicitud de backup recibida del admin:', req.usuario.nombre); 

    try {
        const DB_NAME = 'base_datos_inventario_taller';
        const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        const filename = `backup-ragganel-tech-${timestamp}.sql`;
        
        const backupDir = path.join(__dirname, '..', '..', 'public', 'backups');
        const backupFilePath = path.join(backupDir, filename);

        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const writeStream = fs.createWriteStream(backupFilePath);

        const command = process.env.MYSQLDUMP_PATH || 'mysqldump';
        console.log(`Ejecutando comando: ${command}`);

        const mysqldumpArgs = [
            '--host', dbConfig.host,
            '--user', dbConfig.user,
            '--no-tablespaces',
            DB_NAME
        ];
        const env = { ...process.env, MYSQL_PWD: dbConfig.password };

        const mysqldump = spawn(command, mysqldumpArgs, { env: env });

        mysqldump.stdout
            .pipe(writeStream)
            .on('finish', () => {
                console.log(`Backup creado exitosamente: ${filename}`);
                res.status(200).json({
                    success: true,
                    message: `¡Backup "${filename}" creado exitosamente!`,
                    filename: filename,
                    path: `/backups/${filename}` 
                });
            })
            .on('error', (err) => {
                console.error(`Error al escribir el archivo: ${err.message}`);
                res.status(500).json({ success: false, message: 'Error al guardar el archivo en el servidor.' });
            });

        mysqldump.stderr.on('data', (data) => {
            console.error(`Error en mysqldump: ${data.toString()}`);
        });

        mysqldump.on('close', (code) => {
            if (code !== 0 && !res.headersSent) {
                console.error(`mysqldump se cerró con código ${code}`);
                res.status(500).json({ success: false, message: `Error de mysqldump (código: ${code}).` });
            }
        });

    } catch (error) {
        console.error("Error en la ruta de backup:", error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

module.exports = router;