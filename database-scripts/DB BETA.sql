/*CREAR BASE PRUEBA*/


/*TABLA ESTADOS DE USUARIOS*/
CREATE TABLE EstadoUsuarios (
	IdEstadoPK INT AUTO_INCREMENT PRIMARY KEY,
    DescripcionEstado varchar(100)
);

INSERT INTO EstadoUsuarios (DescripcionEstado) VALUES ('Activo');
INSERT INTO EstadoUsuarios (DescripcionEstado) VALUES ('Inactivo');

/*TABLA ROLES CREADA EL 18/03/2025*/
CREATE TABLE Roles (
    IdRolPK INT AUTO_INCREMENT PRIMARY KEY,
    NombreRol VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO ROLES (NombreRol) VALUES ('Admin');
INSERT INTO ROLES (NombreRol) VALUES ('Vendedor');
INSERT INTO ROLES (NombreRol) VALUES ('Logistica');

/*TABLA USUARIO CREADA EL 18/03/2025*/
CREATE TABLE Usuarios (
    IdUsuarioPK INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    FechaIngresoUsuario date,
    IdEstadoFK int not null,
    IdRolFK INT NOT NULL,
    FOREIGN KEY (IdRolFK) REFERENCES Roles(IdRolPK),
    FOREIGN KEY (IdEstadoFK) REFERENCES EstadoUsuarios (IdEstadoPK)
);

INSERT INTO USUARIOS (Nombre, Correo, Password, FechaIngresoUsuario, IdEstadoFK, IdRolFK) VALUES ('Usuario Default Administrador 3', 'correoejemplo2@ragganel.com', '$2b$10$fJqJ2zwn1Bc7kfyTFpG3ZOL9hhiiXz8Q7.NC5GnZhC.XN0hBWGYlK', '2025-03-18',1,1);
-- password *NDYWng37F}M>6q
/*TABLA CLIENTES CREADA POR ROMMEL MALTEZ 29/03/2025*/
CREATE TABLE Clientes (
	IdClientePK INT AUTO_INCREMENT PRIMARY KEY,
    NombreCliente VARCHAR(255) NOT NULL,
    DNI VARCHAR(255) NULL,
    RUC VARCHAR(255) NULL,
    Telefono VARCHAR(255) NULL,
    CorreoElectronico VARCHAR(255) NULL,
    Direccion VARCHAR(255) NULL,
    FechaRegistro date,
    Estado boolean not null default 1
);

/*TABLAS DE VENTAS*/

/*TABLA TIPO DOCUMENTO*/
CREATE TABLE TipoDocumento (
	IdTipoDocumentoPK INT AUTO_INCREMENT PRIMARY KEY,
    DescripcionDocumento varchar(100)
);

INSERT INTO TipoDocumento (DescripcionDocumento) values ('En Espera');
INSERT INTO TipoDocumento (DescripcionDocumento) values ('Proforma');
INSERT INTO TipoDocumento (DescripcionDocumento) values ('Factura');

/*Estado de venta*/
CREATE TABLE ESTADOVENTA(
	IdEstadoVentaPK INT AUTO_INCREMENT PRIMARY KEY,
	DescripcionEstadoVenta varchar(100)
);

INSERT INTO ESTADOVENTA (DescripcionEstadoVenta) values ('Pendiente');
INSERT INTO ESTADOVENTA (DescripcionEstadoVenta) values ('Pagado');
INSERT INTO ESTADOVENTA (DescripcionEstadoVenta) values ('Anulado');

/*TABLA VENTASBASE CREADA el 10/04/2025 POR ROMMEL MALTEZ*/
CREATE TABLE VentasBase(
	/*VALORES DE LA VENTA*/
	IdVentaPK INT AUTO_INCREMENT PRIMARY KEY, 
    FechaCreacion date NOT NULL,
    IdTipoDocumentoFK int not null,
    NumeroDocumento varchar(255),
    SubtotalVenta Decimal(6,2),
    IVA Decimal(6,2),
    TotalVenta Decimal(6,2),
    IdEstadoVentaFK  int not null,
    IdMetodoDePagoFK int not null,
    /*VALORES EXTRAS VENTA*/
    IdMargenVentaFK int not null,
    IdUsuarioFK int not null,
    IdClienteFK int not null,
    Observaciones varchar(255),
    FOREIGN KEY (IdTipoDocumentoFK) REFERENCES TipoDocumento(IdTipoDocumentoPK),
    FOREIGN KEY (IdEstadoVentaFK) REFERENCES ESTADOVENTA(IdEstadoVentaPK),
    FOREIGN KEY (IdMetodoDePagoFK) REFERENCES metodosdepago (IdMetodoPagoPK),
    FOREIGN KEY (IdMargenVentaFK) REFERENCES margenesventa (IdMargenPK),
    FOREIGN KEY (IdUsuarioFK) REFERENCES Usuarios (IdUsuarioPK),
    FOREIGN KEY (IdClienteFK) REFERENCES Clientes (IdCLientePK)
);


CREATE TABLE VentasBase(
	/*VALORES DE LA VENTA*/
	IdVentaPK INT AUTO_INCREMENT PRIMARY KEY, 
    FechaCreacion date NOT NULL,
    IdTipoDocumentoFK int not null,
    NumeroDocumento varchar(255),
    SubtotalVenta Decimal(6,2),
    IVA Decimal(6,2),
    TotalVenta Decimal(6,2),
    IdEstadoVentaFK  int not null,
    IdMetodoDePagoFK int not null,
    /*VALORES EXTRAS VENTA*/
    IdMargenVentaFK int not null,
    IdUsuarioFK int not null,
    IdClienteFK int not null,
    Observaciones varchar(255),
    FOREIGN KEY (IdTipoDocumentoFK) REFERENCES TipoDocumento(IdTipoDocumentoPK),
    FOREIGN KEY (IdEstadoVentaFK) REFERENCES ESTADOVENTA(IdEstadoVentaPK),
    FOREIGN KEY (IdMetodoDePagoFK) REFERENCES metodosdepago (IdMetodoPagoPK),
    FOREIGN KEY (IdMargenVentaFK) REFERENCES margenesventa (IdMargenPK),
    FOREIGN KEY (IdUsuarioFK) REFERENCES Usuarios (IdUsuarioPK),
    FOREIGN KEY (IdClienteFK) REFERENCES Clientes (IdCLientePK)
);


/*TABLA MargenesVenta*/
CREATE TABLE MargenesVenta (
    IdMargenPK INT PRIMARY KEY AUTO_INCREMENT,
    NombreMargen VARCHAR(50) NOT NULL COMMENT 'Ej: Estandar, Promocional, Mayorista',
    Porcentaje DECIMAL(5, 2) NOT NULL COMMENT '30.00 para 30%, 15.50 para 15.5%',
    Descripcion VARCHAR(255),
    Activo BOOLEAN DEFAULT TRUE
);

INSERT INTO MargenesVenta (NombreMargen, Porcentaje, Descripcion) VALUES 
('Estandar', 35.00, 'Margen normal para venta al público'),
('Promocional', 20.00, 'Para ofertas temporales'),
('Mayorista', 15.00, 'Clientes con compras al por mayor'),
('VIP', 25.00, 'Clientes frecuentes');

/*TABLA MetodosDePago CREADA EL 31/05/2025*/
CREATE TABLE MetodosDePago (
	IdMetodoPagoPK INT PRIMARY KEY auto_increment,
    NombreMetodoPago Varchar(50) NOT NULL,
    Descripcion varchar(255),
    Activo BOOLEAN DEFAULT TRUE
);

INSERT INTO MetodosDePago (NombreMetodoPago, Descripcion) VALUES 
('Efectivo', 'Pago de contado en efectivo'),
('Transferencia',  'Pago por transferencia bancaria, anotar numero de referencia'),
('Tarjeta POS Electronico', 'Clientes con compras al por mayor'),
('Otros',  'Pagos por medios sin contacto como NFC, Billetera digital, Canje');


-- Tabla principal del carrito
CREATE TABLE CarritoVentas (
    IdCarritoPK INT AUTO_INCREMENT PRIMARY KEY,
    IdUsuarioFK INT NOT NULL,
    IdClienteFK INT,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Comentario VARCHAR(255),
    EstadoCarrito VARCHAR(50) DEFAULT 'En curso',
    FOREIGN KEY (IdUsuarioFK) REFERENCES Usuarios(IdUsuarioPK),
    FOREIGN KEY (IdClienteFK) REFERENCES Clientes(IdClientePK)
);

-- Detalle del carrito (los artículos)
CREATE TABLE DetalleCarritoVentas (
    IdDetalleCarritoPK INT AUTO_INCREMENT PRIMARY KEY,
    IdCarritoFK INT NOT NULL,
    TipoArticulo ENUM('Producto', 'Accesorio', 'Insumo', 'Servicio') NOT NULL,
    CodigoArticulo VARCHAR(25) NOT NULL,
    PrecioVenta DECIMAL(10,2) NOT NULL,
    Descuento DECIMAL(10,2) DEFAULT 0,
    SubtotalSinIVA DECIMAL(10,2) NOT NULL,
    Cantidad INT UNSIGNED DEFAULT 1,
    FOREIGN KEY (IdCarritoFK) REFERENCES CarritoVentas(IdCarritoPK)
);

-- Detalle de cualquier venta (proforma o factura)
CREATE TABLE DetalleVenta (
    IdDetalleVentaPK INT AUTO_INCREMENT PRIMARY KEY,
    IdVentaFK INT NOT NULL,
    TipoArticulo ENUM('Producto', 'Accesorio', 'Insumo', 'Servicio') NOT NULL,
    CodigoArticulo VARCHAR(25) NOT NULL,
    PrecioVenta DECIMAL(10,2) NOT NULL,
    Descuento DECIMAL(10,2) DEFAULT 0,
    SubtotalSinIVA DECIMAL(10,2) NOT NULL,
    Cantidad INT UNSIGNED DEFAULT 1,
    FOREIGN KEY (IdVentaFK) REFERENCES VentasBase(IdVentaPK)
);

CREATE TABLE NotasCredito (
    IdNotaCreditoPK INT AUTO_INCREMENT PRIMARY KEY,
    IdVentaFK INT NOT NULL,
    FechaEmision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Motivo TEXT NOT NULL,
    TotalCredito DECIMAL(10,2) NOT NULL,
    UsuarioEmisorFK INT NOT NULL,
    Estado BOOLEAN DEFAULT TRUE, -- TRUE = activa, FALSE = anulada
    FOREIGN KEY (IdVentaFK) REFERENCES VentasBase(IdVentaPK),
    FOREIGN KEY (UsuarioEmisorFK) REFERENCES Usuarios(IdUsuarioPK)
);



CREATE TABLE DetalleNotaCredito (
    IdDetalleNotaPK INT AUTO_INCREMENT PRIMARY KEY,
    IdNotaCreditoFK INT NOT NULL,
    TipoArticulo ENUM('Producto', 'Accesorio', 'Insumo', 'Servicio') NOT NULL,
    CodigoArticulo VARCHAR(25) NOT NULL,
    Cantidad INT UNSIGNED DEFAULT 1,
    PrecioUnitario DECIMAL(10,2),
    Subtotal DECIMAL(10,2),
    FOREIGN KEY (IdNotaCreditoFK) REFERENCES NotasCredito(IdNotaCreditoPK)
);








