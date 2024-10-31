const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List all active cate
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

// List all cate
router.get('/listar-cate-b', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarCategoriasProductosBase`();', (err, results) => {
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

// List all active subcate
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

// List all subcate by cate
router.get('/listar-subcate-b/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarSubCategoriasProductosxCategoriaBase` (?)';
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

// Delete a category
router.put('/categoria-eliminar/:id', (req, res) => {
    const id = req.params.id;    
    const sql = 'CALL `base_datos_inventario_taller`.`SofDeleteCategoria` (?)';
    db.query(sql, [id], err => {
        if (err) {
            res.status(500).send('Error al eliminar Categoria');
            return;
        }
        res.send({ message: 'Categoria eliminada' });
    });
});

// Create a new categorie
router.post('/ingresar-categoria', (req, res) => {
    const IdFabricante = req.query.IdFabricante;
    // Convert RealizadoValue to a number (0 or 1)
    const NombreCategoria = req.query.NombreCategoria; 
    //console.log(req.body);

    const sql = 'CALL `base_datos_inventario_taller`.`IngresarCategoria` (?, ?)';
    db.query(sql, [NombreCategoria, IdFabricante ], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Categoria agregada', id: result.insertId });
    });
});

// Create a new subcategorie
router.post('/ingresar-subcategoria', (req, res) => {
    const IdCategoria = req.query.IdCategoria;
    // Convert RealizadoValue to a number (0 or 1)
    const NombreSubCategoria = req.query.NombreSubCategoria; 
    //console.log(req.body);

    const sql = 'CALL `base_datos_inventario_taller`.`IngresarSubcategoria` (?, ?)';
    db.query(sql, [NombreSubCategoria, IdCategoria ], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Categoria agregada', id: result.insertId });
    });
});

// Delete a category
router.put('/subcategoria-eliminar/:id', (req, res) => {
    const id = req.params.id;    
    const sql = 'CALL `base_datos_inventario_taller`.`SofDeleteSubCategoria` (?)';
    db.query(sql, [id], err => {
        if (err) {
            res.status(500).send('Error al eliminar Subcategoria');
            return;
        }
        res.send({ message: 'Subategoria eliminada' });
    });
});

module.exports = router;