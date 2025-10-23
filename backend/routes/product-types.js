const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

/**
 * @route   GET /api/tipos-producto
 * @desc    Obtiene todos los tipos de producto.
 * @access  Private
 */
router.get('/', (req, res) => {
    const sql = `CALL \`${dbConfig.database}\`.\`sp_ListarTiposProducto\`();`;
    Basedatos.query(sql, (err, results) => {
        if (err) {
            console.error('Error al listar tipos de producto:', err);
            return res.status(500).json({ error: 'Error en el servidor.' });
        }
        res.json(results[0]);
    });
});

/**
 * @route   GET /api/tipos-producto/accesorios-disponibles
 * @desc    Obtiene todos los tipos de accesorios disponibles para el formulario.
 * @access  Private
 */
router.get('/accesorios-disponibles', (req, res) => {
    const sql = `CALL \`${dbConfig.database}\`.\`sp_ListarTiposAccesorio\`();`;
    Basedatos.query(sql, (err, results) => {
        if (err) {
            console.error('Error al listar tipos de accesorio:', err);
            return res.status(500).json({ error: 'Error en el servidor.' });
        }
        res.json(results[0]);
    });
});

/**
 * @route   GET /api/tipos-producto/:id
 * @desc    Obtiene un tipo de producto específico y los IDs de sus accesorios.
 * @access  Private
 */
router.get('/:id', (req, res) => {
    const idTipoProducto = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`sp_ObtenerTipoProductoConAccesorios\`(?);`;

    Basedatos.query(sql, [idTipoProducto], (err, results) => {
        if (err) {
            console.error('Error al obtener tipo de producto con accesorios:', err);
            return res.status(500).json({ error: 'Error en el servidor.' });
        }

        if (!results || results.length < 2 || results[0].length === 0) {
            return res.status(404).json({ error: 'Tipo de producto no encontrado.' });
        }

        const tipoProducto = results[0][0];
        const accesorios = results[1].map(acc => acc.IdTipoAccesorioFK); // Extraemos solo los IDs

        res.json({
            ...tipoProducto,
            accesorios: accesorios
        });
    });
});

/**
 * @route   POST /api/tipos-producto
 * @desc    Crea un nuevo tipo de producto y sus asociaciones de accesorios.
 * @access  Private
 */
router.post('/', (req, res) => {
    const { descripcion, accesorios } = req.body;

    if (!descripcion || !Array.isArray(accesorios)) {
        return res.status(400).json({ error: 'Faltan datos: descripción y lista de accesorios son requeridos.' });
    }

    const sql = `CALL \`${dbConfig.database}\`.\`sp_CrearTipoProductoConAccesorios\`(?, ?);`;
    const accesoriosJSON = JSON.stringify(accesorios);

    Basedatos.query(sql, [descripcion, accesoriosJSON], (err, results) => {
        if (err) {
            console.error('Error al crear tipo de producto:', err);
            return res.status(500).json({ error: 'Error en el servidor al crear el tipo de producto.' });
        }
        res.status(201).json({ message: 'Tipo de producto creado exitosamente.', data: results[0] });
    });
});

/**
 * @route   PUT /api/tipos-producto/:id
 * @desc    Actualiza un tipo de producto y sus asociaciones de accesorios.
 * @access  Private
 */
router.put('/:id', (req, res) => {
    const idTipoProducto = req.params.id;
    const { descripcion, activo, accesorios } = req.body;

    if (!descripcion || typeof activo === 'undefined' || !Array.isArray(accesorios)) {
        return res.status(400).json({ error: 'Faltan datos: descripción, estado y lista de accesorios son requeridos.' });
    }

    const sql = `CALL \`${dbConfig.database}\`.\`sp_ActualizarTipoProductoConAccesorios\`(?, ?, ?, ?);`;
    const accesoriosJSON = JSON.stringify(accesorios);

    Basedatos.query(sql, [idTipoProducto, descripcion, activo, accesoriosJSON], (err, results) => {
        if (err) {
            console.error('Error al actualizar tipo de producto:', err);
            return res.status(500).json({ error: 'Error en el servidor al actualizar el tipo de producto.' });
        }
        res.status(200).json({ message: 'Tipo de producto actualizado exitosamente.' });
    });
});

module.exports = router;
