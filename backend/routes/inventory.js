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

module.exports = router;