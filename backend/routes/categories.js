const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

// Create a new category
router.post('/crear-categoria-producto', (req, res) => {
    const { Fabricante, Cate, SubCategoria, CodigoModeloConsola, LinkImagen, TipoProducto } = req.body;
    const sql = `CALL \`${dbConfig.database}\`.\`IngresarCategoriaProducto\` (?, ?, ?, ?, ?, ?)`;
    Basedatos.query(sql, [Fabricante, Cate, SubCategoria, CodigoModeloConsola, LinkImagen, TipoProducto], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Categoria agregada', id: result.insertId });
    });
});

// Get a specific active category
router.get('/categoria/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarTablacatalogoconsolasXId\` (?)`;
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
    const sql = `CALL \`${dbConfig.database}\`.\`BuscarIdCategoriaCatalogo\` (?, ?, ?)`;
    Basedatos.query(sql, [fabricante, categoria, subcategoria], (err, result) => {
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

// En tu router de categorías (ej. categories.js)
router.get('/check-exists', (req, res) => {
    const { fab, cat, sub } = req.query;

    const sql = `CALL \`${dbConfig.database}\`.\`sp_CheckSuperCategoriaActivaExists\`(?, ?, ?);`;

    Basedatos.query(sql, [fab, cat, sub], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor.' });
        }
        // results[0][0].existe será 1 si existe, 0 si no.
        res.json(results[0][0]);
    });
});

// Update a category
router.put('/categoria/:id', (req, res) => {
    const id = req.params.id;
    const { IdModeloConsolaPK, Fabricante, Cate, SubCategoria, CodigoModeloConsola, LinkImagen, TipoProducto } = req.body;
    const sql = `CALL \`${dbConfig.database}\`.\`ActualizarCategoria\` (?, ?, ?, ?, ?, ?, ?)`;
    const sql2 = `CALL \`${dbConfig.database}\`.\`ListarTablacatalogoconsolasXId\` (?)`;
    Basedatos.query(sql, [IdModeloConsolaPK, Fabricante, Cate, SubCategoria, CodigoModeloConsola, LinkImagen, TipoProducto], err => {
        if (err) {
            res.status(500).send('Error actualizando categoria');
            return;
        }
        Basedatos.query(sql2, id, (err, result) => {
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
    const sql = `CALL \`${dbConfig.database}\`.\`BorrarCategoria\` (?)`;
    Basedatos.query(sql, [IdModeloConsolaPK], err => {
        if (err) {
            res.status(500).send('Error al eliminar categoria');
            return;
        }
        res.send({ message: 'Categoria eliminada' });
    });
});

module.exports = router;