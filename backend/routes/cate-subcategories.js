const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List all cate
router.get('/listar-cate', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarCategoriasProductos`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// List all cate by manufacturer
router.get('/listar-cate/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarCategoriasProductosxFabricante` (?)';
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

// List all subcate
router.get('/listar-subcate', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarSubCategoriasProductos`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// List all subcate by cate
router.get('/listar-subcate/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarSubCategoriasProductosxCategoria` (?)';
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