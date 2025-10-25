-- Añadir columna de usuario a HistorialEstadoPedido
ALTER TABLE HistorialEstadoPedido
ADD COLUMN IdUsuarioFK INT NULL,
ADD CONSTRAINT fk_historialpedido_usuario
FOREIGN KEY (IdUsuarioFK) REFERENCES Usuarios(IdUsuarioPK);

-- Añadir columna de usuario a HistorialEstadoProducto
ALTER TABLE HistorialEstadoProducto
ADD COLUMN IdUsuarioFK INT NULL,
ADD CONSTRAINT fk_historialproducto_usuario
FOREIGN KEY (IdUsuarioFK) REFERENCES Usuarios(IdUsuarioPK);

-- Añadir columna de usuario a HistorialEstadoAccesorio
ALTER TABLE HistorialEstadoAccesorio
ADD COLUMN IdUsuarioFK INT NULL,
ADD CONSTRAINT fk_historialaccesorio_usuario
FOREIGN KEY (IdUsuarioFK) REFERENCES Usuarios(IdUsuarioPK);

-- NOTA: La tabla HistorialEstadoInsumo ya contenía la columna en tu script,
-- pero nos aseguramos de que la restricción exista.
-- Si la columna no existiera, se usaría el siguiente código:
ALTER TABLE HistorialEstadoInsumo
ADD COLUMN IdUsuarioFK INT NULL,
ADD CONSTRAINT fk_historialinsumo_usuario
FOREIGN KEY (IdUsuarioFK) REFERENCES Usuarios(IdUsuarioPK);


-- Asumiendo que estás usando la base de datos correcta
-- USE base_datos_inventario_taller_prueba;

-- II. SECCIÓN DE INVENTARIO
ALTER TABLE ProductosBases MODIFY COLUMN Comentario VARCHAR(10000);
ALTER TABLE AccesoriosBase MODIFY COLUMN Comentario VARCHAR(10000);
ALTER TABLE InsumosBase MODIFY COLUMN Comentario VARCHAR(10000);

-- III. SECCIÓN DE PEDIDOS
ALTER TABLE PedidoBase MODIFY COLUMN Comentarios VARCHAR(10000);
ALTER TABLE DetalleProductoPedido MODIFY COLUMN Comentario VARCHAR(10000);
ALTER TABLE DetalleAccesorioPedido MODIFY COLUMN Comentario VARCHAR(10000);
ALTER TABLE DetalleInsumoPedido MODIFY COLUMN Comentario VARCHAR(10000);

-- V. SECCIÓN DE TABLAS VENTAS
ALTER TABLE Clientes MODIFY COLUMN Comentarios VARCHAR(10000);
ALTER TABLE VentasBase MODIFY COLUMN Observaciones VARCHAR(10000);
ALTER TABLE CarritoVentas MODIFY COLUMN Comentario VARCHAR(10000);

-- VI. SECCIÓN DE TABLAS SERVICIOS
ALTER TABLE ServiciosBase MODIFY COLUMN Comentario VARCHAR(10000);

-- VIII. SECCIÓN DE PRE-INGRESO DE PEDIDOS
ALTER TABLE PreIngresoProductos MODIFY COLUMN Comentario VARCHAR(10000);
ALTER TABLE PreIngresoAccesorios MODIFY COLUMN Comentario VARCHAR(10000);
ALTER TABLE PreIngresoInsumos MODIFY COLUMN Comentario VARCHAR(10000);