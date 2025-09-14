const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');


// List all orders types
router.get('/listar-tipo-pedidos', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarTiposPedidos\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching tipo pedidos');
            return;
        }
        res.json(results[0]);
    });
});

// List all websites
router.get('/listar-websites', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarWebsites\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching websites');
            return;
        }
        res.json(results[0]);
    });
});

// List all estados pedidos
router.get('/listar-estados-pedidos', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarEstadosPedidos\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching Estados Pedidos');
            return;
        }
        res.json(results[0]);
    });
});

module.exports = router;