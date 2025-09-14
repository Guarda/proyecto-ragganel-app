const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

// List all active manufacturers
router.get('/listar-fabricantes-accesorios', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarFabricantesAccesorios\`();`, (err, results) => {
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
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarFabricantesAccesoriosBase\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// List all manufacturers on any state
router.get('/listar-fabricantes-accesorios-c', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarFabricantesAccesoriosModelo\`();`, (err, results) => {
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
    const sql = `CALL \`${dbConfig.database}\`.\`ListarInformacionFabricanteAccesorioxId\` (?)`;
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
router.post('/ingresar-fabricante-accesorios', (req, res) => {
    const { NombreFabricanteAccesorio  } = req.body;
    // console.log(NombreFabricanteAccesorio );
    // console.log(req.body);

    const sql = `CALL \`${dbConfig.database}\`.\`IngresarFabricanteAccesorio\` (?)`;
    Basedatos.query(sql, [NombreFabricanteAccesorio ], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Fabricante agregado', id: result.insertId });
    });
});


// Delete a category
router.put('/fabricante-eliminar-accesorios/:id', (req, res) => {
    const id = req.params.id;    
    const sql = `CALL \`${dbConfig.database}\`.\`SoftDeleteFabricanteAccesorio\` (?)`;
    Basedatos.query(sql, [id], err => {
        if (err) {
            res.status(500).send('Error al eliminar Fabricante');
            return;
        }
        res.send({ message: 'Fabricante eliminado' });
    });
});

module.exports = router;