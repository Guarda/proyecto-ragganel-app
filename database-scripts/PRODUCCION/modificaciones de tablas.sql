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