/*SCRIPT DE CREACION DE LA DB Y TABLAS*/
create database base_datos_inventario_taller;
use base_datos_inventario_taller;

CREATE TABLE TipoArticulo 
(
	IdTipoArticuloPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionTipoArticulo varchar(100) not null,
    Estado boolean not null default 1
);

INSERT INTO TipoArticulo (DescripcionTipoArticulo) values ('Producto');
INSERT INTO TipoArticulo (DescripcionTipoArticulo) values ('Accesorio');
INSERT INTO TipoArticulo (DescripcionTipoArticulo) values ('Insumo');

/*TABLAS CREADAS EL 10/09/24 TiposAccesorios, TiposProductos y CatalogoTiposAccesoriosXProducto*/
CREATE TABLE TiposAccesorios (
	IdTipoAccesorioPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    CodigoAccesorio varchar(25),
    DescripcionAccesorio varchar(100),
    Activo boolean not null default 1
);


CREATE TABLE TiposProductos (
	IdTipoProductoPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionTipoProducto varchar(100),
    Activo boolean not null default 1
);

CREATE TABLE CatalogoTiposAccesoriosXProducto (
	IdCatalogoAccesorioXProductoPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    IdTipoAccesorioFK int,
    IdTipoProductoFK int,
    Activo boolean not null default 1,
	FOREIGN KEY (IdTipoAccesorioFK) REFERENCES TiposAccesorios (IdTipoAccesorioPK),
    FOREIGN KEY (IdTipoProductoFK) REFERENCES TiposProductos (IdTipoProductoPK)
);    

/*TABLA FABRICANTES CREADO 14/09/24*/

CREATE TABLE FABRICANTES (
	IdFabricantePK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreFabricante varchar(100),
    Activo boolean not null default 1
);

INSERT INTO FABRICANTES (NombreFabricante) values ('Nintendo');
INSERT INTO FABRICANTES (NombreFabricante) values ('Sony');
INSERT INTO FABRICANTES (NombreFabricante) values ('Microsoft');


/* TABLA CATEGORIAS CREADO 14/09/24*/

CREATE TABLE CategoriasProductos (
	IdCategoriaPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreCategoria varchar(100),
    IdFabricanteFK int,
    Activo boolean not null default 1,
    FOREIGN KEY (IdFabricanteFK) REFERENCES FABRICANTES (IdFabricantePK)
);

INSERT INTO CategoriasProductos (NombreCategoria, IdFabricanteFK) values ('Gamecube',1);
INSERT INTO CategoriasProductos (NombreCategoria, IdFabricanteFK) values ('3DS',1);
INSERT INTO CategoriasProductos (NombreCategoria, IdFabricanteFK) values ('Nintendo 64',1);
INSERT INTO CategoriasProductos (NombreCategoria, IdFabricanteFK) values ('Play Station 2 - FAT',2);
INSERT INTO CategoriasProductos (NombreCategoria, IdFabricanteFK) values ('Play Station 2 - SLIM',2);
INSERT INTO CategoriasProductos (NombreCategoria, IdFabricanteFK) values ('Xbox 360',3);
INSERT INTO CategoriasProductos (NombreCategoria, IdFabricanteFK) values ('Xbox 360 S',3);
/* TABLA SUBCATEGORIAS CREADO 14/09/24*/

CREATE TABLE SubcategoriasProductos (
	IdSubcategoria int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreSubcategoria varchar(100),
    IdCategoriaFK int,
    Activo boolean not null default 1,
    FOREIGN KEY (IdCategoriaFK) REFERENCES CategoriasProductos (IdCategoriaPK)
);

INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('Indigo',1);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('Jet Black',1);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('Platinum Silver',1);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('Spice Orange',1);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('Pearl White',1);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('Metroid Prime Bundle',1);

INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('OLD 3DS',2);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('OLD 3DSXL',2);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('OLD 2DS',2);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('NEW 3DS',2);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('NEW 3DSXL',2);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('NEW 2DSXL',2);

INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('SCPH-700xx (2004-2005)',5);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('SCPH-750xx (2005-2006)',5);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('SCPH-770xx (2006-2007)',5);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('SCPH-790xx (2007)',5);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('SCPH-900xx (2007-2013)',5);


CREATE TABLE CatalogoConsolas (
	IdModeloConsolaPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    Fabricante int,
    Categoria int,
    Subcategoria int,
	CodigoModeloConsola varchar(25),    
    LinkImagen varchar(100),
    TipoProducto int,
    Activo boolean not null default 1,
    FOREIGN KEY (TipoProducto) REFERENCES TiposProductos (IdTipoProductoPK),
    FOREIGN KEY (Fabricante) REFERENCES Fabricantes (IdFabricantePK),
    FOREIGN KEY (Categoria) REFERENCES categoriasproductos (IdcategoriaPK),
    FOREIGN KEY (Subcategoria) REFERENCES subcategoriasproductos (IdSubcategoria)
);

/*TABLA ESTADOS*/

CREATE TABLE IF NOT EXISTS CatalogoEstadosConsolas(
	CodigoEstado int not null AUTO_INCREMENT,
    DescripcionEstado varchar(100) not null,
    PRIMARY KEY (CodigoEstado)
);
Insert into CatalogoEstadosConsolas (DescripcionEstado) values('Nuevo');
Insert into CatalogoEstadosConsolas (DescripcionEstado) values('Usado');
Insert into CatalogoEstadosConsolas (DescripcionEstado) values('Para piezas');
Insert into CatalogoEstadosConsolas (DescripcionEstado) values('Personalizado');
Insert into CatalogoEstadosConsolas (DescripcionEstado) values('Reparado');
Insert into CatalogoEstadosConsolas (DescripcionEstado) values('A reparar');
Insert into CatalogoEstadosConsolas (DescripcionEstado) values('Borrado');
insert into catalogoestadosconsolas (DescripcionEstado) values ('Vendido');
Insert into CatalogoEstadosConsolas (DescripcionEstado) values('En garantia');
Insert into CatalogoEstadosConsolas (DescripcionEstado) values('Descargado');
Insert into CatalogoEstadosConsolas (DescripcionEstado) values('En proceso de venta');

select * from CatalogoEstadosConsolas;
select * from catalogoconsolas;
/* TABLA PRODUCTOSBASES*/

CREATE TABLE ProductosBases (
	CodigoConsola varchar(25) primary key not null,
    Modelo int not null,
    Color varchar(100) not null,
    Estado int not null,
    Hackeado boolean not null default 0,
    FechaIngreso date,
    Comentario varchar(255),
    PrecioBase Decimal(6,2),
    NumeroSerie varchar(100),    
    Accesorios varchar(500),
    FOREIGN KEY (Modelo) REFERENCES CatalogoConsolas (IdModeloConsolaPK),
    FOREIGN KEY (Estado) REFERENCES CatalogoEstadosConsolas (CodigoEstado)
);

/*MODIFICACION A LA TABLA PRODUCTOS BASES 24/02/2025*/
ALTER TABLE ProductosBases 
ADD COLUMN IdIngreso INT AUTO_INCREMENT UNIQUE;


/*NO USAR
CREATE TABLE AccesoriosdeProductos (
/*TABLA ACCESORIOSDEPRODUCTOS CREADA 23/09/2024 
	IdAccesorioPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionAccesorio varchar(100),
    Activo boolean not null default 1,
    IdCodigoConsolaFK varchar(25),
    FOREIGN KEY (IdCodigoConsolaFK) REFERENCES ProductosBases (CodigoConsola)
);*/

CREATE TABLE TareasdeProductos (
/*TABLA TareasdeProductos CREADA 23/09/2024 */
	IdTareaPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionTarea varchar(100),
    Realizado boolean not null default 0,
    Activo boolean not null default 1,
    IdCodigoConsolaFK varchar(25),
    FOREIGN KEY (IdCodigoConsolaFK) REFERENCES ProductosBases (CodigoConsola)
);

/*CREAR TABLAS DE ACCESORIOS */

CREATE TABLE FabricanteAccesorios
(
	/*TABLA FABRICANTE ACCESORIOS CREADA 9/11/24*/
	IdFabricanteAccesorioPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreFabricanteAccesorio varchar(100),
    Activo boolean not null default 1
);

CREATE TABLE CategoriasAccesorios 
(
	/*TABLA Categoria ACCESORIOS CREADA 9/11/24*/
	IdCategoriaAccesorioPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreCategoriaAccesorio varchar(100),
    IdFabricanteAccesorioFK int,
    Activo boolean not null default 1,
    FOREIGN KEY (IdFabricanteAccesorioFK) REFERENCES FabricanteAccesorios (IdFabricanteAccesorioPK)
);

CREATE TABLE SubcategoriasAccesorios 
(
	/*TABLA SUBCATEGORIA ACCESORIOS CREADA 9/11/24*/
	IdSubcategoriaAccesorio int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreSubcategoriaAccesorio varchar(100),
    IdCategoriaAccesorioFK int,
    Activo boolean not null default 1,
    FOREIGN KEY (IdCategoriaAccesorioFK) REFERENCES CategoriasAccesorios (IdCategoriaAccesorioPK)
);

CREATE TABLE CatalogoAccesorios (
/*TABLA CATALOGOACCESORIOS CREADA 9/11/24*/
	IdModeloAccesorioPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    FabricanteAccesorio int,
    CategoriaAccesorio int,
    SubcategoriaAccesorio int,
	CodigoModeloAccesorio varchar(25),    
    LinkImagen varchar(100),
    Activo boolean not null default 1,
    FOREIGN KEY (FabricanteAccesorio) REFERENCES FabricanteAccesorios (IdFabricanteAccesorioPK),
    FOREIGN KEY (CategoriaAccesorio) REFERENCES CategoriasAccesorios (IdCategoriaAccesorioPK),
    FOREIGN KEY (SubcategoriaAccesorio) REFERENCES SubcategoriasAccesorios (IdSubcategoriaAccesorio)
);

CREATE TABLE AccesoriosBase (
/*TABLA AccesoriosBase CREADA 9/11/24*/
	CodigoAccesorio varchar(25) primary key not null,
    ModeloAccesorio int not null,
    ColorAccesorio varchar(100) not null,
    EstadoAccesorio int not null,
    FechaIngreso date,
    Comentario varchar(2000),
    PrecioBase Decimal(6,2),
    NumeroSerie varchar(100),
    ProductosCompatibles varchar(500),
    FOREIGN KEY (ModeloAccesorio) REFERENCES CatalogoAccesorios (IdModeloAccesorioPK),
    FOREIGN KEY (EstadoAccesorio) REFERENCES CatalogoEstadosConsolas (CodigoEstado)
);

/*MODIFICACION A LA TABLA ACCESORIOS BASES 24/02/2025*/
ALTER TABLE AccesoriosBase 
ADD COLUMN IdIngreso INT AUTO_INCREMENT UNIQUE;

CREATE TABLE TareasdeAccesorios (
/*TABLA TareasdeAccesorios CREADA 9/11/24 */
	IdTareaAccesorioPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionTarea varchar(100),
    Realizado boolean not null default 0,
    Activo boolean not null default 1,
    IdCodigoAccesorioFK varchar(25),
    FOREIGN KEY (IdCodigoAccesorioFK) REFERENCES AccesoriosBase (CodigoAccesorio)
);

TRUNCATE TABLE AccesoriosBase;

/*SECCION DE PEDIDOS*/

CREATE TABLE EstadoPedido
(
	/*TABLA EstadoPedido CREADA 9/11/24 */
	CodigoEstadoPedido int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionEstadoPedido varchar(100) not null
);

INSERT INTO ESTADOPEDIDO (DescripcionEstadoPedido) values ('En espera');
INSERT INTO ESTADOPEDIDO (DescripcionEstadoPedido) values ('En tránsito');
INSERT INTO ESTADOPEDIDO (DescripcionEstadoPedido) values ('Recibido en Estados Unidos');
INSERT INTO ESTADOPEDIDO (DescripcionEstadoPedido) values ('En aduana/agencia');
INSERT INTO ESTADOPEDIDO (DescripcionEstadoPedido) values ('Recibido');
INSERT INTO ESTADOPEDIDO (DescripcionEstadoPedido) values ('Cancelado');
INSERT INTO ESTADOPEDIDO (DescripcionEstadoPedido) values ('Eliminado');

CREATE TABLE TipoPedido
(
	/*TABLA TipoPedido CREADA 9/11/24 */
	CodigoTipoPedido int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionTipoPedido varchar(100) not null
);

INSERT INTO TipoPedido (DescripcionTipoPedido) values ('Aéreo');
INSERT INTO TipoPedido (DescripcionTipoPedido) values ('Marítimo');

CREATE TABLE SitioWeb
(
	/*TABLA SITIO WEB CREADA 9/11/24*/
    CodigoSitioWeb int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionSitioWeb varchar(100) not null
);

INSERT INTO SitioWeb (DescripcionSitioWeb) values ('Ebay');
INSERT INTO SitioWeb (DescripcionSitioWeb) values ('AliExpress');
INSERT INTO SitioWeb (DescripcionSitioWeb) values ('Amazon');
INSERT INTO SitioWeb (DescripcionSitioWeb) values ('Mercado Libre');
INSERT INTO SitioWeb (DescripcionSitioWeb) values ('Otros');

CREATE TABLE PedidoBase 
(
	/*TABLA PedidoBase CREADA 9/11/24 */
    CodigoPedido varchar(25) primary key not null,
    FechaCreacionPedido date,
    FechaArriboEstadosUnidos date,
    FechaIngreso date,
    NumeroTracking1 varchar(100) not null,
    NumeroTracking2 varchar(100),
    SitioWebFK int not null,
    ViaPedidoFK int not null,
    EstadoPedidoFK int not null,    
    PrecioEstimado Decimal(6,2),
    Comentarios varchar(2000),
    Peso DECIMAL(6,2),
	SubtotalArticulos DECIMAL(6,2),
	Impuestos DECIMAL(6,2),
	EnvioUSA DECIMAL(6,2),
	EnvioNIC DECIMAL(6,2),
    FOREIGN KEY (SitioWebFK) REFERENCES SitioWeb (CodigoSitioWeb),
    FOREIGN KEY (ViaPedidoFK) REFERENCES TipoPedido (CodigoTipoPedido),
    FOREIGN KEY (EstadoPedidoFK) REFERENCES EstadoPedido (CodigoEstadoPedido)
);

-- Agregar las nuevas columnas
/*ALTER TABLE PedidoBase
ADD Peso DECIMAL(6,2),
ADD SubtotalArticulos DECIMAL(6,2),
ADD Impuestos DECIMAL(6,2),
ADD EnvioUSA DECIMAL(6,2),
ADD EnvioNIC DECIMAL(6,2);*/

-- Renombrar la columna PrecioEstimado a TotalPedido
/*ALTER TABLE PedidoBase
CHANGE PrecioEstimado TotalPedido DECIMAL(6,2);*/


CREATE TABLE DetalleProductoPedido 
(
	/*Tabla Detalle Producto Pedido, esta tabla se agrega para poder asociar los productos ya ingresados en el inventario a un pedido*/
    IdDetalleProcutoPedidoPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    IdProductoBaseFK varchar(25) not null,
    IdCodigoPedidoFK varchar(25) not null,
    EnlaceArticulo varchar(1000), /*Se agrega para que cada producto pueda saberse de donde se obtuvo, este se puede dejar en blanco o se llena a la hora de hacer la recepcion de un pedido*/
    Comentario varchar(2000),
    FOREIGN KEY (IdProductoBaseFK) REFERENCES productosbases (CodigoConsola),
    FOREIGN KEY (IdCodigoPedidoFK) REFERENCES PedidoBase (CodigoPedido)
);

CREATE TABLE DetalleAccesorioPedido 
(
	/*Tabla Detalle Producto Pedido, esta tabla se agrega para poder asociar los accesorios ya ingresados en el inventario a un pedido*/
    IdDetalleAccesorioPedidoPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    IdAccesorioBaseFK varchar(25) not null,
    IdCodigoPedidoFK varchar(25) not null,
    EnlaceArticulo varchar(1000), /*Se agrega para que cada accesorios pueda saberse de donde se obtuvo, este se puede dejar en blanco o se llena a la hora de hacer la recepcion de un pedido*/
    Comentario varchar(2000),
    FOREIGN KEY (IdAccesorioBaseFK) REFERENCES accesoriosbase (CodigoAccesorio),
    FOREIGN KEY (IdCodigoPedidoFK) REFERENCES PedidoBase (CodigoPedido)
);  

CREATE TABLE DetalleInsumoPedido 
(
	/*Tabla Detalle Producto Pedido, esta tabla se agrega para poder asociar los accesorios ya ingresados en el inventario a un pedido*/
    IdDetalleInsumoPedidoPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    IdInsumoBaseFK varchar(25) not null,
    IdCodigoPedidoFK varchar(25) not null,
    EnlaceArticulo varchar(1000), /*Se agrega para que cada insumo pueda saberse de donde se obtuvo, este se puede dejar en blanco o se llena a la hora de hacer la recepcion de un pedido*/
    Comentario varchar(2000),
    FOREIGN KEY (IdInsumoBaseFK) REFERENCES insumosbase (CodigoInsumo),
    FOREIGN KEY (IdCodigoPedidoFK) REFERENCES PedidoBase (CodigoPedido)
);  



CREATE TABLE PedidoDetalles
(
	/*TABLA PedidoDetalles CREADA 9/11/24 */
	IdPedidoDetallePK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    IdCodigoPedidoFK varchar(25) not null,
    TipoArticuloFK int not null,
    FabricanteArticulo int not null,
    CategoriaArticulo int not null,
    SubcategoriaArticulo int not null,
    CantidadArticulo int not null,
    EnlaceArticulo varchar(1000),
    PrecioArticulo DECIMAL(6,2),
    IdModeloPK int not null,
    EstadoArticuloPedido boolean not null default 1,
    Activo boolean not null default 1,
	FOREIGN KEY (IdCodigoPedidoFK) REFERENCES PedidoBase (CodigoPedido),
    FOREIGN KEY (TipoArticuloFK) REFERENCES TipoArticulo (IdTipoArticuloPK)    
);

/*CREAR TABLAS DE INSUMOS */

CREATE TABLE FabricanteInsumos
(
	/*TABLA FABRICANTE INSUMOS CREADA 23/11/24*/
	IdFabricanteInsumosPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreFabricanteInsumos varchar(100),
    Activo boolean not null default 1
);

CREATE TABLE CategoriasInsumos
(
	/*TABLA Categoria ACCESORIOS CREADA 23/11/24*/
	IdCategoriaInsumosPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreCategoriaInsumos varchar(100),
    IdFabricanteInsumosFK int,
    Activo boolean not null default 1,
    FOREIGN KEY (IdFabricanteInsumosFK) REFERENCES FabricanteInsumos (IdFabricanteInsumosPK)
);

CREATE TABLE SubcategoriasInsumos 
(
	/*TABLA SUBCATEGORIA INSUMOS CREADA 23/11/24*/
	IdSubcategoriaInsumos int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreSubcategoriaInsumos varchar(100),
    IdCategoriaInsumosFK int,
    Activo boolean not null default 1,
    FOREIGN KEY (IdCategoriaInsumosFK) REFERENCES CategoriasInsumos (IdCategoriaInsumosPK)
);

CREATE TABLE CatalogoInsumos (
/*TABLA CATALGOINSUMOS CREADA 23/11/24*/
	IdModeloInsumosPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    FabricanteInsumos int,
    CategoriaInsumos int,
    SubcategoriaInsumos int,
	CodigoModeloInsumos varchar(25),    
    LinkImagen varchar(100),
    Activo boolean not null default 1,
    FOREIGN KEY (FabricanteInsumos) REFERENCES FabricanteInsumos (IdFabricanteInsumosPK),
    FOREIGN KEY (CategoriaInsumos) REFERENCES CategoriasInsumos (IdCategoriaInsumosPK),
    FOREIGN KEY (SubcategoriaInsumos) REFERENCES SubcategoriasInsumos (IdSubcategoriaInsumos)
);

CREATE TABLE InsumosBase (
/*TABLA InsumosBase CREADA 23/11/24*/
	CodigoInsumo varchar(25) primary key not null,
    ModeloInsumo int not null,
    EstadoInsumo int not null,
    FechaIngreso date,
    Comentario varchar(2000),
    PrecioBase Decimal(6,2),
    NumeroSerie varchar(100),
    ServiciosCompatibles varchar(500),
    Cantidad int unsigned not null,
    StockMinimo int unsigned not null,
    IdIngreso INT AUTO_INCREMENT UNIQUE,
    FOREIGN KEY (ModeloInsumo) REFERENCES CatalogoInsumos (IdModeloInsumosPK),
    FOREIGN KEY (EstadoInsumo) REFERENCES CatalogoEstadosconsolas (CodigoEstado)
);

/*MODIFICACION A LA TABLA InsumosBase 24/02/2025*/
/** alters sino estan estos datos en la tabla
ALTER TABLE InsumosBase 
ADD COLUMN StockMinimo int unsigned not null;
ALTER TABLE InsumosBase 
ADD COLUMN IdIngreso INT AUTO_INCREMENT UNIQUE;*/

CREATE TABLE TareasdeInsumos (
/*TABLA TareasdeInsumos CREADA 23/11/24*/
	IdTareaInsumosPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionTarea varchar(100),
    Realizado boolean not null default 0,
    Activo boolean not null default 1,
    IdCodigoInsumoFK varchar(25),
    FOREIGN KEY (IdCodigoInsumoFK) REFERENCES InsumosBase (CodigoInsumo)
);


/*TABLAS HISTORIALES*/

CREATE TABLE HistorialEstadoPedido (
/*HISTORIAL DEL PEDIDO CREADO 05/02/2025*/
    IdHistorial INT AUTO_INCREMENT PRIMARY KEY,
    CodigoPedido VARCHAR(25) NOT NULL,
    EstadoAnterior INT,
    EstadoNuevo INT NOT NULL,
    FechaCambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CodigoPedido) REFERENCES PedidoBase(CodigoPedido),
    FOREIGN KEY (EstadoAnterior) REFERENCES EstadoPedido(CodigoEstadoPedido),
    FOREIGN KEY (EstadoNuevo) REFERENCES EstadoPedido(CodigoEstadoPedido)
);


/*18/02/2025*/
CREATE TABLE HistorialEstadoProducto (
    IdHistorial INT AUTO_INCREMENT PRIMARY KEY,
    CodigoConsola VARCHAR(25) NOT NULL,
    EstadoAnterior INT,
    EstadoNuevo INT NOT NULL,
    FechaCambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CodigoConsola) REFERENCES ProductosBases(CodigoConsola),
    FOREIGN KEY (EstadoAnterior) REFERENCES CatalogoEstadosConsolas(CodigoEstado),
    FOREIGN KEY (EstadoNuevo) REFERENCES CatalogoEstadosConsolas(CodigoEstado)
);

CREATE TABLE HistorialEstadoAccesorio (
    IdHistorial INT AUTO_INCREMENT PRIMARY KEY,
    CodigoAccesorio VARCHAR(25) NOT NULL,
    EstadoAnterior INT,
    EstadoNuevo INT NOT NULL,
    FechaCambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CodigoAccesorio) REFERENCES AccesoriosBase(CodigoAccesorio),
    FOREIGN KEY (EstadoAnterior) REFERENCES CatalogoEstadosConsolas(CodigoEstado),
    FOREIGN KEY (EstadoNuevo) REFERENCES CatalogoEstadosConsolas(CodigoEstado)
);

CREATE TABLE HistorialEstadoInsumo (
    IdHistorial INT AUTO_INCREMENT PRIMARY KEY,
    CodigoInsumo VARCHAR(25) NOT NULL,

    EstadoAnterior INT,
    EstadoNuevo INT NOT NULL,

    StockAnterior INT UNSIGNED,
    StockNuevo INT UNSIGNED,

    StockMinimoAnterior INT UNSIGNED,
    StockMinimoNuevo INT UNSIGNED,

    FechaCambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (CodigoInsumo) REFERENCES InsumosBase(CodigoInsumo),
    FOREIGN KEY (EstadoAnterior) REFERENCES CatalogoEstadosConsolas(CodigoEstado),
    FOREIGN KEY (EstadoNuevo) REFERENCES CatalogoEstadosConsolas(CodigoEstado)
);



/*TABLAS DE USUARIOS CREADAS EL 18/03/2025*/

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

/**INSERT INTO Clientes (NombreCliente, DNI, RUC, Telefono, CorreoElectronico, Direccion, FechaRegistro, Estado) VALUES
('Juan Pérez', '12345678', '100200300400', '987654321', 'juan.perez@email.com', 'Av. Siempre Viva 123', CURDATE(), 1),
('María Gómez', '87654321', '400300200100', '912345678', 'maria.gomez@email.com', 'Calle Falsa 456', CURDATE(), 1),
('Carlos Rodríguez', '11223344', '500600700800', NULL, 'carlos.rodriguez@email.com', 'Jr. Los Olivos 789', CURDATE(), 1),
('Ana Martínez', '22334455', NULL, '956789123', NULL, 'Psj. Las Flores 321', CURDATE(), 1),
('Luis Fernández', '33445566', '900800700600', '965432189', 'luis.fernandez@email.com', NULL, CURDATE(), 1);*/


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
INSERT INTO ESTADOVENTA (DescripcionEstadoVenta) values ('Borrado');

/*METODO DE PAGO*/
/*CREATE TABLE METODOPAGO(
	IdMetodoPagoPK INT AUTO_INCREMENT PRIMARY KEY,
    DescripcionMetodoPago varchar (100)
);

INSERT INTO METODOPAGO (DescripcionMetodoPago) values ('Efectivo');
INSERT INTO METODOPAGO (DescripcionMetodoPago) values ('Transferencia');*/

/*TABLA VENTASBASE CREADA el 10/04/2025 POR ROMMEL MALTEZ*/
CREATE TABLE VentasBase(
	/*VALORES DE LA VENTA*/
	IdVentaPK INT AUTO_INCREMENT PRIMARY KEY, 
    FechaCreacion DATETIME NOT NULL,
    IdTipoDocumentoFK int not null,
    NumeroDocumento varchar(255),
    SubtotalVenta Decimal(6,2),
    IVA Decimal(6,2),
    TotalVenta Decimal(6,2),
    IdEstadoVentaFK  int not null,
    IdMetodoDePagoFK int not null,
    /*VALORES EXTRAS VENTA*/   
    IdUsuarioFK int not null,
    IdClienteFK int not null,
    Observaciones varchar(255),
    FOREIGN KEY (IdTipoDocumentoFK) REFERENCES TipoDocumento(IdTipoDocumentoPK),
    FOREIGN KEY (IdEstadoVentaFK) REFERENCES ESTADOVENTA(IdEstadoVentaPK),
    FOREIGN KEY (IdMetodoDePagoFK) REFERENCES metodosdepago (IdMetodoPagoPK),    
    FOREIGN KEY (IdUsuarioFK) REFERENCES Usuarios (IdUsuarioPK),
    FOREIGN KEY (IdClienteFK) REFERENCES Clientes (IdCLientePK)
);

/*tabla adicional para almacenar informacion extra y opcional de la venta*/
CREATE TABLE VentasEXT(
	IdVentaFK int not null,
    NumeroReferenciaTransferencia varchar(255),
    FOREIGN KEY (IdVentaFK) REFERENCES VENTASBASE (IdVentaPK)
);

/*TABLA DE SERVICIOS BASE creado 1/05/2025*/
CREATE TABLE ServiciosBase(
	IdServicioPK INT AUTO_INCREMENT PRIMARY KEY,
    DescripcionServicio varchar(255),
	Estado boolean not null default 1,
    PrecioBase Decimal(6,2),
    Comentario varchar(2000),
    FechaIngreso date
);

/*Tabla Insumos x Servicios 01/05/2025*/
CREATE TABLE InsumosXServicio(
	IdInsumosXServicio INT auto_increment PRIMARY KEY,
    IdServicioFK int not null,
	CodigoInsumoFK VARCHAR(25) NOT NULL,
    CantidadDescargue int unsigned,
    Estado boolean not null default 1,
    FOREIGN KEY (CodigoInsumoFK) REFERENCES InsumosBase(CodigoInsumo),
    FOREIGN KEY (IdServicioFK) REFERENCES ServiciosBase(IdServicioPK)
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

ALTER TABLE DetalleCarritoVentas
ADD COLUMN PrecioBaseOriginal DECIMAL(10,2) NOT NULL,
ADD COLUMN MargenAplicado DECIMAL(5,2) NOT NULL;

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

-- Esto ya está en tu script, lo cual es perfecto.
ALTER TABLE DetalleVenta
ADD COLUMN PrecioBaseOriginal DECIMAL(10,2) NOT NULL,
ADD COLUMN MargenAplicado DECIMAL(5,2) NOT NULL;
-- Agrega la columna para guardar el ID del tipo de margen
ALTER TABLE DetalleVenta
ADD COLUMN IdMargenFK INT NULL COMMENT 'FK a la tabla MargenesVenta para contexto de negocio';

-- Ahora, crea la relación de llave foránea
ALTER TABLE DetalleVenta
ADD CONSTRAINT fk_detalleventa_margenes
FOREIGN KEY (IdMargenFK) REFERENCES MargenesVenta(IdMargenPK);

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

ALTER TABLE NotasCredito
ADD COLUMN IdMotivoFK INT,
ADD FOREIGN KEY (IdMotivoFK) REFERENCES MotivosNotaCredito(IdMotivoPK);



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

CREATE TABLE MotivosNotaCredito (
    IdMotivoPK INT AUTO_INCREMENT PRIMARY KEY,
    Descripcion VARCHAR(255) NOT NULL,
    Activo BOOLEAN DEFAULT TRUE
);

INSERT INTO MotivosNotaCredito (Descripcion) VALUES
('Devolución por garantía'),
('Producto dañado o defectuoso'),
('Error en facturación'),
('Cancelación de factura completa'),
('Ajuste de precio post-venta'),
('Producto incorrecto enviado');

CREATE TABLE HistorialNotasCredito (    
    IdHistorialNC_PK INT AUTO_INCREMENT PRIMARY KEY,    
    IdNotaCreditoFK INT NOT NULL,    
    TipoAccion ENUM('CREACION', 'ANULACION') NOT NULL,    
    IdUsuarioFK INT NOT NULL,
    FechaAccion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    Detalles VARCHAR(255) NULL,
    FOREIGN KEY (IdNotaCreditoFK) REFERENCES NotasCredito(IdNotaCreditoPK),
    FOREIGN KEY (IdUsuarioFK) REFERENCES Usuarios(IdUsuarioPK)
);













    





