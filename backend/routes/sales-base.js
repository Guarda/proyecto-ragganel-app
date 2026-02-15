const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

router.post('/limpiar-carrito', (req, res) => {
  const { IdUsuario, IdCliente } = req.body;
  
  // Log para confirmar que el endpoint es alcanzado
  console.log('ENDPOINT ALCANZADO: /limpiar-carrito. Body recibido:', req.body);
  
  if (!IdUsuario || !IdCliente) {
    return res.status(400).json({
      success: false,
      mensaje: 'Faltan parámetros requeridos (IdUsuario, IdCliente) en el cuerpo de la solicitud.'
    });
  }

  const query = `CALL \`${dbConfig.database}\`.\`sp_Carrito_LimpiarPorUsuarioCliente\`(?, ?);`;
  const params = [IdUsuario, IdCliente];

  Basedatos.query(query, params, (err, results) => {
    if (err) {
      console.error('Error al ejecutar sp_Carrito_LimpiarPorUsuarioCliente:', err);
      return res.status(500).json({ success: false, error: err });
    }
    res.json({
      success: true,
      mensaje: 'Carrito limpiado correctamente.'
    });
  });
});

router.post('/limpiar-carrito-proforma', (req, res) => {
  const { IdUsuario, IdCliente } = req.body;
  
  // Invocamos el SP que elimina los registros temporales y devuelve ítems a 'Disponible' (Estado 1)
  const query = `CALL \`${dbConfig.database}\`.\`sp_Carrito_LimpiarPorUsuarioCliente\`(?, ?);`;
  
  Basedatos.query(query, [IdUsuario, IdCliente], (err, results) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, mensaje: 'Inventario liberado para carga de proforma.' });
  });
});

// List all sales margins types
router.get('/margenes-venta', (req, res) => {
  Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarPreciosVenta\`();`, (err, results) => {
    if (err) {
      res.status(500).send('Error margins types');
      console.log(err);
      return;
    }
    res.json(results[0]);
  });
});

// List all payment methods
router.get('/metodos-de-pago', (req, res) => {
  Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarMetodosDePago\`();`, (err, results) => {
    if (err) {
      res.status(500).send('Error payment methods');
      console.log(err);
      return;
    }
    res.json(results[0]);
  });
});

router.post('/ingresar-venta', (req, res) => {
  // 1. Se elimina 'Margen' de la desestructuración
  const {
    TipoDocumento,
    SubtotalVenta, IVA, TotalVenta, EstadoVenta,
    MetodoPago, Usuario, Cliente, Observaciones, // Se quitó 'Margen'
    NumeroReferenciaTransferencia, Detalles
  } = req.body;

  const detallesJSON = JSON.stringify(Detalles);

  // 2. La consulta ahora tiene un '?' menos.
  const query = `
    CALL \`${dbConfig.database}\`.\`InsertarVentaProforma\`(
      ?, @codigoGenerado, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    );
    SELECT @codigoGenerado AS CodigoProforma;
  `;

  // 3. Se elimina 'Margen' del array de parámetros
  const params = [
    TipoDocumento,
    SubtotalVenta,
    IVA,
    TotalVenta,
    EstadoVenta,
    MetodoPago,
    // Se quitó Margen de aquí
    Usuario,
    Cliente,
    Observaciones,
    NumeroReferenciaTransferencia,
    detallesJSON
  ];

  Basedatos.query(query, params, (err, results) => {
    if (err) {
      console.error('Error al ejecutar InsertarVentaProforma:', err);
      return res.status(500).json({ success: false, error: err });
    }

    const codigoGenerado = results[1][0]?.CodigoProforma;
    return res.status(200).json({
      success: true,
      codigo: codigoGenerado || null
    });
  });
});

router.post('/agregar-al-carrito', (req, res) => {
  // 1. Extraemos TODOS los campos del cuerpo de la solicitud...
  const {
    IdUsuario, IdCliente,
    TipoArticulo, CodigoArticulo,
    PrecioVenta, Descuento,
    Cantidad,
    PrecioBaseOriginal,
    MargenAplicado,
    IdMargenFK 
  } = req.body;
  console.log('payload recibido:', req.body);
  
  // 2. La consulta ahora debe esperar 10 parámetros
  const query = `CALL \`${dbConfig.database}\`.\`sp_Carrito_AgregarArticulo\`(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`; 
  
  // 3. Los parámetros deben incluir el nuevo campo en el orden correcto
  const params = [
    IdUsuario,
    IdCliente,
    TipoArticulo,
    CodigoArticulo,
    PrecioVenta,
    Descuento,
    Cantidad,
    PrecioBaseOriginal,
    MargenAplicado,
    IdMargenFK 
  ];

  Basedatos.query(query, params, (err, results) => {
    if (err) {
      console.error('Error al agregar artículo al carrito:', err);
      
      // ⭐️ CORRECCIÓN CLAVE: Manejo del error lanzado por el SP (SIGNAL) ⭐️
      if (err.sqlState === '45000') {
          // Es un error de negocio lanzado intencionalmente por el SP
          return res.status(400).json({ // 400 Bad Request
              success: false, 
              error: err.sqlMessage // Devolvemos el mensaje limpio del SP
          });
      }

      // Si es otro error de la base de datos o interno (500)
      return res.status(500).json({ 
          success: false, 
          error: 'Error interno del servidor al procesar la solicitud.',
          dbError: err.sqlMessage || err.message
      });
    }

    const idCarrito = results[0][0]?.IdCarritoUsado ?? null;

    res.json({
      success: true,
      mensaje: 'Artículo agregado correctamente al carrito.',
      idCarritoUsado: idCarrito
    });
  });
});

router.post('/eliminar-linea-del-carrito', (req, res) => {
  const { IdUsuario, IdCliente, TipoArticulo, CodigoArticulo } = req.body;

  console.log('Intentando eliminar línea del carrito con:', req.body);

  // Validación básica
  if (!IdUsuario || !IdCliente || !TipoArticulo || !CodigoArticulo) {
    return res.status(400).json({
      success: false,
      mensaje: 'Faltan parámetros requeridos (IdUsuario, IdCliente, TipoArticulo, CodigoArticulo).'
    });
  }

  // 1. CORRECCIÓN: Agregamos el 5to signo de interrogación (?)
  const query = `CALL \`${dbConfig.database}\`.\`sp_Carrito_EliminarLineaCompleta\`(?, ?, ?, ?, ?)`;
  
  // 2. CORRECCIÓN: Pasamos 'IdUsuario' dos veces.
  // La primera es para encontrar el carrito (dueño de la sesión).
  // La segunda es para el nuevo parámetro p_IdUsuarioExecutor (quién guarda en el historial).
  const params = [IdUsuario, IdCliente, TipoArticulo, CodigoArticulo, IdUsuario];

  Basedatos.query(query, params, (error, results) => {
    if (error) {
      console.error('Error al ejecutar sp_Carrito_EliminarLineaCompleta:', error);
      return res.status(500).json({
        success: false,
        mensaje: 'Error al eliminar línea del carrito.',
        error
      });
    }

    console.log('Resultado:', results);
    return res.json({
      success: true,
      mensaje: 'Línea del carrito eliminada correctamente.',
      resultado: results[0] || []
    });
  });
});

// Endpoint para eliminar una línea completa del carrito
router.post('/eliminar-linea-del-carrito', (req, res) => {
  const { IdUsuario, IdCliente, TipoArticulo, CodigoArticulo } = req.body;

  console.log('Intentando eliminar línea del carrito con:', req.body);

  // Validación básica
  if (!IdUsuario || !IdCliente || !TipoArticulo || !CodigoArticulo) {
    return res.status(400).json({
      success: false,
      mensaje: 'Faltan parámetros requeridos (IdUsuario, IdCliente, TipoArticulo, CodigoArticulo).'
    });
  }

  // Query para ejecutar el procedimiento almacenado
  const query = `CALL \`${dbConfig.database}\`.\`sp_Carrito_EliminarLineaCompleta\`(?, ?, ?, ?)`;
  const params = [IdUsuario, IdCliente, TipoArticulo, CodigoArticulo];

  Basedatos.query(query, params, (error, results) => {
    if (error) {
      console.error('Error al ejecutar sp_Carrito_EliminarLineaCompleta:', error);
      return res.status(500).json({
        success: false,
        mensaje: 'Error al eliminar línea del carrito.',
        error
      });
    }

    console.log('Resultado:', results);
    return res.json({
      success: true,
      mensaje: 'Línea del carrito eliminada correctamente.',
      resultado: results[0] || []
    });
  });
});


// En tu archivo de rutas del backend (ej: /routes/sales-base.js)
router.post('/finalizar', (req, res) => {
    // --- INICIO DE LA CORRECCIÓN ---
    // 1. Usamos nombres de variables consistentes con el endpoint de proformas.
    const {
        TipoDocumento,
        SubtotalVenta,
        IVA,
        TotalVenta,
        EstadoVenta,
        MetodoPago,
        Usuario,
        Cliente,
        Observaciones,
        Detalles
    } = req.body;

    // 2. La validación ahora comprueba las nuevas variables.
    if (!Usuario || !Cliente || !MetodoPago || !Detalles) {
        return res.status(400).json({ success: false, error: 'Faltan parámetros esenciales.' });
    }
    // --- FIN DE LA CORRECCIÓN ---

    const detallesJSON = JSON.stringify(Detalles);

    const args = [
        TipoDocumento,
        SubtotalVenta,
        IVA,
        TotalVenta,
        EstadoVenta,
        MetodoPago,
        Usuario,
        Cliente,
        Observaciones,
        detallesJSON
    ];
    
    const sql = `CALL \`${dbConfig.database}\`.\`RealizarVentaYDescargarInventario\`(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    Basedatos.query(sql, args, (err, results) => {
        if (err) {
            console.error('Error al ejecutar el SP RealizarVentaYDescargarInventario:', err);
            return res.status(500).json({ success: false, error: err.message, sqlState: err.sqlState });
        }
        
        const ventaId = results[0][0].CodigoVentaFinal;
        const numeroDocumento = results[0][0].NumeroDocumentoFinal;

        res.json({
            success: true,
            message: 'Venta realizada y registrada con éxito.',
            ventaId: ventaId,
            numeroDocumento: numeroDocumento
        });
    });
});
// En tu archivo de rutas del backend (ej: /routes/sales-base.js)

// ... (tu código de express, router, db, etc.)

// POST /api/ventas-base/carrito/actualizar-detalle
// Endpoint dedicado para actualizar detalles (como el descuento) de un artículo ya en el carrito.
router.post('/carrito/actualizar-detalle', (req, res) => {
    // 1. Extraer los datos del cuerpo de la solicitud
    const {
        IdUsuario,
        IdCliente,
        CodigoArticulo,
        TipoArticulo,
        Descuento,
        SubtotalSinIVA
    } = req.body;

    // 2. Preparar los argumentos para el procedimiento almacenado
    const args = [
        IdUsuario,
        IdCliente,
        CodigoArticulo,
        TipoArticulo,
        Descuento,
        SubtotalSinIVA
    ];

    // 3. Definir la consulta para llamar al SP
    const sql = `CALL \`${dbConfig.database}\`.\`sp_Carrito_ActualizarDetalle\`(?, ?, ?, ?, ?, ?)`;

    // 4. Ejecutar el procedimiento almacenado
    Basedatos.query(sql, args, (err, results) => {
        if (err) {
            // Si el SP lanza un error (ej: carrito no encontrado), se captura aquí
            console.error('Error al ejecutar sp_Carrito_ActualizarDetalle:', err);
            return res.status(500).json({ success: false, error: err.message });
        }

        // 5. Devolver una respuesta exitosa
        res.json({ success: true, message: 'Detalle del carrito actualizado correctamente.' });
    });
});


//get ssales by user id
router.get('/listado-ventas/:id', (req, res) => {
  const id = req.params.id;
  const sql = `CALL \`${dbConfig.database}\`.\`ListarVentasPorUsuario\` (?)`;
  Basedatos.query(sql, id, (err, result) => {
    if (err) {
      res.status(500).send('Error al buscar las ventas por usuario');
      return;
    }
    if (result.length === 0) {
      res.status(404).send('ventas no encotradas');
      return;
    }
    res.json(result[0]);
  });
});

// Listar carrito en curso para un usuario y cliente específicos
router.get('/listar-carrito-en-curso-cliente-usuario', (req, res) => {
  const { IdUsuario, IdCliente } = req.query;
  console.log('Parámetros recibidos:', { IdUsuario, IdCliente });
  if (!IdUsuario || !IdCliente) {
    return res.status(400).send('Faltan parámetros IdUsuario o IdCliente');
  }

  Basedatos.query(
    `CALL \`${dbConfig.database}\`.\`ListarCarritoUsuarioxClienteEnCurso\`(?, ?);`,
    [IdUsuario, IdCliente],
    (err, results) => {
      if (err) {
        console.error('Error al listar carrito en curso:', err);
        return res.status(500).send('Error al obtener el carrito');
      }
      res.json(results[0]); // MySQL devuelve los datos en la primera posición del array
    }
  );
});

router.get('/venta-completa/:idVenta', (req, res) => {
  // Extrae el ID de los parámetros de la ruta.
  const { idVenta } = req.params;

  // Validación básica para asegurar que se proveyó un ID.
  if (!idVenta) {
    return res.status(400).json({ success: false, error: 'ID de venta no proporcionado.' });
  }

  const query = `CALL \`${dbConfig.database}\`.\`sp_ObtenerDetalleVentaCompleta\`(?);`;

  // Ejecuta el procedimiento almacenado pasando el ID como parámetro.
  Basedatos.query(query, [idVenta], (err, results) => {
    if (err) {
      console.error('Error al ejecutar sp_ObtenerDetalleVentaCompleta:', err);
      return res.status(500).json({ success: false, error: 'Error en la base de datos.', details: err });
    }

    // El SP devuelve un array de resultados.
    // results[0] => contiene la info general de la venta (el primer SELECT).
    // results[1] => contiene los detalles de los artículos (el segundo SELECT).

    // Si no hay resultados o falta alguna de las dos partes, la venta no existe.
    if (!results || results.length < 2 || results[0].length === 0) {
      return res.status(404).json({ success: false, error: 'Venta no encontrada.' });
    }

    // Estructura la respuesta para que sea fácil de usar en el frontend.
    const ventaInfo = results[0][0]; // El primer elemento del primer resultado.
    const detallesVenta = results[1];   // El array completo del segundo resultado.

    res.json({
      success: true,
      data: {
        venta: ventaInfo,
        detalles: detallesVenta
      }
    });
  });
});

router.get('/proforma/:idProforma', (req, res) => {
  // 1. Extraer el ID de los parámetros de la URL.
  const { idProforma } = req.params;
  const { idUsuario } = req.query; // Obtenemos el usuario que intenta cargar la proforma

  // 2. Validación básica para asegurar que se proporcionó un ID.
  if (!idProforma || !idUsuario) {
    return res.status(400).json({ success: false, error: 'Faltan parámetros: ID de proforma o ID de usuario.' });
  }

  // 3. La consulta para llamar al procedimiento almacenado.
  const query = `CALL \`${dbConfig.database}\`.\`sp_GetProformaDetailsYValidarStock\`(?, ?);`;

  // 4. Ejecutar la consulta en la base de datos.
  Basedatos.query(query, [idProforma, idUsuario], (err, results) => {
    // Manejo de errores de conexión o sintaxis SQL.
    if (err) {
      console.error('Error al ejecutar sp_GetProformaDetailsYValidarStock:', err);
      return res.status(500).json({ success: false, error: 'Error en la base de datos.', details: err });
    }

    // 5. Procesar la respuesta del procedimiento almacenado.
    // Primero, verificamos si el SP devolvió un mensaje de error de lógica (ej. proforma expirada).
    // El SP fue diseñado para devolver un campo "Resultado" en este caso.
    if (results && results[0] && results[0][0] && results[0][0].Resultado) {
      return res.status(400).json({ success: false, error: results[0][0].Resultado });
    }

    // Si la proforma es válida, el SP devuelve 3 conjuntos de resultados.
    // Verificamos que la estructura sea la esperada.
    if (!results || results.length < 3) {
      return res.status(404).json({ success: false, error: 'Proforma no encontrada o la respuesta de la base de datos es inesperada.' });
    }

    // 6. Estructurar la respuesta exitosa para el frontend.
    const proformaInfo = results[0][0];       // El primer SELECT devuelve la cabecera.
    const detallesProforma = results[1];      // El segundo SELECT devuelve los detalles.
    const itemsNoDisponibles = results[2]; // El tercer SELECT devuelve los ítems sin stock.

    res.json({
      success: true,
      data: {
        proforma: proformaInfo,
        detalles: detallesProforma,
        itemsNoDisponibles: itemsNoDisponibles
      }
    });
  });
});

router.delete('/proforma/:id', (req, res) => {
  // 1. Obtener el ID de la proforma desde los parámetros de la URL.
  const { id } = req.params;
  console.log(`Solicitud para eliminar proforma con ID: ${id}`);

  // 2. Validación básica.
  if (!id) {
    return res.status(400).json({
      success: false,
      mensaje: 'No se proporcionó un ID de proforma para eliminar.'
    });
  }

  // 3. Preparar la llamada al procedimiento almacenado.
  const query = `CALL \`${dbConfig.database}\`.\`sp_EliminarProforma\`(?);`;
  const params = [id];

  // 4. Ejecutar la consulta en la base de datos.
  Basedatos.query(query, params, (err, results) => {
    // Manejo de errores de la base de datos.
    if (err) {
      console.error('Error al ejecutar sp_EliminarProforma:', err);
      
      // Si el error fue lanzado por nosotros desde el SP (código '45000')
      if (err.sqlState === '45000') {
        return res.status(400).json({
          success: false,
          mensaje: err.sqlMessage // Muestra el mensaje personalizado del SP
        });
      }
      
      // Para otros errores de servidor.
      return res.status(500).json({
        success: false,
        mensaje: 'Error en el servidor al intentar eliminar la proforma.',
        error: err.sqlMessage || err.message
      });
    }

    // 5. Enviar una respuesta exitosa.
    res.status(200).json({
      success: true,
      mensaje: `Proforma con ID ${id} eliminada exitosamente.`
    });
  });
});


router.get('/motivos-nota-credito', (req, res) => {
  // 1. Preparamos la llamada al procedimiento almacenado.
  const query = `CALL \`${dbConfig.database}\`.\`sp_ListarMotivosNotaCredito\`();`;

  // 2. Ejecutamos la consulta en la base de datos.
  Basedatos.query(query, (err, results) => {
    // 3. Manejo de errores.
    if (err) {
      console.error('Error al obtener los motivos de nota de crédito:', err);
      return res.status(500).json({ 
        success: false, 
        mensaje: 'Error en el servidor al consultar los motivos.' 
      });
    }

    // 4. Envío de la respuesta exitosa.
    // El resultado de un SP siempre viene en un array, usualmente en la posición [0].
    res.status(200).json(results[0]);
  });
});



module.exports = router;