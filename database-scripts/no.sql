INSERT INTO Clientes (NombreCliente, DNI, RUC, Telefono, CorreoElectronico, Direccion, FechaRegistro, Estado)
VALUES ('Carlos Pérez', '001234567', 'J123456789', '8888-0000', 'carlos@example.com', 'Managua, Nicaragua', CURDATE(), 1);

INSERT INTO Usuarios (Nombre, Correo, Password, FechaIngresoUsuario, IdEstadoFK, IdRolFK)
VALUES ('Pedro Vendedor', 'vendedor@example.com', 'clave123encriptada', CURDATE(), 1, 2);

INSERT INTO CarritoVentas (IdUsuarioFK, IdClienteFK, Comentario)
VALUES (2, 1, 'Carrito de prueba para venta completa');

-- Supongamos que tienes artículos con códigos 'PROD001', 'ACCE001', 'SERV001'
INSERT INTO DetalleCarritoVentas (IdCarritoFK, TipoArticulo, CodigoArticulo, PrecioVenta, Descuento, SubtotalSinIVA, Cantidad)
VALUES 
(1, 'Producto', 'PROD001', 100.00, 0.00, 100.00, 1),
(1, 'Accesorio', 'ACCE001', 50.00, 5.00, 45.00, 1),
(1, 'Servicio', 'SERV001', 200.00, 0.00, 200.00, 1);

-- Proforma con margen 'Estandar' y pago en efectivo
INSERT INTO VentasBase (FechaCreacion, IdTipoDocumentoFK, NumeroDocumento, SubtotalVenta, IVA, TotalVenta, IdEstadoVentaFK, IdMetodoDePagoFK, IdMargenVentaFK, IdUsuarioFK, IdClienteFK, Observaciones)
VALUES (CURDATE(), 2, 'PROF-0001', 345.00, 51.75, 396.75, 1, 1, 1, 2, 1, 'Proforma generada automáticamente');

INSERT INTO DetalleVenta (IdVentaFK, TipoArticulo, CodigoArticulo, PrecioVenta, Descuento, SubtotalSinIVA, Cantidad)
VALUES 
(1, 'Producto', 'PROD001', 100.00, 0.00, 100.00, 1),
(1, 'Accesorio', 'ACCE001', 50.00, 5.00, 45.00, 1),
(1, 'Servicio', 'SERV001', 200.00, 0.00, 200.00, 1);

INSERT INTO NotasCredito (IdVentaFK, Motivo, TotalCredito, UsuarioEmisorFK)
VALUES (1, 'Error en el artículo entregado', 145.00, 2);

INSERT INTO DetalleNotaCredito (IdNotaCreditoFK, TipoArticulo, CodigoArticulo, Cantidad, PrecioUnitario, Subtotal)
VALUES 
(1, 'Accesorio', 'ACCE001', 1, 45.00, 45.00),
(1, 'Servicio', 'SERV001', 1, 100.00, 100.00);



/*FACTURA*/
INSERT INTO VentasBase (
    FechaCreacion, IdTipoDocumentoFK, NumeroDocumento, SubtotalVenta, IVA, TotalVenta,
    IdEstadoVentaFK, IdMetodoDePagoFK, IdMargenVentaFK, IdUsuarioFK, IdClienteFK, Observaciones
)
VALUES (
    CURDATE(), 3, 'FACT-0001', 300.00, 45.00, 345.00,
    2, 1, 1, 2, 1, 'Factura de prueba emitida manualmente'
);

INSERT INTO DetalleVenta (
    IdVentaFK, TipoArticulo, CodigoArticulo, PrecioVenta, Descuento, SubtotalSinIVA, Cantidad
)
VALUES
(1, 'Producto', 'PROD001', 100.00, 0.00, 100.00, 1),
(1, 'Accesorio', 'ACCE001', 80.00, 10.00, 70.00, 1),
(1, 'Servicio', 'SERV001', 150.00, 20.00, 130.00, 1);


/*factura de transferencia*/
INSERT INTO VentasBase (
    FechaCreacion, IdTipoDocumentoFK, NumeroDocumento, SubtotalVenta, IVA, TotalVenta,
    IdEstadoVentaFK, IdMetodoDePagoFK, IdMargenVentaFK, IdUsuarioFK, IdClienteFK, Observaciones
)
VALUES (
    CURDATE(), 3, 'FACT-0002', 400.00, 60.00, 460.00,
    2, 2, 1, 2, 1, 'Factura pagada vía transferencia bancaria'
);

INSERT INTO DetalleVenta (
    IdVentaFK, TipoArticulo, CodigoArticulo, PrecioVenta, Descuento, SubtotalSinIVA, Cantidad
)
VALUES
(2, 'Producto', 'PROD002', 150.00, 0.00, 150.00, 1),
(2, 'Insumo', 'INSU001', 100.00, 0.00, 100.00, 1),
(2, 'Servicio', 'SERV002', 180.00, 30.00, 150.00, 1);

INSERT INTO VentasEXT (IdVentaFK, NumeroReferenciaTransferencia)
VALUES (2, 'TRANSF-12345678');





