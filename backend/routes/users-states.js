const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List all users states
router.get('/', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarEstadosUsuarios`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching users');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

module.exports = router;