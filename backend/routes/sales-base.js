const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List all sales margins types
router.get('/margenes-venta', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarPreciosVenta`();', (err, results) => {
        if (err) {
            res.status(500).send('Error margins types');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// List all payment methods
router.get('/metodos-de-pago', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarMetodosDePago`();', (err, results) => {
        if (err) {
            res.status(500).send('Error payment methods');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

module.exports = router;