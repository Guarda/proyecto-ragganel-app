INSERT INTO TiposAccesorios (CodigoAccesorio, DescripciónAccesorio) values ('J001','Mando de juego');
INSERT INTO TiposAccesorios (CodigoAccesorio, DescripciónAccesorio) values ('C001','Cable HDMI');
INSERT INTO TiposAccesorios (CodigoAccesorio, DescripciónAccesorio) values ('X001','Mando de Monitor');

INSERT INTO TiposProductos (DescripcionTipoProducto) values ('Consola de juegos');
INSERT INTO TiposProductos (DescripcionTipoProducto) values ('Monitor');
INSERT INTO TiposProductos (DescripcionTipoProducto) values ('Laptop');

select * from tiposaccesorios;
select * from tiposproductos;

insert into CatalogoTiposAccesoriosXProducto (IdTipoAccesorioFK, IdTipoProductoFK) values (1,1);
insert into CatalogoTiposAccesoriosXProducto (IdTipoAccesorioFK, IdTipoProductoFK) values (2,1);
insert into CatalogoTiposAccesoriosXProducto (IdTipoAccesorioFK, IdTipoProductoFK) values (2,2);
insert into CatalogoTiposAccesoriosXProducto (IdTipoAccesorioFK, IdTipoProductoFK) values (3,2);

select * from TiposAccesorios a 
inner join CatalogoTiposAccesoriosXProducto b on a.IdTipoAccesorioPK = b.IdTipoAccesorioFK
inner join TiposProductos c on b.IdTipoProductoFK = c.IdTipoProductoPK
where c.DescripcionTipoProducto like 'Monitor';
