-- 1. Consultar una proforma específica
SELECT vb.IdVentaPK, td.DescripcionDocumento, vb.NumeroDocumento, vb.FechaCreacion,
       c.NombreCliente, u.Nombre AS Vendedor, vb.SubtotalVenta, vb.IVA, vb.TotalVenta,
       ev.DescripcionEstadoVenta, mp.NombreMetodoPago, mv.NombreMargen
FROM VentasBase vb
JOIN TipoDocumento td ON vb.IdTipoDocumentoFK = td.IdTipoDocumentoPK
JOIN Clientes c ON vb.IdClienteFK = c.IdClientePK
JOIN Usuarios u ON vb.IdUsuarioFK = u.IdUsuarioPK
JOIN EstadoVenta ev ON vb.IdEstadoVentaFK = ev.IdEstadoVentaPK
JOIN MetodosDePago mp ON vb.IdMetodoDePagoFK = mp.IdMetodoPagoPK
JOIN MargenesVenta mv ON vb.IdMargenVentaFK = mv.IdMargenPK
WHERE td.DescripcionDocumento = 'Proforma' AND vb.IdVentaPK = 41;

-- 2. Consultar los detalles de cualquier venta
SELECT dv.IdDetalleVentaPK, dv.TipoArticulo, dv.CodigoArticulo, dv.Cantidad,
       dv.PrecioVenta, dv.Descuento, dv.SubtotalSinIVA
FROM DetalleVenta dv
WHERE dv.IdVentaFK = 42;

-- 3. Listado de facturas emitidas
SELECT vb.IdVentaPK, vb.NumeroDocumento, vb.FechaCreacion, 
       c.NombreCliente, vb.TotalVenta
FROM VentasBase vb
JOIN TipoDocumento td ON vb.IdTipoDocumentoFK = td.IdTipoDocumentoPK
JOIN Clientes c ON vb.IdClienteFK = c.IdClientePK
WHERE td.DescripcionDocumento = 'Factura';

-- 4. Consultar nota de crédito emitida para una venta
SELECT nc.IdNotaCreditoPK, nc.FechaEmision, nc.Motivo, nc.TotalCredito,
       u.Nombre AS Emisor, nc.Estado
FROM NotasCredito nc
JOIN Usuarios u ON nc.UsuarioEmisorFK = u.IdUsuarioPK
WHERE nc.IdVentaFK = 1;

-- 5. Consultar artículos relacionados a una nota de crédito
SELECT dnc.TipoArticulo, dnc.CodigoArticulo, dnc.Cantidad, dnc.PrecioUnitario, dnc.Subtotal
FROM DetalleNotaCredito dnc
WHERE dnc.IdNotaCreditoFK = 1;

-- 6. Consultar el contenido del carrito antes de hacer la venta
SELECT cv.IdCarritoPK, u.Nombre AS Usuario, c.NombreCliente, cv.EstadoCarrito, cv.FechaCreacion,
       dc.TipoArticulo, dc.CodigoArticulo, dc.Cantidad, dc.PrecioVenta, dc.Descuento, dc.SubtotalSinIVA
FROM CarritoVentas cv
JOIN Usuarios u ON cv.IdUsuarioFK = u.IdUsuarioPK
LEFT JOIN Clientes c ON cv.IdClienteFK = c.IdClientePK
JOIN DetalleCarritoVentas dc ON cv.IdCarritoPK = dc.IdCarritoFK
WHERE cv.IdCarritoPK = 1;

-- 7. Resumen de ventas por tipo de documento
SELECT td.DescripcionDocumento, COUNT(*) AS Cantidad, SUM(vb.TotalVenta) AS TotalVendido
FROM VentasBase vb
JOIN TipoDocumento td ON vb.IdTipoDocumentoFK = td.IdTipoDocumentoPK
GROUP BY td.DescripcionDocumento;
