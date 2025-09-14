const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

// List all active manufacturers
router.get('/listar-fabricantes', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarFabricantes\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// List all manufacturers on any state
router.get('/listar-fabricantes-b', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarFabricantesBase\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// List all manufacturers on any state
router.get('/listar-fabricantes-c', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarFabricantesModelo\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// Get a specific active category
router.get('/info-farbicante/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarInformacionFabricantexId\` (?)`;
    Basedatos.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).send('Error al buscar la categoria');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Categoria no encontrada');
            return;
        }
        res.json(result[0]);
    });
});

// Create a new fabricante
router.post('/ingresar-fabricante', (req, res) => {
    const { NombreFabricante  } = req.body;
    console.log(NombreFabricante );
    //console.log(req.body);

    const sql = `CALL \`${dbConfig.database}\`.\`IngresarFabricante\` (?)`;
    Basedatos.query(sql, [NombreFabricante ], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Fabricante agregado', id: result.insertId });
    });
});

// Delete a category
router.put('/fabricante-eliminar/:id', (req, res) => {
    const id = req.params.id;    
    const sql = `CALL \`${dbConfig.database}\`.\`SoftDeleteFabricante\` (?)`;
    Basedatos.query(sql, [id], err => {
        if (err) {
            res.status(500).send('Error al eliminar Fabricante');
            return;
        }
        res.send({ message: 'Fabricante eliminado' });
    });
});

module.exports = router;