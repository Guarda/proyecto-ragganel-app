const express = require('express');
const router = express.Router();
// 1. Importamos la configuración centralizada
const { Basedatos, dbConfig } = require('../config/db');

// Get the list of tasks by a specific product
router.get('/tareas/:id', (req, res) => {
    const id = req.params.id;
    // 2. Hacemos la consulta dinámica
    const sql = `CALL \`${dbConfig.database}\`.\`ListarTareasxAccesorio\`(?)`;
    
    // 3. Usamos 'Basedatos.query'
    Basedatos.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).send('Error al buscar producto');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Producto no encontrado');
            return;
        }
        res.json(result[0]);
    });
});

// Update a task
router.put('/tareas', (req, res) => {
    const IdTareaPK = req.query.IdTareaPK;
    const RealizadoValue = req.query.RealizadoValue; 

    if (!IdTareaPK || typeof RealizadoValue === 'undefined') {
        return res.status(400).send('Missing one or more required parameters.');
    }

    console.log('Updating task with:', { IdTareaPK, RealizadoValue });

    // 2. Hacemos la consulta dinámica
    const sql = `CALL \`${dbConfig.database}\`.\`ActualizarTareaAccesorioRealizado\`(?, ?)`;
    
    // 3. Usamos 'Basedatos.query'
    Basedatos.query(sql, [IdTareaPK, RealizadoValue], (err, result) => {
        if (err) {
            console.error('Error updating task:', err);
            return res.status(500).send('Error actualizando tarea');
        }
        res.json(result);
    });
});

module.exports = router;