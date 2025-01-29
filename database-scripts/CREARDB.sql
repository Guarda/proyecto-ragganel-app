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
    FOREIGN KEY (ModeloInsumo) REFERENCES CatalogoInsumos (IdModeloInsumosPK),
    FOREIGN KEY (EstadoInsumo) REFERENCES CatalogoEstadosconsolas (CodigoEstado)
);

CREATE TABLE TareasdeInsumos (
/*TABLA TareasdeInsumos CREADA 23/11/24*/
	IdTareaInsumosPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionTarea varchar(100),
    Realizado boolean not null default 0,
    Activo boolean not null default 1,
    IdCodigoInsumoFK varchar(25),
    FOREIGN KEY (IdCodigoInsumoFK) REFERENCES InsumosBase (CodigoInsumo)
);






    





