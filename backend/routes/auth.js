const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/keys');

router.post('/login', (req, res) => {
    const { Correo, Password } = req.body;

    if (!Correo || !Password) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    const sql = 'CALL VerificarUsuarioPorCorreo(?)';
    db.query(sql, [Correo], (err, results) => {
        if (err) {
            console.error('Error en la base de datos:', err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (results[0].length === 0) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }

        const usuario = results[0][0];

        bcrypt.compare(Password, usuario.Password, (err, isMatch) => {
            if (err) {
                console.error('Error al comparar las contraseñas:', err);
                return res.status(500).json({ error: 'Error al comparar las contraseñas' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
            }

            const payload = {
                usuarioId: usuario.IdUsuarioPK,
                nombre: usuario.Nombre,
                correo: usuario.Correo,
                rol: usuario.IdRolFK,
                avatarUrl: usuario.AvatarUrl  // Incluye el avatar del usuario
            };

            const token = jwt.sign(payload, config.JWT_SECRET_KEY, { expiresIn: '1h' });

            res.json({
                message: 'Inicio de sesión exitoso',
                token: 'Bearer ' + token,
                user: {  // Enviar la información del usuario (nombre, correo, avatar)
                    id: usuario.IdUsuarioPK,
                    name: usuario.Nombre,
                    email: usuario.Correo,
                    role: usuario.IdRolFK,
                    avatarUrl: usuario.AvatarUrl
                }
            });
        });
    });
});

// Middleware de verificación de token
function verifyToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(403).json({ message: 'Acceso denegado, token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token no válido o expirado' });
    }
}

// Exporta el router y la función verifyToken por separado
module.exports = router;
module.exports.verifyToken = verifyToken;
