const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List all sales margins types
router.get('/margenes-venta', (req, res) => {
  db.query('CALL `base_datos_inventario_taller`.`ListarPreciosVenta`();', (err, results) => {
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
  db.query('CALL `base_datos_inventario_taller`.`ListarMetodosDePago`();', (err, results) => {
    if (err) {
      res.status(500).send('Error payment methods');
      console.log(err);
      return;
    }
    res.json(results[0]);
  });
});

// create sale proforma
router.post('/ingresar-venta', (req, res) => {
  const {
    FechaCreacion, TipoDocumento,
    SubtotalVenta, IVA, TotalVenta, EstadoVenta,
    MetodoPago, Margen, Usuario, Cliente, Observaciones,
    NumeroReferenciaTransferencia, Detalles
  } = req.body;

  console.log('Datos recibidos:', req.body);

  const detallesJSON = JSON.stringify(Detalles);

  // CORRECCIÓN: La consulta debe tener 13 '?' para los 13 parámetros de ENTRADA (IN).
  // El parámetro de SALIDA (OUT) se maneja con @codigoGenerado directamente.
  const query = `
    CALL InsertarVentaProforma(
      ?, ?, @codigoGenerado, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    );
    SELECT @codigoGenerado AS CodigoProforma;
  `;

  // CORRECIÓN: El orden de los parámetros debe coincidir con la consulta.
  const params = [
    FechaCreacion,                      // p_Fecha
    TipoDocumento,                      // p_TipoDocumento
    // @codigoGenerado se maneja en el SQL, no se pasa aquí
    SubtotalVenta,                      // p_Subtotal
    IVA,                                // p_IVA
    TotalVenta,                         // p_Total
    EstadoVenta,                        // p_Estado
    MetodoPago,                         // p_MetodoPago
    Margen,                             // p_Margen
    Usuario,                            // p_Usuario
    Cliente,                            // p_Cliente
    Observaciones,                      // p_Observaciones
    NumeroReferenciaTransferencia,      // p_ReferenciaTransferencia
    detallesJSON                        // p_Detalles
  ];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error al ejecutar InsertarVentaProforma:', err);
      // Devuelve el error completo para facilitar la depuración
      return res.status(500).json({ success: false, error: err });
    }

    // El resultado de la variable de sesión está en el segundo resultado (índice 1)
    const codigoGenerado = results[1][0]?.CodigoProforma;
    return res.status(200).json({
      success: true,
      codigo: codigoGenerado || null
    });
  });
});

// Agregar artículo al carrito (creando carrito si no existe)
router.post('/agregar-al-carrito', (req, res) => {
  const {
    IdUsuario, IdCliente,
    TipoArticulo, CodigoArticulo,
    PrecioVenta, Descuento, /* SubtotalSinIVA, */ Cantidad // SubtotalSinIVA commented out here
  } = req.body;

  // The stored procedure now expects 7 arguments:
  // p_IdUsuario, p_IdCliente, p_TipoArticulo, p_CodigoArticulo, p_PrecioVenta, p_Descuento, p_Cantidad
  const query = `CALL base_datos_inventario_taller.sp_Carrito_AgregarArticulo(?, ?, ?, ?, ?, ?, ?);`; // Reduced to 7 placeholders
  const params = [
    IdUsuario,
    IdCliente,
    TipoArticulo,
    CodigoArticulo,
    PrecioVenta,
    Descuento,
    // SubtotalSinIVA, // <<< REMOVE THIS LINE
    Cantidad
  ];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error al agregar artículo al carrito:', err);
      return res.status(500).json({ success: false, error: err });
    }

    // Retorna el ID del carrito utilizado (nuevo o existente)
    const idCarrito = results[0][0]?.IdCarritoUsado ?? null;

    res.json({
      success: true,
      mensaje: 'Artículo agregado correctamente.',
      idCarritoUsado: idCarrito
    });
  });
});

router.delete('/eliminar-del-carrito', (req, res) => {
  const {
    IdUsuario,
    IdCliente,
    TipoArticulo,
    CodigoArticulo
  } = req.body;

  if (!IdUsuario || !IdCliente || !TipoArticulo || !CodigoArticulo) {
    return res.status(400).json({
      success: false,
      mensaje: 'Faltan parámetros requeridos (IdUsuario, IdCliente, TipoArticulo, CodigoArticulo).'
    });
  }

  const query = 'CALL base_datos_inventario_taller.sp_Carrito_DisminuirArticulo(?, ?, ?, ?);';

  db.query(query, [IdUsuario, IdCliente, TipoArticulo, CodigoArticulo], (err, results) => {
    if (err) {
      console.error('Error al disminuir/eliminar artículo del carrito:', err);
      return res.status(500).json({
        success: false,
        mensaje: 'Error al ejecutar el procedimiento almacenado.',
        error: err
      });
    }

    res.json({
      success: true,
      mensaje: 'Artículo disminuido o eliminado correctamente del carrito.',
      resultado: results[0]
    });
  });
});

router.delete('/vaciar-carrito/:idCarrito', (req, res) => {
  const idCarrito = parseInt(req.params.idCarrito);

  if (isNaN(idCarrito)) {
    return res.status(400).json({
      success: false,
      mensaje: 'ID de carrito inválido.'
    });
  }

  const query = 'CALL base_datos_inventario_taller.VaciarCarrito(?);';

  db.query(query, [idCarrito], (err, results) => {
    if (err) {
      console.error('Error al vaciar carrito:', err);
      return res.status(500).json({
        success: false,
        mensaje: 'Error al ejecutar el procedimiento almacenado.',
        error: err
      });
    }

    res.json({
      success: true,
      mensaje: `Carrito con ID ${idCarrito} vaciado correctamente.`,
      resultado: results[0] || []
    });
  });
});


//get ssales by user id
router.get('/listado-ventas/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'CALL `base_datos_inventario_taller`.`ListarVentasPorUsuario` (?)';
  db.query(sql, id, (err, result) => {
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

  db.query(
    'CALL `base_datos_inventario_taller`.`ListarCarritoUsuarioxClienteEnCurso`(?, ?);',
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


module.exports = router;