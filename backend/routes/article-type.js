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

module.exports = router;