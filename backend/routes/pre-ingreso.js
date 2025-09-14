const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

/**
 * @route   POST /api/pre-ingreso/producto
 * @desc    Guarda o actualiza el estado de un formulario de producto.
 * @access  Private
 */
router.post('/producto', (req, res) => {
    // Usamos 'let' para poder modificar las variables si es necesario, aunque aquí crearemos nuevas constantes.
    const {
        idPedido, usuarioId, formIndex, articuloId, ColorConsola, EstadoConsola, HackConsola,
        ComentarioConsola, PrecioBase, NumeroSerie, Accesorios, TodoList, CostoDistribuido
    } = req.body;

    // --- Saneamiento de Datos ---
    // Convierte valores que deben ser numéricos/booleanos de string a su tipo correcto, o a un valor por defecto si están vacíos/inválidos.
    const estadoInt = (EstadoConsola === '' || EstadoConsola === null || isNaN(parseInt(EstadoConsola, 10))) ? 0 : parseInt(EstadoConsola, 10);
    const precioDecimal = (PrecioBase === '' || PrecioBase === null || isNaN(parseFloat(PrecioBase))) ? 0.00 : parseFloat(PrecioBase);
    const costoDistribuidoDecimal = (CostoDistribuido === '' || CostoDistribuido === null || isNaN(parseFloat(CostoDistribuido))) ? 0.00 : parseFloat(CostoDistribuido);
    // Para el booleano, MySQL acepta 0 o 1.
    const hackeadoBool = (HackConsola === '1' || HackConsola === true) ? 1 : 0;

    // Convertir los arrays a strings separados por comas antes de enviarlos a la BD.
    const accesoriosString = Array.isArray(Accesorios) ? Accesorios.join(',') : Accesorios;
    const todoListString = Array.isArray(TodoList) ? TodoList.join(',') : TodoList;

    const query = `CALL \`${dbConfig.database}\`.\`sp_UpsertPreIngresoProducto\`(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const params = [
        idPedido, usuarioId, formIndex, articuloId, ColorConsola, estadoInt, hackeadoBool,
        ComentarioConsola, precioDecimal, NumeroSerie, accesoriosString, todoListString, costoDistribuidoDecimal
    ];

    Basedatos.query(query, params, (err, results) => {
        if (err) {
            console.error('Error al ejecutar sp_UpsertPreIngresoProducto:', err);
            return res.status(500).json({ success: false, mensaje: 'Error al guardar el progreso.', error: err });
        }
        res.status(200).json({ success: true, mensaje: 'Progreso guardado.' });
    });
});

/**
 * @route   POST /api/pre-ingreso/accesorio
 * @desc    Guarda o actualiza el estado de un formulario de accesorio.
 * @access  Private
 */
router.post('/accesorio', (req, res) => {
    const {
        idPedido, usuarioId, formIndex, articuloId, ColorAccesorio, EstadoAccesorio,
        ComentarioAccesorio, PrecioBase, CostoDistribuido, NumeroSerie, ProductosCompatibles, TodoList
    } = req.body;

    // --- Saneamiento de Datos ---
    const estadoInt = (EstadoAccesorio === '' || EstadoAccesorio === null || isNaN(parseInt(EstadoAccesorio, 10))) ? 0 : parseInt(EstadoAccesorio, 10);
    const precioDecimal = (PrecioBase === '' || PrecioBase === null || isNaN(parseFloat(PrecioBase))) ? 0.00 : parseFloat(PrecioBase);
    const costoDistribuidoDecimal = (CostoDistribuido === '' || CostoDistribuido === null || isNaN(parseFloat(CostoDistribuido))) ? 0.00 : parseFloat(CostoDistribuido);

    // Convertir arrays a strings
    const compatiblesString = Array.isArray(ProductosCompatibles) ? ProductosCompatibles.join(',') : ProductosCompatibles;
    const todoListString = Array.isArray(TodoList) ? TodoList.join(',') : TodoList;

    const query = `CALL \`${dbConfig.database}\`.\`sp_UpsertPreIngresoAccesorio\`(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const params = [
        idPedido, usuarioId, formIndex, articuloId, ColorAccesorio, estadoInt,
        ComentarioAccesorio, precioDecimal, costoDistribuidoDecimal, NumeroSerie, compatiblesString, todoListString
    ];

    Basedatos.query(query, params, (err, results) => {
        if (err) {
            console.error('Error al ejecutar sp_UpsertPreIngresoAccesorio:', err);
            return res.status(500).json({ success: false, mensaje: 'Error al guardar el progreso del accesorio.', error: err });
        }
        res.status(200).json({ success: true, mensaje: 'Progreso de accesorio guardado.' });
    });
});

/**
 * @route   POST /api/pre-ingreso/insumo
 * @desc    Guarda o actualiza el estado de un formulario de insumo.
 * @access  Private
 */
router.post('/insumo', (req, res) => {
    const {
        idPedido, usuarioId, formIndex, articuloId, EstadoInsumo, ComentarioInsumo,
        PrecioBase, CostoDistribuido, NumeroSerie, Cantidad, StockMinimo
    } = req.body;

    // --- Saneamiento de Datos ---
    const estadoInt = (EstadoInsumo === '' || EstadoInsumo === null || isNaN(parseInt(EstadoInsumo, 10))) ? 0 : parseInt(EstadoInsumo, 10);
    const precioDecimal = (PrecioBase === '' || PrecioBase === null || isNaN(parseFloat(PrecioBase))) ? 0.00 : parseFloat(PrecioBase);
    const costoDistribuidoDecimal = (CostoDistribuido === '' || CostoDistribuido === null || isNaN(parseFloat(CostoDistribuido))) ? 0.00 : parseFloat(CostoDistribuido);
    const cantidadInt = (Cantidad === '' || Cantidad === null || isNaN(parseInt(Cantidad, 10))) ? 1 : parseInt(Cantidad, 10);
    const stockMinimoInt = (StockMinimo === '' || StockMinimo === null || isNaN(parseInt(StockMinimo, 10))) ? 0 : parseInt(StockMinimo, 10);

    const query = `CALL \`${dbConfig.database}\`.\`sp_UpsertPreIngresoInsumo\`(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const params = [
        idPedido, usuarioId, formIndex, articuloId, estadoInt, ComentarioInsumo,
        precioDecimal, costoDistribuidoDecimal, NumeroSerie, cantidadInt, stockMinimoInt
    ];

    Basedatos.query(query, params, (err, results) => {
        if (err) {
            console.error('Error al ejecutar sp_UpsertPreIngresoInsumo:', err);
            return res.status(500).json({ success: false, mensaje: 'Error al guardar el progreso del insumo.', error: err });
        }
        res.status(200).json({ success: true, mensaje: 'Progreso de insumo guardado.' });
    });
});

/**
 * @route   GET /api/pre-ingreso/productos/:pedidoId/:usuarioId
 * @desc    Obtiene los datos de productos pre-guardados.
 * @access  Private
 */
router.get('/productos/:pedidoId/:usuarioId', (req, res) => {
    const { pedidoId, usuarioId } = req.params;

    const query = `CALL \`${dbConfig.database}\`.\`sp_GetPreIngresoProductos\`(?, ?);`;
    const params = [pedidoId, usuarioId];

    Basedatos.query(query, params, (err, results) => {
        if (err) {
            console.error('Error al ejecutar sp_GetPreIngresoProductos:', err);
            return res.status(500).json({ success: false, mensaje: 'Error al cargar el progreso.', error: err });
        }
        console.log('Resultados obtenidos:', results[0]);
        res.status(200).json({ success: true, data: results[0] });
    });
});

/**
 * @route   GET /api/pre-ingreso/accesorios/:pedidoId/:usuarioId
 * @desc    Obtiene los datos de accesorios pre-guardados.
 * @access  Private
 */
router.get('/accesorios/:pedidoId/:usuarioId', (req, res) => {
    const { pedidoId, usuarioId } = req.params;

    const query = `CALL \`${dbConfig.database}\`.\`sp_GetPreIngresoAccesorios\`(?, ?);`;
    const params = [pedidoId, usuarioId];

    Basedatos.query(query, params, (err, results) => {
        if (err) {
            console.error('Error al ejecutar sp_GetPreIngresoAccesorios:', err);
            return res.status(500).json({ success: false, mensaje: 'Error al cargar el progreso de accesorios.', error: err });
        }
        console.log('Resultados obtenidos:', results[0]);
        res.status(200).json({ success: true, data: results[0] });
    });
});

/**
 * @route   GET /api/pre-ingreso/insumos/:pedidoId/:usuarioId
 * @desc    Obtiene los datos de insumos pre-guardados.
 * @access  Private
 */
router.get('/insumos/:pedidoId/:usuarioId', (req, res) => {
    const { pedidoId, usuarioId } = req.params;

    const query = `CALL \`${dbConfig.database}\`.\`sp_GetPreIngresoInsumos\`(?, ?);`;
    const params = [pedidoId, usuarioId];

    Basedatos.query(query, params, (err, results) => {
        if (err) {
            console.error('Error al ejecutar sp_GetPreIngresoInsumos:', err);
            return res.status(500).json({ success: false, mensaje: 'Error al cargar el progreso de insumos.', error: err });
        }
        res.status(200).json({ success: true, data: results[0] });
    });
});

/**
 * @route   DELETE /api/pre-ingreso/:pedidoId/:usuarioId
 * @desc    Elimina todos los datos de pre-ingreso para un pedido.
 * @access  Private
 */
router.delete('/:pedidoId/:usuarioId', (req, res) => {
    const { pedidoId, usuarioId } = req.params;

    const query = `CALL \`${dbConfig.database}\`.\`sp_DeletePreIngresoPorPedido\`(?, ?);`;
    const params = [pedidoId, usuarioId];

    Basedatos.query(query, params, (err, results) => {
        if (err) {
            console.error('Error al ejecutar sp_DeletePreIngresoPorPedido:', err);
            return res.status(500).json({ success: false, mensaje: 'Error al limpiar datos temporales.', error: err });
        }
        res.status(200).json({ success: true, mensaje: 'Datos temporales limpiados.' });
    });
});

module.exports = router;
