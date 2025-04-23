const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List all accessories
router.get('/', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarTablaInsumosBase`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// List all accesories categories
router.get('/listar-categorias-insumos', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarCategoriasInsumosBase`();', (err, results) => {
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
    const sql = 'CALL `base_datos_inventario_taller`.`ListarTablaCatalogoInsumosXId` (?)';
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


// Get a specific supply with additional parameters
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
    const sql = 'CALL `base_datos_inventario_taller`.`BuscarIdCategoriaInsumoCatalogo` (?, ?, ?)';
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
router.post('/crear-insumo', (req, res) => {
    const { IdModeloInsumosPK, Cantidad, PrecioBase, EstadoInsumo, ComentarioInsumo, NumeroSerie, StockMinimo } = req.body;
    console.log(req.body);

    // Convert arrays to comma-separated strings
    // const CompatibleProductsString = ProductosCompatibles.join(',');
    // const TodoListString = TodoList.join(',');

    const sql = 'CALL `base_datos_inventario_taller`.`IngresarInsumoATablaInsumosBase` (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [IdModeloInsumosPK, EstadoInsumo, ComentarioInsumo, PrecioBase, Cantidad, NumeroSerie, StockMinimo], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Producto agregado', id: result.insertId });
    });
});

// Get a specific accessorie
router.get('/insumo/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarTablaInsumosBasesXId` (?)';
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
router.put('/insumo/:id', (req, res) => {
    const id = req.params.id; // Assuming this is the CodigoConsola
    const { CodigoInsumo, IdModeloInsumoPK, Cantidad, EstadoInsumo, Comentario, PrecioBase, NumeroSerie, StockMinimo } = req.body;
    // console.log(req.body);
    const sql = 'CALL base_datos_inventario_taller.ActualizarInsumoBase(?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(
        sql,
        [
            CodigoInsumo,        // CodigoInsumoA
            IdModeloInsumoPK,    // ModeloInsumoA
            EstadoInsumo,        // EstadoInsumoA
            PrecioBase,          // PrecioInsumoA
            Comentario,          // ComentarioInsumoA
            NumeroSerie,         // NumeroSerieInsumoA
            Cantidad,            // CantidadInsumoA
            StockMinimo          // StockMinimoInsumoA
        ]
        , err => {
            if (err) {
                res.status(500).send('Error actualizando insumo');
                return;
            }
            // Fetch the updated product to return the updated details        
        });
});

// Delete a supply
router.put('/insumo-eliminar/:id', (req, res) => {
    const id = req.params.id;
    const { CodigoInsumo } = req.body;
    const sql = 'CALL `base_datos_inventario_taller`.`BorrarInsumo` (?)';
    db.query(sql, [CodigoInsumo], err => {
        if (err) {
            res.status(500).send('Error al eliminar accesorio');
            return;
        }
        res.send({ message: 'Accesorio eliminado' });
    });
});




module.exports = router;