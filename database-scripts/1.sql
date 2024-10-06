select * from catalogoconsolas;
select * from subcategoriasproductos;


use base_datos_inventario_taller;

select * from productosbases;

select * from tiposproductos;

select * from fabricantes;

select * from categoriasproductos join fabricantes on IdFabricanteFK = IdFabricantePK WHERE IdFabricantePK = 3;

select NombreFabricante, NombreCategoria, NombreSubcategoria from subcategoriasproductos 
join categoriasproductos on IdCategoriaFK = IdCategoriaPK
join Fabricantes on IdFabricanteFK = IdFabricantePK
WHERE idCategoriaPK = 1;

select * from categoriasproductos;

select  * from tiposaccesorios;

SELECT * FROM base_datos_inventario_taller.tareasdeproductos where IdTareaPK = 2;
CALL `base_datos_inventario_taller`.`ActualizarTareaRealizado`('2',false);
