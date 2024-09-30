create database base_datos_inventario_taller_test;
use base_datos_inventario_taller_test;

CREATE TABLE CatalogoConsolas (
	IdModeloConsolaPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreCate varchar(100)
);

Insert into CatalogoConsolas (NombreCate) values('Gamecube');
Insert into CatalogoConsolas (NombreCate) values('PS2');


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

Insert into ProductosBases (CodigoConsola, Modelo, Color, Estado, Hackeado, FechaIngreso, Comentario, PrecioBase, NumeroSerie, TodoList, Accesorios) 
values ('A1',1,'verde',1,1,date(now()),'aaa',150,'AAA1','bbbb','ccc');
Insert into ProductosBases (CodigoConsola, Modelo, Color, Estado, Hackeado, FechaIngreso, Comentario, PrecioBase, NumeroSerie, TodoList, Accesorios) 
values ('A2',2,'rojo',1,1,date(now()),'aaa',160,'AAA1','bbbb','ccc');

select * from productosbases;

CREATE TABLE AccesoriosdeProductos (
	IdAccesorioPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    NombreAccesorio varchar(100),
    Activo boolean not null default 1 
);

insert into AccesoriosdeProductos (NombreAccesorio) values ('control');
insert into AccesoriosdeProductos (NombreAccesorio) values ('cable HDMI');
insert into AccesoriosdeProductos (NombreAccesorio) values ('cable AC');
insert into AccesoriosdeProductos (NombreAccesorio) values ('controles');
insert into AccesoriosdeProductos (NombreAccesorio) values ('memoria');

CREATE TABLE ProductosXAccesorios (
	IdProductoXAccesorio int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    IdProductoFK varchar(25),
    IdAccesorioFK int,
    FOREIGN KEY (IdProductoFK) REFERENCES ProductosBases (CodigoConsola),
    FOREIGN KEY (IdAccesorioFK) REFERENCES AccesoriosdeProductos (IdAccesorioPK)
);

insert into ProductosXAccesorios (IdproductoFK, IdAccesorioFK) values ('A1',1);
insert into ProductosXAccesorios (IdproductoFK, IdAccesorioFK) values ('A1',2);
insert into ProductosXAccesorios (IdproductoFK, IdAccesorioFK) values ('A1',3);

insert into ProductosXAccesorios (IdproductoFK, IdAccesorioFK) values ('A2',4);
insert into ProductosXAccesorios (IdproductoFK, IdAccesorioFK) values ('A2',5);


select a.CodigoConsola, c.NombreAccesorio from ProductosBases a
join ProductosXAccesorios b on b.IdProductoFK = a.CodigoConsola
join AccesoriosdeProductos c on b.IdAccesorioFK = c.IdAccesorioPK
where a.CodigoConsola = 'A1'
AND c.Activo = 1;

UPDATE AccesoriosdeProductos 
SET	Activo = 0
WHERE IdAccesorioPK = 3;

CREATE TABLE TareasdeProductos (
	IdTareaPK int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    DescripcionTarea varchar(100),
    Realizado boolean not null default 0,
	Activo boolean not null default 1,
    CodigoConsolaFK VARCHAR(25),
	FOREIGN KEY (CodigoConsolaFK) REFERENCES ProductosBases(CodigoConsola)
);

insert into TareasdeProductos (DescripcionTarea,CodigoConsolaFK) values ('Cambiar Pantalla','A1'); 
insert into TareasdeProductos (DescripcionTarea,CodigoConsolaFK) values ('Chipear','A1'); 

select * from productosbases join TareasdeProductos on CodigoConsolaFK = CodigoConsola;