const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List all accessories
router.get('/', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarTablaAccesoriosBase`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// List all accesories categories
router.get('/listar-categorias-accesorios', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarCategoriasAccesoriosBase`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching categorias');
            return;
        }
        res.json(results[0]);
    });
});

module.exports = router;