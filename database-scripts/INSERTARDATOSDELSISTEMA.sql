use base_datos_inventario_taller;

INSERT INTO TiposAccesorios (CodigoAccesorio, DescripcionAccesorio) values ('J001','Mando de juego');
INSERT INTO TiposAccesorios (CodigoAccesorio, DescripcionAccesorio) values ('C001','Cable HDMI');
INSERT INTO TiposAccesorios (CodigoAccesorio, DescripcionAccesorio) values ('X001','Mando de Monitor');
INSERT INTO tiposaccesorios (CodigoAccesorio, DescripcionAccesorio) values ('M001','Memoria');
INSERT INTO tiposaccesorios (CodigoAccesorio, DescripcionAccesorio) values ('M001','Cable AC');


INSERT INTO TiposProductos (DescripcionTipoProducto) values ('Consola de juegos');
INSERT INTO TiposProductos (DescripcionTipoProducto) values ('Monitor');
INSERT INTO TiposProductos (DescripcionTipoProducto) values ('Laptop');
INSERT INTO TIPOSProductos (DescripcionTipoProducto) values ('Consola Portátil');

select * from tiposaccesorios;
select * from tiposproductos;

insert into CatalogoTiposAccesoriosXProducto (IdTipoAccesorioFK, IdTipoProductoFK) values (1,1);
insert into CatalogoTiposAccesoriosXProducto (IdTipoAccesorioFK, IdTipoProductoFK) values (2,1);
insert into CatalogoTiposAccesoriosXProducto (IdTipoAccesorioFK, IdTipoProductoFK) values (4,1);
insert into CatalogoTiposAccesoriosXProducto (IdTipoAccesorioFK, IdTipoProductoFK) values (5,1);

insert into CatalogoTiposAccesoriosXProducto (IdTipoAccesorioFK, IdTipoProductoFK) values (2,2);
insert into CatalogoTiposAccesoriosXProducto (IdTipoAccesorioFK, IdTipoProductoFK) values (3,2);
insert into CatalogoTiposAccesoriosXProducto (IdTipoAccesorioFK, IdTipoProductoFK) values (5,2);

insert into CatalogoTiposAccesoriosXProducto (IdTipoAccesorioFK, IdTipoProductoFK) values (5,3);

insert into CatalogoTiposAccesoriosXProducto (IdTipoAccesorioFK, IdTipoProductoFK) values (5,4);

select * from TiposAccesorios a 
inner join CatalogoTiposAccesoriosXProducto b on a.IdTipoAccesorioPK = b.IdTipoAccesorioFK
inner join TiposProductos c on b.IdTipoProductoFK = c.IdTipoProductoPK
where c.DescripcionTipoProducto like 'Monitor';
