const express = require('express');
const router = express.Router();
const db = require('../config/db');


// List all orders types
router.get('/listar-tipo-pedidos', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarTiposPedidos`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching tipo pedidos');
            return;
        }
        res.json(results[0]);
    });
});

// List all websites
router.get('/listar-websites', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarWebsites`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching websites');
            return;
        }
        res.json(results[0]);
    });
});

// List all estados pedidos
router.get('/listar-estados-pedidos', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarEstadosPedidos`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching Estados Pedidos');
            return;
        }
        res.json(results[0]);
    });
});

module.exports = router;