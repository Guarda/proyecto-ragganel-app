const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @route   POST /notas-credito/crear
 * @desc    Crea una nueva nota de crédito, actualiza inventario y anula la factura si es necesario.
 * @access  Private
 */
router.post('/crear', (req, res) => {
  // 1. Extraemos todos los datos necesarios del cuerpo de la solicitud (req.body)
  const {
    IdVentaFK,
    UsuarioEmisorFK,
    Observaciones, // Esto se mapeará al parámetro p_Motivo del SP
    TotalCredito,
    Detalles, // Este es el array de artículos    
    IdMotivoFK,
    anularFactura 
  } = req.body;

  // 2. Validación simple para asegurar que los datos principales vienen
  if (!IdVentaFK || !UsuarioEmisorFK || !TotalCredito || !Detalles || !IdMotivoFK) {
    return res.status(400).json({
      success: false,
      mensaje: 'Faltan datos requeridos para crear la nota de crédito.'
    });
  }

  // 3. El procedimiento almacenado espera que el array de detalles sea un string JSON
  const detallesJSON = JSON.stringify(Detalles);

  // 4. Preparamos los parámetros en el orden EXACTO que los espera el SP
  const params = [
    IdVentaFK,
    UsuarioEmisorFK,
    Observaciones, // El texto libre va a p_Motivo
    TotalCredito,
    detallesJSON, // El array convertido a string JSON    
    IdMotivoFK, // El ID del motivo del dropdown,
    anularFactura 
  ];

  // 5. Definimos y ejecutamos la consulta
  const query = 'CALL sp_CrearNotaCredito(?, ?, ?, ?, ?, ?, ?);';

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error al ejecutar sp_CrearNotaCredito:', err);
      return res.status(500).json({
        success: false,
        mensaje: 'Error en el servidor al crear la nota de crédito.',
        error: err
      });
    }

    // 6. Si todo sale bien, devolvemos una respuesta exitosa con el ID de la nota creada
    const idNotaCredito = results[0][0]?.IdNotaCreditoGenerada;
    res.status(201).json({
      success: true,
      mensaje: `Nota de crédito #${idNotaCredito} creada exitosamente.`,
      idNotaCredito: idNotaCredito
    });
  });
});

router.get('/listar', (req, res) => {
    const query = 'CALL sp_ListarNotasCredito();';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al ejecutar sp_ListarNotasCredito:', err);
            return res.status(500).json({
                success: false,
                mensaje: 'Error en el servidor al obtener las notas de crédito.'
            });
        }

        // El resultado del SP usualmente está en la primera posición del array
        const notasDeCredito = results[0];

        res.status(200).json({
            success: true,
            data: notasDeCredito
        });
    });
});

router.get('/:id', (req, res) => {
    // Obtenemos el ID de los parámetros de la URL
    const idNotaCredito = parseInt(req.params.id, 10);
    console.log('ID Nota Crédito recibido:', idNotaCredito);
    // Validación simple del ID
    if (isNaN(idNotaCredito)) {
        return res.status(400).json({ success: false, mensaje: 'El ID proporcionado no es un número válido.' });
    }

    const query = 'CALL sp_ObtenerNotaCreditoPorId(?);';

    db.query(query, [idNotaCredito], (err, results) => {
        if (err) {
            console.error('Error al ejecutar sp_ObtenerNotaCreditoPorId:', err);
            return res.status(500).json({
                success: false,
                mensaje: 'Error en el servidor al obtener la nota de crédito.'
            });
        }

        // El SP devuelve 2 resultados: results[0] = encabezado, results[1] = detalles
        const encabezado = results[0][0]; // El encabezado es un objeto único
        const detalles = results[1];       // Los detalles son un array de objetos

        // Verificamos si se encontró la nota de crédito
        if (!encabezado) {
            return res.status(404).json({ success: false, mensaje: `No se encontró la nota de crédito con ID ${idNotaCredito}.` });
        }
        
        // Enviamos una respuesta exitosa con los datos estructurados
        res.status(200).json({
            success: true,
            data: {
                encabezado: encabezado,
                detalles: detalles
            }
        });
    });
});

router.put('/anular/:id', (req, res) => {
    const idNotaCredito = req.params.id;
    const { motivo, usuarioId } = req.body; // El cuerpo ahora se leerá correctamente

    // Verificación para asegurar que los datos llegan
    if (!motivo || !usuarioId) {
        return res.status(400).json({ 
            success: false, 
            error: 'Faltan datos requeridos. Se necesita "motivo" y "usuarioId".' 
        });
    }

    const sql = 'CALL sp_AnularNotaCredito(?, ?, ?)';

    db.query(sql, [idNotaCredito, usuarioId, motivo], (err, result) => {
        if (err) {
            console.error('Error al anular nota de crédito:', err);
            return res.status(500).json({ success: false, error: 'Error al ejecutar la consulta en la base de datos.' });
        }

        // Si todo sale bien, devolvemos una respuesta de éxito
        res.json({ success: true, mensaje: `Nota de crédito #${idNotaCredito} anulada correctamente.` });
    });
});

module.exports = router;