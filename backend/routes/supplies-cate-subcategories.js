const express = require('express');
const db = require('../config/db');

const router = express.Router();

// List all active supplies categories
router.get('/listar-cate-insumos', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarCategoriasInsumos`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching categories');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// List all supplies categories
router.get('/listar-cate-insumos-b', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarCategoriasInsumosBase`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching categories');
            console.log(err);
            return;
        }        
        res.json(results[0]);
    });
});

// List all active supplies subcategories
router.get('/listar-subcate-insumos', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarSubCategoriasInsumos`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching subcategories');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// List all supplies categories by manufacturer
router.get('/listar-cate-insumos/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarCategoriasInsumosxFabricante` (?)';
    db.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).send('Error fetching category');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Category not found');
            return;
        }
        res.json(result[0]);
    });
});

// List all supplies categories by active model
router.get('/listar-cate-insumos-b/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarCategoriasInsumosxModeloActivo` (?)';
    db.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).send('Error fetching category');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Category not found');
            return;
        }
        res.json(result[0]);
    });
});

// List supplies category info by id
router.get('/informacion-categoria/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarInformacionCategoriaInsumoxId` (?)';
    db.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).send('Error fetching category');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Category not found');
            return;
        }
        res.json(result[0]);
    });
});

// List all supplies subcategories by category
router.get('/listar-subcate-insumos/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarSubCategoriasInsumosxCategoria` (?)';
    db.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).send('Error fetching subcategory');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Subcategory not found');
            return;
        }
        res.json(result[0]);
    });
});

// List all supplies subcategories with an active model
router.get('/listar-subcate-insumos-c/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarSubCategoriasInsumosxModeloActivo` (?)';
    db.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).send('Error fetching subcategory');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Subcategory not found');
            return;
        }
        res.json(result[0]);
    });
});

// Create a new supplies category
router.post('/ingresar-categoria-insumos', (req, res) => {
    const IdFabricante = req.query.IdFabricanteInsumo;
    const NombreCategoria = req.query.NombreCategoriaInsumo; 
    console.log('prueba cate');

    const sql = 'CALL `base_datos_inventario_taller`.`IngresarCategoriaInsumoB` (?, ?)';
    db.query(sql, [NombreCategoria, IdFabricante], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Category added', id: result.insertId });
    });
});

// List supplies subcategory info by id
router.get('/informacion-subcategoria/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarInformacionSubCategoriaInsumoxId` (?)';
    db.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).send('Error fetching subcategory');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Subcategory not found');
            return;
        }
        res.json(result[0]);
    });
});

// Delete a supplies category
router.put('/categoria-eliminar-insumos/:id', (req, res) => {
    const id = req.params.id;    
    const sql = 'CALL `base_datos_inventario_taller`.`SofDeleteCategoriaInsumo` (?)';
    db.query(sql, [id], err => {
        if (err) {
            res.status(500).send('Error deleting category');
            return;
        }
        res.send({ message: 'Category deleted' });
    });
});

// Create a new supplies subcategory
router.post('/ingresar-subcategoria-insumos', (req, res) => {
    const IdCategoria = req.query.IdCategoriaInsumo;
    const NombreSubCategoria = req.query.NombreSubCategoriaInsumo; 

    const sql = 'CALL `base_datos_inventario_taller`.`IngresarSubcategoriaInsumos` (?, ?)';
    db.query(sql, [NombreSubCategoria, IdCategoria], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Subcategory added', id: result.insertId });
    });
});

// Delete a supplies subcategory
router.put('/subcategoria-eliminar-insumos/:id', (req, res) => {    
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`SofDeleteSubCategoriaInsumo` (?)';
    db.query(sql, [id], err => {
        if (err) {
            res.status(500).send('Error deleting subcategory');
            return;
        }
        res.send({ message: 'Subcategory deleted' });
    });
});

module.exports = router;