const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List all active cate
router.get('/listar-cate-accesorio', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarCategoriasAccesorios`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// List all active subcate
router.get('/listar-subcate-accesorio', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarSubCategoriasAccesorios`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

module.exports = router;