/*TABLAS ADICIONALES PARA IMPLEMENTAR LA FUNCIONALIDAD DE MANTENER LOS ARTICULOS QUE SE VAN INGRESANDO
 EN EL PEDIDO Y LA FUNCIONALIDAD PARA DISTRIBUIR DE FORMA MAS RAPIDA LOS COSTOS ADICIONALES A LOS PRODUCTOS*/
 
 /*------------------------------------------------------------------------------
-- TABLA: PreIngresoProductos
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-09-12
-- DESCRIPCIÓN: Almacena de forma temporal los detalles de los productos
--              mientras se completa el proceso de ingreso de un pedido.
------------------------------------------------------------------------------*/
CREATE TABLE PreIngresoProductos (
    IdPreIngresoProductoPK INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    IdCodigoPedidoFK VARCHAR(25) NOT NULL,
    IdUsuarioFK INT NOT NULL,
    FormIndex INT NOT NULL, -- Columna añadida para el índice único
    Modelo INT NOT NULL,
    Color VARCHAR(100) NOT NULL,
    Estado INT NOT NULL,
    Hackeado BOOLEAN NOT NULL DEFAULT 0,
    Comentario VARCHAR(255),
    PrecioBase DECIMAL(6,2),
    CostoDistribuido DECIMAL(10,2) NULL DEFAULT 0.00,
    NumeroSerie VARCHAR(100),
    Accesorios VARCHAR(500),
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TareasPendientes VARCHAR(1000) NULL,    
    -- Clave única implementada directamente en la creación
    UNIQUE KEY `idx_pedido_usuario_form` (`IdCodigoPedidoFK`, `IdUsuarioFK`, `FormIndex`),    
    FOREIGN KEY (IdCodigoPedidoFK) REFERENCES PedidoBase(CodigoPedido),
    FOREIGN KEY (IdUsuarioFK) REFERENCES Usuarios(IdUsuarioPK)
);

/*------------------------------------------------------------------------------
-- TABLA: PreIngresoAccesorios
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-09-12
-- DESCRIPCIÓN: Almacena de forma temporal los detalles de los accesorios
--              mientras se completa el proceso de ingreso de un pedido.
------------------------------------------------------------------------------*/
CREATE TABLE PreIngresoAccesorios (
    IdPreIngresoAccesorioPK INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    IdCodigoPedidoFK VARCHAR(25) NOT NULL,
    IdUsuarioFK INT NOT NULL,
    FormIndex INT NOT NULL,
    ModeloAccesorio INT NOT NULL,
    ColorAccesorio VARCHAR(100) NOT NULL,
    EstadoAccesorio INT NOT NULL,
    Comentario VARCHAR(2000),
    PrecioBase DECIMAL(6,2),
    CostoDistribuido DECIMAL(10,2) NULL DEFAULT 0.00,
    NumeroSerie VARCHAR(100),
    ProductosCompatibles VARCHAR(500),
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TareasPendientes VARCHAR(1000) NULL,
    UNIQUE KEY `idx_pedido_usuario_form_acc` (`IdCodigoPedidoFK`, `IdUsuarioFK`, `FormIndex`),
    FOREIGN KEY (IdCodigoPedidoFK) REFERENCES PedidoBase(CodigoPedido),
    FOREIGN KEY (IdUsuarioFK) REFERENCES Usuarios(IdUsuarioPK)
);

/*------------------------------------------------------------------------------
-- TABLA: PreIngresoInsumos
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-09-12
-- DESCRIPCIÓN: Almacena de forma temporal los detalles de los insumos
--              mientras se completa el proceso de ingreso de un pedido.
------------------------------------------------------------------------------*/
CREATE TABLE PreIngresoInsumos (
    IdPreIngresoInsumoPK INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    IdCodigoPedidoFK VARCHAR(25) NOT NULL,
    IdUsuarioFK INT NOT NULL,
    FormIndex INT NOT NULL,
    ModeloInsumo INT NOT NULL,
    EstadoInsumo INT NOT NULL,
    Comentario VARCHAR(2000),
    PrecioBase DECIMAL(6,2),
    CostoDistribuido DECIMAL(10,2) NULL DEFAULT 0.00,
    NumeroSerie VARCHAR(100),
    ServiciosCompatibles VARCHAR(500),
    Cantidad INT UNSIGNED NOT NULL,
    StockMinimo INT UNSIGNED NOT NULL,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TareasPendientes VARCHAR(1000) NULL,
    UNIQUE KEY `idx_pedido_usuario_form_ins` (`IdCodigoPedidoFK`, `IdUsuarioFK`, `FormIndex`),
    FOREIGN KEY (IdCodigoPedidoFK) REFERENCES PedidoBase(CodigoPedido),
    FOREIGN KEY (IdUsuarioFK) REFERENCES Usuarios(IdUsuarioPK)
);
