/*VISTAS*/

CREATE VIEW VistaInventarioGeneral AS
SELECT 
    'Producto' AS TipoArticulo,
    pb.CodigoConsola AS CodigoArticulo,
    cc.CodigoModeloConsola AS Modelo,
    pb.Estado,
    pb.PrecioBase,
    pb.FechaIngreso,
    pb.Comentario,
    NULL AS Cantidad
FROM ProductosBases pb
JOIN CatalogoConsolas cc ON pb.Modelo = cc.IdModeloConsolaPK

UNION ALL

SELECT 
    'Accesorio' AS TipoArticulo,
    ab.CodigoAccesorio AS CodigoArticulo,
    ca.CodigoModeloAccesorio AS Modelo,
    ab.EstadoAccesorio AS Estado,
    ab.PrecioBase,
    ab.FechaIngreso,
    ab.Comentario,
    NULL AS Cantidad
FROM AccesoriosBase ab
JOIN CatalogoAccesorios ca ON ab.ModeloAccesorio = ca.IdModeloAccesorioPK

UNION ALL

SELECT 
    'Insumo' AS TipoArticulo,
    ib.CodigoInsumo AS CodigoArticulo,
    ci.CodigoModeloInsumos AS Modelo,
    ib.EstadoInsumo AS Estado,
    ib.PrecioBase,
    ib.FechaIngreso,
    ib.Comentario,
    ib.Cantidad
FROM InsumosBase ib
JOIN CatalogoInsumos ci ON ib.ModeloInsumo = ci.IdModeloInsumosPK;


/*vista por grupo*/
CREATE VIEW VistaInventarioAgrupada AS

-- Productos
SELECT 
    'Producto' AS TipoArticulo,
    f.NombreFabricante,
    cp.NombreCategoria,
    sp.NombreSubcategoria,
    pb.Estado,
    COUNT(*) AS Cantidad
FROM ProductosBases pb
JOIN CatalogoConsolas cc ON pb.Modelo = cc.IdModeloConsolaPK
JOIN FABRICANTES f ON cc.Fabricante = f.IdFabricantePK
JOIN CategoriasProductos cp ON cc.Categoria = cp.IdCategoriaPK
JOIN SubcategoriasProductos sp ON cc.Subcategoria = sp.IdSubcategoria
GROUP BY TipoArticulo, f.NombreFabricante, cp.NombreCategoria, sp.NombreSubcategoria, pb.Estado

UNION ALL

-- Accesorios
SELECT 
    'Accesorio' AS TipoArticulo,
    fa.NombreFabricanteAccesorio,
    ca.NombreCategoriaAccesorio,
    sa.NombreSubcategoriaAccesorio,
    ab.EstadoAccesorio,
    COUNT(*) AS Cantidad
FROM AccesoriosBase ab
JOIN CatalogoAccesorios caa ON ab.ModeloAccesorio = caa.IdModeloAccesorioPK
JOIN FabricanteAccesorios fa ON caa.FabricanteAccesorio = fa.IdFabricanteAccesorioPK
JOIN CategoriasAccesorios ca ON caa.CategoriaAccesorio = ca.IdCategoriaAccesorioPK
JOIN SubcategoriasAccesorios sa ON caa.SubcategoriaAccesorio = sa.IdSubcategoriaAccesorio
GROUP BY TipoArticulo, fa.NombreFabricanteAccesorio, ca.NombreCategoriaAccesorio, sa.NombreSubcategoriaAccesorio, ab.EstadoAccesorio

UNION ALL

-- Insumos
SELECT 
    'Insumo' AS TipoArticulo,
    fi.NombreFabricanteInsumos,
    ci.NombreCategoriaInsumos,
    si.NombreSubcategoriaInsumos,
    ib.EstadoInsumo,
    SUM(ib.Cantidad) AS Cantidad
FROM InsumosBase ib
JOIN CatalogoInsumos ci2 ON ib.ModeloInsumo = ci2.IdModeloInsumosPK
JOIN FabricanteInsumos fi ON ci2.FabricanteInsumos = fi.IdFabricanteInsumosPK
JOIN CategoriasInsumos ci ON ci2.CategoriaInsumos = ci.IdCategoriaInsumosPK
JOIN SubcategoriasInsumos si ON ci2.SubcategoriaInsumos = si.IdSubcategoriaInsumos
GROUP BY TipoArticulo, fi.NombreFabricanteInsumos, ci.NombreCategoriaInsumos, si.NombreSubcategoriaInsumos, ib.EstadoInsumo;

