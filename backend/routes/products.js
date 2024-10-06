const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List all products
router.get('/', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarTablaProductosBases`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// List all categories
router.get('/listar-categorias', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarCategoriasConsolasBase`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching categorias');
            return;
        }
        res.json(results[0]);
    });
});

// List all console states
router.get('/listar-estados', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarEstadosConsolas`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching estados');
            return;
        }
        res.json(results[0]);
    });
});

// List all product types
router.get('/listar-tipos-productos', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarTiposProductos`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching tipos de productos');
            return;
        }
        res.json(results[0]);
    });
});

// List Accesories by product type.

// Create a new product
router.post('/crear-producto', (req, res) => {
    const { Fabricante, Cate, SubCategoria, IdModeloConsolaPK, ColorConsola, PrecioBase, EstadoConsola, HackConsola, ComentarioConsola, Accesorios, NumeroSerie, TodoList } = req.body;
    //console.log(req.body);

    // Convert arrays to comma-separated strings
    const AccesoriosString = Accesorios.join(',');
    const TodoListString = TodoList.join(',');

    const sql = 'CALL `base_datos_inventario_taller`.`IngresarProductoATablaProductoBaseV4` (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [IdModeloConsolaPK, ColorConsola, EstadoConsola, HackConsola, PrecioBase, ComentarioConsola, NumeroSerie, AccesoriosString, TodoListString], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Producto agregado', id: result.insertId });
    });
});

// Get a specific product
router.get('/producto/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarTablaProductosBasesXIdV2` (?)';
    db.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).send('Error al buscar producto');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Producto no encontrado');
            return;
        }
        res.json(result[0]);
    });
});

// Update a product
router.put('/producto/:id', (req, res) => {
    const id = req.params.id; // Assuming this is the CodigoConsola
    const { IdModeloConsolaPK, ColorConsola, EstadoConsola, HackConsola, ComentarioConsola, PrecioBase, NumeroSerie, Accesorios } = req.body;

    // console.log('Updating product with params:', {
    //     IdModeloConsolaPK, 
    //     ColorConsola, 
    //     EstadoConsola, 
    //     HackConsola, 
    //     PrecioBase, 
    //     ComentarioConsola, 
    //     NumeroSerie, 
    //     Accesorios
    // });
    // Convert arrays to comma-separated strings
    const AccesoriosString = Accesorios.join(',');
    // Adjust the SQL query to call the new stored procedure
    const sql = 'CALL `base_datos_inventario_taller`.`Actualizarproductobasev2` (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    // Call the new stored procedure with the updated parameters
    db.query(sql, [id, IdModeloConsolaPK, ColorConsola, EstadoConsola, HackConsola, PrecioBase, ComentarioConsola, NumeroSerie, AccesoriosString], err => {
        if (err) {
            res.status(500).send('Error actualizando producto');
            return;
        }
        // Fetch the updated product to return the updated details        
    });
});

// Delete a product
router.put('/producto-eliminar/:id', (req, res) => {
    const id = req.params.id;
    const { CodigoConsola } = req.body;
    const sql = 'CALL `base_datos_inventario_taller`.`BorrarProducto` (?)';
    db.query(sql, [CodigoConsola], err => {
        if (err) {
            res.status(500).send('Error al eliminar producto');
            return;
        }
        res.send({ message: 'Producto eliminado' });
    });
});

module.exports = router;