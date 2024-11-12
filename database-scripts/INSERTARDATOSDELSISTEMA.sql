use base_datos_inventario_taller;
/*ACCESORIOS*/

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


INSERT INTO fabricanteaccesorios (NombreFabricanteAccesorio) values ('Nintendo');
INSERT INTO fabricanteaccesorios (NombreFabricanteAccesorio) values ('Sony');
INSERT INTO fabricanteaccesorios (NombreFabricanteAccesorio) values ('Hori');

INSERT INTO categoriasaccesorios (NombreCategoriaAccesorio, IdFabricanteAccesorioFK) values ('Gamecube gamepad',1);
INSERT INTO categoriasaccesorios (NombreCategoriaAccesorio, IdFabricanteAccesorioFK) values ('Wii U/Switch Gamecube gamepad adapter',1);
INSERT INTO categoriasaccesorios (NombreCategoriaAccesorio, IdFabricanteAccesorioFK) values ('Dualshock',2);
INSERT INTO categoriasaccesorios (NombreCategoriaAccesorio, IdFabricanteAccesorioFK) values ('Dualshock 2',2);
INSERT INTO categoriasaccesorios (NombreCategoriaAccesorio, IdFabricanteAccesorioFK) values ('HORIPAD Turbo SL for Windows PC',3);

INSERT INTO subcategoriasaccesorios (NombreSubcategoriaAccesorio, IdCategoriaAccesorioFK) values ('Indigo',1);
INSERT INTO subcategoriasaccesorios (NombreSubcategoriaAccesorio, IdCategoriaAccesorioFK) values ('Orange',1);
INSERT INTO subcategoriasaccesorios (NombreSubcategoriaAccesorio, IdCategoriaAccesorioFK) values ('Black',1);
INSERT INTO subcategoriasaccesorios (NombreSubcategoriaAccesorio, IdCategoriaAccesorioFK) values ('Smash 4 Edition',1);
INSERT INTO subcategoriasaccesorios (NombreSubcategoriaAccesorio, IdCategoriaAccesorioFK) values ('Black',2);
INSERT INTO subcategoriasaccesorios (NombreSubcategoriaAccesorio, IdCategoriaAccesorioFK) values ('Black',4);
INSERT INTO subcategoriasaccesorios (NombreSubcategoriaAccesorio, IdCategoriaAccesorioFK) values ('Crystal',4);
INSERT INTO subcategoriasaccesorios (NombreSubcategoriaAccesorio, IdCategoriaAccesorioFK) values ('Ocean Blue',4);
INSERT INTO subcategoriasaccesorios (NombreSubcategoriaAccesorio, IdCategoriaAccesorioFK) values ('Midnight Blue',4);

INSERT INTO catalogoaccesorios ( FabricanteAccesorio, CategoriaAccesorio, SubcategoriaAccesorio, CodigoModeloAccesorio, LinkImagen, Activo)
values (1,1,1,'GCGMPAD-1','',1);
INSERT INTO catalogoaccesorios ( FabricanteAccesorio, CategoriaAccesorio, SubcategoriaAccesorio, CodigoModeloAccesorio, LinkImagen, Activo)
values (2,4,8,'GCGMPAD-1','',1);

INSERT INTO accesoriosbase (CodigoAccesorio, ModeloAccesorio, ColorAccesorio, EstadoAccesorio, FechaIngreso, Comentario, PrecioBase, NumeroSerie)
values ('GCGMPAD-1-1',1,'',1,'2024-11-11','accesorio de prueba',19.99,'A1');

INSERT INTO accesoriosbase (CodigoAccesorio, ModeloAccesorio, ColorAccesorio, EstadoAccesorio, FechaIngreso, Comentario, PrecioBase, NumeroSerie)
values ('PS2MPAD-1-1',2,'',1,'2024-11-11','accesorio de prueba',9.99,'A1');

