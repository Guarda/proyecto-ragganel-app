const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get the list of tasks by a specific product
router.get('/tareas/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarTareasxProducto` (?)';
    db.query(sql, id, (err, result) => {
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
    // Convert RealizadoValue to a number (0 or 1)
    const RealizadoValue = req.query.RealizadoValue; 

    // Ensure all required parameters are provided
    if (!IdTareaPK || typeof RealizadoValue === 'undefined') {
        return res.status(400).send('Missing one or more required parameters.');
    }

    console.log('Updating task with:', { IdTareaPK, RealizadoValue }); // Debugging log

    const sql = 'CALL `base_datos_inventario_taller`.`ActualizarTareaRealizado` (?, ?)';
    db.query(sql, [IdTareaPK, RealizadoValue], (err, result) => {
        if (err) {
            console.error('Error updating task:', err); // Log any error for debugging
            return res.status(500).send('Error actualizando tarea');
        }
        res.json(result); // Send back the result
    });
});


module.exports = router;