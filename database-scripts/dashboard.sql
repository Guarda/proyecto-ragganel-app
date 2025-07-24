DELIMITER $$

-- ===================================================================================
-- 1. PROCEDIMIENTO PARA LOS INDICADORES CLAVE (KPIs)
-- Este SP es muy eficiente, ya que obtiene todas las "cifras grandes" en una sola llamada.
-- ===================================================================================

DROP PROCEDURE IF EXISTS sp_Dashboard_KPIs;
CREATE PROCEDURE sp_Dashboard_KPIs()
BEGIN
    -- Declaramos variables para los estados que nos interesan
    DECLARE var_estado_garantia INT DEFAULT 8;
    DECLARE var_estado_reparar INT DEFAULT 6;

    -- La consulta principal une varias subconsultas para obtener todos los KPIs
    SELECT
        -- Ventas
        (SELECT IFNULL(SUM(TotalVenta), 0) FROM VentasBase WHERE DATE(FechaCreacion) = CURDATE()) AS VentasHoy,
        (SELECT IFNULL(SUM(TotalVenta), 0) FROM VentasBase WHERE YEARWEEK(FechaCreacion, 1) = YEARWEEK(CURDATE(), 1)) AS VentasSemana,
        (SELECT IFNULL(SUM(TotalVenta), 0) FROM VentasBase WHERE MONTH(FechaCreacion) = MONTH(CURDATE()) AND YEAR(FechaCreacion) = YEAR(CURDATE())) AS VentasMes,
        
        -- Clientes
        (SELECT COUNT(IdClientePK) FROM Clientes WHERE MONTH(FechaRegistro) = MONTH(CURDATE()) AND YEAR(FechaRegistro) = YEAR(CURDATE())) AS ClientesNuevosMes,
        
        -- Inventario con estados especiales
        (
            (SELECT COUNT(CodigoConsola) FROM ProductosBases WHERE Estado = var_estado_garantia) +
            (SELECT COUNT(CodigoAccesorio) FROM AccesoriosBase WHERE EstadoAccesorio = var_estado_garantia)
        ) AS ArticulosEnGarantia,
        (
            (SELECT COUNT(CodigoConsola) FROM ProductosBases WHERE Estado = var_estado_reparar) +
            (SELECT COUNT(CodigoAccesorio) FROM AccesoriosBase WHERE EstadoAccesorio = var_estado_reparar)
        ) AS ArticulosAReparar;
END$$


-- ===================================================================================
-- 2. PROCEDIMIENTO PARA EL GRÁFICO DE VENTAS DE LOS ÚLTIMOS 30 DÍAS
-- ===================================================================================
DELIMITER $$

-- DROP PROCEDURE IF EXISTS sp_Dashboard_VentasUltimos30Dias;
CREATE PROCEDURE sp_Dashboard_VentasUltimos30Dias()
BEGIN
    SELECT 
        DATE(FechaCreacion) AS name,
        -- Aseguramos que el total nunca sea nulo, aunque SUM() ya suele devolver 0
        IFNULL(SUM(TotalVenta), 0) AS value
    FROM VentasBase
    WHERE FechaCreacion >= CURDATE() - INTERVAL 30 DAY
    GROUP BY DATE(FechaCreacion)
    ORDER BY name ASC;
END$$

DELIMITER ;


-- ===================================================================================
-- 3. PROCEDIMIENTO PARA EL GRÁFICO DE TOP 5 ARTÍCULOS VENDIDOS (POR MONTO)
-- ===================================================================================
DELIMITER $$

-- DROP PROCEDURE IF EXISTS sp_Dashboard_Top5ArticulosVendidos;
CREATE PROCEDURE sp_Dashboard_Top5ArticulosVendidos()
BEGIN
    -- (La sección de la tabla temporal no cambia)
    CREATE TEMPORARY TABLE IF NOT EXISTS TempNombresArticulos (
        Codigo VARCHAR(25) PRIMARY KEY,
        Nombre VARCHAR(255)
    );
    INSERT INTO TempNombresArticulos (Codigo, Nombre)
    SELECT pb.CodigoConsola, CONCAT(f.NombreFabricante, ' ', cp.NombreCategoria, ' ', sp.NombreSubcategoria)
    FROM ProductosBases pb
    JOIN CatalogoConsolas cc ON pb.Modelo = cc.IdModeloConsolaPK
    JOIN Fabricantes f ON cc.Fabricante = f.IdFabricantePK
    JOIN CategoriasProductos cp ON cc.Categoria = cp.IdCategoriaPK
    JOIN SubcategoriasProductos sp ON cc.Subcategoria = sp.IdSubcategoria
    ON DUPLICATE KEY UPDATE Nombre = VALUES(Nombre);
    INSERT INTO TempNombresArticulos (Codigo, Nombre)
    SELECT ab.CodigoAccesorio, CONCAT(fa.NombreFabricanteAccesorio, ' ', ca.NombreCategoriaAccesorio)
    FROM AccesoriosBase ab
    JOIN CatalogoAccesorios cacc ON ab.ModeloAccesorio = cacc.IdModeloAccesorioPK
    JOIN FabricanteAccesorios fa ON cacc.FabricanteAccesorio = fa.IdFabricanteAccesorioPK
    JOIN CategoriasAccesorios ca ON cacc.CategoriaAccesorio = ca.IdCategoriaAccesorioPK
    ON DUPLICATE KEY UPDATE Nombre = VALUES(Nombre);

    -- ===== CORRECCIÓN AÑADIDA AQUÍ =====
    SELECT 
        -- Si el nombre es nulo, lo reemplazamos con 'Artículo Desconocido'
        IFNULL(tna.Nombre, 'Artículo Desconocido') AS name, 
        SUM(dv.SubtotalSinIVA) AS value
    FROM DetalleVenta dv
    LEFT JOIN TempNombresArticulos tna ON dv.CodigoArticulo = tna.Codigo -- Usamos LEFT JOIN por seguridad
    WHERE dv.TipoArticulo IN ('Producto', 'Accesorio')
    GROUP BY name
    ORDER BY value DESC
    LIMIT 5;

    DROP TEMPORARY TABLE TempNombresArticulos;
END$$

DELIMITER ;


-- ===================================================================================
-- 4. PROCEDIMIENTO PARA EL GRÁFICO DE VENTAS POR VENDEDOR
-- ===================================================================================
DELIMITER $$
-- DROP PROCEDURE IF EXISTS sp_Dashboard_VentasPorVendedor;
CREATE PROCEDURE sp_Dashboard_VentasPorVendedor()
BEGIN
    SELECT 
        u.Nombre AS NombreVendedor,
        SUM(vb.TotalVenta) AS TotalVendido
    FROM VentasBase vb
    JOIN Usuarios u ON vb.IdUsuarioFK = u.IdUsuarioPK
    GROUP BY u.Nombre
    ORDER BY TotalVendido DESC;
END$$


-- ===================================================================================
-- 5. PROCEDIMIENTO PARA LA TABLA DE ÚLTIMAS 5 VENTAS
-- ===================================================================================
DELIMITER $$
-- DROP PROCEDURE IF EXISTS sp_Dashboard_Ultimas5Ventas;
CREATE PROCEDURE sp_Dashboard_Ultimas5Ventas()
BEGIN
    SELECT 
        vb.NumeroDocumento,
        c.NombreCliente,
        vb.TotalVenta,
        u.Nombre AS NombreVendedor,
        vb.FechaCreacion
    FROM VentasBase vb
    JOIN Clientes c ON vb.IdClienteFK = c.IdClientePK
    JOIN Usuarios u ON vb.IdUsuarioFK = u.IdUsuarioPK
    ORDER BY vb.FechaCreacion DESC
    LIMIT 5;
END$$


-- ===================================================================================
-- 6. PROCEDIMIENTO PARA LA LISTA DE ALERTAS DE STOCK BAJO (INSUMOS)
-- ===================================================================================
DELIMITER $$
-- DROP PROCEDURE IF EXISTS sp_Dashboard_AlertasStockBajo;
CREATE PROCEDURE sp_Dashboard_AlertasStockBajo()
BEGIN
    -- Usamos una subconsulta para construir el nombre del insumo
    SELECT 
        ib.CodigoInsumo,
        (SELECT CONCAT(fi.NombreFabricanteInsumos, ' ', ci.NombreCategoriaInsumos, ' ', si.NombreSubcategoriaInsumos)
         FROM CatalogoInsumos cain
         JOIN FabricanteInsumos fi ON cain.FabricanteInsumos = fi.IdFabricanteInsumosPK
         JOIN CategoriasInsumos ci ON cain.CategoriaInsumos = ci.IdCategoriaInsumosPK
         JOIN SubcategoriasInsumos si ON cain.SubcategoriaInsumos = si.IdSubcategoriaInsumos
         WHERE cain.IdModeloInsumosPK = ib.ModeloInsumo
        ) AS DescripcionInsumo,
        ib.Cantidad,
        ib.StockMinimo
    FROM InsumosBase ib
    WHERE ib.Cantidad <= ib.StockMinimo
    ORDER BY ib.Cantidad ASC;
END$$


DELIMITER ;

DELIMITER $$

-- ===================================================================================
-- 7. PROCEDIMIENTO PARA EL ANÁLISIS DE INVENTARIO ABC
-- Devuelve el valor total del inventario para Productos (A), Accesorios (B) e Insumos (C).
-- ===================================================================================
DELIMITER $$

-- DROP PROCEDURE IF EXISTS sp_Dashboard_ValorInventarioABC;
CREATE PROCEDURE sp_Dashboard_ValorInventarioABC()
BEGIN
    SELECT 
        'A (Productos)' AS name, -- <-- CORREGIDO: de 'Categoria' a 'name'
        IFNULL(SUM(PrecioBase), 0) AS value -- <-- CORREGIDO: de 'ValorTotal' a 'value'
    FROM ProductosBases 
    WHERE Estado IN (1, 2)

    UNION ALL

    SELECT 
        'B (Accesorios)' AS name, -- <-- CORREGIDO
        IFNULL(SUM(PrecioBase), 0) AS value -- <-- CORREGIDO
    FROM AccesoriosBase 
    WHERE EstadoAccesorio IN (1, 2)

    UNION ALL

    SELECT 
        'C (Insumos)' AS name, -- <-- CORREGIDO
        IFNULL(SUM(PrecioBase * Cantidad), 0) AS value -- <-- CORREGIDO
    FROM InsumosBase;
END$$

DELIMITER ;