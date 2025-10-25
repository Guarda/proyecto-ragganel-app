const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

// List all accessories
router.get('/', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarTablaInsumosBase\`();`, (err, results) => {
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
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarCategoriasInsumosBase\`();`, (err, results) => {
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
    const sql = `CALL \`${dbConfig.database}\`.\`ListarTablaCatalogoInsumosXId\` (?)`;
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

// Get a specific active category
router.get('/categoria-b/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarTablacatalogoainsumosXIdB\` (?)`;
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
    const sql = `CALL \`${dbConfig.database}\`.\`BuscarIdCategoriaInsumoCatalogo\` (?, ?, ?)`;
    Basedatos.query(sql, [fabricante, categoria, subcategoria], (err, result) => {
        if (err) {
            console.error('Error executing stored procedure:', err);
            return res.status(500).send('Error al buscar categoria');
        }
        if (result[0].length === 0) {
            return res.status(404).send('Categoria de insumo no encontrada');
        }
        res.json(result[0]);
    });
});

// Get a specific supply with additional parameters
router.get('/categoria-b', (req, res) => {
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
    const sql = `CALL \`${dbConfig.database}\`.\`BuscarIdCategoriaInsumoCatalogob\` (?, ?, ?)`;
    Basedatos.query(sql, [fabricante, categoria, subcategoria], (err, result) => {
        if (err) {
            console.error('Error executing stored procedure:', err);
            return res.status(500).send('Error al buscar categoria');
        }
        if (result[0].length === 0) {
            return res.status(404).send('Categoria de insumo no encontrada');
        }
        res.json(result[0]);
    });
});

// Create a new product
router.post('/crear-insumo', (req, res) => {
    // 1. Añadimos IdUsuario a la desestructuración del body
    const { IdModeloInsumosPK, Cantidad, PrecioBase, EstadoInsumo, ComentarioInsumo, NumeroSerie, StockMinimo, IdUsuario } = req.body;

    // 2. Se añade un '?' para el nuevo parámetro del SP
    const sql = `CALL \`${dbConfig.database}\`.\`IngresarInsumoATablaInsumosBase\` (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    // 3. Pasamos IdUsuario como el último parámetro en el array
    Basedatos.query(sql, [IdModeloInsumosPK, EstadoInsumo, ComentarioInsumo, PrecioBase, Cantidad, NumeroSerie, StockMinimo, IdUsuario], (err, result) => {
        if (err) {
            console.error("Error al ejecutar SP para crear insumo:", err);
            return res.status(500).send(err);
        }
        res.send({ message: 'Insumo agregado', id: result.insertId });
    });
});

// Get a specific accessorie
router.get('/insumo/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarTablaInsumosBasesXId\` (?)`;
    Basedatos.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).send('Error al buscar accesorio');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Insumo no encontrado');
            return;
        }
        res.json(result[0]);
    });
});

router.put('/insumo/:id', (req, res) => {
    const id = req.params.id;
    // 1. Añadimos IdUsuario a la desestructuración del body
    const {
        CodigoInsumo,
        IdModeloInsumoPK,
        Cantidad,
        EstadoInsumo,
        Comentario,
        PrecioBase,
        NumeroSerie,
        StockMinimo,
        IdUsuario 
    } = req.body;

    // 2. Se añade un '?' para el nuevo parámetro del SP
    const sql = `CALL \`${dbConfig.database}\`.\`ActualizarInsumoBase\`(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // 3. Pasamos IdUsuario como el último parámetro en el array
    Basedatos.query(
        sql,
        [
            CodigoInsumo,
            IdModeloInsumoPK,
            EstadoInsumo,
            PrecioBase,
            Comentario,
            NumeroSerie,
            Cantidad,
            StockMinimo,
            IdUsuario
        ],
        (err) => {
            if (err) {
                console.error("Error al ejecutar SP para actualizar insumo:", err);
                res.status(500).send('Error actualizando insumo');
                return;
            }
            res.status(200).json({ success: true, message: 'Insumo actualizado correctamente' });
        }
    );
});

// Delete a supply
router.put('/insumo-eliminar/:id', (req, res) => {
    // 1. Añadimos IdUsuario a la desestructuración del body
    const { CodigoInsumo, IdUsuario } = req.body;
    
    // 2. Se añade un '?' para el nuevo parámetro del SP
    const sql = `CALL \`${dbConfig.database}\`.\`BorrarInsumo\` (?, ?)`;
    
    // 3. Pasamos ambos parámetros en el array
    Basedatos.query(sql, [CodigoInsumo, IdUsuario], err => {
        if (err) {
            res.status(500).send('Error al eliminar insumo');
            return;
        }
        res.send({ message: 'Insumo eliminado' });
    });
});

// Get Order article list 
router.get('/historial-insumo/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarHistorialEstadoInsumoXId\` (?)`;
    Basedatos.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error al obtener historial:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }
        res.json(results[0]); // Devuelve el primer conjunto de resultados
    });
});




module.exports = router;