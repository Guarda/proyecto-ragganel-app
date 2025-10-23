/**
 * @fileoverview Rutas API para gestionar los Tipos de Accesorios base.
 * Permite listar, obtener por ID, crear, actualizar y desactivar (soft delete)
 * los tipos de accesorios disponibles en el sistema.
 */

const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db'); // Asegúrate que la ruta sea correcta

/**
 * @route   GET /api/tipos-accesorios
 * @desc    Obtiene TODOS los tipos de accesorios (activos e inactivos).
 * Para la pantalla de administración.
 * @access  Private (Asumido)
 */
router.get('/', (req, res) => {
    // Llama al SP que lista todos los tipos (activos e inactivos)
    const sql = `CALL \`${dbConfig.database}\`.\`sp_ListarTodosTiposAccesorio\`();`;
    Basedatos.query(sql, (err, results) => {
        if (err) {
            console.error('Error al listar todos los tipos de accesorio:', err);
            return res.status(500).json({ error: 'Error en el servidor.' });
        }
        res.json(results[0]);
    });
});

/**
 * @route   GET /api/tipos-accesorios/activos
 * @desc    Obtiene solo los tipos de accesorios ACTIVOS.
 * Para usar en dropdowns y selecciones.
 * @access  Private (Asumido)
 */
router.get('/activos', (req, res) => {
    // Llama al SP que lista solo los tipos activos
    const sql = `CALL \`${dbConfig.database}\`.\`sp_ListarTiposAccesorio\`();`;
    Basedatos.query(sql, (err, results) => {
        if (err) {
            console.error('Error al listar tipos de accesorio activos:', err);
            return res.status(500).json({ error: 'Error en el servidor.' });
        }
        res.json(results[0]);
    });
});

/**
 * @route   GET /api/tipos-accesorios/:id
 * @desc    Obtiene un tipo de accesorio específico por su ID.
 * @access  Private (Asumido)
 */
router.get('/:id', (req, res) => {
    const idTipoAccesorio = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`sp_GetTipoAccesorioById\`(?);`;

    Basedatos.query(sql, [idTipoAccesorio], (err, results) => {
        if (err) {
            console.error('Error al obtener tipo de accesorio por ID:', err);
            return res.status(500).json({ error: 'Error en el servidor.' });
        }
        if (!results || results[0].length === 0) {
            return res.status(404).json({ error: 'Tipo de accesorio no encontrado.' });
        }
        res.json(results[0][0]); // Devuelve el primer objeto del primer result set
    });
});

/**
 * @route   POST /api/tipos-accesorios
 * @desc    Crea un nuevo tipo de accesorio.
 * @access  Private (Asumido)
 */
router.post('/', (req, res) => {
    // Nombres coinciden con el SP: p_CodigoAccesorio, p_DescripcionAccesorio
    const { CodigoAccesorio, DescripcionAccesorio } = req.body;

    if (!CodigoAccesorio || !DescripcionAccesorio) {
        return res.status(400).json({ error: 'Faltan datos: Código y Descripción son requeridos.' });
    }

    const sql = `CALL \`${dbConfig.database}\`.\`sp_InsertTipoAccesorio\`(?, ?);`;

    Basedatos.query(sql, [CodigoAccesorio, DescripcionAccesorio], (err, results) => {
        if (err) {
            console.error('Error al crear tipo de accesorio:', err);
            // Considerar verificar errores específicos como código duplicado si tu SP lo manejara
            return res.status(500).json({ error: 'Error en el servidor al crear el tipo de accesorio.' });
        }
        // Devuelve el ID creado por el SP
        res.status(201).json({ message: 'Tipo de accesorio creado exitosamente.', data: results[0][0] });
    });
});

/**
 * @route   PUT /api/tipos-accesorios/:id
 * @desc    Actualiza un tipo de accesorio existente.
 * @access  Private (Asumido)
 */
router.put('/:id', (req, res) => {
    const idTipoAccesorio = req.params.id;
    // Nombres coinciden con el SP: p_CodigoAccesorio, p_DescripcionAccesorio, p_Activo
    const { CodigoAccesorio, DescripcionAccesorio, Activo } = req.body;

    // Validamos que 'Activo' sea explícitamente true o false
    if (!CodigoAccesorio || !DescripcionAccesorio || typeof Activo !== 'boolean') {
        return res.status(400).json({ error: 'Faltan datos: Código, Descripción y Estado (Activo) son requeridos y deben ser del tipo correcto.' });
    }

    const sql = `CALL \`${dbConfig.database}\`.\`sp_UpdateTipoAccesorio\`(?, ?, ?, ?);`;

    Basedatos.query(sql, [idTipoAccesorio, CodigoAccesorio, DescripcionAccesorio, Activo], (err, results) => {
        if (err) {
            console.error('Error al actualizar tipo de accesorio:', err);
            return res.status(500).json({ error: 'Error en el servidor al actualizar el tipo de accesorio.' });
        }
        // El SP de actualización no devuelve filas, solo afecta
        if (results.affectedRows === 0) {
             return res.status(404).json({ error: 'Tipo de accesorio no encontrado para actualizar.' });
        }
        res.status(200).json({ message: 'Tipo de accesorio actualizado exitosamente.' });
    });
});

/**
 * @route   DELETE /api/tipos-accesorios/:id
 * @desc    Desactiva (soft delete) un tipo de accesorio.
 * @access  Private (Asumido)
 */
router.delete('/:id', (req, res) => {
    const idTipoAccesorio = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`sp_DeactivateTipoAccesorio\`(?);`;

    Basedatos.query(sql, [idTipoAccesorio], (err, results) => {
        if (err) {
            console.error('Error al desactivar tipo de accesorio:', err);
            return res.status(500).json({ error: 'Error en el servidor al desactivar el tipo de accesorio.' });
        }
        if (results.affectedRows === 0) {
             return res.status(404).json({ error: 'Tipo de accesorio no encontrado para desactivar.' });
        }
        res.status(200).json({ message: 'Tipo de accesorio desactivado exitosamente.' });
    });
});

module.exports = router;