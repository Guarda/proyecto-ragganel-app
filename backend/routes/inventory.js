const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db'); // Asegúrate que la ruta al archivo de conexión de BD sea correcta

/**
 * @route   GET /api/inventory/
 * @desc    Obtiene todos los artículos del inventario general.
 * @access  Private (se asume que tendrás autenticación más adelante)
 */
router.get('/', (req, res) => {
  // 1. Preparamos la consulta a la vista que creamos.
  const query = `CALL \`${dbConfig.database}\`.\`ListarVistaInventarioGeneral\`();`;

  // 2. Ejecutamos la consulta en la base de datos.
  Basedatos.query(query, (err, results) => {
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
  const query = `CALL \`${dbConfig.database}\`.\`sp_ListarArticulosEnGarantia\`();`;

  // 2. Ejecutamos la consulta.
  Basedatos.query(query, (err, results) => {
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
  // 1. Obtenemos los datos del cuerpo de la solicitud, incluyendo IdUsuario
  const { tipoArticulo, codigoArticulo, nuevoEstadoId, IdUsuario } = req.body;

  // 2. Validación básica, incluyendo IdUsuario
  if (!tipoArticulo || !codigoArticulo || !nuevoEstadoId || !IdUsuario) {
    return res.status(400).json({
      success: false,
      mensaje: 'Faltan parámetros requeridos (tipoArticulo, codigoArticulo, nuevoEstadoId, IdUsuario).'
    });
  }

  // 3. Preparamos la llamada al procedimiento almacenado con el nuevo parámetro
  const query = `CALL \`${dbConfig.database}\`.\`sp_ActualizarEstadoArticulo\`(?, ?, ?, ?);`;
  const params = [tipoArticulo, codigoArticulo, nuevoEstadoId, IdUsuario];

  // 4. Ejecutamos la consulta
  Basedatos.query(query, params, (err, results) => {
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

  const query = `CALL \`${dbConfig.database}\`.\`sp_ObtenerHistorialArticulo\`(?, ?);`;
  Basedatos.query(query, [tipo, codigo], (err, results) => {
    if (err) {
      console.error('Error al obtener el historial del artículo:', err);
      return res.status(500).json({ success: false, mensaje: 'Error en el servidor.' });
    }
    res.status(200).json(results[0]);
  });
});


module.exports = router;