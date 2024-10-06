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


/* SOLO USAR EN CASO QUE NO SE HAYA LLENADO INFORMACIÓN CORRECTAMENTE, CODIGO INSEGURO.
SET SQL_SAFE_UPDATES = 0;
UPDATE CatalogoConsolas SET Fabricante = 'Nintendo';
SET SQL_SAFE_UPDATES = 1;*/

/*INSERTAR VALORES A LA TABLA CATALOGO*/
/*
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0001','NES Estandar NES NTSC-US','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0002','NES Estandar FAMICON NTSC-J','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0003','NES Estandar NES PAL','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0004','NES Toploader Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0005','NES Model 101 (AV version)','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0006','NES Classic NES/FAMICON Edition','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0007','SNES Estandar NTSC-US','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0008','SNES Estandar S. FAMICON NTSC-J','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0009','SNES Estandar PAL','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0010','SNES Classic SNES/S.FAMICON Edition','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0011','Gameboy Original','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0012','Gameboy Pocket','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0013','Gameboy Light','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0014','Gameboy Color','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0015','Gameboy Advance','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0016','Gameboy Advance SP','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0017','Gameboy Micro','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0018','Nintendo 64 Standard Charcoal Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0019','Nintendo 64 Funtastic Jungle Green Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0020','Nintendo 64 Funtastic Ice Blue Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0021','Nintendo 64 Funtastic Grape Purple Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0022','Nintendo 64 Funtastic Fire Orange Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0023','Nintendo 64 Funtastic Smoke / Clear Black Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0024','Nintendo 64 Funtastic Watermelon Red Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0025','Nintendo 64 Clear White / Blue Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0026','Nintendo 64 Clear White / Red Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0027','Nintendo 64 Pikachu Dark Blue Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0028','Nintendo 64 Pikachu Light Blue Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0029','Nintendo 64 Pikachu Orange Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0030','Nintendo 64 Battle Set Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0031','Nintendo 64 Gold Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0032','Nintendo 64 Daiei Hawks Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0033','Nintendo 64 JUSCO 30th Anniversary Edition Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0034','Nintendo 64 All Nippon Airlines (ANA) Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0035','Nintendo 64 Hyundai Comboy Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0036','Nintendo 64 IQue Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0037','Nintendo 64 Lawson Station','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0038','GameCube Indigo Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0039','GameCube Jet Black Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0040','GameCube Platinum Silver Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0041','GameCube Spice Orange Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0042','GameCube Pearl White Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0043','GameCube Metroid Prime Bundle (Example EU]','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0044','GameCube Pokemon XD Bundle (Example NA)','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0045','GameCube Resident Evil 4 Bundle','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0046','GameCube Tales of Symphonia Console (Example JP)','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0047','GameCube Donkey Konga Bundle','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0048','GameCube Hanshin Tigers Bundle','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0049','GameCube Metal Gear Solid Bundle','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0050','GameCube Panasonic Q Bundle','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0051','GameCube Starlight Gold Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0052','GameCube Customized Gundam Char Bundle','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0053','GameCube Final Fantasy Crystal Chronicles Bundle','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0054','GameCube Heineken Black Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0055','GameCube Heineken Indigo Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0056','GameCube ATI Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0057','Gamecube IBM Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0058','GameCube MTV Tom Ford Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0059','GameCube MTV Camouflage Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0060','GameCube MTV Paul Smith Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0061','GameCube MTV Snow White','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0062','GameCube MTV Canadian Maple Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0063','GameCube Metroid Prime 2 Echoes Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0064','Nintendo Wii White Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0065','Nintendo Wii Black Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0066','Nintendo Wii Family Edition','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0067','Nintendo Wii Mini Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0068','Nintendo Wii Light Blue Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0069','Nintendo Wii New Super Mario Bros. Wii Bundle','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0070','Nintendo Wii The Art of Wii Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0071','Nintendo Wii PAX 2008 Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0072','Nintendo Wii Super Smash Bros Brawl Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0073','Nintendo Wii ATI We Did it Console','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0074','Nintendo DS','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0075','Nintendo DS Lite','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0076','Nintendo DSi','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0077','Nintendo DSi XL','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0078','Wii U (WUP-001 - 8 GB Model)','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0079','Wii U (WUP-101 - 32 GB Model)','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0080','Nintendo 3DS','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0081','Nintendo 3DS XL','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0082','Nintendo 2DS','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0083','New Nintendo 3DS','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0084','New Nintendo 3DS XL','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0085','New Nintendo 2DS XL','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0086','Nintendo Switch V1 (2017)','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0087','Nintendo Switch V2','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0088','Nintendo Switch Lite','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N0089','Nintendo Switch OLED','Nintendo');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola,Fabricante, LinkImagen) values('P', 'SONY Play Station 2 - FAT - SCPH-18000 (2000)','Sony','ps2fat18000.png');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola,Fabricante, LinkImagen) values('P', 'SONY Play Station 2 - SLIM - SCPH-900XX (2007-2013)','Sony','ps2slim900xx.jpg');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola,Fabricante, LinkImagen) values('P', 'SONY Play Station 2 - FAT - SCPH-500xx (2003-2004)','Sony','ps2fat500xx.jpg');*/

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

/*
CREATE TABLE TareasdeProductos (
	IdTareaPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionTarea varchar(100),
    Realizado boolean not null default 0,
	Activo boolean not null default 1,
    CodigoConsola VARCHAR(25),
	FOREIGN KEY (CodigoConsola) REFERENCES ProductosBases(CodigoConsola)
);*/


    





