const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create a new category
router.post('/crear-categoria-producto', (req, res) => {
    const { Fabricante, Cate, SubCategoria, CodigoModeloConsola, LinkImagen, TipoProducto } = req.body;
    const sql = 'CALL `base_datos_inventario_taller`.`IngresarCategoriaProducto` (?, ?, ?, ?, ?, ?)';
    db.query(sql, [Fabricante, Cate, SubCategoria, CodigoModeloConsola, LinkImagen, TipoProducto], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Categoria agregada', id: result.insertId });
    });
});

// Get a specific category
router.get('/categoria/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarTablacatalogoconsolasXId` (?)';
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

// Get a specific product with additional parameters
router.get('/categoria', (req, res) => {
    // Extract parameters from the query string
    const fabricante = req.query.Fabricante;
    const categoria = req.query.Categoria;
    const subcategoria = req.query.Subcategoria;
    //console.log(fabricante)

    // Ensure all required parameters are provided
    if (!fabricante || !categoria || !subcategoria) {
        return res.status(400).send('Missing one or more required parameters.');
    }

    // Call the stored procedure with three parameters
    const sql = 'CALL `base_datos_inventario_taller`.`BuscarIdCategoriaCatalogo` (?, ?, ?)';
    db.query(sql, [fabricante, categoria, subcategoria], (err, result) => {
        if (err) {
            console.error('Error executing stored procedure:', err);
            return res.status(500).send('Error al buscar categoria');
        }
        if (result[0].length === 0) {
            return res.status(404).send('Producto no categoria');
        }
        res.json(result[0]);
    });
});

// Update a category
router.put('/categoria/:id', (req, res) => {
    const id = req.params.id;
    const { IdModeloConsolaPK, Fabricante, Cate, SubCategoria, CodigoModeloConsola, LinkImagen, TipoProducto } = req.body;
    const sql = 'CALL `base_datos_inventario_taller`.`ActualizarCategoria` (?, ?, ?, ?, ?, ?, ?)';
    const sql2 = 'CALL `base_datos_inventario_taller`.`ListarTablacatalogoconsolasXId` (?)';
    db.query(sql, [IdModeloConsolaPK, Fabricante, Cate, SubCategoria, CodigoModeloConsola, LinkImagen, TipoProducto ], err => {
        if (err) {
            res.status(500).send('Error actualizando categoria');
            return;
        }
        db.query(sql2, id, (err, result) => {
            if (err) {
                res.status(500).send('Error al buscar categoria actualizada');
                return;
            }
            res.json(result[0]);
        });
    });
});

// Delete a category
router.put('/categoria-eliminar/:id', (req, res) => {
    const id = req.params.id;
    const { IdModeloConsolaPK } = req.body;
    const sql = 'CALL `base_datos_inventario_taller`.`BorrarCategoria` (?)';
    db.query(sql, [IdModeloConsolaPK], err => {
        if (err) {
            res.status(500).send('Error al eliminar categoria');
            return;
        }
        res.send({ message: 'Categoria eliminada' });
    });
});

module.exports = router;