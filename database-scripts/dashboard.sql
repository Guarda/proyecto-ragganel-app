
-- ===================================================================================
-- 1. PROCEDIMIENTO PARA LOS INDICADORES CLAVE (KPIs)
-- Este SP es muy eficiente, ya que obtiene todas las "cifras grandes" en una sola llamada.
-- ===================================================================================

DELIMITER $$

DROP PROCEDURE IF EXISTS sp_Dashboard_KPIs;
CREATE PROCEDURE sp_Dashboard_KPIs()
BEGIN
    -- Declaramos variables para los IDs clave y mejorar la legibilidad
    DECLARE var_tipo_factura INT DEFAULT 3; -- ID para el tipo de documento 'Factura'
    DECLARE var_estado_pagado INT DEFAULT 2; -- ID para el estado de venta 'Pagado'
    DECLARE var_estado_garantia INT DEFAULT 9; -- Estado 'En garantia' para inventario
    DECLARE var_estado_reparar INT DEFAULT 6;  -- Estado 'A reparar' para inventario

    SELECT
        -- Ventas Corregidas (Facturas Pagadas - Notas de Crédito Activas)
        (
            (SELECT IFNULL(SUM(TotalVenta), 0) FROM VentasBase WHERE IdTipoDocumentoFK = var_tipo_factura AND IdEstadoVentaFK = var_estado_pagado AND DATE(FechaCreacion) = CURDATE()) -
            (SELECT IFNULL(SUM(TotalCredito), 0) FROM NotasCredito WHERE Estado = 1 AND DATE(FechaEmision) = CURDATE())
        ) AS VentasHoy,
        (
            (SELECT IFNULL(SUM(TotalVenta), 0) FROM VentasBase WHERE IdTipoDocumentoFK = var_tipo_factura AND IdEstadoVentaFK = var_estado_pagado AND YEARWEEK(FechaCreacion, 1) = YEARWEEK(CURDATE(), 1)) -
            (SELECT IFNULL(SUM(TotalCredito), 0) FROM NotasCredito WHERE Estado = 1 AND YEARWEEK(FechaEmision, 1) = YEARWEEK(CURDATE(), 1))
        ) AS VentasSemana,
        (
            (SELECT IFNULL(SUM(TotalVenta), 0) FROM VentasBase WHERE IdTipoDocumentoFK = var_tipo_factura AND IdEstadoVentaFK = var_estado_pagado AND MONTH(FechaCreacion) = MONTH(CURDATE()) AND YEAR(FechaCreacion) = YEAR(CURDATE())) -
            (SELECT IFNULL(SUM(TotalCredito), 0) FROM NotasCredito WHERE Estado = 1 AND MONTH(FechaEmision) = MONTH(CURDATE()) AND YEAR(FechaEmision) = YEAR(CURDATE()))
        ) AS VentasMes,
        
        -- Clientes (sin cambios)
        (SELECT COUNT(IdClientePK) FROM Clientes WHERE MONTH(FechaRegistro) = MONTH(CURDATE()) AND YEAR(FechaRegistro) = YEAR(CURDATE())) AS ClientesNuevosMes,
        
        -- Inventario con estados especiales (sin cambios)
        (
            (SELECT COUNT(CodigoConsola) FROM ProductosBases WHERE Estado = var_estado_garantia) +
            (SELECT COUNT(CodigoAccesorio) FROM AccesoriosBase WHERE EstadoAccesorio = var_estado_garantia)
        ) AS ArticulosEnGarantia,
        (
            (SELECT COUNT(CodigoConsola) FROM ProductosBases WHERE Estado = var_estado_reparar) +
            (SELECT COUNT(CodigoAccesorio) FROM AccesoriosBase WHERE EstadoAccesorio = var_estado_reparar)
        ) AS ArticulosAReparar;
END$$

DELIMITER ;

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

DROP PROCEDURE IF EXISTS sp_Dashboard_Ultimas5Ventas;
CREATE PROCEDURE sp_Dashboard_Ultimas5Ventas()
BEGIN
    SELECT
        vb.NumeroDocumento,
        c.NombreCliente,
        vb.TotalVenta,
        u.Nombre AS NombreVendedor,
        vb.FechaCreacion,
        GROUP_CONCAT(
            CONCAT(dv.Cantidad, 'x ',
                -- Usamos CASE para obtener el nombre completo del artículo
                CASE dv.TipoArticulo
                    WHEN 'Producto' THEN (
                        -- MODIFICADO: Ahora une todas las tablas para construir el nombre completo
                        SELECT CONCAT_WS(' ', f.NombreFabricante, cp.NombreCategoria, sp.NombreSubcategoria)
                        FROM ProductosBases pb
                        JOIN CatalogoConsolas cc ON pb.Modelo = cc.IdModeloConsolaPK
                        JOIN SubcategoriasProductos sp ON cc.Subcategoria = sp.IdSubcategoria
                        JOIN CategoriasProductos cp ON sp.IdCategoriaFK = cp.IdCategoriaPK
                        JOIN Fabricantes f ON cp.IdFabricanteFK = f.IdFabricantePK
                        WHERE pb.CodigoConsola = dv.CodigoArticulo
                    )
                    WHEN 'Accesorio' THEN (
                        -- MODIFICADO: Ahora une todas las tablas para construir el nombre completo
                        SELECT CONCAT_WS(' ', fa.NombreFabricanteAccesorio, ca.NombreCategoriaAccesorio, sa.NombreSubcategoriaAccesorio)
                        FROM AccesoriosBase ab
                        JOIN CatalogoAccesorios cat_a ON ab.ModeloAccesorio = cat_a.IdModeloAccesorioPK
                        JOIN SubcategoriasAccesorios sa ON cat_a.SubcategoriaAccesorio = sa.IdSubcategoriaAccesorio
                        JOIN CategoriasAccesorios ca ON sa.IdCategoriaAccesorioFK = ca.IdCategoriaAccesorioPK
                        JOIN FabricanteAccesorios fa ON ca.IdFabricanteAccesorioFK = fa.IdFabricanteAccesorioPK
                        WHERE ab.CodigoAccesorio = dv.CodigoArticulo
                    )
                    WHEN 'Insumo' THEN (
                        -- MODIFICADO: Ahora une todas las tablas para construir el nombre completo
                        SELECT CONCAT_WS(' ', fi.NombreFabricanteInsumos, ci.NombreCategoriaInsumos, si.NombreSubcategoriaInsumos)
                        FROM InsumosBase ib
                        JOIN CatalogoInsumos cat_i ON ib.ModeloInsumo = cat_i.IdModeloInsumosPK
                        JOIN SubcategoriasInsumos si ON cat_i.SubcategoriaInsumos = si.IdSubcategoriaInsumos
                        JOIN CategoriasInsumos ci ON si.IdCategoriaInsumosFK = ci.IdCategoriaInsumosPK
                        JOIN FabricanteInsumos fi ON ci.IdFabricanteInsumosFK = fi.IdFabricanteInsumosPK
                        WHERE ib.CodigoInsumo = dv.CodigoArticulo
                    )
                    WHEN 'Servicio' THEN (
                        -- Sin cambios para servicios
                        SELECT DescripcionServicio
                        FROM ServiciosBase
                        WHERE IdServicioPK = CAST(dv.CodigoArticulo AS UNSIGNED)
                    )
                    ELSE 'Artículo Desconocido'
                END
            ) SEPARATOR '\n'
        ) AS ArticulosVendidos
    FROM
        VentasBase vb
    JOIN Clientes c ON vb.IdClienteFK = c.IdClientePK
    JOIN Usuarios u ON vb.IdUsuarioFK = u.IdUsuarioPK
    LEFT JOIN DetalleVenta dv ON vb.IdVentaPK = dv.IdVentaFK
    WHERE
        vb.IdTipoDocumentoFK = 3 -- Aseguramos que solo sean Facturas
    GROUP BY
        vb.IdVentaPK
    ORDER BY
        vb.FechaCreacion DESC
    LIMIT 5;
END$$

DELIMITER ;


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