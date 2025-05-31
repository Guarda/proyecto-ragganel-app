const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List all margenes de venta
router.get('/margenes-venta', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarPreciosVenta`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});


module.exports = router;