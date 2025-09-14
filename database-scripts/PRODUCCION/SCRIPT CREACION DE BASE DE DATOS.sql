/*******************************************************************************
** ARCHIVO: SCRIPT CREACION DE BASE DE DATOS.sql
** PROYECTO: Sistema de Inventario y Taller
/*******************************************************************************
** ARCHIVO: SCRIPT CREACION DE BASE DE DATOS.sql
** PROYECTO: Sistema de Inventario y Taller
** AUTOR: Rommel Maltez
** FECHA DE CREACIÓN: 2025-08-30
** DESCRIPCIÓN:
** Script completo para la creación de la base de datos, tablas, relaciones
** e inserciones iniciales para el sistema de inventario.
*******************************************************************************/

-- Descomentar las siguientes líneas para crear un ambiente de pruebas
CREATE DATABASE base_datos_inventario_taller_prueba;
USE base_datos_inventario_taller_prueba;

/*
================================================================================
-- CREACIÓN DE LA BASE DE DATOS
================================================================================
*/
-- CREATE DATABASE base_datos_inventario_taller;
-- USE base_datos_inventario_taller;

/*
================================================================================
-- I. SECCIÓN DE CATÁLOGOS PRINCIPALES Y TIPOS PARA LOS ARTICULOS.
-- DESCRIPCIÓN: Tablas base que definen tipos y estados generales
-- utilizados en múltiples secciones del sistema.
================================================================================
*/

/*------------------------------------------------------------------------------
-- TABLA: TipoArticulo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-09-10
-- DESCRIPCIÓN: Cataloga los 3 tipos de artículos que administra el sistema.
------------------------------------------------------------------------------*/
CREATE TABLE TipoArticulo
(
    IdTipoArticuloPK INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionTipoArticulo VARCHAR(100) NOT NULL,
    Estado BOOLEAN NOT NULL DEFAULT 1
);
INSERT INTO TipoArticulo (DescripcionTipoArticulo) VALUES ('Producto'), ('Accesorio'), ('Insumo');

/*------------------------------------------------------------------------------
-- TABLA: CatalogoEstadosConsolas
-- FECHA DE CREACIÓN: 2024-09-14
-- DESCRIPCIÓN: Tabla general que almacena el catalogo de estados de los articulos del sistema. (ej. Nuevo, Usado, etc...)).
------------------------------------------------------------------------------*/
CREATE TABLE IF NOT EXISTS CatalogoEstadosConsolas( 
	CodigoEstado int not null AUTO_INCREMENT,
    DescripcionEstado varchar(100) not null,
    PRIMARY KEY (CodigoEstado)
);
Insert into CatalogoEstadosConsolas (DescripcionEstado) 
values
('Nuevo'),                 	-- 1
('Usado'),					-- 2	
('Para piezas'),			-- 3
('Personalizado'),			-- 4
('Reparado'),				-- 5
('A reparar'),          	-- 6
('Borrado'),  				-- 7
('Vendido'),				-- 8
('En garantia'),  			-- 9
('Descargado'),				-- 10
('En proceso de venta');	-- 11

/*------------------------------------------------------------------------------
-- TABLA: TiposAccesorios
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-09-10
-- DESCRIPCIÓN: Cataloga los tipos de accesorios que podria traer un producto por defecto, esta lógica solo aplica para los productos.
------------------------------------------------------------------------------*/
CREATE TABLE TiposAccesorios (
	IdTipoAccesorioPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    CodigoAccesorio varchar(25),
    DescripcionAccesorio varchar(100),
    Activo boolean not null default 1
);
INSERT INTO TiposAccesorios (CodigoAccesorio, DescripcionAccesorio) VALUES
('J001', 'Mando de juego'),
('C001', 'Cable HDMI'),
('X001', 'Mando de Monitor'),
('M001', 'Memoria'),
('C002', 'Cable AC');

/*------------------------------------------------------------------------------
-- TABLA: TiposProductos
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-09-10
-- DESCRIPCIÓN: Cataloga los tipos productos, dependiendo del tipo va a determinar que accesorios puede tener por defecto este producto cuando se esté creando su ingreso al sistema.
------------------------------------------------------------------------------*/
CREATE TABLE TiposProductos (
	IdTipoProductoPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionTipoProducto varchar(100),
    Activo boolean not null default 1
);
INSERT INTO TiposProductos (DescripcionTipoProducto) values ('Consola de juegos'), ('Monitor'), ('Laptop'), ('Consola Portátil');

/*------------------------------------------------------------------------------
-- TABLA: CatalogoTiposAccesoriosXProducto
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-09-10
-- DESCRIPCIÓN: Hace una union entre la tabla TiposAccesorios y TiposProductos para determinar que accesorio va para que tipo de producto
------------------------------------------------------------------------------*/
CREATE TABLE CatalogoTiposAccesoriosXProducto (
	IdCatalogoAccesorioXProductoPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    IdTipoAccesorioFK int,
    IdTipoProductoFK int,
    Activo boolean not null default 1,
	FOREIGN KEY (IdTipoAccesorioFK) REFERENCES TiposAccesorios (IdTipoAccesorioPK),
    FOREIGN KEY (IdTipoProductoFK) REFERENCES TiposProductos (IdTipoProductoPK)
);
INSERT INTO CatalogoTiposAccesoriosXProducto (IdTipoAccesorioFK, IdTipoProductoFK) VALUES
-- Accesorios para el Producto con ID 1
(1, 1),
(2, 1),
(4, 1),
(5, 1),

-- Accesorios para el Producto con ID 2
(2, 2),
(3, 2),
(5, 2),

-- Accesorios para el Producto con ID 3
(5, 3),

-- Accesorios para el Producto con ID 4
(5, 4);

/*
================================================================================
-- II. SECCIÓN DE INVENTARIO.
-- DESCRIPCIÓN: Contiene todas las tablas relacionadas con la gestión,
-- catalogación e inventario de todos los articulos.
================================================================================
*/

/*-- II.A. Subsección: Productos (Consolas, Laptos, Equipos, etc...) ---------------------------------*/

/*------------------------------------------------------------------------------
-- TABLA: Fabricantes
-- FECHA DE CREACIÓN: 2024-09-14
-- DESCRIPCIÓN: Almacena los fabricantes de los productos (ej. Nintendo, Sony).
------------------------------------------------------------------------------*/
CREATE TABLE FABRICANTES (
	IdFabricantePK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreFabricante varchar(100),
    Activo boolean not null default 1
);

/*------------------------------------------------------------------------------
-- TABLA: CategoriasProductos
-- FECHA DE CREACIÓN: 2024-09-14
-- DESCRIPCIÓN: Almacena las categorias que contiene cada fabricante de productos (ej. Gamecube, Wii).
------------------------------------------------------------------------------*/
CREATE TABLE CategoriasProductos ( 
	IdCategoriaPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreCategoria varchar(100),
    IdFabricanteFK int,
    Activo boolean not null default 1,
    FOREIGN KEY (IdFabricanteFK) REFERENCES FABRICANTES (IdFabricantePK)
);

/*------------------------------------------------------------------------------
-- TABLA: SubcategoriasProductos
-- FECHA DE CREACIÓN: 2024-09-14
-- DESCRIPCIÓN: Almacena las subcategorias que contiene cada categoria de productos, pueden ser color, edición o detalle que distinga el producto (ej. Color Indigo, Edición Limitada).
------------------------------------------------------------------------------*/
CREATE TABLE SubcategoriasProductos ( 
	IdSubcategoria int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreSubcategoria varchar(100),
    IdCategoriaFK int,
    Activo boolean not null default 1,
    FOREIGN KEY (IdCategoriaFK) REFERENCES CategoriasProductos (IdCategoriaPK)
);

/*------------------------------------------------------------------------------
-- TABLA: CatalogoConsolas
-- FECHA DE CREACIÓN: 2024-09-14
-- DESCRIPCIÓN: Supercategorias de los productos (consolas, portatiles, etc...), esta tabla junta las tablas de fabricantes, categorias y subcategorias de los productos para crear una supercategoria,
-- (ej. Nintendo - Wii U - US Black Edition 32GB)
------------------------------------------------------------------------------*/
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

/*------------------------------------------------------------------------------
-- TABLA: ProductosBases
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-09-14
-- DESCRIPCIÓN: Tabla principal de inventario para cada producto físico.
--              Contiene detalles como número de serie, precio y estado.
-- -----------------------------------------------------------------------------
-- MODIFICACIONES:
-- 2025-02-24 Rommel Maltez: Se agregó la columna 'IdIngreso' como identificador
--                     único autoincremental para cada registro, utilizado en procedimiento almacenado IngresarArticulosPedidov2
------------------------------------------------------------------------------*/
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
    IdIngreso INT AUTO_INCREMENT UNIQUE, -- Columna añadida en modificación
    FOREIGN KEY (Modelo) REFERENCES CatalogoConsolas (IdModeloConsolaPK),
    FOREIGN KEY (Estado) REFERENCES CatalogoEstadosConsolas (CodigoEstado)
);

/*------------------------------------------------------------------------------
-- TABLA: TareasdeProductos
-- FECHA DE CREACIÓN: 2024-09-23
-- DESCRIPCIÓN: Alamacena tareas a realizar para determinado producto guardado.
------------------------------------------------------------------------------*/
CREATE TABLE TareasdeProductos (
	IdTareaPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionTarea varchar(100),
    Realizado boolean not null default 0,
    Activo boolean not null default 1,
    IdCodigoConsolaFK varchar(25),
    FOREIGN KEY (IdCodigoConsolaFK) REFERENCES ProductosBases (CodigoConsola)
);

/*-- II.B. Subsección: Accesorios (Consolas, Laptos, Equipos, etc...) ---------------------------------*/

/*------------------------------------------------------------------------------
-- TABLA: FabricanteAccesorios
-- FECHA DE CREACIÓN: 2024-11-09
-- DESCRIPCIÓN: Almacena los fabricantes de los accesorios (ej. Nintendo, Sony).
------------------------------------------------------------------------------*/
CREATE TABLE FabricanteAccesorios
(	
	IdFabricanteAccesorioPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreFabricanteAccesorio varchar(100),
    Activo boolean not null default 1
);

/*------------------------------------------------------------------------------
-- TABLA: CategoriasAccesorios
-- FECHA DE CREACIÓN: 2024-11-09
-- DESCRIPCIÓN: Almacena las categorias que contiene cada fabricante de accesorio (ej. Dualshock, Joystick).
------------------------------------------------------------------------------*/
CREATE TABLE CategoriasAccesorios 
(
	IdCategoriaAccesorioPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreCategoriaAccesorio varchar(100),
    IdFabricanteAccesorioFK int,
    Activo boolean not null default 1,
    FOREIGN KEY (IdFabricanteAccesorioFK) REFERENCES FabricanteAccesorios (IdFabricanteAccesorioPK)
);

/*------------------------------------------------------------------------------
-- TABLA: SubcategoriasAccesorios
-- FECHA DE CREACIÓN: 2024-11-09
-- DESCRIPCIÓN: Almacena las subcategorias que contiene cada categoria de accesorios, pueden ser color, edición o detalle que distinga el producto (ej. Color Indigo, Edición Limitada).
------------------------------------------------------------------------------*/
CREATE TABLE SubcategoriasAccesorios 
(
	IdSubcategoriaAccesorio int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreSubcategoriaAccesorio varchar(100),
    IdCategoriaAccesorioFK int,
    Activo boolean not null default 1,
    FOREIGN KEY (IdCategoriaAccesorioFK) REFERENCES CategoriasAccesorios (IdCategoriaAccesorioPK)
);

/*------------------------------------------------------------------------------
-- TABLA: CatalogoAccesorios
-- FECHA DE CREACIÓN: 2024-09-14
-- DESCRIPCIÓN: Supercategorias de los acceosrios (joysticks, parlantes, etc...), esta tabla junta las tablas de fabricantes, categorias y subcategorias de los productos para crear una supercategoria,
-- (ej. Sony - Dualshock 2 - Clear Blue)
------------------------------------------------------------------------------*/
CREATE TABLE CatalogoAccesorios (
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


/*------------------------------------------------------------------------------
-- TABLA: AccesoriosBase
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-09
-- DESCRIPCIÓN: Tabla principal de inventario para cada accesorio físico.
--              Contiene detalles como número de serie, precio y estado.
-- -----------------------------------------------------------------------------
-- MODIFICACIONES:
-- 2025-02-24 Rommel Maltez: Se agregó la columna 'IdIngreso' como identificador
--                     único autoincremental para cada registro, utilizado en procedimiento almacenado IngresarArticulosPedidov2
------------------------------------------------------------------------------*/
CREATE TABLE AccesoriosBase (
	CodigoAccesorio varchar(25) primary key not null,
    ModeloAccesorio int not null,
    ColorAccesorio varchar(100) not null,
    EstadoAccesorio int not null,
    FechaIngreso date,
    Comentario varchar(2000),
    PrecioBase Decimal(6,2),
    NumeroSerie varchar(100),
    ProductosCompatibles varchar(500),
    IdIngreso INT AUTO_INCREMENT UNIQUE,
    FOREIGN KEY (ModeloAccesorio) REFERENCES CatalogoAccesorios (IdModeloAccesorioPK),
    FOREIGN KEY (EstadoAccesorio) REFERENCES CatalogoEstadosConsolas (CodigoEstado)
);

/*------------------------------------------------------------------------------
-- TABLA: TareasdeAccesorios
-- FECHA DE CREACIÓN: 2024-11-09
-- DESCRIPCIÓN: Alamacena tareas a realizar para determinado accesorio guardado.
------------------------------------------------------------------------------*/
CREATE TABLE TareasdeAccesorios (
	IdTareaAccesorioPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionTarea varchar(100),
    Realizado boolean not null default 0,
    Activo boolean not null default 1,
    IdCodigoAccesorioFK varchar(25),
    FOREIGN KEY (IdCodigoAccesorioFK) REFERENCES AccesoriosBase (CodigoAccesorio)
);

/*-- II.C. Subsección: Insumos (Memorias, Pendrives, Chips, etc...) ---------------------------------*/

/*------------------------------------------------------------------------------
-- TABLA: FabricanteInsumos
-- FECHA DE CREACIÓN: 2024-11-23
-- DESCRIPCIÓN: Almacena los fabricantes de los insumos (ej. Kingston, Sandisk).
------------------------------------------------------------------------------*/
CREATE TABLE FabricanteInsumos
(
	IdFabricanteInsumosPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreFabricanteInsumos varchar(100),
    Activo boolean not null default 1
);

/*------------------------------------------------------------------------------
-- TABLA: CategoriasInsumos
-- FECHA DE CREACIÓN: 2024-11-23
-- DESCRIPCIÓN: Almacena las categorias que contiene cada fabricante de insumo (ej. Pendrive, Memoria RAM).
------------------------------------------------------------------------------*/
CREATE TABLE CategoriasInsumos
(
	IdCategoriaInsumosPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreCategoriaInsumos varchar(100),
    IdFabricanteInsumosFK int,
    Activo boolean not null default 1,
    FOREIGN KEY (IdFabricanteInsumosFK) REFERENCES FabricanteInsumos (IdFabricanteInsumosPK)
);

/*------------------------------------------------------------------------------
-- TABLA: SubcategoriasAccesorios
-- FECHA DE CREACIÓN: 2024-11-23
-- DESCRIPCIÓN: Almacena las subcategorias que contiene cada categoria de accesorios, pueden ser color, edición o detalle que distinga el producto (ej. 32 GB, 8GB 2400Mhz).
------------------------------------------------------------------------------*/
CREATE TABLE SubcategoriasInsumos 
(
	IdSubcategoriaInsumos int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreSubcategoriaInsumos varchar(100),
    IdCategoriaInsumosFK int,
    Activo boolean not null default 1,
    FOREIGN KEY (IdCategoriaInsumosFK) REFERENCES CategoriasInsumos (IdCategoriaInsumosPK)
);

/*------------------------------------------------------------------------------
-- TABLA: CatalogoInsumos
-- FECHA DE CREACIÓN: 2024-11-23
-- DESCRIPCIÓN: Supercategorias de los acceosrios (joysticks, parlantes, etc...), esta tabla junta las tablas de fabricantes, categorias y subcategorias de los productos para crear una supercategoria,
-- (ej. Kingston - Pendrive - 32GB)
------------------------------------------------------------------------------*/
CREATE TABLE CatalogoInsumos (
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

/*------------------------------------------------------------------------------
-- TABLA: InsumosBase
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-23
-- DESCRIPCIÓN: Tabla principal de inventario para cada accesorio físico.
--              Contiene detalles como número de serie, precio y estado.
-- -----------------------------------------------------------------------------
-- MODIFICACIONES:
-- 2025-02-24 Rommel Maltez: Se agregó la columna 'IdIngreso' como identificador
--                     único autoincremental para cada registro, utilizado en procedimiento almacenado IngresarArticulosPedidov2
--					   se agregó la columna 'StockMinimo' para determinar una alerta de stock minimo.
------------------------------------------------------------------------------*/
CREATE TABLE InsumosBase (
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

/*------------------------------------------------------------------------------
-- TABLA: TareasdeInsumos
-- FECHA DE CREACIÓN: 2024-11-23
-- DESCRIPCIÓN: Alamacena tareas a realizar para determinado insumo guardado.
------------------------------------------------------------------------------*/
CREATE TABLE TareasdeInsumos (
	IdTareaInsumosPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionTarea varchar(100),
    Realizado boolean not null default 0,
    Activo boolean not null default 1,
    IdCodigoInsumoFK varchar(25),
    FOREIGN KEY (IdCodigoInsumoFK) REFERENCES InsumosBase (CodigoInsumo)
);

/*
================================================================================
-- III. SECCIÓN DE PEDIDOS.
-- DESCRIPCIÓN: Contiene todas las tablas relacionadas con la gestión,
-- de pedidos y los articulos que pueden contener.
================================================================================
*/

/*------------------------------------------------------------------------------
-- TABLA: EstadoPedido
-- FECHA DE CREACIÓN: 2024-11-24
-- DESCRIPCIÓN: Alamacena el estado en el que puede estar un pedido.
------------------------------------------------------------------------------*/
CREATE TABLE EstadoPedido
(
	CodigoEstadoPedido int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionEstadoPedido varchar(100) not null
);

INSERT INTO ESTADOPEDIDO (DescripcionEstadoPedido) values ('En espera'), ('En tránsito'), ('Recibido en Estados Unidos'), ('En aduana/agencia'), ('Recibido'), ('Cancelado'), ('Eliminado');

/*------------------------------------------------------------------------------
-- TABLA: TipoPedido
-- FECHA DE CREACIÓN: 2024-11-24
-- DESCRIPCIÓN: Alamacena el tipo de pedido que se hace, esto se refiere a la via en la que viene aéreo o marítimo.
------------------------------------------------------------------------------*/
CREATE TABLE TipoPedido
(
	CodigoTipoPedido int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionTipoPedido varchar(100) not null
);

INSERT INTO TipoPedido (DescripcionTipoPedido) values ('Aéreo'), ('Marítimo');

/*------------------------------------------------------------------------------
-- TABLA: SitioWeb
-- FECHA DE CREACIÓN: 2024-11-24
-- DESCRIPCIÓN: Alamacena el sitio wev del que se hizo el pedido.
------------------------------------------------------------------------------*/
CREATE TABLE SitioWeb
(
    CodigoSitioWeb int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionSitioWeb varchar(100) not null
);

INSERT INTO SitioWeb (DescripcionSitioWeb) values ('Ebay'), ('AliExpress'), ('Amazon'), ('Mercado Libre'), ('Otros');

/*------------------------------------------------------------------------------
-- TABLA: PedidoBase
-- FECHA DE CREACIÓN: 2024-11-24
-- DESCRIPCIÓN: Alamacena los datos completos del pedido.
------------------------------------------------------------------------------*/
CREATE TABLE PedidoBase 
(
    CodigoPedido varchar(25) primary key not null,
    FechaCreacionPedido date,
    FechaArriboEstadosUnidos date,
    FechaIngreso date,
    NumeroTracking1 varchar(100) not null,
    NumeroTracking2 varchar(100),
    SitioWebFK int not null,
    ViaPedidoFK int not null,
    EstadoPedidoFK int not null,    
    TotalPedido Decimal(6,2),
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

/*------------------------------------------------------------------------------
-- TABLA: DetalleProductoPedido
-- FECHA DE CREACIÓN: 2024-11-24
-- DESCRIPCIÓN: Tabla Detalle Producto Pedido, esta tabla se agrega para poder asociar los productos ya ingresados en el inventario a un pedido.
------------------------------------------------------------------------------*/
CREATE TABLE DetalleProductoPedido 
(
    IdDetalleProcutoPedidoPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    IdProductoBaseFK varchar(25) not null,
    IdCodigoPedidoFK varchar(25) not null,
    EnlaceArticulo varchar(1000), /*Se agrega para que cada producto pueda saberse de donde se obtuvo, este se puede dejar en blanco o se llena a la hora de hacer la recepcion de un pedido*/
    Comentario varchar(2000),
    FOREIGN KEY (IdProductoBaseFK) REFERENCES productosbases (CodigoConsola),
    FOREIGN KEY (IdCodigoPedidoFK) REFERENCES PedidoBase (CodigoPedido)
);

/*------------------------------------------------------------------------------
-- TABLA: DetalleAccesorioPedido
-- FECHA DE CREACIÓN: 2024-11-24
-- DESCRIPCIÓN: Tabla Detalle Accesorio Pedido, esta tabla se agrega para poder asociar los accesorios ya ingresados en el inventario a un pedido.
------------------------------------------------------------------------------*/
CREATE TABLE DetalleAccesorioPedido 
(
    IdDetalleAccesorioPedidoPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    IdAccesorioBaseFK varchar(25) not null,
    IdCodigoPedidoFK varchar(25) not null,
    EnlaceArticulo varchar(1000), /*Se agrega para que cada accesorios pueda saberse de donde se obtuvo, este se puede dejar en blanco o se llena a la hora de hacer la recepcion de un pedido*/
    Comentario varchar(2000),
    FOREIGN KEY (IdAccesorioBaseFK) REFERENCES accesoriosbase (CodigoAccesorio),
    FOREIGN KEY (IdCodigoPedidoFK) REFERENCES PedidoBase (CodigoPedido)
);  

/*------------------------------------------------------------------------------
-- TABLA: DetalleInsumoPedido
-- FECHA DE CREACIÓN: 2024-11-24
-- DESCRIPCIÓN: Tabla Detalle Insumo Pedido, esta tabla se agrega para poder asociar los insumos ya ingresados en el inventario a un pedido.
------------------------------------------------------------------------------*/
CREATE TABLE DetalleInsumoPedido 
(
    IdDetalleInsumoPedidoPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    IdInsumoBaseFK varchar(25) not null,
    IdCodigoPedidoFK varchar(25) not null,
    EnlaceArticulo varchar(1000), /*Se agrega para que cada insumo pueda saberse de donde se obtuvo, este se puede dejar en blanco o se llena a la hora de hacer la recepcion de un pedido*/
    Comentario varchar(2000),
    FOREIGN KEY (IdInsumoBaseFK) REFERENCES insumosbase (CodigoInsumo),
    FOREIGN KEY (IdCodigoPedidoFK) REFERENCES PedidoBase (CodigoPedido)
);

/*------------------------------------------------------------------------------
-- TABLA: PedidoDetalles
-- FECHA DE CREACIÓN: 2024-11-24
-- DESCRIPCIÓN: Tabla Pedido Detalles que asocia la supercategoria de un articulo al pedido para poder llevar registro que articulos contiene el pedido.
------------------------------------------------------------------------------*/
CREATE TABLE PedidoDetalles
(
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

/*
================================================================================
-- IV. SECCIÓN DE TABLAS USUARIOS.
-- DESCRIPCIÓN: Contiene todas las tablas relacionadas con la gestion 
-- de los usuarios del sistema.
================================================================================
*/

/*------------------------------------------------------------------------------
-- TABLA: EstadoUsuarios
-- FECHA DE CREACIÓN: 2025-03-18
-- DESCRIPCIÓN: Tabla que contiene el estado del usuario.
------------------------------------------------------------------------------*/
CREATE TABLE EstadoUsuarios (
	IdEstadoPK INT AUTO_INCREMENT PRIMARY KEY,
    DescripcionEstado varchar(100)
);
INSERT INTO EstadoUsuarios (DescripcionEstado) VALUES ('Activo'), ('Inactivo');

/*------------------------------------------------------------------------------
-- TABLA: Roles
-- FECHA DE CREACIÓN: 2025-03-18
-- DESCRIPCIÓN: Tabla que contiene los roles de usuario del sistema.
------------------------------------------------------------------------------*/
CREATE TABLE Roles (
    IdRolPK INT AUTO_INCREMENT PRIMARY KEY,
    NombreRol VARCHAR(50) UNIQUE NOT NULL
);
INSERT INTO ROLES (NombreRol) VALUES ('Admin'), ('Vendedor'), ('Logistica');

/*------------------------------------------------------------------------------
-- TABLA: Usuarios
-- FECHA DE CREACIÓN: 2025-03-18
-- DESCRIPCIÓN: Tabla que contiene los usuarios del sistema.
------------------------------------------------------------------------------*/
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

/*
================================================================================
-- V. SECCIÓN DE TABLAS VENTAS.
-- DESCRIPCIÓN: Contiene todas las tablas relacionadas con la gestion 
-- de las ventas, notas de credito, clientes.
================================================================================
*/

/*------------------------------------------------------------------------------
-- TABLA: Clientes
-- FECHA DE CREACIÓN: 2025-03-29
-- DESCRIPCIÓN: Tabla que contiene los clientes del sistema.
------------------------------------------------------------------------------*/
CREATE TABLE Clientes (
	IdClientePK INT AUTO_INCREMENT PRIMARY KEY,
    NombreCliente VARCHAR(255) NOT NULL,
    DNI VARCHAR(255) NULL,
    RUC VARCHAR(255) NULL,
    Telefono VARCHAR(255) NULL,
    CorreoElectronico VARCHAR(255) NULL,
    Direccion VARCHAR(255) NULL,
    FechaRegistro date,
    Estado boolean not null default 1,
    Comentarios varchar(1000)
);

/*------------------------------------------------------------------------------
-- TABLA: TipoDocumento
-- FECHA DE CREACIÓN: 2025-03-29
-- DESCRIPCIÓN: Tabla que enumera los tipos de documentos fiscales del sistema.
------------------------------------------------------------------------------*/
CREATE TABLE TipoDocumento (
	IdTipoDocumentoPK INT AUTO_INCREMENT PRIMARY KEY,
    DescripcionDocumento varchar(100)
);
INSERT INTO TipoDocumento (DescripcionDocumento) values ('En Espera'), ('Proforma'), ('Factura');

/*------------------------------------------------------------------------------
-- TABLA: ESTADOVENTA
-- FECHA DE CREACIÓN: 2025-03-29
-- DESCRIPCIÓN: Tabla que contiene los estados de las ventas.
------------------------------------------------------------------------------*/
CREATE TABLE ESTADOVENTA(
	IdEstadoVentaPK INT AUTO_INCREMENT PRIMARY KEY,
	DescripcionEstadoVenta varchar(100)
);
INSERT INTO ESTADOVENTA (DescripcionEstadoVenta) values ('Pendiente'), ('Pagado'), ('Anulado'), ('Borrado');

/*------------------------------------------------------------------------------
-- TABLA: MargenesVenta
-- FECHA DE CREACIÓN: 2025-05-31
-- DESCRIPCIÓN: Tabla que guarda la informacion de metodos de pago de una venta.
------------------------------------------------------------------------------*/
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

/*------------------------------------------------------------------------------
-- TABLA: VentasBase
-- FECHA DE CREACIÓN: 2025-04-10
-- DESCRIPCIÓN: Tabla que contiene los datos generales de una venta.
------------------------------------------------------------------------------*/
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

/*------------------------------------------------------------------------------
-- TABLA: VentasEXT
-- FECHA DE CREACIÓN: 2025-04-10
-- DESCRIPCIÓN: Tabla adicional para almacenar informacion extra y opcional de la venta.
------------------------------------------------------------------------------*/
CREATE TABLE VentasEXT(
	IdVentaFK int not null,
    NumeroReferenciaTransferencia varchar(255),
    FOREIGN KEY (IdVentaFK) REFERENCES VENTASBASE (IdVentaPK)
);

/*------------------------------------------------------------------------------
-- TABLA: MargenesVenta
-- FECHA DE CREACIÓN: 2025-04-10
-- DESCRIPCIÓN: Tabla que guarda la informacion de margenes de venta.
------------------------------------------------------------------------------*/
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
('VIP', 25.00, 'Clientes frecuentes'),
('Precio de Costo', 0, 'Precio al costo sin ganancia'),
('Precio Personalizado',-1,' Precio personalizado');



/*------------------------------------------------------------------------------
-- TABLA: CarritoVentas
-- FECHA DE CREACIÓN: 2025-05-31
-- DESCRIPCIÓN: Tabla que guarda la informacion de los carritos de venta.
------------------------------------------------------------------------------*/
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

/*------------------------------------------------------------------------------
-- TABLA: CarritoVentas
-- FECHA DE CREACIÓN: 2025-05-31
-- DESCRIPCIÓN: Detalle del carrito (los artículos)
------------------------------------------------------------------------------*/
CREATE TABLE DetalleCarritoVentas (
    IdDetalleCarritoPK INT AUTO_INCREMENT PRIMARY KEY,
    IdCarritoFK INT NOT NULL,
    TipoArticulo ENUM('Producto', 'Accesorio', 'Insumo', 'Servicio') NOT NULL,
    CodigoArticulo VARCHAR(25) NOT NULL,
    PrecioVenta DECIMAL(10,2) NOT NULL,
    Descuento DECIMAL(10,2) DEFAULT 0,
    SubtotalSinIVA DECIMAL(10,2) NOT NULL,
    Cantidad INT UNSIGNED DEFAULT 1,
    PrecioBaseOriginal DECIMAL(10,2) NOT NULL,
	MargenAplicado DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (IdCarritoFK) REFERENCES CarritoVentas(IdCarritoPK)
);

/*------------------------------------------------------------------------------
-- TABLA: DetalleVenta
-- FECHA DE CREACIÓN: 2025-05-31
-- DESCRIPCIÓN: Detalle de cualquier venta o proforma.
------------------------------------------------------------------------------*/
CREATE TABLE DetalleVenta (
    IdDetalleVentaPK INT AUTO_INCREMENT PRIMARY KEY,
    IdVentaFK INT NOT NULL,
    TipoArticulo ENUM('Producto', 'Accesorio', 'Insumo', 'Servicio') NOT NULL,
    CodigoArticulo VARCHAR(25) NOT NULL,
    Cantidad INT UNSIGNED DEFAULT 1,
    PrecioBaseOriginal DECIMAL(10,2) NOT NULL,
    MargenAplicado DECIMAL(5,2) NOT NULL,
    PrecioVenta DECIMAL(10,2) NOT NULL,
    Descuento DECIMAL(10,2) DEFAULT 0,
    SubtotalSinIVA DECIMAL(10,2) NOT NULL,
    IdMargenFK INT NULL COMMENT 'FK a la tabla MargenesVenta para contexto de negocio',
    FOREIGN KEY (IdVentaFK) REFERENCES VentasBase(IdVentaPK),
    CONSTRAINT fk_detalleventa_margenes FOREIGN KEY (IdMargenFK) REFERENCES MargenesVenta(IdMargenPK)
);

/*------------------------------------------------------------------------------
-- TABLA: MotivosNotaCredito
-- FECHA DE CREACIÓN: 2025-05-31
-- DESCRIPCIÓN: Detalle de nota de credito
------------------------------------------------------------------------------*/
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

/*------------------------------------------------------------------------------
-- TABLA: NotasCredito
-- FECHA DE CREACIÓN: 2025-05-31
-- DESCRIPCIÓN: Detalle de nota de credito
------------------------------------------------------------------------------*/
CREATE TABLE NotasCredito (
    IdNotaCreditoPK INT AUTO_INCREMENT PRIMARY KEY,
    IdVentaFK INT NOT NULL,
    FechaEmision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Motivo TEXT NOT NULL,
    TotalCredito DECIMAL(10,2) NOT NULL,
    UsuarioEmisorFK INT NOT NULL,
    Estado BOOLEAN DEFAULT TRUE, -- TRUE = activa, FALSE = anulada,
    IdMotivoFK INT,
    FOREIGN KEY (IdVentaFK) REFERENCES VentasBase(IdVentaPK),
    FOREIGN KEY (UsuarioEmisorFK) REFERENCES Usuarios(IdUsuarioPK),
    FOREIGN KEY (IdMotivoFK) REFERENCES MotivosNotaCredito(IdMotivoPK)
);

/*------------------------------------------------------------------------------
-- TABLA: DetalleNotaCredito
-- FECHA DE CREACIÓN: 2025-05-31
-- DESCRIPCIÓN: Detalle articulo por articulo relacionado con la nota de credito
------------------------------------------------------------------------------*/
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

/*
================================================================================
-- VI. SECCIÓN DE TABLAS SERVICIOS.
-- DESCRIPCIÓN: Contiene todas las tablas relacionadas con los servicios ofrecidos
-- los servicios pueden o no estar asociados a un insumo.
================================================================================
*/

/*------------------------------------------------------------------------------
-- TABLA: ServiciosBase
-- FECHA DE CREACIÓN: 2025-05-01
-- DESCRIPCIÓN: Tabla que contiene los datos de un servicio.
------------------------------------------------------------------------------*/
CREATE TABLE ServiciosBase(
	IdServicioPK INT AUTO_INCREMENT PRIMARY KEY,
    DescripcionServicio varchar(255),
	Estado boolean not null default 1,
    PrecioBase Decimal(6,2),
    Comentario varchar(2000),
    FechaIngreso date
);

/*------------------------------------------------------------------------------
-- TABLA: InsumosXServicio
-- FECHA DE CREACIÓN: 2025-05-01
-- DESCRIPCIÓN: Tabla que relaciona un servicio con los insumos asociados.
------------------------------------------------------------------------------*/
CREATE TABLE InsumosXServicio(
	IdInsumosXServicio INT auto_increment PRIMARY KEY,
    IdServicioFK int not null,
	CodigoInsumoFK VARCHAR(25) NOT NULL,
    CantidadDescargue int unsigned,
    Estado boolean not null default 1,
    FOREIGN KEY (CodigoInsumoFK) REFERENCES InsumosBase(CodigoInsumo),
    FOREIGN KEY (IdServicioFK) REFERENCES ServiciosBase(IdServicioPK)
);

/*
================================================================================
-- VII. SECCIÓN DE TABLAS HISTORIALES.
-- DESCRIPCIÓN: Contiene todas las tablas relacionadas con llevar registro historial 
-- de cambios en los articulos y pedidos del sistema.
================================================================================
*/

/*------------------------------------------------------------------------------
-- TABLA: HistorialEstadoPedido
-- FECHA DE CREACIÓN: 2025-02-05
-- DESCRIPCIÓN: Tabla Historial Estado Pedido lleva registro del cambio de estado del pedido.
------------------------------------------------------------------------------*/
CREATE TABLE HistorialEstadoPedido (
    IdHistorial INT AUTO_INCREMENT PRIMARY KEY,
    CodigoPedido VARCHAR(25) NOT NULL,
    EstadoAnterior INT,
    EstadoNuevo INT NOT NULL,
    FechaCambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CodigoPedido) REFERENCES PedidoBase(CodigoPedido),
    FOREIGN KEY (EstadoAnterior) REFERENCES EstadoPedido(CodigoEstadoPedido),
    FOREIGN KEY (EstadoNuevo) REFERENCES EstadoPedido(CodigoEstadoPedido)
);


/*------------------------------------------------------------------------------
-- TABLA: HistorialEstadoProducto
-- FECHA DE CREACIÓN: 2025-02-18
-- DESCRIPCIÓN: Tabla Historial Estado Producto lleva registro del cambio de estado del producto.
------------------------------------------------------------------------------*/
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

/*------------------------------------------------------------------------------
-- TABLA: HistorialEstadoAccesorio
-- FECHA DE CREACIÓN: 2025-02-18
-- DESCRIPCIÓN: Tabla Historial Estado Accesorio lleva registro del cambio de estado del accesorio.
------------------------------------------------------------------------------*/
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

/*------------------------------------------------------------------------------
-- TABLA: HistorialEstadoInsumo
-- FECHA DE CREACIÓN: 2025-02-18
-- DESCRIPCIÓN: Tabla Historial Estado Insumo lleva registro del cambio de estado del insumo.
------------------------------------------------------------------------------*/
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

/*------------------------------------------------------------------------------
-- TABLA: HistorialNotasCredito
-- FECHA DE CREACIÓN: 2025-05-31
-- DESCRIPCIÓN: Tabla Historial Estado de notas de credito lleva registro del cambio de estado de las notas de credito.
------------------------------------------------------------------------------*/
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

/*
================================================================================
-- VIII. SECCIÓN DE PRE-INGRESO DE PEDIDOS.
-- DESCRIPCIÓN: Tablas para guardar, cargar y limpiar el progreso
-- del ingreso de artículos de un pedido.
================================================================================
*/

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
    PrecioBase DECIMAL(10,2),
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

/*
================================================================================
-- VIII. SECCIÓN DE CONFIGURACIÓN DE COSTOS.
-- DESCRIPCIÓN: Tablas para configurar la distribución de costos.
================================================================================
*/

/*------------------------------------------------------------------------------
-- TABLA: CostosDistribucionPorModelo
-- AUTOR: Gemini
-- FECHA DE CREACIÓN: 2025-09-13
-- DESCRIPCIÓN: Almacena el porcentaje de costos adicionales que se asignará
-- a cada supercategoría (modelo) de artículo.
------------------------------------------------------------------------------*/
CREATE TABLE CostosDistribucionPorModelo (
    IdCostoDistribucionPK INT AUTO_INCREMENT PRIMARY KEY,
    IdModeloFK INT NOT NULL,
    TipoArticuloFK INT NOT NULL,
    PorcentajeAsignado DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    UNIQUE KEY idx_modelo_tipo (IdModeloFK, TipoArticuloFK),
    FOREIGN KEY (TipoArticuloFK) REFERENCES TipoArticulo(IdTipoArticuloPK)
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
