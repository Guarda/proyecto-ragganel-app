/*SCRIPT DE CREACION DE LA DB Y TABLAS*/
create database base_datos_inventario_taller;
use base_datos_inventario_taller;

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
INSERT INTO CategoriasProductos (NombreCategoria, IdFabricanteFK) values ('Gameboy',1);
INSERT INTO CategoriasProductos (NombreCategoria, IdFabricanteFK) values ('Nintendo DS',1);
INSERT INTO CategoriasProductos (NombreCategoria, IdFabricanteFK) values ('Wii U',1);
INSERT INTO CategoriasProductos (NombreCategoria, IdFabricanteFK) values ('Wii',1);
INSERT INTO CategoriasProductos (NombreCategoria, IdFabricanteFK) values ('Switch',1);

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

Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo 64 Standard Charcoal Console',3);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo 64 Funtastic Jungle Green Console',3);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo 64 Funtastic Ice Blue Console',3);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo 64 Funtastic Grape Purple Console',3);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo 64 Funtastic Fire Orange Console',3);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo 64 Funtastic Smoke / Clear Black Console',3);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo 64 Funtastic Watermelon Red Console',3);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo 64 Clear White / Blue Console',3);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo 64 Clear White / Red Console',3);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo 64 Pikachu Dark Blue Console',3);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo 64 Pikachu Light Blue Console',3);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo 64 Pikachu Orange Console',3);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo 64 Battle Set Console',3);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo 64 Gold Console',3);

Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Gameboy Original',4);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Gameboy Pocket',4);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Gameboy Light',4);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Gameboy Color',4);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Gameboy Advance',4);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Gameboy Advance SP',4);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Gameboy Micro',4);

Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo DS',5);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo DS Lite',5);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo DSi',5);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo DSi XL',5);

Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Wii U (WUP-001 - 8 GB Model)',6);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Wii U (WUP-101 - 32 GB Model)',6);

Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo Wii White Console',7);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo Wii Black Console',7);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo Wii Mini Console',7);
Insert into SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values('Nintendo Wii Light Blue Console',7);

INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('SCPH-10000/15000 (2000)',8);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('SCPH-18000 (2000)',8);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('SCPH-300xx (2001-2002)',8);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('SCPH-370xx (2002)',8);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('SCPH-390xx (2002-2003)',8);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('SCPH-500xx (2003-2004)',8);

INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('SCPH-700xx (2004-2005)',9);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('SCPH-750xx (2005-2006)',9);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('SCPH-770xx (2006-2007)',9);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('SCPH-790xx (2007)',9);
INSERT INTO SubcategoriasProductos (NombreSubcategoria, IdCategoriaFK) values ('SCPH-900xx (2007-2013)',9);

/*
CREATE TABLE TareasdeProductos (
	IdTareaPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionTarea varchar(100),
    Realizado boolean not null default 0,
	Activo boolean not null default 1,
    CodigoConsola VARCHAR(25),
	FOREIGN KEY (CodigoConsola) REFERENCES ProductosBases(CodigoConsola)
);*/


    





