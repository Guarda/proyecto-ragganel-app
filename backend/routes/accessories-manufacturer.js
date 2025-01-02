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

// List all manufacturers on any state
router.get('/listar-fabricantes-accesorios-c', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarFabricantesAccesoriosModelo`();', (err, results) => {
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
    const sql = 'CALL `base_datos_inventario_taller`.`ListarInformacionFabricanteAccesorioxId` (?)';
    db.query(sql, id, (err, result) => {
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

    const sql = 'CALL `base_datos_inventario_taller`.`IngresarFabricanteAccesorio` (?)';
    db.query(sql, [NombreFabricanteAccesorio ], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Fabricante agregado', id: result.insertId });
    });
});


// Delete a category
router.put('/fabricante-eliminar-accesorios/:id', (req, res) => {
    const id = req.params.id;    
    const sql = 'CALL `base_datos_inventario_taller`.`SoftDeleteFabricanteAccesorio` (?)';
    db.query(sql, [id], err => {
        if (err) {
            res.status(500).send('Error al eliminar Fabricante');
            return;
        }
        res.send({ message: 'Fabricante eliminado' });
    });
});

module.exports = router;