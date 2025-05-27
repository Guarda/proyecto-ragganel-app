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

router.put('/producto/:id', (req, res) => {
    const id = req.params.id;
    const { IdModeloConsolaPK, ColorConsola, EstadoConsola, HackConsola, ComentarioConsola, PrecioBase, NumeroSerie, Accesorios } = req.body;

    const AccesoriosString = Accesorios.join(',');
    const sql = 'CALL `base_datos_inventario_taller`.`Actualizarproductobasev2` (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(sql, [id, IdModeloConsolaPK, ColorConsola, EstadoConsola, HackConsola, PrecioBase, ComentarioConsola, NumeroSerie, AccesoriosString], err => {
        if (err) {
            res.status(500).send('Error actualizando producto');
            return;
        }
        // Aquí respondemos que todo salió bien
        res.status(200).json({ message: 'Producto actualizado correctamente' });
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

// Get Order article list 
router.get('/historial-producto/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarHistorialEstadoProductoXId` (?)';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error al obtener historial:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }
        res.json(results[0]); // Devuelve el primer conjunto de resultados
    });
});


module.exports = router;