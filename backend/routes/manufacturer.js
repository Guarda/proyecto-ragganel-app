const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List all active manufacturers
router.get('/listar-fabricantes', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarFabricantes`();', (err, results) => {
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
    db.query('CALL `base_datos_inventario_taller`.`ListarFabricantesBase`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// Create a new fabricante
router.post('/ingresar-fabricante', (req, res) => {
    const { NombreFabricante  } = req.body;
    console.log(NombreFabricante );
    //console.log(req.body);

    const sql = 'CALL `base_datos_inventario_taller`.`IngresarFabricante` (?)';
    db.query(sql, [NombreFabricante ], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Fabricante agregado', id: result.insertId });
    });
});

// Delete a category
router.put('/fabricante-eliminar/:id', (req, res) => {
    const id = req.params.id;    
    const sql = 'CALL `base_datos_inventario_taller`.`SoftDeleteFabricante` (?)';
    db.query(sql, [id], err => {
        if (err) {
            res.status(500).send('Error al eliminar Fabricante');
            return;
        }
        res.send({ message: 'Fabricante eliminado' });
    });
});

module.exports = router;