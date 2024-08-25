/*SCRIPT DE CREACION DE LA DB Y TABLAS*/
create database base_datos_inventario_taller;
use base_datos_inventario_taller;

CREATE TABLE CatalogoConsolas (
	IdModeloConsolaPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	CodigoModeloConsola varchar(25),
    DescripcionConsola varchar(100) 
);

/*INSERTAR VALORES A LA TABLA CATALOGO*/

Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N01-0001','NES Estandar NES NTSC-US');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N01-0002','NES Estandar FAMICON NTSC-J');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N01-0003','NES Estandar NES PAL');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N01-0004','NES Toploader Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N01-0005','NES Model 101 (AV version)');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N01-0006','NES Classic NES/FAMICON Edition');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N02-0007','SNES Estandar NTSC-US');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N02-0008','SNES Estandar S. FAMICON NTSC-J');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N02-0009','SNES Estandar PAL');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N02-0010','SNES Classic SNES/S.FAMICON Edition');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N03-0011','Gameboy Original');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N03-0012','Gameboy Pocket');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N03-0013','Gameboy Light');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N03-0014','Gameboy Color');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N03-0015','Gameboy Advance');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N03-0016','Gameboy Advance SP');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N03-0017','Gameboy Micro');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0018','Nintendo 64 Standard Charcoal Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0019','Nintendo 64 Funtastic Jungle Green Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0020','Nintendo 64 Funtastic Ice Blue Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0021','Nintendo 64 Funtastic Grape Purple Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0022','Nintendo 64 Funtastic Fire Orange Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0023','Nintendo 64 Funtastic Smoke / Clear Black Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0024','Nintendo 64 Funtastic Watermelon Red Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0025','Nintendo 64 Clear White / Blue Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0026','Nintendo 64 Clear White / Red Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0027','Nintendo 64 Pikachu Dark Blue Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0028','Nintendo 64 Pikachu Light Blue Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0029','Nintendo 64 Pikachu Orange Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0030','Nintendo 64 Battle Set Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0031','Nintendo 64 Gold Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0032','Nintendo 64 Daiei Hawks Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0033','Nintendo 64 JUSCO 30th Anniversary Edition Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0034','Nintendo 64 All Nippon Airlines (ANA) Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0035','Nintendo 64 Hyundai Comboy Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0036','Nintendo 64 IQue Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N04-0037','Nintendo 64 Lawson Station');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0038','GameCube Indigo Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0039','GameCube Jet Black Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0040','GameCube Platinum Silver Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0041','GameCube Spice Orange Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0042','GameCube Pearl White Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0043','GameCube Metroid Prime Bundle (Example EU]');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0044','GameCube Pokemon XD Bundle (Example NA)');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0045','GameCube Resident Evil 4 Bundle');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0046','GameCube Tales of Symphonia Console (Example JP)');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0047','GameCube Donkey Konga Bundle');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0048','GameCube Hanshin Tigers Bundle');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0049','GameCube Metal Gear Solid Bundle');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0050','GameCube Panasonic Q Bundle');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0051','GameCube Starlight Gold Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0052','GameCube Customized Gundam Char Bundle');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0053','GameCube Final Fantasy Crystal Chronicles Bundle');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0054','GameCube Heineken Black Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0055','GameCube Heineken Indigo Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0056','GameCube ATI Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0057','Gamecube IBM Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0058','GameCube MTV Tom Ford Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0059','GameCube MTV Camouflage Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0060','GameCube MTV Paul Smith Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0061','GameCube MTV Snow White');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0062','GameCube MTV Canadian Maple Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N05-0063','GameCube Metroid Prime 2 Echoes Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N06-0064','Nintendo Wii White Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N06-0065','Nintendo Wii Black Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N06-0066','Nintendo Wii Family Edition');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N06-0067','Nintendo Wii Mini Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N06-0068','Nintendo Wii Light Blue Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N06-0069','Nintendo Wii New Super Mario Bros. Wii Bundle');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N06-0070','Nintendo Wii The Art of Wii Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N06-0071','Nintendo Wii PAX 2008 Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N06-0072','Nintendo Wii Super Smash Bros Brawl Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N06-0073','Nintendo Wii ATI We Did it Console');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N07-0074','Nintendo DS');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N07-0075','Nintendo DS Lite');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N07-0076','Nintendo DSi');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N07-0077','Nintendo DSi XL');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N08-0078','Wii U (WUP-001 - 8 GB Model)');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N08-0079','Wii U (WUP-101 - 32 GB Model)');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N09-0080','Nintendo 3DS');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N09-0081','Nintendo 3DS XL');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N09-0082','Nintendo 2DS');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N09-0083','New Nintendo 3DS');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N09-0084','New Nintendo 3DS XL');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N09-0085','New Nintendo 2DS XL');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N10-0086','Nintendo Switch V1 (2017)');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N10-0087','Nintendo Switch V2');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N10-0088','Nintendo Switch Lite');
Insert into CatalogoConsolas (CodigoModeloConsola,DescripcionConsola) values('N10-0089','Nintendo Switch OLED');

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
    Comentario varchar(100),
    FOREIGN KEY (Modelo) REFERENCES CatalogoConsolas (IdModeloConsolaPK),
    FOREIGN KEY (Estado) REFERENCES CatalogoEstadosConsolas (CodigoEstado)
);
    






