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

// List all cate
router.get('/listar-cate-accesorio-b', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarCategoriasAccesoriosB`();', (err, results) => {
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

// List all cate by manufacturer
router.get('/listar-cate-accesorio/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarCategoriasAccesoriosxFabricante` (?)';
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

// List all subcate by cate
router.get('/listar-subcate-accesorio/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarSubCategoriasAccesoriossxCategoria` (?)';
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

// List all subcate by cate
router.get('/listar-subcate-accesorio-b/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarSubCategoriasAccesoriosxCategoriaBase` (?)';
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

module.exports = router;