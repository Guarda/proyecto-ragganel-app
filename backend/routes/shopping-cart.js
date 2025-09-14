const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

router.get('/vigentes/:idUsuario', (req, res) => {
  const { idUsuario } = req.params;

  if (!idUsuario) {
    return res.status(400).json({ error: 'El ID del usuario es requerido.' });
  }

  // Llama al procedimiento almacenado pasándole el ID del usuario como parámetro
  const query = `CALL \`${dbConfig.database}\`.\`sp_ConsultarCarritosVigentes\`(?)`;
  //console.log(`Llamando al procedimiento almacenado sp_ConsultarCarritosVigentes con idUsuario: ${idUsuario}`);
  Basedatos.query(query, [idUsuario], (err, results) => {
    if (err) {
      console.error('Error al llamar al procedimiento almacenado sp_ConsultarCarritosVigentes:', err);
      return res.status(500).json({ error: 'Error interno del servidor al consultar los carritos.' });
    }
    //console.log('Resultados de sp_ConsultarCarritosVigentes:', results);
    // Los resultados de un CALL suelen estar en el primer elemento del array devuelto
    res.json(results[0]);
  });
});

router.delete('/:idCarrito', (req, res) => {
  const { idCarrito } = req.params;

  if (!idCarrito) {
    return res.status(400).json({ success: false, error: 'Se requiere el ID del carrito.' });
  }

  // La nueva consulta ahora es una simple llamada al procedimiento almacenado.
  const query = `CALL \`${dbConfig.database}\`.\`sp_LiberarCarrito\`(?)`;

  Basedatos.query(query, [idCarrito], (err, result) => {
    if (err) {
      // Este error se activará si la conexión falla o si el procedimiento señala un error.
      console.error('Error al llamar al procedimiento sp_LiberarCarrito:', err);
      return res.status(500).json({ success: false, error: 'Error interno del servidor al liberar el carrito.' });
    }

    // Si el procedimiento se ejecutó sin errores, la operación fue exitosa.
    // La lógica de 'affectedRows' ya no es necesaria aquí, la ausencia de error es nuestro indicador.
    res.json({ success: true, message: 'Carrito liberado con éxito.' });
  });
});

router.get('/listar-carrito-en-curso-cliente-usuario', (req, res) => {
    // Asumiendo que los parámetros vienen en la query string
    const { IdUsuario, IdCliente } = req.query;

    const query = `CALL \`${dbConfig.database}\`.\`sp_ObtenerContenidoCarrito\`(?, ?)`;
    Basedatos.query(query, [IdUsuario, IdCliente], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
        // Devuelve los artículos del carrito o un array vacío si no hay nada
        res.json(results[0] || []);
    });
});


module.exports = router;