const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List all active manufacturers
router.get('/listar-fabricantes-accesorios', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarFabricantesAccesorios`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// List all manufacturers on any state
router.get('/listar-fabricantes-accesorios-b', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarFabricantesAccesoriosBase`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

module.exports = router;