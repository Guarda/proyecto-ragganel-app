const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

router.get('/', (req, res) => {
  const query = `CALL \`${dbConfig.database}\`.\`ListarVistaInventarioGeneral\`();`;

  Basedatos.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener el inventario general:', err);
      return res.status(500).json({
        success: false,
        mensaje: 'Error en el servidor al consultar la base de datos.'
      });
    }

    res.status(200).json(results[0]);
  });
});

router.get('/garantia', (req, res) => {
  const query = `CALL \`${dbConfig.database}\`.\`sp_ListarArticulosEnGarantia\`();`;

  Basedatos.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener artículos en garantía:', err);
      return res.status(500).json({
        success: false,
        mensaje: 'Error en el servidor al consultar la base de datos.'
      });
    }

    res.status(200).json(results[0]);
  });
});

router.post('/cambiar-estado', (req, res) => {
  const { tipoArticulo, codigoArticulo, nuevoEstadoId, IdUsuario } = req.body;

  if (!tipoArticulo || !codigoArticulo || !nuevoEstadoId || !IdUsuario) {
    return res.status(400).json({
      success: false,
      mensaje: 'Faltan parámetros requeridos (tipoArticulo, codigoArticulo, nuevoEstadoId, IdUsuario).'
    });
  }

  const query = `CALL \`${dbConfig.database}\`.\`sp_ActualizarEstadoArticulo\`(?, ?, ?, ?);`;
  const params = [tipoArticulo, codigoArticulo, nuevoEstadoId, IdUsuario];

  Basedatos.query(query, params, (err, results) => {
    if (err) {
      console.error('Error al cambiar el estado del artículo:', err);
      return res.status(500).json({
        success: false,
        mensaje: 'Error en el servidor al actualizar el estado.'
      });
    }

    res.status(200).json({
      success: true,
      mensaje: `Estado del artículo ${codigoArticulo} actualizado correctamente.`
    });
  });
});

router.get('/historial', (req, res) => {
  const { tipo, codigo } = req.query;

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