const express = require('express');
const { Basedatos, dbConfig } = require('../config/db');

const router = express.Router();

// List all active supplies manufacturers
router.get('/listar-fabricantes-insumos', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarFabricantesInsumos\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching manufacturers');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// List all supplies manufacturers on any state
router.get('/listar-fabricantes-insumos-b', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarFabricantesInsumosBase\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching manufacturers');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// List all supplies manufacturers on any state
router.get('/listar-fabricantes-insumos-c', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarFabricantesInsumosModelo\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching manufacturers');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// Get a specific active supply manufacturer
router.get('/info-fabricante/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarInformacionFabricanteInsumoxId\` (?)`;
    Basedatos.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).send('Error fetching manufacturer information');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Manufacturer not found');
            return;
        }
        res.json(result[0]);
    });
});

// Create a new supply manufacturer
router.post('/ingresar-fabricante-insumos', (req, res) => {
    const { NombreFabricanteInsumo } = req.body;

    const sql = `CALL \`${dbConfig.database}\`.\`IngresarFabricanteInsumo\` (?)`;
    Basedatos.query(sql, [NombreFabricanteInsumo], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Manufacturer added', id: result.insertId });
    });
});

// Delete a supply manufacturer
router.put('/fabricante-eliminar-insumos/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`SoftDeleteFabricanteInsumo\` (?)`;
    Basedatos.query(sql, [id], err => {
        if (err) {
            res.status(500).send('Error deleting manufacturer');
            return;
        }
        res.send({ message: 'Manufacturer deleted' });
    });
});

module.exports = router;