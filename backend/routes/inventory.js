const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Asegúrate que la ruta al archivo de conexión de BD sea correcta

/**
 * @route   GET /api/inventory/
 * @desc    Obtiene todos los artículos del inventario general.
 * @access  Private (se asume que tendrás autenticación más adelante)
 */
router.get('/', (req, res) => {
  // 1. Preparamos la consulta a la vista que creamos.
  const query = 'CALL `base_datos_inventario_taller`.`ListarVistaInventarioGeneral`();';

  // 2. Ejecutamos la consulta en la base de datos.
  db.query(query, (err, results) => {
    // 3. Manejo de errores.
    // Si ocurre un error en la BD, se notifica al cliente con un código 500.
    if (err) {
      console.error('Error al obtener el inventario general:', err);
      return res.status(500).json({
        success: false,
        mensaje: 'Error en el servidor al consultar la base de datos.'
      });
    }

    // 4. Envío de la respuesta exitosa.
    // Si todo sale bien, se envían los resultados en formato JSON.
    res.status(200).json(results[0]);
  });
});

router.get('/garantia', (req, res) => {
  // 1. Preparamos la llamada al nuevo procedimiento almacenado.
  const query = 'CALL sp_ListarArticulosEnGarantia();';

  // 2. Ejecutamos la consulta.
  db.query(query, (err, results) => {
    // 3. Manejo de errores (igual que el otro endpoint).
    if (err) {
      console.error('Error al obtener artículos en garantía:', err);
      return res.status(500).json({
        success: false,
        mensaje: 'Error en el servidor al consultar la base de datos.'
      });
    }

    // 4. Enviamos la respuesta exitosa.
    res.status(200).json(results[0]);
  });
});

router.post('/cambiar-estado', (req, res) => {
  // 1. Obtenemos los datos del cuerpo de la solicitud
  const { tipoArticulo, codigoArticulo, nuevoEstadoId } = req.body;

  // 2. Validación básica
  if (!tipoArticulo || !codigoArticulo || !nuevoEstadoId) {
    return res.status(400).json({
      success: false,
      mensaje: 'Faltan parámetros requeridos (tipoArticulo, codigoArticulo, nuevoEstadoId).'
    });
  }

  // 3. Preparamos la llamada al nuevo procedimiento almacenado
  const query = 'CALL sp_ActualizarEstadoArticulo(?, ?, ?);';
  const params = [tipoArticulo, codigoArticulo, nuevoEstadoId];

  // 4. Ejecutamos la consulta
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error al cambiar el estado del artículo:', err);
      return res.status(500).json({
        success: false,
        mensaje: 'Error en el servidor al actualizar el estado.'
      });
    }

    // 5. Enviamos una respuesta exitosa
    res.status(200).json({
      success: true,
      mensaje: `Estado del artículo ${codigoArticulo} actualizado correctamente.`
    });
  });
});

router.get('/historial', (req, res) => {
  const { tipo, codigo } = req.query; // Recibimos por query params: ?tipo=Producto&codigo=XYZ

  if (!tipo || !codigo) {
    return res.status(400).json({ success: false, mensaje: 'Faltan parámetros tipo o codigo.' });
  }

  const query = 'CALL sp_ObtenerHistorialArticulo(?, ?);';
  db.query(query, [tipo, codigo], (err, results) => {
    if (err) {
      console.error('Error al obtener el historial del artículo:', err);
      return res.status(500).json({ success: false, mensaje: 'Error en el servidor.' });
    }
    res.status(200).json(results[0]);
  });
});


module.exports = router;