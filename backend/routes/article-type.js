const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List all orders types
router.get('/listar-tipo-articulo', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarTipoArticulo`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching tipo pedidos');
            return;
        }
        res.json(results[0]);
    });
})

// Get a specific active category
router.get('/informacion-tipo-articulo/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarInformacionTipoArticuloXId` (?)';
    db.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).send('Error al buscar la categoria');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Categoria no encontrada');
            return;
        }
        res.json(result[0]);
    });
});

module.exports = router;