const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List all accessories
router.get('/', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarTablaAccesoriosBase`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// List all accesories categories
router.get('/listar-categorias-accesorios', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarCategoriasAccesoriosBase`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching categorias');
            return;
        }
        res.json(results[0]);
    });
});

// Get a specific active category
router.get('/categoria/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarTablacatalogoaccesoriosXId` (?)';
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
    const sql = 'CALL `base_datos_inventario_taller`.`BuscarIdCategoriaAccesorioCatalogo` (?, ?, ?)';
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

// Create a new product
router.post('/crear-accesorio', (req, res) => {
    const { IdModeloAccesorioPK, ColorAccesorio, PrecioBase, EstadoAccesorio, ComentarioAccesorio, NumeroSerie, TodoList } = req.body;
    // console.log(req.body);

    // Convert arrays to comma-separated strings
    const TodoListString = TodoList.join(',');

    const sql = 'CALL `base_datos_inventario_taller`.`IngresarAccesorioATablaAccesoriosBase` (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [IdModeloAccesorioPK, ColorAccesorio, EstadoAccesorio, PrecioBase, ComentarioAccesorio, NumeroSerie, TodoListString], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Producto agregado', id: result.insertId });
    });
});

// Get a specific accessorie
router.get('/accesorio/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarTablaAccesoriosBasesXId` (?)';
    db.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).send('Error al buscar accesorio');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Producto no encontrado');
            return;
        }
        res.json(result[0]);
    });
});

// Update an accessorie
router.put('/accesorio/:id', (req, res) => {
    const id = req.params.id; // Assuming this is the CodigoConsola
    const { IdModeloAccesorioPK, ColorAccesorio, EstadoAccesorio, ComentarioAccesorio, PrecioBase, NumeroSerie } = req.body;

    // Convert arrays to comma-separated strings
    // Adjust the SQL query to call the new stored procedure
    const sql = 'CALL `base_datos_inventario_taller`.`ActualizarAccesorioBase` (?, ?, ?, ?, ?, ?, ?)';

    // Call the new stored procedure with the updated parameters
    db.query(sql, [id, IdModeloAccesorioPK, ColorAccesorio, EstadoAccesorio, PrecioBase, ComentarioAccesorio, NumeroSerie], err => {
        if (err) {
            res.status(500).send('Error actualizando producto');
            return;
        }
        // Fetch the updated product to return the updated details        
    });
});

// Delete an accessorie
router.put('/accesorio-eliminar/:id', (req, res) => {
    const id = req.params.id;
    const { CodigoAccesorio } = req.body;
    const sql = 'CALL `base_datos_inventario_taller`.`BorrarAccesorio` (?)';
    db.query(sql, [CodigoAccesorio], err => {
        if (err) {
            res.status(500).send('Error al eliminar accesorio');
            return;
        }
        res.send({ message: 'Accesorio eliminado' });
    });
});

module.exports = router;