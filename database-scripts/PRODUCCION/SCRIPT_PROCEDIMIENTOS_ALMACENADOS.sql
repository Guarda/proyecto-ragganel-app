/*******************************************************************************
** ARCHIVO: SCRIPT_PROCEDIMIENTOS_ALMACENADOS.sql
** PROYECTO: Sistema de Inventario y Taller
** AUTOR: Rommel Maltez
** FECHA DE CREACIÓN: 2025-09-01
** DESCRIPCIÓN:
** Script completo para la creación de todos los procedimientos almacenados
** del sistema. Los procedimientos están organizados por secciones funcionales.
*******************************************************************************/

-- Seleccionamos la base de datos sobre la cual se crearán los procedimientos
USE base_datos_inventario_taller_prueba;

/*
================================================================================
-- I. SECCIÓN DE DASHBOARD
-- DESCRIPCIÓN: Procedimientos para realizar informes rapidos para alimentar 
-- los graficos y estadisticas del dashboard.
================================================================================
*/

-- ===================================================================================
-- 1. PROCEDIMIENTO PARA LOS INDICADORES CLAVE (KPIs)
-- FECHA DE CREACIÓN: 2025-08-02
-- ===================================================================================

DELIMITER $$

-- DROP PROCEDURE IF EXISTS sp_Dashboard_KPIs;
CREATE PROCEDURE sp_Dashboard_KPIs()
BEGIN
    -- Declaramos variables para los IDs clave y mejorar la legibilidad
    DECLARE var_tipo_factura INT DEFAULT 3; -- ID para el tipo de documento 'Factura'
    DECLARE var_estado_pagado INT DEFAULT 2; -- ID para el estado de venta 'Pagado'
    DECLARE var_estado_garantia INT DEFAULT 9; -- Estado 'En garantia' para inventario
    DECLARE var_estado_reparar INT DEFAULT 6;  -- Estado 'A reparar' para inventario

    SELECT        
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
        
        (SELECT COUNT(IdClientePK) FROM Clientes WHERE MONTH(FechaRegistro) = MONTH(CURDATE()) AND YEAR(FechaRegistro) = YEAR(CURDATE())) AS ClientesNuevosMes,
        
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
-- FECHA DE CREACIÓN: 2025-08-02
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
-- FECHA DE CREACIÓN: 2025-08-02
-- ===================================================================================
DELIMITER $$

-- DROP PROCEDURE IF EXISTS sp_Dashboard_Top5ArticulosVendidos;
CREATE PROCEDURE sp_Dashboard_Top5ArticulosVendidos()
BEGIN
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

    SELECT 
        -- Si el nombre es nulo, lo reemplazamos con 'Artículo Desconocido'
        IFNULL(tna.Nombre, 'Artículo Desconocido') AS name, 
        SUM(dv.SubtotalSinIVA) AS value
    FROM DetalleVenta dv
    LEFT JOIN TempNombresArticulos tna ON dv.CodigoArticulo = tna.Codigo 
    WHERE dv.TipoArticulo IN ('Producto', 'Accesorio')
    GROUP BY name
    ORDER BY value DESC
    LIMIT 5;

    DROP TEMPORARY TABLE TempNombresArticulos;
END$$

DELIMITER ;


-- ===================================================================================
-- 4. PROCEDIMIENTO PARA EL GRÁFICO DE VENTAS POR VENDEDOR
-- FECHA DE CREACIÓN: 2025-08-02
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
-- FECHA DE CREACIÓN: 2025-08-02
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
        vb.FechaCreacion,
        GROUP_CONCAT(
            CONCAT(dv.Cantidad, 'x ',
                -- Usamos CASE para obtener el nombre completo del artículo
                CASE dv.TipoArticulo
                    WHEN 'Producto' THEN (                        
                        SELECT CONCAT_WS(' ', f.NombreFabricante, cp.NombreCategoria, sp.NombreSubcategoria)
                        FROM ProductosBases pb
                        JOIN CatalogoConsolas cc ON pb.Modelo = cc.IdModeloConsolaPK
                        JOIN SubcategoriasProductos sp ON cc.Subcategoria = sp.IdSubcategoria
                        JOIN CategoriasProductos cp ON sp.IdCategoriaFK = cp.IdCategoriaPK
                        JOIN Fabricantes f ON cp.IdFabricanteFK = f.IdFabricantePK
                        WHERE pb.CodigoConsola = dv.CodigoArticulo
                    )
                    WHEN 'Accesorio' THEN (                        
                        SELECT CONCAT_WS(' ', fa.NombreFabricanteAccesorio, ca.NombreCategoriaAccesorio, sa.NombreSubcategoriaAccesorio)
                        FROM AccesoriosBase ab
                        JOIN CatalogoAccesorios cat_a ON ab.ModeloAccesorio = cat_a.IdModeloAccesorioPK
                        JOIN SubcategoriasAccesorios sa ON cat_a.SubcategoriaAccesorio = sa.IdSubcategoriaAccesorio
                        JOIN CategoriasAccesorios ca ON sa.IdCategoriaAccesorioFK = ca.IdCategoriaAccesorioPK
                        JOIN FabricanteAccesorios fa ON ca.IdFabricanteAccesorioFK = fa.IdFabricanteAccesorioPK
                        WHERE ab.CodigoAccesorio = dv.CodigoArticulo
                    )
                    WHEN 'Insumo' THEN (                       
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
-- FECHA DE CREACIÓN: 2025-08-02
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
-- FECHA DE CREACIÓN: 2025-08-02
-- Devuelve el valor total del inventario para Productos (A), Accesorios (B) e Insumos (C).
-- ===================================================================================
DELIMITER $$

-- DROP PROCEDURE IF EXISTS sp_Dashboard_ValorInventarioABC;
CREATE PROCEDURE sp_Dashboard_ValorInventarioABC()
BEGIN
    SELECT 
        'A (Productos)' AS name, 
        IFNULL(SUM(PrecioBase), 0) AS value 
    FROM ProductosBases 
    WHERE Estado IN (1, 2)

    UNION ALL

    SELECT 
        'B (Accesorios)' AS name, 
        IFNULL(SUM(PrecioBase), 0) AS value 
    FROM AccesoriosBase 
    WHERE EstadoAccesorio IN (1, 2)

    UNION ALL

    SELECT 
        'C (Insumos)' AS name, 
        IFNULL(SUM(PrecioBase * Cantidad), 0) AS value
    FROM InsumosBase;
END$$

DELIMITER ;

/*
================================================================================
-- II. SECCIÓN DE HISTORIALES
-- DESCRIPCIÓN: Procedimientos para obtener los historiales de cambios de estados en multiples partes del sistema
-- Accesorios, insumos, productos, pedidos, notas de credito, etc ...
================================================================================
*/

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarHistorialEstadoAccesorioXId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-03-01
-- DESCRIPCIÓN: Devuelve el historial del accesorio por id
------------------------------------------------------------------------------*/
DELIMITER $$

CREATE PROCEDURE ListarHistorialEstadoAccesorioXId(
	IN IdAccesorio VARCHAR(25)
)
BEGIN
    SELECT 
        h.IdHistorial,
        h.CodigoAccesorio,
        h.EstadoAnterior,
        ea.DescripcionEstado AS EstadoAnteriorDescripcion,
        h.EstadoNuevo,
        en.DescripcionEstado AS EstadoNuevoDescripcion,
        h.FechaCambio
    FROM historialestadoaccesorio h
    LEFT JOIN  catalogoestadosconsolas ea ON h.EstadoAnterior = ea.CodigoEstado
    INNER JOIN catalogoestadosconsolas en ON h.EstadoNuevo = en.CodigoEstado
    WHERE h.CodigoAccesorio = IdAccesorio
    ORDER BY h.FechaCambio ASC;
END $$

DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_UpsertCostoDistribucion
-- AUTOR: Gemini
-- FECHA DE CREACIÓN: 2025-09-13
-- DESCRIPCIÓN: Inserta o actualiza el porcentaje de distribución de costos
-- para un modelo de artículo específico.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_UpsertCostoDistribucion(
    IN p_IdModeloFK INT,
    IN p_TipoArticuloFK INT,
    IN p_PorcentajeAsignado DECIMAL(5, 2)
)
BEGIN
    INSERT INTO CostosDistribucionPorModelo (IdModeloFK, TipoArticuloFK, PorcentajeAsignado)
    VALUES (p_IdModeloFK, p_TipoArticuloFK, p_PorcentajeAsignado)
    ON DUPLICATE KEY UPDATE PorcentajeAsignado = VALUES(PorcentajeAsignado);
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_GetModelosUnicosDePedido
-- AUTOR: Gemini
-- FECHA DE CREACIÓN: 2025-09-13
-- DESCRIPCIÓN: Obtiene los modelos únicos de un pedido, la cantidad de cada
-- uno y el porcentaje de distribución de costos preconfigurado.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_GetModelosUnicosDePedido(IN p_IdPedido VARCHAR(25))
BEGIN
    SELECT
        pd.IdModeloPK,
        pd.TipoArticuloFK,
        ta.DescripcionTipoArticulo,
        -- Obtiene el nombre completo del modelo desde la tabla de catálogo correcta
        CASE
            WHEN pd.TipoArticuloFK = 1 THEN (SELECT CONCAT(f.NombreFabricante, ' ', cp.NombreCategoria, ' ', sp.NombreSubcategoria) FROM CatalogoConsolas cc JOIN Fabricantes f ON cc.Fabricante = f.IdFabricantePK JOIN CategoriasProductos cp ON cc.Categoria = cp.IdCategoriaPK JOIN SubcategoriasProductos sp ON cc.Subcategoria = sp.IdSubcategoria WHERE cc.IdModeloConsolaPK = pd.IdModeloPK)
            WHEN pd.TipoArticuloFK = 2 THEN (SELECT CONCAT(fa.NombreFabricanteAccesorio, ' ', ca.NombreCategoriaAccesorio, ' ', sa.NombreSubcategoriaAccesorio) FROM CatalogoAccesorios caa JOIN FabricanteAccesorios fa ON caa.FabricanteAccesorio = fa.IdFabricanteAccesorioPK JOIN CategoriasAccesorios ca ON caa.CategoriaAccesorio = ca.IdCategoriaAccesorioPK JOIN SubcategoriasAccesorios sa ON caa.SubcategoriaAccesorio = sa.IdSubcategoriaAccesorio WHERE caa.IdModeloAccesorioPK = pd.IdModeloPK)
            WHEN pd.TipoArticuloFK = 3 THEN (SELECT CONCAT(fi.NombreFabricanteInsumos, ' ', ci.NombreCategoriaInsumos, ' ', si.NombreSubcategoriaInsumos) FROM CatalogoInsumos cain JOIN FabricanteInsumos fi ON cain.FabricanteInsumos = fi.IdFabricanteInsumosPK JOIN CategoriasInsumos ci ON cain.CategoriaInsumos = ci.IdCategoriaInsumosPK JOIN SubcategoriasInsumos si ON cain.SubcategoriaInsumos = si.IdSubcategoriaInsumos WHERE cain.IdModeloInsumosPK = pd.IdModeloPK)
        END AS NombreModelo,
        SUM(pd.CantidadArticulo) AS CantidadEnPedido,
        -- Obtiene el porcentaje preconfigurado, o 0 si no existe
        COALESCE(cdm.PorcentajeAsignado, 0.00) AS PorcentajeConfigurado
    FROM
        PedidoDetalles pd
    JOIN
        TipoArticulo ta ON pd.TipoArticuloFK = ta.IdTipoArticuloPK
    LEFT JOIN
        CostosDistribucionPorModelo cdm ON pd.IdModeloPK = cdm.IdModeloFK AND pd.TipoArticuloFK = cdm.TipoArticuloFK
    WHERE
        pd.IdCodigoPedidoFK = p_IdPedido AND pd.Activo = 1
    GROUP BY
        pd.IdModeloPK, pd.TipoArticuloFK, ta.DescripcionTipoArticulo, NombreModelo
    ORDER BY
        pd.TipoArticuloFK, NombreModelo;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarHistorialEstadoInsumoXId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-04-25
-- DESCRIPCIÓN: Devuelve el historial del insumo por id
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE ListarHistorialEstadoInsumoXId(
	IN IdInsumo VARCHAR(25)
)
BEGIN
    SELECT 
        h.IdHistorial,
        h.CodigoInsumo,
        h.EstadoAnterior,
        ea.DescripcionEstado AS EstadoAnteriorDescripcion,
        h.EstadoNuevo,
        en.DescripcionEstado AS EstadoNuevoDescripcion,
        h.StockAnterior,
        h.StockNuevo,
        h.StockMinimoAnterior,
        h.StockMinimoNuevo,
        h.FechaCambio
    FROM HistorialEstadoInsumo h
    LEFT JOIN CatalogoEstadosConsolas ea ON h.EstadoAnterior = ea.CodigoEstado
    INNER JOIN CatalogoEstadosConsolas en ON h.EstadoNuevo = en.CodigoEstado
    WHERE h.CodigoInsumo = IdInsumo
    ORDER BY h.FechaCambio ASC;
END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarHistorialEstadoPedidoXId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-02-05
-- DESCRIPCIÓN: Devuelve el historial del pedido por id
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE ListarHistorialEstadoPedidoXId(
	IN IdPedido VARCHAR(25)
)
BEGIN
    SELECT 
        h.IdHistorial,
        h.CodigoPedido,
        h.EstadoAnterior,
        ea.DescripcionEstadoPedido AS EstadoAnteriorDescripcion,
        h.EstadoNuevo,
        en.DescripcionEstadoPedido AS EstadoNuevoDescripcion,
        h.FechaCambio
    FROM HistorialEstadoPedido h
    LEFT JOIN EstadoPedido ea ON h.EstadoAnterior = ea.CodigoEstadoPedido
    INNER JOIN EstadoPedido en ON h.EstadoNuevo = en.CodigoEstadoPedido
    WHERE h.CodigoPedido = IdPedido
    ORDER BY h.FechaCambio ASC;
END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarHistorialEstadoProductoXId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-03-01
-- DESCRIPCIÓN: Devuelve el historial del producto por id
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE ListarHistorialEstadoProductoXId(
	IN IdProducto VARCHAR(25)
)
BEGIN
    SELECT 
        h.IdHistorial,
        h.CodigoConsola,
        h.EstadoAnterior,
        ea.DescripcionEstado AS EstadoAnteriorDescripcion,
        h.EstadoNuevo,
        en.DescripcionEstado AS EstadoNuevoDescripcion,
        h.FechaCambio
    FROM historialestadoproducto h
    LEFT JOIN  catalogoestadosconsolas ea ON h.EstadoAnterior = ea.CodigoEstado
    INNER JOIN catalogoestadosconsolas en ON h.EstadoNuevo = en.CodigoEstado
    WHERE h.CodigoConsola = IdProducto
    -- WHERE h.CodigoConsola = 'GCI003-19'
    ORDER BY h.FechaCambio ASC;
END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_ObtenerHistorialArticulo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-08-01
-- DESCRIPCIÓN: Devuelve el historial de articulo general.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_ObtenerHistorialArticulo(
    IN p_TipoArticulo VARCHAR(50),
    IN p_CodigoArticulo VARCHAR(25)
)
BEGIN
    IF p_TipoArticulo = 'Producto' THEN
        SELECT 
            FechaCambio,
            EstadoAnterior,
            EstadoNuevo,
            (SELECT DescripcionEstado FROM CatalogoEstadosConsolas WHERE CodigoEstado = hep.EstadoAnterior) AS EstadoAnteriorDescripcion,
            (SELECT DescripcionEstado FROM CatalogoEstadosConsolas WHERE CodigoEstado = hep.EstadoNuevo) AS EstadoNuevoDescripcion,
            NULL AS StockAnterior, -- Columnas de Insumo en NULL
            NULL AS StockNuevo
        FROM HistorialEstadoProducto hep
        WHERE CodigoConsola = p_CodigoArticulo
        ORDER BY FechaCambio ASC;
        
    ELSEIF p_TipoArticulo = 'Accesorio' THEN
        SELECT 
            FechaCambio,
            EstadoAnterior,
            EstadoNuevo,
            (SELECT DescripcionEstado FROM CatalogoEstadosConsolas WHERE CodigoEstado = hea.EstadoAnterior) AS EstadoAnteriorDescripcion,
            (SELECT DescripcionEstado FROM CatalogoEstadosConsolas WHERE CodigoEstado = hea.EstadoNuevo) AS EstadoNuevoDescripcion,
            NULL AS StockAnterior,
            NULL AS StockNuevo
        FROM HistorialEstadoAccesorio hea
        WHERE CodigoAccesorio = p_CodigoArticulo
        ORDER BY FechaCambio ASC;

    ELSEIF p_TipoArticulo = 'Insumo' THEN
        SELECT 
            FechaCambio,
            EstadoAnterior,
            EstadoNuevo,
            (SELECT DescripcionEstado FROM CatalogoEstadosConsolas WHERE CodigoEstado = hei.EstadoAnterior) AS EstadoAnteriorDescripcion,
            (SELECT DescripcionEstado FROM CatalogoEstadosConsolas WHERE CodigoEstado = hei.EstadoNuevo) AS EstadoNuevoDescripcion,
            StockAnterior,
            StockNuevo
        FROM HistorialEstadoInsumo hei
        WHERE CodigoInsumo = p_CodigoArticulo
        ORDER BY FechaCambio ASC;
    END IF;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_RegistrarHistorialNotaCredito
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-08-01
-- DESCRIPCIÓN: Devuelve el historial de nota de credito.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_RegistrarHistorialNotaCredito(
    IN p_IdNotaCreditoFK INT,
    IN p_IdUsuarioFK INT,
    IN p_TipoAccion VARCHAR(20),
    IN p_Detalles VARCHAR(255)
)
BEGIN
    -- Inserta un nuevo registro en la tabla de historial con los datos proporcionados.
    INSERT INTO HistorialNotasCredito (
        IdNotaCreditoFK, 
        IdUsuarioFK, 
        TipoAccion, 
        Detalles
    ) 
    VALUES (
        p_IdNotaCreditoFK, 
        p_IdUsuarioFK, 
        p_TipoAccion, 
        p_Detalles
    );
END$$
DELIMITER ;

/*
================================================================================
-- III. SECCIÓN DE INVENTARIO
-- DESCRIPCIÓN: Procedimientos para gestionar artículos (Productos, Accesorios,
-- Insumos) y sus catálogos asociados (Fabricantes, Categorías, etc.).
================================================================================
*/

/*-- III.A. Subsección: Procedimientos generales ---------------------------*/

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarEstadosConsolas
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-08-24.
-- DESCRIPCIÓN: Devuelve una lista de todos los estados disponibles para un articulo.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE ListarEstadosConsolas()
    BEGIN
		SELECT * FROM catalogoestadosconsolas;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarInformacionTipoArticuloXId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-01-01
-- DESCRIPCIÓN: PROCEDIMIENTO CONSEGUIR INFORMACION ESPECIFICA DE TIPO ARTICULO CREADO
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarInformacionTipoArticuloXId(TipoArticuloid int)
	BEGIN
		SELECT * FROM tipoarticulo
        WHERE IdTipoArticuloPK = TipoArticuloid;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarVistaInventarioGeneral
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-07-01
-- DESCRIPCIÓN: Procedimiento para listar la vista Inventario General.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE ListarVistaInventarioGeneral ()
BEGIN
	SELECT * FROM VistaInventarioGeneral;
END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_ActualizarEstadoArticulo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-07-01
-- DESCRIPCIÓN: Procedimiento para actualizar estado del articulo dependiendo de su tipo,
-- se usa cuando se tiene que actualizar el estado por medio de una venta o cancelacion de esta
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_ActualizarEstadoArticulo(
    IN p_TipoArticulo VARCHAR(50),
    IN p_CodigoArticulo VARCHAR(25),
    IN p_NuevoEstadoID INT
)
BEGIN
    -- Determina qué tabla actualizar basado en el tipo de artículo
    IF p_TipoArticulo = 'Producto' THEN
        UPDATE ProductosBases
        SET Estado = p_NuevoEstadoID
        WHERE CodigoConsola = p_CodigoArticulo;
        
    ELSEIF p_TipoArticulo = 'Accesorio' THEN
        UPDATE AccesoriosBase
        SET EstadoAccesorio = p_NuevoEstadoID
        WHERE CodigoAccesorio = p_CodigoArticulo;
    END IF;
    -- insumos no se afectan ya que no se prevee que un insumo regrese a inventario por garantía.
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_ListarArticulosEnGarantia
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-07-01
-- DESCRIPCIÓN: Procedimiento para listar todos los productos y accesorios que estan en estado de garantía
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_ListarArticulosEnGarantia()
BEGIN
    DECLARE var_id_estado_garantia INT DEFAULT 9; -- El ID para 'En garantia'
    -- Consulta para PRODUCTOS
    SELECT 
        'Producto' AS TipoArticulo,
        pb.CodigoConsola AS CodigoArticulo,
        CONCAT(f.NombreFabricante, ' ', cp.NombreCategoria, ' ', sp.NombreSubcategoria, ' (Color: ', pb.Color, ')') AS Descripcion,
        pb.FechaIngreso,
        pb.PrecioBase,
        cec.DescripcionEstado AS Estado,
        pb.Estado AS IdEstado, 
        pb.NumeroSerie,
        pb.Comentario
    FROM 
        ProductosBases pb
    JOIN CatalogoEstadosConsolas cec ON pb.Estado = cec.CodigoEstado
    JOIN CatalogoConsolas cc ON pb.Modelo = cc.IdModeloConsolaPK
    JOIN Fabricantes f ON cc.Fabricante = f.IdFabricantePK
    JOIN CategoriasProductos cp ON cc.Categoria = cp.IdCategoriaPK
    JOIN SubcategoriasProductos sp ON cc.Subcategoria = sp.IdSubcategoria
    WHERE pb.Estado = var_id_estado_garantia
    UNION ALL
    -- Consulta para ACCESORIOS
    SELECT 
        'Accesorio' AS TipoArticulo,
        ab.CodigoAccesorio AS CodigoArticulo,
        CONCAT(fa.NombreFabricanteAccesorio, ' ', ca.NombreCategoriaAccesorio, ' ', sa.NombreSubcategoriaAccesorio, ' (Color: ', ab.ColorAccesorio, ')') AS Descripcion,
        ab.FechaIngreso,
        ab.PrecioBase,
        cec.DescripcionEstado AS Estado,
        ab.EstadoAccesorio AS IdEstado, 
        ab.NumeroSerie,
        ab.Comentario
    FROM 
        AccesoriosBase ab
    JOIN CatalogoEstadosConsolas cec ON ab.EstadoAccesorio = cec.CodigoEstado
    JOIN CatalogoAccesorios cacc ON ab.ModeloAccesorio = cacc.IdModeloAccesorioPK
    JOIN FabricanteAccesorios fa ON cacc.FabricanteAccesorio = fa.IdFabricanteAccesorioPK
    JOIN CategoriasAccesorios ca ON cacc.CategoriaAccesorio = ca.IdCategoriaAccesorioPK
    JOIN SubcategoriasAccesorios sa ON cacc.SubcategoriaAccesorio = sa.IdSubcategoriaAccesorio
    WHERE ab.EstadoAccesorio = var_id_estado_garantia;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_VerificarCodigoUnico
-- AUTOR: Gemini Code Assist
-- FECHA DE CREACIÓN: 2025-09-15
-- DESCRIPCIÓN: Verifica si un código de modelo ya existe en cualquiera de
-- las tablas de catálogo (productos, accesorios o insumos).
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_VerificarCodigoUnico(IN p_Codigo VARCHAR(25))
BEGIN
    SELECT 1 AS Existe FROM CatalogoConsolas WHERE CodigoModeloConsola = p_Codigo
    UNION ALL
    SELECT 1 AS Existe FROM CatalogoAccesorios WHERE CodigoModeloAccesorio = p_Codigo
    UNION ALL
    SELECT 1 AS Existe FROM CatalogoInsumos WHERE CodigoModeloInsumos = p_Codigo
    LIMIT 1;
END$$
DELIMITER ;


/*-- III.B. Subsección: Procedimientos accesorios ---------------------------*/

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ActualizarAccesorioBase
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-14
-- DESCRIPCIÓN: actualizacion de los datos base de un accesorio, sus tareas y productos relacionados.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ActualizarAccesorioBase (
    CodigoAccesorioA VARCHAR(50),
    modeloAccesorioA INT, 
    colorAccesorioA VARCHAR(100), 
    EstadoAccesorioA INT, 
    PrecioAccesorioA DECIMAL(6,2), 
    ComentariAccesorioA VARCHAR(100), 
    NumeroSAccesorioA VARCHAR(100),
    ProductosCompatiblesA TEXT -- Lista de productos compatibles (cadena separada por comas)
)
BEGIN   
    -- Procesamiento la cadena de productos compatibles (en caso de necesitar limpieza o formateo)
    DECLARE productosConcatenados TEXT;
    SET productosConcatenados = REPLACE(ProductosCompatiblesA, '","', ',');

    -- Actualización el accesorio en la tabla AccesoriosBase
    UPDATE AccesoriosBase
    SET 
        ModeloAccesorio = modeloAccesorioA, 
        ColorAccesorio = colorAccesorioA, 
        EstadoAccesorio = EstadoAccesorioA, 
        Comentario = ComentariAccesorioA, 
        PrecioBase = PrecioAccesorioA, 
        NumeroSerie = NumeroSAccesorioA, 
        ProductosCompatibles = productosConcatenados 
    WHERE CodigoAccesorio = CodigoAccesorioA;
    SELECT 'Accesorio actualizado correctamente' AS mensaje;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ActualizarCategoriaAccesorio
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-16
-- DESCRIPCIÓN: actualizacion de los datos base de la supercategoria de un accesorio.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ActualizarCategoriaAccesorio(IdModeloA int, FabricanteA int, CategoriaA int, SubcategoriaA int, CodigoA varchar(25), LinkA varchar(100))
BEGIN
	UPDATE catalogoaccesorios 
    SET  
        FabricanteAccesorio = FabricanteA, 
        CategoriaAccesorio = CategoriaA, 
        SubcategoriaAccesorio = SubcategoriaA,
        CodigoModeloAccesorio = CodigoA,
        LinkImagen = LinkA
	WHERE IdModeloAccesorioPK = IdModeloA;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ActualizarCategoriaAccesorio
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-14
-- DESCRIPCIÓN: actualizacion de realizacion de una tarea de un accesorio.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ActualizarTareaAccesorioRealizado(
    IN p_IdTareaPK INT,
    IN p_Realizado BOOLEAN
)
BEGIN
    UPDATE Tareasdeaccesorios
    SET Realizado = p_Realizado
    WHERE IdTareaAccesorioPK = p_IdTareaPK;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: BorrarAccesorio
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-14
-- DESCRIPCIÓN: se hace un softdelete al accesorio al asignarle estado 7 - borrado.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE BorrarAccesorio(IdCodigoAccesorio varchar(100))
    BEGIN
		UPDATE AccesoriosBase
        SET
			EstadoAccesorio = 7
        WHERE CodigoAccesorio = IdCodigoAccesorio;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: BorrarCategoriaAccesorio
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-16
-- DESCRIPCIÓN: se hace un softdelete de una supercategoria de accesorios.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE BorrarCategoriaAccesorio(IdCategoria int)
    BEGIN
		UPDATE catalogoaccesorios
        SET
			Activo = 0
        WHERE IdModeloAccesorioPK = IdCategoria;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: BuscarIdCategoriaAccesorioCatalogo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-14
-- DESCRIPCIÓN: se busca el id de la supercategoria de accesorio por medio de su fabricante, categoria y subcategoria.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE BuscarIdCategoriaAccesorioCatalogo(IdFabricanteA int, IdCategoriaA int, IdSubcategoriaA int)
    BEGIN
		SELECT IdModeloAccesorioPK FROM catalogoaccesorios
        WHERE FabricanteAccesorio = IdFabricanteA
        AND CategoriaAccesorio = IdCategoriaA
        AND SubcategoriaAccesorio = IdSubcategoriaA
        AND Activo = 1;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_CheckSuperCategoriaAccesorioActivaExists
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-10-22
-- DESCRIPCIÓN: Verifica si ya existe una supercategoría de accesorio activa
--              con una combinación específica de fabricante, categoría y subcategoría.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE sp_CheckSuperCategoriaAccesorioActivaExists(
    IN p_Fabricante INT,
    IN p_Categoria INT,
    IN p_Subcategoria INT
)
BEGIN
    SELECT EXISTS(
        SELECT 1
        FROM CatalogoAccesorios
        WHERE FabricanteAccesorio = p_Fabricante
          AND CategoriaAccesorio = p_Categoria
          AND SubcategoriaAccesorio = p_Subcategoria
          AND Activo = 1
    ) AS 'existe';
END //
DELIMITER ;



/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarAccesorioATablaAccesoriosBaseV2
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-16
-- DESCRIPCIÓN: Insercion de un accesorio a la base de datos con sus productos compatibles y tareas.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE IngresarAccesorioATablaAccesoriosBaseV2 (
    modeloAcc INT, 
    colorAcc VARCHAR(100), 
    estadoAcc INT, 
    precioBase DECIMAL(6,2), 
    comentarioAcc VARCHAR(2000), 
    numeroSerie VARCHAR(100), 
    productosCompatibles TEXT, -- Lista de productos compatibles (cadena separada por comas)
    tareasP TEXT -- Lista de tareas (cadena separada por comas)
)
BEGIN
    DECLARE codigoAccesorioGenerated VARCHAR(50);
    DECLARE cantidadRegistros INT DEFAULT 0;
    DECLARE tarea VARCHAR(100);
    DECLARE next_comma INT;
    DECLARE ModeloCatCons VARCHAR(25);
    DECLARE productosConcatenados TEXT;
    
    -- se obtiene el codigo de la supercategoria
    SELECT CodigoModeloAccesorio INTO ModeloCatCons 
    FROM CatalogoAccesorios 
    WHERE IdModeloAccesorioPK = modeloAcc;
    
    -- se obtiene el total de registros en la tabla accesoriosbase
    SELECT COUNT(*) INTO cantidadRegistros 
    FROM AccesoriosBase;

    -- Se genera un codigo unico (CodigoAccesorio) al combinar el modeloAcc con el conteo de registros.
    SET codigoAccesorioGenerated = CONCAT(ModeloCatCons, '-', cantidadRegistros + 1);

    -- procesamiento del listado de productos compatibles.
    SET productosConcatenados = REPLACE(productosCompatibles, '","', ',');

    -- Insercion
    INSERT INTO AccesoriosBase (
        CodigoAccesorio, ModeloAccesorio, ColorAccesorio, EstadoAccesorio, FechaIngreso, Comentario, PrecioBase, NumeroSerie, ProductosCompatibles
    )
    VALUES (
        codigoAccesorioGenerated, 
        modeloAcc, 
        colorAcc, 
        estadoAcc, 
        DATE_FORMAT(NOW(), '%Y%m%d'), 
        comentarioAcc, 
        precioBase, 
        numeroSerie, 
        productosConcatenados
    );

    -- Insecion de las tareas.
    WHILE LENGTH(tareasP) > 0 DO
        SET next_comma = LOCATE(',', tareasP);

        IF next_comma = 0 THEN
            SET tarea = TRIM(tareasP);
            INSERT INTO TareasdeAccesorios (DescripcionTarea, Realizado, Activo, IdCodigoAccesorioFK)
            VALUES (tarea, 0, 1, codigoAccesorioGenerated);
            SET tareasP = '';
        ELSE
            SET tarea = TRIM(SUBSTRING(tareasP, 1, next_comma - 1));
            INSERT INTO TareasdeAccesorios (DescripcionTarea, Realizado, Activo, IdCodigoAccesorioFK)
            VALUES (tarea, 0, 1, codigoAccesorioGenerated);
            SET tareasP = SUBSTRING(tareasP, next_comma + 1);
        END IF;
    END WHILE;

END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTablaProductosBasesXIdV2
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-10-02
-- DESCRIPCIÓN: Lista informacion completa del producto.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarTablaProductosBasesXIdV2(IdCodigoConsola varchar(100))
BEGIN
	SELECT 
		A.CodigoConsola, A.Modelo, A.Color, A.Estado, A.Hackeado as 'Hack', A.FechaIngreso, A.Comentario, A.PrecioBase, A.NumeroSerie, A.Accesorios,
        B.Fabricante, B.Categoria, B.Subcategoria
    FROM ProductosBases A
    JOIN CatalogoConsolas B
    ON A.Modelo = B.IdModeloConsolaPK 
    WHERE A.CodigoConsola = IdCodigoConsola;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarCategoriaAccesorio
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-16
-- DESCRIPCIÓN: Insercion de supercategorias para accesorios.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE IngresarCategoriaAccesorio(FabricanteA int, CategoriaA int, SubcategoriaA int, PrefijoAccesorio varchar(25), NombreArchivoImagen varchar(100))
    BEGIN
		INSERT INTO catalogoaccesorios(FabricanteAccesorio, CategoriaAccesorio, SubcategoriaAccesorio, CodigoModeloAccesorio, LinkImagen) 
        values (FabricanteA, CategoriaA, SubcategoriaA, PrefijoAccesorio, NombreArchivoImagen);
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarCategoriaAccesorio
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-16
-- DESCRIPCIÓN: Insercion de una categoria del fabricante de accesorio.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE IngresarCategoriaAccesorioB(NombreCategoriaA varchar(100), IdFabricanteA int)
BEGIN
   INSERT INTO categoriasaccesorios (NombreCategoriaAccesorio, IdFabricanteAccesorioFK, Activo) values (NombreCategoriaA, IdFabricanteA, 1);   
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarFabricanteAccesorio
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-16
-- DESCRIPCIÓN: Insercion de un fabricante de accesorio.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE IngresarFabricanteAccesorio(NombreFabricanteAccesorio varchar(100))
BEGIN
   INSERT INTO FABRICANTEACCESORIOS (NombreFabricanteAccesorio, Activo) values (NombreFabricanteAccesorio, 1);   
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarSubcategoriaAccesorio
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-16
-- DESCRIPCIÓN: Insercion de una subcategoria de categoria de accesorio.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE IngresarSubcategoriaAccesorio(NombreSubcategoriaAccesorio varchar(100), IdCategoriaAccesorio int)
BEGIN
   INSERT INTO SUBCATEGORIASACCESORIOS (NombreSubcategoriaAccesorio, IdCategoriaAccesorioFK, Activo) values (NombreSubcategoriaAccesorio, IdCategoriaAccesorio, 1);   
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarCategoriasAccesoriosxModeloActivo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-12-28
-- DESCRIPCIÓN: Lista las categorias que estan asociadas a un fabricante de accesorio.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarCategoriasAccesoriosxModeloActivo(FabricanteP INT)
		BEGIN
			SELECT DISTINCT a.IdCategoriaAccesorioPK, a.NombreCategoriaAccesorio FROM categoriasaccesorios a
            JOIN catalogoaccesorios b ON a.IdCategoriaAccesorioPK = b.CategoriaAccesorio
            WHERE a.Activo = 1
            AND b.Activo = 1
            AND b.FabricanteAccesorio = FabricanteP;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarCategoriasAccesorios
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-10-13
-- DESCRIPCIÓN: Lista las categorias de accesorios activas.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarCategoriasAccesorios()
		BEGIN
			SELECT * FROM categoriasaccesorios 
            WHERE Activo = 1;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarCategoriasAccesoriosB
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-14
-- DESCRIPCIÓN: Lista las categorias de accesorios activas.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarCategoriasAccesoriosB()
		BEGIN
			SELECT * FROM categoriasaccesorios;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarCategoriasAccesoriosBase
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-12
-- DESCRIPCIÓN: Lista las supercategorias de accesorios activas junto con la informacion de fabricantes, categorias y subcategorias.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarCategoriasAccesoriosBase ()
BEGIN	
    SELECT * FROM catalogoaccesorios a
    join Fabricanteaccesorios b on a.FabricanteAccesorio = b.IdFabricanteAccesorioPK
    join CategoriasAccesorios c on a.CategoriaAccesorio = c.IdCategoriaAccesorioPK
    join Subcategoriasaccesorios d on a.Subcategoriaaccesorio = d.IdSubcategoriaaccesorio
    WHERE a.ACTIVO = 1;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarCategoriasAccesoriosxFabricante
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-14
-- DESCRIPCIÓN: Lista id y nombre de las categorias de fabricantes de accesorios activas.
------------------------------------------------------------------------------*/
DELIMITER //
/*PROCEDIMIENTO LISTAR CATEGORIAS POR FABRICANTE ACCESORIOS CREADO 14/11/2024*/
CREATE PROCEDURE ListarCategoriasAccesoriosxFabricante(IdFabricanteA int)
	BEGIN
		SELECT a.IdCategoriaAccesorioPK, a.NombreCategoriaAccesorio from categoriasaccesorios a
        join fabricanteaccesorios b on a.IdFabricanteAccesorioFK = b.IdFabricanteAccesorioPK
        WHERE b.IdFabricanteAccesorioPK = IdFabricanteA
        AND a.Activo = 1;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarFabricantesAccesorios
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-10-13
-- DESCRIPCIÓN: Listar los fabricantes activos de accesorios.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarFabricantesAccesorios()
		BEGIN
			SELECT * FROM Fabricanteaccesorios 
            WHERE Activo = 1;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarFabricantesAccesoriosBase
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-14
-- DESCRIPCIÓN: Listar todos los fabricantes de accesorios.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarFabricantesAccesoriosBase()
		BEGIN
			SELECT * FROM Fabricanteaccesorios;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarFabricantesAccesoriosModelo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-12-28
-- DESCRIPCIÓN: Listar todos los id y nombres de fabricantes de accesorios activos.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarFabricantesAccesoriosModelo()
		BEGIN
			SELECT DISTINCT a.IdFabricanteAccesorioPK, a.NombreFabricanteAccesorio FROM fabricanteaccesorios a
            JOIN catalogoaccesorios b ON a.IdFabricanteAccesorioPK = b.FabricanteAccesorio
            WHERE a.Activo = 1
            AND b.Activo = 1;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarInformacionCategoriaAccesorioxId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-01-01
-- DESCRIPCIÓN: Listar la informacion de una categoria de accesorio por id.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarInformacionCategoriaAccesorioxId(IdCategoria int)
	BEGIN
		SELECT * FROM categoriasaccesorios
        WHERE IdCategoriaAccesorioPK = IdCategoria;
    END //
DELIMITER ;


/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarInformacionFabricanteAccesorioxId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-01-01
-- DESCRIPCIÓN: Listar la informacion de un fabricante de accesorio por id.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarInformacionFabricanteAccesorioxId(IdFabricante int)
	BEGIN
		SELECT * FROM fabricanteaccesorios
        WHERE IdFabricanteAccesorioPK = IdFabricante;
    END //
DELIMITER ;


/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarInformacionSubCategoriaAccesorioxId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-01-01
-- DESCRIPCIÓN: Listar la informacion de una subcategoria de accesorio por id.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarInformacionSubCategoriaAccesorioxId(IdSubcategoriaAccesorio int)
	BEGIN
		SELECT * FROM subcategoriasaccesorios
        WHERE IdSubcategoriaAccesorio = IdSubcategoriaAccesorio;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarInformacionSubCategoriaAccesorioxId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-10-13
-- DESCRIPCIÓN: Listar todas las subcategorias de accesorio activas.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarSubCategoriasAccesorios()
		BEGIN
			SELECT * FROM subcategoriasaccesorios 
            WHERE Activo = 1;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarInformacionSubCategoriaAccesorioxId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-09-16
-- DESCRIPCIÓN: Busca el id y nombre de una subcategoria correspondiente a una categoria de accesorio.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarSubCategoriasAccesoriossxCategoria(IdCategoriaA int)
	BEGIN
		SELECT a.IdSubcategoriaAccesorio, a.NombreSubcategoriaAccesorio from Subcategoriasaccesorios a
        join categoriasaccesorios b on a.IdCategoriaAccesorioFK = b.IdCategoriaAccesorioPK
        WHERE b.IdCategoriaAccesorioPK = IdCategoriaA
        AND a.Activo = 1;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarSubCategoriasAccesoriosxCategoriaBase
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-14
-- DESCRIPCIÓN: lista todas las subcategorias de una categoria de accesorio.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarSubCategoriasAccesoriosxCategoriaBase(IdCategoriaP int)
	BEGIN
		SELECT a.IdSubcategoriaaccesorio, a.NombreSubCategoriaaccesorio from Subcategoriasaccesorios a
        join categoriasaccesorios b on a.IdCategoriaAccesorioFK = b.IdCategoriaAccesorioPK
        WHERE b.IdCategoriaAccesorioPK = IdCategoriaP;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarSubCategoriasAccesoriosxModeloActivo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-12-28
-- DESCRIPCIÓN: lista todas las subcategorias de una categoria de accesorio activa.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarSubCategoriasAccesoriosxModeloActivo(CategoriaP INT)
		BEGIN
			SELECT DISTINCT a.IdSubcategoriaAccesorio, a.NombreSubcategoriaAccesorio FROM subcategoriasaccesorios a
            JOIN catalogoaccesorios b ON a.IdSubcategoriaAccesorio = b.SubcategoriaAccesorio
            WHERE a.Activo = 1
            AND b.Activo = 1
            AND b.CategoriaAccesorio = CategoriaP;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTablaAccesoriosBase
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-14
-- DESCRIPCIÓN: lista la informacion de la tabla accesorios base, formateando fecha y otros campos.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarTablaAccesoriosBase ()
       BEGIN
			SELECT A.CodigoAccesorio, concat(NombreCategoriaAccesorio,' ',NombreSubcategoriaAccesorio) as DescripcionAccesorio, A.ColorAccesorio, C.DescripcionEstado As 'Estado',
                DATE_FORMAT(A.FechaIngreso, '%d/%m/%Y') as 'FechaIngreso',
                Comentario, 
                PrecioBase,
                NumeroSerie,
                ProductosCompatibles
			FROM AccesoriosBase A 
            join Catalogoaccesorios B on A.ModeloAccesorio = B.IdModeloAccesorioPK
            join CatalogoEstadosConsolas C on A.EstadoAccesorio = C.CodigoEstado
            join CategoriasAccesorios D on B.CategoriaAccesorio = D.IdCategoriaAccesorioPK
            join Subcategoriasaccesorios E on B.SubcategoriaAccesorio = E.IdSubcategoriaAccesorio
			WHERE A.EstadoAccesorio != 7;
       END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTablaAccesoriosBasesXId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-14
-- DESCRIPCIÓN: lista la informacion de la tabla accesorios base por id.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarTablaAccesoriosBasesXId(IdCodigoAccesorio varchar(100))
BEGIN
	SELECT 
		A.CodigoAccesorio, A.ModeloAccesorio, A.ColorAccesorio, A.EstadoAccesorio, A.FechaIngreso, A.Comentario, A.PrecioBase, A.NumeroSerie, A.ProductosCompatibles,
        B.FabricanteAccesorio, B.CategoriaAccesorio, B.SubcategoriaAccesorio
    FROM AccesoriosBase A
    JOIN CatalogoAccesorios B
    ON A.ModeloAccesorio = B.IdModeloAccesorioPK 
    WHERE A.CodigoAccesorio = IdCodigoAccesorio;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTablacatalogoaccesoriosXId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-14
-- DESCRIPCIÓN: lista la informacion de la tabla supercategoria de accesorios por id.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE ListarTablacatalogoaccesoriosXId(IdCategoria int)
    BEGIN
		SELECT 
			*
        FROM catalogoaccesorios 
        where IdModeloAccesorioPK = IdCategoria;    
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTareasxAccesorio
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-14
-- DESCRIPCIÓN: lista las tareas de un accesorio.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarTareasxAccesorio(Codigoaccesorio varchar(25))
BEGIN
	SELECT * FROM Tareasdeaccesorios
    WHERE IdCodigoAccesorioFK = Codigoaccesorio;
END //
DELIMITER ; 

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: SofDeleteCategoriaAccesorio
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-14
-- DESCRIPCIÓN: Desactiva categoria, supercategoria y subcategoria de accesorio dado por el id de la categoria.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE SofDeleteCategoriaAccesorio(IN IdCategoriaA INT)
BEGIN
    -- Paso 1. Se desactiva la categoria de accesorio
    UPDATE categoriasaccesorios
    SET Activo = 0
    WHERE IdCategoriaAccesorioPK = IdCategoriaA;

    -- Step 2: Se desactivan las subcategorias asociadas a la categoria.
    UPDATE subcategoriasaccesorios
    SET Activo = 0
    WHERE IdCategoriaAccesorioFK = IdCategoriaA;
    
     -- Step 3: Se descativa la supercategoria.
    UPDATE catalogoaccesorios
    SET Activo = 0
    WHERE CategoriaAccesorio = IdCategoriaA;   
END$$

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: SofDeleteSubCategoriaAccesorio
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-16
-- DESCRIPCIÓN: Desactiva supercategoria y subcategoria de accesorio dado por el id de la categoria.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE SofDeleteSubCategoriaAccesorio(IN IdSubCategoriaA INT)
BEGIN
    -- Step 1: Se desactivan las subcategoria.
    UPDATE subcategoriasaccesorios
    SET Activo = 0
    WHERE IdSubcategoriaAccesorio = IdSubCategoriaA;

    -- Step 2: Se descativa la supercategoria asociada a esta subcategoria.
    UPDATE catalogoaccesorios
    SET Activo = 0
    WHERE SubcategoriaAccesorio = IdSubCategoriaA;   
END$$

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: SoftDeleteFabricanteAccesorio
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-16
-- DESCRIPCIÓN: Desactiva supercategoria y subcategoria de accesorio dado por el id de la categoria.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE SoftDeleteFabricanteAccesorio(IN IdFabricantePKA INT)
BEGIN
    -- Paso 1: Se descativa el fabricante
    UPDATE fabricanteaccesorios
    SET Activo = 0
    WHERE IdFabricanteAccesorioPK = IdFabricantePKA;

    -- Paso 2: Se descativan todas las categorias asociadas al fabricante
    UPDATE categoriasaccesorios
    SET Activo = 0
    WHERE IdFabricanteAccesorioFK = IdFabricantePKA;

    -- Paso 3. Se desactivan todas las subcategorias asociadas a las categorias desactivadas en el paso 2.
    UPDATE subcategoriasaccesorios
    SET Activo = 0
    WHERE IdCategoriaAccesorioFK IN (
        SELECT IdCategoriaAccesorioPK 
        FROM categoriasaccesorios 
        WHERE IdFabricanteAccesorioFK = IdFabricantePKA
    );
    
    -- Paso 4: Se descativan las supercategorias asociadas al fabricante.
    UPDATE catalogoaccesorios
    SET Activo = 0
    WHERE FabricanteAccesorio = IdFabricantePKA;    
END$$

/*-- III.C. Subsección: Procedimientos insumos ---------------------------*/

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ActualizarCategoriaInsumo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-23
-- DESCRIPCIÓN: Actualiza la supercategoria de insumo.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ActualizarCategoriaInsumo(IdModeloI int, FabricanteI int, CategoriaI int, SubcategoriaI int, CodigoI varchar(25), LinkI varchar(100))
BEGIN
	UPDATE catalogoinsumos 
    SET  
        fabricanteinsumos = FabricanteI, 
        categoriainsumos = CategoriaI, 
        subcategoriainsumos = SubcategoriaI,
        codigomodeloinsumos = CodigoI,
        LinkImagen = LinkI
	WHERE IdmodeloInsumosPK = IdModeloI;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ActualizarInsumoBase
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-19
-- DESCRIPCIÓN: Actualiza la supercategoria de insumo.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ActualizarInsumoBase (
    CodigoInsumoA VARCHAR(25),       -- Código del insumo a actualizar
    ModeloInsumoA INT,               -- Nuevo modelo
    EstadoInsumoA INT,               -- Nuevo estado
    PrecioInsumoA DECIMAL(6,2),      -- Nuevo precio base
    ComentarioInsumoA VARCHAR(2000), -- Comentario actualizado
    NumeroSerieInsumoA VARCHAR(100), -- Número de serie
    CantidadInsumoA INT UNSIGNED,    -- Cantidad actualizada
    StockMinimoInsumoA INT UNSIGNED  -- Stock mínimo actualizado
)
BEGIN
    UPDATE InsumosBase
    SET 
        ModeloInsumo = ModeloInsumoA,
        EstadoInsumo = EstadoInsumoA,
        Comentario = ComentarioInsumoA,
        PrecioBase = PrecioInsumoA,
        NumeroSerie = NumeroSerieInsumoA,
        Cantidad = CantidadInsumoA,
        StockMinimo = StockMinimoInsumoA
    WHERE CodigoInsumo = CodigoInsumoA;
    SELECT 'Insumo actualizado correctamente' AS mensaje;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: BorrarCategoriaInsumo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-23
-- DESCRIPCIÓN: Desactiva la supercategoria de insumo por id.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE BorrarCategoriaInsumo(IdCategoria int)
    BEGIN
		UPDATE catalogoinsumos
        SET
			Activo = 0
        WHERE IdModeloInsumosPK = IdCategoria;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: BorrarInsumo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-21
-- DESCRIPCIÓN: Desactiva un insumo por id.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE BorrarInsumo(IdCodigoInsumo varchar(100))
    BEGIN
		UPDATE InsumosBase
        SET
			EstadoInsumo = 7
        WHERE CodigoInsumo = IdCodigoInsumo;
    END //

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: BuscarIdCategoriaInsumoCatalogo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-19
-- DESCRIPCIÓN: Busca el id de la supercategoria de insumo que contiene el fabricante, categoria y subcategoria dados.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE BuscarIdCategoriaInsumoCatalogo(IdFabricanteI int, IdCategoriaI int, IdSubcategoriaI int)
    BEGIN
		SELECT IdModeloInsumosPK FROM catalogoinsumos     
        WHERE FabricanteInsumos = IdFabricanteI
        AND CategoriaInsumos = IdCategoriaI
        AND SubcategoriaInsumos = IdSubcategoriaI
        AND Activo = 1;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: BuscarIdCategoriaInsumoCatalogob
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-19
-- DESCRIPCIÓN: Busca el id y nombre de la supercategoria de insumo que contiene el fabricante, categoria y subcategoria dados.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE BuscarIdCategoriaInsumoCatalogob(IdFabricanteI int, IdCategoriaI int, IdSubcategoriaI int)
    BEGIN
		SELECT a.IdModeloInsumosPK, b.CodigoInsumo  FROM catalogoinsumos a
        join insumosbase b
        on a.IdModeloInsumosPK = b.ModeloInsumo
        WHERE FabricanteInsumos = IdFabricanteI
        AND CategoriaInsumos = IdCategoriaI
        AND SubcategoriaInsumos = IdSubcategoriaI
        AND Activo = 1;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_CheckSuperCategoriaInsumoActivaExists
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-10-22
-- DESCRIPCIÓN: Verifica si ya existe una supercategoría de insumo activa
--              con una combinación específica de fabricante, categoría y subcategoría.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE sp_CheckSuperCategoriaInsumoActivaExists(
    IN p_Fabricante INT,
    IN p_Categoria INT,
    IN p_Subcategoria INT
)
BEGIN
    SELECT EXISTS(
        SELECT 1
        FROM CatalogoInsumos
        WHERE FabricanteInsumos = p_Fabricante
          AND CategoriaInsumos = p_Categoria
          AND SubcategoriaInsumos = p_Subcategoria
          AND Activo = 1
    ) AS 'existe';
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarCategoriaInsumoB
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-25
-- DESCRIPCIÓN: Ingreso de categoria de fabricante de insumos.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE IngresarCategoriaInsumoB(NombreCategoriaI varchar(100), IdFabricanteI int)
BEGIN
   INSERT INTO categoriasinsumos (NombreCategoriaInsumos, IdFabricanteInsumosFK, Activo) values (NombreCategoriaI, IdFabricanteI, 1);   
END$$

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarCategoriaInsumo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-09-16
-- DESCRIPCIÓN: Crea una supercategoria de insumo.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE IngresarCategoriaInsumo(FabricanteI int, CategoriaI int, SubcategoriaI int, PrefijoInsumo varchar(25), NombreArchivoImagen varchar(100))
    BEGIN
		INSERT INTO catalogoinsumos(FabricanteInsumos, CategoriaInsumos, SubcategoriaInsumos, CodigoModeloInsumos, LinkImagen) 
        values (FabricanteI, CategoriaI, SubcategoriaI, PrefijoInsumo, NombreArchivoImagen);
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarFabricanteInsumo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-17
-- DESCRIPCIÓN: Ingresa un fabricante de insumo.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE IngresarFabricanteInsumo(PNombreFabricante varchar(100))
BEGIN
   INSERT INTO fabricanteinsumos (NombreFabricanteInsumos, Activo) values (PNombreFabricante, 1);   
END$$

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarInsumoATablaInsumosBase
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-19
-- DESCRIPCIÓN: Ingresa un insumo y sus detalles.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE IngresarInsumoATablaInsumosBase(
    IN p_IdModeloInsumosPK INT,
    IN p_EstadoInsumo INT,
    IN p_ComentarioInsumo VARCHAR(2000),
    IN p_PrecioBase DECIMAL(6,2),
    IN p_Cantidad INT UNSIGNED,
    IN p_NumeroSerie VARCHAR(100),
    IN p_StockMinimo INT UNSIGNED
)
BEGIN
    DECLARE v_CodigoGenerado VARCHAR(50);
    DECLARE v_CodigoModelo VARCHAR(25);
    DECLARE v_CantidadExistente INT;
    DECLARE v_StockMinimoExistente INT;
    DECLARE v_PrecioBaseExistente DECIMAL(6,2);
    DECLARE v_Existe INT;

    SELECT COUNT(*) INTO v_Existe
    FROM InsumosBase
    WHERE ModeloInsumo = p_IdModeloInsumosPK;

    IF v_Existe > 0 THEN
        -- El insumo ya existe, se actualiza el stock y el precio si es mayor.
        SELECT Cantidad, StockMinimo, PrecioBase INTO v_CantidadExistente, v_StockMinimoExistente, v_PrecioBaseExistente
        FROM InsumosBase
        WHERE ModeloInsumo = p_IdModeloInsumosPK
        LIMIT 1;

        UPDATE InsumosBase
        SET 
            Cantidad = v_CantidadExistente + p_Cantidad,
            StockMinimo = IF(v_StockMinimoExistente != p_StockMinimo, p_StockMinimo, v_StockMinimoExistente),
            PrecioBase = IF(p_PrecioBase > v_PrecioBaseExistente, p_PrecioBase, v_PrecioBaseExistente)
        WHERE ModeloInsumo = p_IdModeloInsumosPK;

    ELSE
        -- El insumo es nuevo, se inserta un nuevo registro.
        SELECT CodigoModeloInsumos INTO v_CodigoModelo
        FROM CatalogoInsumos
        WHERE IdModeloInsumosPK = p_IdModeloInsumosPK
        LIMIT 1;

        SET v_CodigoGenerado = CONCAT(v_CodigoModelo, '-', (SELECT COUNT(*) + 1 FROM InsumosBase));

        INSERT INTO InsumosBase (
            CodigoInsumo, ModeloInsumo, EstadoInsumo, FechaIngreso, Comentario,
            PrecioBase, NumeroSerie, Cantidad, StockMinimo
        )
        VALUES (
            v_CodigoGenerado, p_IdModeloInsumosPK, p_EstadoInsumo, CURDATE(), p_ComentarioInsumo,
            p_PrecioBase, p_NumeroSerie, p_Cantidad, p_StockMinimo
        );
    END IF;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarSubcategoriaInsumos
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-17
-- DESCRIPCIÓN: Ingresa una subcategoria de insumo.
------------------------------------------------------------------------------*/
DELIMITER $$
/*PROCEDIMIENTO ALMACENADO INSERTAR SUBCATEGORIA INSUMOS 17/04/2025*/
CREATE PROCEDURE IngresarSubcategoriaInsumos(NombreSubcategoriaInsumo varchar(100), IdCategoriaInsumo int)
BEGIN
   INSERT INTO subcategoriasinsumos (NombreSubcategoriainsumos, IdCategoriainsumosFK, Activo) values (NombreSubcategoriaInsumo, IdCategoriaInsumo, 1);   
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarCategoriasInsumos
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-17
-- DESCRIPCIÓN: listar las categorias de insumos activas.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarCategoriasInsumos()
		BEGIN
			SELECT * FROM categoriasinsumos 
            WHERE Activo = 1;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarCategoriasInsumosBase
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-11-12
-- DESCRIPCIÓN: Lista la informacion de una supercategoria activa de insumo con todos los datos de fabricante, categoria y subcategoria.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarCategoriasInsumosBase ()
BEGIN	
    SELECT * FROM catalogoinsumos a
    join Fabricanteinsumos b on a.FabricanteInsumos = b.IdFabricanteInsumosPK
    join categoriasinsumos c on a.CategoriaInsumos = c.IdCategoriaInsumosPK
    join Subcategoriasinsumos d on a.SubcategoriaInsumos = d.IdSubcategoriainsumos
    WHERE a.ACTIVO = 1;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarCategoriasInsumosxFabricante
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-17
-- DESCRIPCIÓN: Lista las categorias disponibles por fabricante de insumo.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarCategoriasInsumosxFabricante(IdFabricanteI int)
	BEGIN
		SELECT a.IdCategoriaInsumosPK, a.NombreCategoriaInsumos from categoriasinsumos a
        join fabricanteinsumos b on a.IdFabricanteInsumosFK = b.IdFabricanteInsumosPK
        WHERE b.IdFabricanteInsumosPK = IdFabricanteI
        AND a.Activo = 1;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarCategoriasInsumosxModeloActivo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-17
-- DESCRIPCIÓN: PROCEDIMIENTO LISTAR TODAS LAS CATEGORIAS DE INSUMOS CON UN MODELO ASOCIADO
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarCategoriasInsumosxModeloActivo(FabricanteP INT)
		BEGIN
			SELECT DISTINCT a.IdCategoriaInsumosPK, a.NombreCategoriaInsumos FROM categoriasinsumos a
            JOIN catalogoinsumos b ON a.IdCategoriaInsumosPK = b.CategoriaInsumos
            WHERE a.Activo = 1
            AND b.Activo = 1
            AND b.FabricanteInsumos = FabricanteP;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarFabricantesInsumos
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-17
-- DESCRIPCIÓN: PROCEDIMIENTO LISTAR TODOS LOS FABRICANTES INSUMOS
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarFabricantesInsumos()
		BEGIN
			SELECT * FROM fabricanteinsumos 
            WHERE Activo = 1;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarFabricantesInsumosBase
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-17
-- DESCRIPCIÓN: PROCEDIMIENTO LISTAR TODOS LOS FABRICANTES INSUMOS EN CUALQUIER ESTADO.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarFabricantesInsumosBase()
		BEGIN
			SELECT * FROM FabricanteInsumos;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarFabricantesInsumosModelo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-17
-- DESCRIPCIÓN: PROCEDIMIENTO LISTAR TODOS LOS FABRICANTES DE INSUMOS CON UN MODELO ASOCIADO.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarFabricantesInsumosModelo()
		BEGIN
			SELECT DISTINCT a.IdFabricanteInsumosPK, a.NombreFabricanteInsumos FROM fabricanteinsumos a
            JOIN catalogoinsumos b ON a.IdFabricanteInsumosPK = b.FabricanteInsumos
            WHERE a.Activo = 1
            AND b.Activo = 1;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarInformacionCategoriaInsumosxId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-17
-- DESCRIPCIÓN: PROCEDIMIENTO CONSEGUIR INFORMACION ESPECIFICA DE CATEGORIA DE INSUMOS POR ID CREADO.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarInformacionCategoriaInsumosxId(IdCategoria int)
	BEGIN
		SELECT * FROM categoriasinsumos
        WHERE IdCategoriaInsumosPK = IdCategoria;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarInformacionFabricanteInsumoxId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-17
-- DESCRIPCIÓN: PROCEDIMIENTO CONSEGUIR INFORMACION ESPECIFICA DE FABRICANTE INSUMO POR ID CREADO.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarInformacionFabricanteInsumoxId(IdFabricante int)
	BEGIN
		SELECT * FROM fabricanteinsumos
        WHERE IdFabricanteInsumosPK = IdFabricante;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarInformacionSubCategoriaInsumoxId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-17
-- DESCRIPCIÓN: PROCEDIMIENTO CONSEGUIR INFORMACION ESPECIFICA DE SUBCATEGORIA DE INSUMO POR ID.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarInformacionSubCategoriaInsumoxId(IdSubcategoriaInsumo int)
	BEGIN
		SELECT IdSubcategoriaInsumos, NombreSubcategoriaInsumos as NombreSubCategoria, IdCategoriaInsumosFK, Activo FROM subcategoriasinsumos
        WHERE IdSubcategoriaInsumos = IdSubcategoriaInsumo;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarSubCategoriasInsumos
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-17
-- DESCRIPCIÓN: PROCEDIMIENTO LISTAR TODOS LAS SUBCATEGORIAS INSUMOS.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarSubCategoriasInsumos()
		BEGIN
			SELECT * FROM subcategoriasinsumos
            WHERE Activo = 1;
        END //
DELIMITER ;


/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarSubCategoriasInsumosxCategoria
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-17
-- DESCRIPCIÓN: PROCEDIMIENTO LISTAR SUBCATEGORIAS POR CATEGORIA DE INSUMOS.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarSubCategoriasInsumosxCategoria(IdCategoriaI int)
	BEGIN
		SELECT a.IdSubcategoriaInsumos, a.NombreSubcategoriaInsumos from subcategoriasinsumos a
        join categoriasinsumos b on a.IdCategoriaInsumosFK = b.IdCategoriaInsumosPK
        WHERE b.IdCategoriaInsumosPK = IdCategoriaI
        AND a.Activo = 1;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarSubCategoriasInsumosxModeloActivo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-17
-- DESCRIPCIÓN: PROCEDIMIENTO LISTAR TODAS LAS SUBCATEGORIAS DE INSUMOS CON UN MODELO ASOCIADO.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarSubCategoriasInsumosxModeloActivo(CategoriaP INT)
		BEGIN
			SELECT DISTINCT a.IdSubcategoriaInsumos, a.NombreSubcategoriaInsumos FROM subcategoriasinsumos a
            JOIN catalogoinsumos b ON a.IdSubcategoriaInsumos = b.SubcategoriaInsumos
            WHERE a.Activo = 1
            AND b.Activo = 1
            AND b.CategoriaInsumos = CategoriaP;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTablacatalogoainsumosXIdB
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-05-10
-- DESCRIPCIÓN: procedimiento para listar la tabla catalogoinsumos con toda la informacion adicional de fabricante, categoria y subcategoria.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE ListarTablacatalogoainsumosXIdB(IdCategoria int)
    BEGIN
		SELECT 
			a.*,
            b.IdFabricanteInsumosPK, b.NombreFabricanteInsumos,
            c.IdCategoriaInsumosPK, c.NombreCategoriaInsumos,
            d.IdSubcategoriaInsumos, d.NombreSubcategoriaInsumos
        FROM catalogoinsumos a
        join fabricanteinsumos b
        on a.FabricanteInsumos = b.IdFabricanteInsumosPK
        join categoriasinsumos c 
        on a.CategoriaInsumos = c.IdCategoriaInsumosPK
        join subcategoriasinsumos d
        on a.SubcategoriaInsumos = d.IdSubcategoriaInsumos
        where IdModeloInsumosPK = IdCategoria;    
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTablaCatalogoInsumosXId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-19
-- DESCRIPCIÓN: procedimiento para listar la tabla catalogoinsumos por id.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE ListarTablaCatalogoInsumosXId(IdCategoria int)
    BEGIN
		SELECT 
			*
        FROM catalogoinsumos 
        where IdModeloInsumosPK = IdCategoria;    
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTablaInsumosBasesXId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-19
-- DESCRIPCIÓN: procedimiento para listar la tabla catalogoinsumos por id.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarTablaInsumosBasesXId(IdCodigoInsumo varchar(100))
BEGIN
	SELECT 
		A.CodigoInsumo, A.ModeloInsumo, A.EstadoInsumo, A.FechaIngreso, A.Comentario, A.PrecioBase, A.NumeroSerie, A.StockMinimo, A.Cantidad,
        B.FabricanteInsumos, B.CategoriaInsumos, B.SubcategoriaInsumos
    FROM insumosbase A
    JOIN catalogoinsumos B
    ON A.ModeloInsumo = B.IdModeloInsumosPK 
    WHERE A.CodigoInsumo = IdCodigoInsumo;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTablaInsumosBase
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-17
-- DESCRIPCIÓN: procedimiento para listar la tabla insumos base.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarTablaInsumosBase ()
       BEGIN
			SELECT A.CodigoInsumo, concat(NombreCategoriaInsumos,' ',NombreSubcategoriaInsumos) as DescripcionInsumo, C.DescripcionEstado As 'Estado',
                DATE_FORMAT(A.FechaIngreso, '%d/%m/%Y') as 'Fecha_Ingreso',
                A.Comentario, 
                A.PrecioBase,
                A.NumeroSerie,
                A.Cantidad,
                A.StockMinimo
			FROM InsumosBase A 
            join CatalogoInsumos B on A.ModeloInsumo = B.IdModeloInsumosPK
            join CatalogoEstadosConsolas C on A.EstadoInsumo = C.CodigoEstado
            join categoriasinsumos D on B.CategoriaInsumos = D.IdCategoriaInsumosPK
            join subcategoriasinsumos E on B.SubcategoriaInsumos = E.IdSubcategoriaInsumos
			WHERE A.EstadoInsumo != 7;
       END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: SofDeleteCategoriaInsumo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-17
-- DESCRIPCIÓN: Similar a SofDeleteCategoriaAccesorio pero con insumos.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE SofDeleteCategoriaInsumo(IN IdCategoriaI INT)
BEGIN
    UPDATE categoriasinsumos
    SET Activo = 0
    WHERE IdCategoriaInsumosPK = IdCategoriaI;

    UPDATE subcategoriasinsumos
    SET Activo = 0
    WHERE IdCategoriaInsumosFK = IdCategoriaI;
    
    UPDATE catalogoinsumos
    SET Activo = 0
    WHERE Categoriainsumos = IdCategoriaI;   
END$$

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: SofDeleteSubCategoriaInsumo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-17
-- DESCRIPCIÓN: PROCEDIMIENTO BORRAR CATEGORIA y ASOCIADOS
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE SofDeleteSubCategoriaInsumo(IN p_IdSubCategoria INT)
BEGIN
    UPDATE Subcategoriasinsumos
    SET Activo = 0
    WHERE IdSubcategoriainsumos = p_IdSubCategoria;
    
    UPDATE catalogoinsumos
    SET Activo = 0
    WHERE subcategoriainsumos = p_IdSubCategoria;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: SofDeleteSubCategoriaInsumo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-04-17
-- DESCRIPCIÓN: PROCEDIMIENTO BORRAR FABRICANTE DE INSUMOS y ASOCIADOS, similar a SoftDeleteFabricanteAccesorio.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE SoftDeleteFabricanteInsumo(IN IdFabricantePKA INT)
BEGIN

    UPDATE fabricanteinsumos
    SET Activo = 0
    WHERE IdFabricanteInsumosPK = IdFabricantePKA;

    UPDATE categoriasinsumos
    SET Activo = 0
    WHERE IdFabricanteInsumosFK = IdFabricantePKA;

    UPDATE subcategoriasinsumos
    SET Activo = 0
    WHERE IdCategoriaInsumosFK IN (
        SELECT IdCategoriaInsumosPK 
        FROM categoriasinsumos 
        WHERE IdFabricanteInsumosFK = IdFabricantePKA
    );
    
    UPDATE catalogoinsumos
    SET Activo = 0
    WHERE fabricanteinsumos = IdFabricantePKA;    
END$$
DELIMITER //

/*-- III.D. Subsección: Procedimientos productos ---------------------------*/

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ActualizarCategoria
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-08-24
-- ACTUALIZADO: 2024-09-11
-- DESCRIPCIÓN: Procedimiento para actualizar una supercategoria de productos.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ActualizarCategoria(IdModeloP int, FabricanteP int, CategoriaP int, SubcategoriaP int, CodigoP varchar(25), LinkP varchar(100), TipoP int)
BEGIN
	UPDATE catalogoconsolas 
    SET  
        Fabricante = FabricanteP, 
        Categoria = CategoriaP, 
        Subcategoria = SubcategoriaP,
        CodigoModeloConsola = CodigoP,
        LinkImagen = LinkP,
        TipoProducto = TipoP
	WHERE IdModeloConsolaPK = IdModeloP;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: Actualizarproductobasev2
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-10-05
-- DESCRIPCIÓN: Procedimiento para actualizar una supercategoria de productos.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE Actualizarproductobasev2 (
    CodigoConsolaP VARCHAR(50), 
    modeloP INT, 
    colorP VARCHAR(100), 
    EstadoP INT, 
    hackP BOOLEAN, 
    Preciob DECIMAL(6,2), 
    ComentarioP VARCHAR(100), 
    NumeroS VARCHAR(100), 
    AccesoriosP TEXT
)
BEGIN
    DECLARE AccesoriosConcatenados TEXT;

    -- se formatea el array de accesorios con una cadena separada por coma
    SET AccesoriosConcatenados = REPLACE(AccesoriosP, '","', ',');

    -- Update the existing product base in the table
    UPDATE ProductosBases
    SET 
        Modelo = modeloP, 
        Color = colorP, 
        Estado = EstadoP, 
        Hackeado = hackP, 
        Comentario = ComentarioP, 
        PrecioBase = Preciob, 
        NumeroSerie = NumeroS, 
        Accesorios = AccesoriosConcatenados
    WHERE CodigoConsola = CodigoConsolaP;

    SELECT 'Product updated successfully' AS message;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ActualizarTareaRealizado
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-10-17
-- DESCRIPCIÓN: Procedimiento para actualizar el estado de la tarea de un producto
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ActualizarTareaRealizado(
    IN p_IdTareaPK INT,
    IN p_Realizado BOOLEAN
)
BEGIN
    UPDATE TareasdeProductos
    SET Realizado = p_Realizado
    WHERE IdTareaPK = p_IdTareaPK;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: BorrarCategoria
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-09-11
-- DESCRIPCIÓN: Procedimiento para borrar / desactivar una supercategoria de producto.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE BorrarCategoria(IdCategoria int)
    BEGIN
		UPDATE catalogoconsolas
        SET
			Activo = 0
        WHERE IdModeloConsolaPK = IdCategoria;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: BorrarProducto
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-09-11
-- DESCRIPCIÓN: Procedimiento para borrar / desactivar un producto.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE BorrarProducto(IdCodigoConsola varchar(100))
    BEGIN
		UPDATE ProductosBases
        SET
			Estado = 7
        WHERE CodigoConsola = IdCodigoConsola;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: BuscarIdCategoriaCatalogo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-09-16
-- DESCRIPCIÓN: Procedimiento para buscar la supercategoria de producto usando fabricante, categoria, subcategoria.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE BuscarIdCategoriaCatalogo(IdFabricanteP int, IdCategoriaP int, IdSubcategoriaP int)
	BEGIN
		SELECT IdModeloConsolaPK, TipoProducto FROM catalogoconsolas
        WHERE Fabricante = IdFabricanteP
        AND Categoria = IdCategoriaP
        AND Subcategoria = IdSubcategoriaP
        AND Activo = 1;
	END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_CheckSuperCategoriaActivaExists
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-10-22
-- DESCRIPCIÓN: Procedimiento para validar si hay una supercategoria activa con la combinacion de fabricante, categoria, subcategoria.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE sp_CheckSuperCategoriaActivaExists(
    IN p_Fabricante INT,
    IN p_Categoria INT,
    IN p_Subcategoria INT
)
BEGIN
    SELECT EXISTS(
        SELECT 1
        FROM catalogoconsolas
        WHERE Fabricante = p_Fabricante
          AND Categoria = p_Categoria
          AND Subcategoria = p_Subcategoria
          AND Activo = 1
    ) AS 'existe';
END //
DELIMITER ;
    
/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarCategoria
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-10-22
-- DESCRIPCIÓN: Procedimiento para ingresar una categoria de un fabricante de producto.
------------------------------------------------------------------------------*/
DELIMITER $$
	CREATE PROCEDURE IngresarCategoria(PNombreCategoria varchar(100), PIdFabricante int)
	BEGIN
	   INSERT INTO CATEGORIASPRODUCTOS (NombreCategoria, IdFabricanteFK, Activo) values (PNombreCategoria, PIdFabricante, 1);   
	END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarCategoriaProducto
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-09-16
-- DESCRIPCIÓN: Procedimiento para ingresar una supercategoria de producto.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE IngresarCategoriaProducto(FabricanteP int, CategoriaP int, SubcategoriaP int, PrefijoProducto varchar(25), NombreArchivoImagen varchar(100), TipoProductoP int)
    BEGIN
		INSERT INTO catalogoconsolas(Fabricante, Categoria, Subcategoria, CodigoModeloConsola, LinkImagen, TipoProducto) 
        values (FabricanteP, CategoriaP, SubcategoriaP, PrefijoProducto, NombreArchivoImagen, TipoProductoP);
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarFabricante
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-10-22
-- DESCRIPCIÓN: Procedimiento para ingresar un fabricante de producto.
------------------------------------------------------------------------------*/
DELIMITER $$
	CREATE PROCEDURE IngresarFabricante(PNombreFabricante varchar(100))
	BEGIN
	   INSERT INTO FABRICANTES (NombreFabricante, Activo) values (PNombreFabricante, 1);   
	END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarProductoATablaProductoBaseV4
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-09-25
-- DESCRIPCIÓN: Procedimiento para ingresar un producto.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE IngresarProductoATablaProductoBaseV4 (
    modeloP INT, 
    colorP VARCHAR(100), 
    EstadoP INT, 
    hackP BOOLEAN, 
    Preciob DECIMAL(6,2), 
    ComentarioP VARCHAR(255), 
    NumeroS VARCHAR(100), 
    AccesoriosP TEXT,
    TareasP TEXT 
)
BEGIN
    DECLARE fecha VARCHAR(25) DEFAULT '010120';
    DECLARE ModeloCatCons VARCHAR(25);
    DECLARE cantidadRegistros INT DEFAULT 0;
    DECLARE CodigoConsolaGenerated VARCHAR(50);
    DECLARE AccesoriosConcatenados TEXT;
    DECLARE tarea VARCHAR(100);
    DECLARE pos INT DEFAULT 1;
    DECLARE next_comma INT;

    -- Se consigue el id del modelo (id de la supercategoria)
    SELECT CodigoModeloConsola INTO ModeloCatCons 
    FROM CatalogoConsolas 
    WHERE IdModeloConsolaPK = modeloP;

    -- Se consigue el numero de registros para crear un codigo unico con el id dado de la supercategoria.
    SELECT COUNT(*) INTO cantidadRegistros 
    FROM ProductosBases;

    -- Concatenacion de id de la supercategoria y la cantidad de registros.
    SET CodigoConsolaGenerated = CONCAT(ModeloCatCons, '-', cantidadRegistros);

    -- listado de accesorios separado por coma.
    SET AccesoriosConcatenados = REPLACE(AccesoriosP, '","', ',');

    -- Inserción.
    INSERT INTO ProductosBases (
        CodigoConsola, Modelo, Color, Estado, Hackeado, FechaIngreso, Comentario, PrecioBase, NumeroSerie, Accesorios
    )
    VALUES (
        CodigoConsolaGenerated, 
        modeloP, 
        colorP, 
        EstadoP, 
        hackP, 
        DATE_FORMAT(NOW(), '%Y%m%d'), 
        ComentarioP, 
        Preciob, 
        NumeroS, 
        AccesoriosConcatenados
    );			

    -- Insercion de las tareas del producto
    WHILE LENGTH(TareasP) > 0 DO
        SET next_comma = LOCATE(',', TareasP);        
        IF next_comma = 0 THEN            
            SET tarea = TRIM(TareasP);
            INSERT INTO TareasdeProductos (DescripcionTarea, Realizado, Activo, IdCodigoConsolaFK)
            VALUES (tarea, 0, 1, CodigoConsolaGenerated);
            SET TareasP = '';
        ELSE           
            SET tarea = TRIM(SUBSTRING(TareasP, 1, next_comma - 1));
            INSERT INTO TareasdeProductos (DescripcionTarea, Realizado, Activo, IdCodigoConsolaFK)
            VALUES (tarea, 0, 1, CodigoConsolaGenerated);          
            SET TareasP = SUBSTRING(TareasP, next_comma + 1);
        END IF;
    END WHILE;
    
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarSubcategoria
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-10-22
-- DESCRIPCIÓN: Procedimiento para ingresar una subcategoria de producto.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE IngresarSubcategoria(PNombreSubcategoria varchar(100), PIdCategoria int)
BEGIN
   INSERT INTO SUBCATEGORIASPRODUCTOS (NombreSubcategoria, IdCategoriaFK, Activo) values (PNombreSubcategoria, PIdCategoria, 1);   
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: InsertTareas
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-10-22
-- DESCRIPCIÓN: Procedimiento para insertar tareas de un producto.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE InsertTareas(
    IN IdCodigoConsolaFK VARCHAR(25), 
    IN Tareas TEXT
)
BEGIN
    DECLARE tarea VARCHAR(100);
    DECLARE pos INT DEFAULT 1;
    DECLARE next_comma INT;

    
    WHILE LENGTH(Tareas) > 0 DO
        SET next_comma = LOCATE(',', Tareas);
        
        IF next_comma = 0 THEN
            SET tarea = TRIM(Tareas);
            INSERT INTO TareasdeProductos (DescripcionTarea, Realizado, Activo, IdCodigoConsolaFK)
            VALUES (tarea, 0, 1, IdCodigoConsolaFK);
            SET Tareas = '';
        ELSE
            SET tarea = TRIM(SUBSTRING(Tareas, 1, next_comma - 1));
            INSERT INTO TareasdeProductos (DescripcionTarea, Realizado, Activo, IdCodigoConsolaFK)
            VALUES (tarea, 0, 1, IdCodigoConsolaFK);
            SET Tareas = SUBSTRING(Tareas, next_comma + 1);
        END IF;
    END WHILE;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarAccesoriosXIdTipoProducto
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-10-22
-- DESCRIPCIÓN: Procedimiento para listar los accesorios que tiene un tipo de producto.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE ListarAccesoriosXIdTipoProducto(IdTipoProductoP int)
    BEGIN
		select DescripcionAccesorio from TiposAccesorios a 
		inner join CatalogoTiposAccesoriosXProducto b on a.IdTipoAccesorioPK = b.IdTipoAccesorioFK
		inner join TiposProductos c on b.IdTipoProductoFK = c.IdTipoProductoPK
		where c.IdTipoProductoPK = IdTipoProductoP;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarCategoriasConsolasBase
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-09-16
-- DESCRIPCIÓN: Lista la informacion completa de las supercategorias de producto con fabricantes, categorias y subcategorias.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarCategoriasConsolasBase()
BEGIN	
    SELECT * FROM catalogoconsolas a
    join Fabricantes b on a.Fabricante = b.IdFabricantePK
    join Categoriasproductos c on a.Categoria = c.IdCategoriaPK
    join Subcategoriasproductos d on a.Subcategoria = d.IdSubcategoria
    join Tiposproductos e on a.TipoProducto = e.IdTipoProductoPK
    WHERE a.ACTIVO = 1;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarCategoriasProductos
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-09-14
-- DESCRIPCIÓN: Lista la informacion completa de la categorias activas de fabricantes de productos.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarCategoriasProductos()
		BEGIN
			SELECT * FROM categoriasproductos 
            WHERE Activo = 1;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarCategoriasProductosBase
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-10-30
-- DESCRIPCIÓN: Lista la informacion completa de la categorias de fabricantes de productos.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarCategoriasProductosBase()
		BEGIN
			SELECT * FROM categoriasproductos;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarCategoriasProductosxFabricante
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-09-16
-- DESCRIPCIÓN: Lista id y nombre de la categorias de fabricantes de productos.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarCategoriasProductosxFabricante(IdFabricanteP int)
	BEGIN
		SELECT a.IdCategoriaPK, a.NombreCategoria from categoriasproductos a
        join Fabricantes b on a.IdFabricanteFK = b.IdFabricantePK
        WHERE b.IdFabricantePK = IdFabricanteP
        AND a.Activo = 1;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarCategoriasProductosxModeloActivo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-12-28
-- DESCRIPCIÓN: PROCEDIMIENTO LISTAR TODAS LAS CATEGORIAS DE PRODUCTOS CON UN MODELO ASOCIADO.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarCategoriasProductosxModeloActivo(FabricanteP INT)
		BEGIN
			SELECT DISTINCT a.IdCategoriaPK, a.NombreCategoria FROM categoriasproductos a
            JOIN catalogoconsolas b ON a.IdCategoriaPK = b.Categoria
            WHERE a.Activo = 1
            AND b.Activo = 1
            AND b.Fabricante = FabricanteP;
        END //
DELIMITER ;
/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarCategoriasXFabricante
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-09-11
-- DESCRIPCIÓN: PROCEDIMIENTO LISTAR TODAS LAS CATEGORIAS POR FABRICANTE.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE ListarCategoriasXFabricante(FabricanteP varchar(100))
		BEGIN
			SELECT * FROM catalogoconsolas 
            where Fabricante = FabricanteP
            AND Activo = 1;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarFabricantes
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-09-14
-- DESCRIPCIÓN: PROCEDIMIENTO LISTAR TODOS LOS FABRICANTES ACTIVOS.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarFabricantes()
		BEGIN
			SELECT * FROM Fabricantes 
            WHERE Activo = 1;
        END //
DELIMITER ;


/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarFabricantesBase
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-10-30
-- DESCRIPCIÓN: PROCEDIMIENTO LISTAR TODOS LOS FABRICANTES EN CUALQUIER ESTADO.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarFabricantesBase()
		BEGIN
			SELECT * FROM Fabricantes;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarFabricantesModelo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-12-28
-- DESCRIPCIÓN: PROCEDIMIENTO LISTAR TODOS LOS FABRICANTES DE PRODUCTOS CON UN MODELO ASOCIADO.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarFabricantesModelo()
		BEGIN
			SELECT DISTINCT a.IdFabricantePK, a.NombreFabricante FROM fabricantes a
            JOIN catalogoconsolas b ON a.IdFabricantePK = b.Fabricante
            WHERE a.Activo = 1
            AND b.Activo = 1;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarInformacionCategoriaxId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-12-30
-- DESCRIPCIÓN: PROCEDIMIENTO CONSEGUIR INFORMACION ESPECIFICA DE CATEGORIA DE PRODUCTO POR ID
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarInformacionCategoriaxId(IdCategoria int)
	BEGIN
		SELECT * FROM categoriasproductos
        WHERE IdCategoriaPK = IdCategoria;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarInformacionFabricantexId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-12-30
-- DESCRIPCIÓN: PROCEDIMIENTO CONSEGUIR INFORMACION ESPECIFICA DE FABRICANTE POR ID
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarInformacionFabricantexId(IdFabricante int)
	BEGIN
		SELECT * FROM fabricantes
        WHERE IdFabricantePK = IdFabricante;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarInformacionSubCategoriaxId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-12-30
-- DESCRIPCIÓN: PROCEDIMIENTO CONSEGUIR INFORMACION ESPECIFICA DE SUBCATEGORIA DE PRODUCTO POR ID
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarInformacionSubCategoriaxId(IdSubcategoriaProducto int)
	BEGIN
		SELECT IdSubcategoria, NombreSubcategoria as NombreSubCategoria, IdCategoriaFK, Activo FROM subcategoriasproductos
        WHERE IdSubcategoria = IdSubcategoriaProducto;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarSubCategoriasProductos
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-12-30
-- DESCRIPCIÓN: PROCEDIMIENTO LISTAR TODOS LAS SUBCATEGORIAS ACTIVAS.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarSubCategoriasProductos()
		BEGIN
			SELECT * FROM subcategoriasproductos 
            WHERE Activo = 1;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarSubCategoriasProductosBase
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-12-30
-- DESCRIPCIÓN: PROCEDIMIENTO LISTAR TODOS LAS SUBCATEGORIAS.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarSubCategoriasProductosBase()
		BEGIN
			SELECT * FROM subcategoriasproductos ;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarSubCategoriasProductosxCategoria
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-09-16
-- DESCRIPCIÓN: PROCEDIMIENTO LISTAR SUBCATEGORIAS POR CATEGORIA.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarSubCategoriasProductosxCategoria(IdCategoriaP int)
	BEGIN
		SELECT a.IdSubcategoria, a.NombreSubCategoria from Subcategoriasproductos a
        join categoriasproductos b on a.IdCategoriaFK = b.IdCategoriaPK
        WHERE b.IdCategoriaPK = IdCategoriaP
        AND a.Activo = 1;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarSubCategoriasProductosxCategoriaBase
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-12-30
-- DESCRIPCIÓN: PROCEDIMIENTO LISTAR SUBCATEGORIAS POR CATEGORIA EN CUALQUIER ESTADO.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarSubCategoriasProductosxCategoriaBase(IdCategoriaP int)
	BEGIN
		SELECT a.IdSubcategoria, a.NombreSubCategoria from Subcategoriasproductos a
        join categoriasproductos b on a.IdCategoriaFK = b.IdCategoriaPK
        WHERE b.IdCategoriaPK = IdCategoriaP;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarSubCategoriasProductosxModeloActivo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-12-28
-- DESCRIPCIÓN: PROCEDIMIENTO LISTAR TODAS LAS SUBCATEGORIAS DE PRODUCTOS CON UN MODELO ASOCIADO.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarSubCategoriasProductosxModeloActivo(CategoriaP INT)
		BEGIN
			SELECT DISTINCT a.IdSubcategoria, a.NombreSubCategoria FROM subcategoriasproductos a
            JOIN catalogoconsolas b ON a.IdSubcategoria = b.Subcategoria
            WHERE a.Activo = 1
            AND b.Activo = 1
            AND b.Categoria = CategoriaP;
        END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTablacatalogoconsolasXId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-08-03
-- DESCRIPCIÓN: Procedimiento para listar toda la informacion de una supercategoria por id.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE ListarTablacatalogoconsolasXId(IdCategoria int)
    BEGIN
		SELECT 
			*
        FROM catalogoconsolas 
        where IdModeloConsolaPK = IdCategoria;    
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTablaAccesoriosBasesXId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-03-28
-- DESCRIPCIÓN: Procedimiento para listar todos los productos.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarTablaProductosBases ()
       BEGIN
			SELECT A.CodigoConsola, concat(NombreCategoria,' ',NombreSubcategoria) as DescripcionConsola, A.Color, C.DescripcionEstado As 'Estado',
				A.Hackeado as 'Hack',
                DATE_FORMAT(A.FechaIngreso, '%d/%m/%Y') as 'Fecha_Ingreso',
                Comentario, 
                PrecioBase,
                NumeroSerie,
                Accesorios
			FROM ProductosBases A 
            join CatalogoConsolas B on A.Modelo = B.IdModeloConsolaPK
            join CatalogoEstadosConsolas C on A.Estado = C.CodigoEstado
            join CategoriasProductos D on B.Categoria = D.IdCategoriaPK
            join Subcategoriasproductos E on B.Subcategoria = E.IdSubcategoria
			WHERE A.Estado != 7;
       END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTareasxProducto
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-10-02
-- DESCRIPCIÓN: Procedimiento para listar todas las tareas de un producto.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarTareasxProducto(Codigoproducto varchar(25))
BEGIN
	SELECT * FROM Tareasdeproductos
    WHERE IdCodigoConsolaFK = Codigoproducto;
END //
DELIMITER ; 

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTiposProductos
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-09-11
-- DESCRIPCIÓN: Procedimiento para listar todas los tipos de productos.
------------------------------------------------------------------------------*/
DELIMITER // 
	CREATE PROCEDURE ListarTiposProductos()
    BEGIN
		SELECT IdTipoProductoPK, DescripcionTipoProducto FROM TiposProductos; 
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: SofDeleteCategoria
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-10-17
-- DESCRIPCIÓN: Procedimiento para borrar una categoria de producto.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE SofDeleteCategoria(IN p_IdCategoria INT)
BEGIN
    UPDATE CategoriasProductos
    SET Activo = 0
    WHERE IdCategoriaPK = p_IdCategoria;

    UPDATE SubcategoriasProductos
    SET Activo = 0
    WHERE IdCategoriaFK = p_IdCategoria;
    
    UPDATE catalogoconsolas
    SET Activo = 0
    WHERE Categoria = p_IdCategoria;
   
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: SofDeleteSubCategoria
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-10-19
-- DESCRIPCIÓN: PROCEDIMIENTO BORRAR CATEGORIA y ASOCIADOS
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE SofDeleteSubCategoria(IN p_IdSubCategoria INT)
BEGIN
    UPDATE SubcategoriasProductos
    SET Activo = 0
    WHERE IdSubcategoria = p_IdSubCategoria;

    UPDATE catalogoconsolas
    SET Activo = 0
    WHERE Subcategoria = p_IdSubCategoria;
   
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: SoftDeleteFabricante
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-10-17
-- DESCRIPCIÓN: PROCEDIMIENTO BORRAR FABRICANTE DE PRODUCTOS Y ASOCIADOS.
------------------------------------------------------------------------------*/

DELIMITER $$
CREATE PROCEDURE SoftDeleteFabricante(IN p_IdFabricantePK INT)
BEGIN
    -- Step 1: Soft delete the fabricante by setting Activo to 0
    UPDATE FABRICANTES
    SET Activo = 0
    WHERE IdFabricantePK = p_IdFabricantePK;

    -- Step 2: Soft delete all categories related to this fabricante
    UPDATE CategoriasProductos
    SET Activo = 0
    WHERE IdFabricanteFK = p_IdFabricantePK;

    -- Step 3: Soft delete all subcategories related to the affected categories
    UPDATE SubcategoriasProductos
    SET Activo = 0
    WHERE IdCategoriaFK IN (
        SELECT IdCategoriaPK 
        FROM CategoriasProductos 
        WHERE IdFabricanteFK = p_IdFabricantePK
    );
    
    -- Step 4: Soft delete all categories of products with the fabricante
    UPDATE catalogoconsolas
    SET Activo = 0
    WHERE Fabricante = p_IdFabricantePK;    
END$$
DELIMITER ;

/*
================================================================================
-- IV. SECCIÓN DE PEDIDOS
-- DESCRIPCIÓN: Procedimientos para gestionar pedidos y los articulos que contiene,
-- además de hacer las inserciones al inventario de estos.
================================================================================
*/

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ActualizarArticuloPedido
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-01-28
-- DESCRIPCIÓN: PROCEDIMIENTO PARA ACTUALIZAR ARTICULO DE UN PEDIDO.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE ActualizarArticuloPedido(
    IN IdPedidoDPK INT,  -- ID del detalle del pedido a actualizar
    IN IdCodigoPFK varchar(25),
    IN TipoArtFK INT,  -- Tipo de artículo
    IN FabricanteArt INT,  -- Fabricante del artículo
    IN CategoriaArt INT,  -- Categoría del artículo
    IN SubcategoriaArt INT,  -- Subcategoría del artículo
    IN CantidadArt INT,  -- Cantidad de artículo
    IN EnlaceArt VARCHAR(1000),  -- Enlace del artículo
    IN PrecioArt DECIMAL(6,2),  -- Precio del artículo
    IN IdModeloPK INT,  -- ID del modelo
    IN EstadoArtPedido BOOLEAN,  -- Estado del artículo en el pedido
    IN ActivoArt BOOLEAN  -- Si el artículo está activo
)
BEGIN
    UPDATE PedidoDetalles
    SET 
        TipoArticuloFK = TipoArtFK,
        IdCodigoPedidoFK = IdCodigoPFK,
        FabricanteArticulo = FabricanteArt,
        CategoriaArticulo = CategoriaArt,
        SubcategoriaArticulo = SubcategoriaArt,
        CantidadArticulo = CantidadArt,
        EnlaceArticulo = EnlaceArt,
        PrecioArticulo = PrecioArt,
        IdModeloPK = IdModeloPK,
        EstadoArticuloPedido = EstadoArtPedido,
        Activo = ActivoArt
    WHERE IdPedidoDetallePK = IdPedidoDPK;

    -- Retornar un mensaje de éxito
    SELECT 'Artículo actualizado correctamente' AS mensaje;
END$$
DELIMITER ;
/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTiposPedidos
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-01-28
-- DESCRIPCIÓN: PROCEDIMIENTO PARA LISTAR LOS TIPOS DE PEDIDOS.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE ListarTiposPedidos()
    BEGIN
		SELECT * FROM tipopedido;
    END //
DELIMITER ;
/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ActualizarDatosGeneralesPedido
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-01-28
-- DESCRIPCIÓN: PROCEDIMIENTO PARA ACTUALIZAR DATOS GENERALES DE UN PEDIDO.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE ActualizarDatosGeneralesPedido(    
    IN p_IdPedido Varchar(25),
    IN p_FechaCreacionPedido DATE,
    IN p_FechaArrivoUSA DATE,
    IN p_FechaEstimadaRecepcion DATE,
    IN p_NumeroTracking1 VARCHAR(100),
    IN p_NumeroTracking2 VARCHAR(100),
    IN p_SitioWeb INT,
    IN p_ViaPedido INT,
    IN p_Peso DECIMAL(6,2),
    IN p_Comentarios VARCHAR(2000),
    IN p_Impuestos DECIMAL(6,2),
    IN p_ShippingUSA DECIMAL(6,2),
    IN p_ShippingNic DECIMAL(6,2),
    IN p_SubTotalArticulos DECIMAL(6,2),
    IN p_PrecioEstimadoDelPedido DECIMAL(6,2),
    IN p_EstadoPedido INT
)
BEGIN
    -- Actualizar los datos sin comprobación de cambios
    UPDATE PedidoBase
    SET 
        FechaCreacionPedido = p_FechaCreacionPedido,
        FechaArriboEstadosUnidos = p_FechaArrivoUSA,
        FechaIngreso = p_FechaEstimadaRecepcion,
        NumeroTracking1 = p_NumeroTracking1,
        NumeroTracking2 = p_NumeroTracking2,
        SitioWebFK = p_SitioWeb,
        ViaPedidoFK = p_ViaPedido,
        Peso = p_Peso,
        Comentarios = p_Comentarios,
        Impuestos = p_Impuestos,
        EnvioUSA = p_ShippingUSA,
        EnvioNIC = p_ShippingNic,
        SubtotalArticulos = p_SubTotalArticulos,
        TotalPedido = p_PrecioEstimadoDelPedido,
        EstadoPedidoFK = p_EstadoPedido
    WHERE CodigoPedido = p_IdPedido;

    -- Retornar un mensaje
    SELECT 'Datos del pedido actualizados correctamente' AS mensaje;
END$$

DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_ObtenerCodigosDePedido
-- AUTOR: Gemini
-- FECHA DE CREACIÓN: 2025-09-13
-- DESCRIPCIÓN: Obtiene los códigos de inventario generados para un pedido
-- que ya ha sido ingresado, para poder regenerar el reporte de Excel.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE sp_ObtenerCodigosDePedido(IN p_IdPedido VARCHAR(25))
BEGIN
    DECLARE v_CodigosGenerados TEXT DEFAULT '';
    DECLARE v_ProductosCount INT DEFAULT 0;
    DECLARE v_AccesoriosCount INT DEFAULT 0;
    DECLARE v_InsumosCantidadTotal INT DEFAULT 0;
    DECLARE v_JsonResultado JSON;

    -- Construir la cadena de códigos para productos
    SELECT IFNULL(GROUP_CONCAT(CONCAT('Producto:', IdProductoBaseFK) SEPARATOR ';'), '')
    INTO @product_codes
    FROM DetalleProductoPedido
    WHERE IdCodigoPedidoFK = p_IdPedido;

    -- Construir la cadena de códigos para accesorios
    SELECT IFNULL(GROUP_CONCAT(CONCAT('Accesorio:', IdAccesorioBaseFK) SEPARATOR ';'), '')
    INTO @accessory_codes
    FROM DetalleAccesorioPedido
    WHERE IdCodigoPedidoFK = p_IdPedido;

    -- Construir la cadena de códigos para insumos con su cantidad
    SELECT IFNULL(GROUP_CONCAT(CONCAT('Insumo:', dip.IdInsumoBaseFK, ' (', pd.CantidadArticulo, ')') SEPARATOR ';'), '')
    INTO @supply_codes
    FROM 
        DetalleInsumoPedido dip
    -- ✅ CORREGIDO: La unión con PedidoDetalles debe ser más precisa para obtener la cantidad correcta.
    -- Se une por el IdModeloPK y el IdCodigoPedidoFK para encontrar la línea de detalle original.
    JOIN 
        PedidoDetalles pd ON dip.IdCodigoPedidoFK = pd.IdCodigoPedidoFK AND pd.IdModeloPK = (
            SELECT ModeloInsumo FROM InsumosBase WHERE CodigoInsumo = dip.IdInsumoBaseFK
        )
    WHERE 
        dip.IdCodigoPedidoFK = p_IdPedido AND pd.TipoArticuloFK = 3;

    -- Combinar todas las cadenas de códigos
    SET v_CodigosGenerados = CONCAT_WS(';', NULLIF(@product_codes, ''), NULLIF(@accessory_codes, ''), NULLIF(@supply_codes, ''));
    IF LENGTH(v_CodigosGenerados) > 0 THEN
        SET v_CodigosGenerados = CONCAT(v_CodigosGenerados, ';');
    END IF;

    -- Contar las cantidades
    SELECT COUNT(*) INTO v_ProductosCount FROM DetalleProductoPedido WHERE IdCodigoPedidoFK = p_IdPedido;
    SELECT COUNT(*) INTO v_AccesoriosCount FROM DetalleAccesorioPedido WHERE IdCodigoPedidoFK = p_IdPedido;
    SELECT IFNULL(SUM(pd.CantidadArticulo), 0) INTO v_InsumosCantidadTotal FROM DetalleInsumoPedido dip JOIN PedidoDetalles pd ON dip.IdCodigoPedidoFK = pd.IdCodigoPedidoFK AND pd.IdModeloPK = (SELECT ModeloInsumo FROM InsumosBase WHERE CodigoInsumo = dip.IdInsumoBaseFK) WHERE dip.IdCodigoPedidoFK = p_IdPedido AND pd.TipoArticuloFK = 3;

    -- Crear el JSON de resultado
    SET v_JsonResultado = JSON_OBJECT('codigosIngresados', v_CodigosGenerados, 'cantidades', JSON_OBJECT('productos', v_ProductosCount, 'accesorios', v_AccesoriosCount, 'insumos', v_InsumosCantidadTotal));
    SELECT v_JsonResultado AS Resultado;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: AvanzarEstadoPedido
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-01-28
-- DESCRIPCIÓN: PROCEDIMIENTO PARA AVANZAR AL SIGUIENTE ESTADO DE UN PEDIDO EN ORDEN ASCENDENTE.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE AvanzarEstadoPedido(
    IN IdPedido VARCHAR(25)
)
BEGIN
    DECLARE estado_actual INT;

    -- Obtener el estado actual del pedido
    SELECT EstadoPedidoFK INTO estado_actual 
    FROM Pedidobase 
    WHERE CodigoPedido = IdPedido;

    -- Verificar si el estado está entre 1 y 4 antes de actualizar (NO actualiza si es 5, 6 o 7)
    IF estado_actual BETWEEN 1 AND 4 THEN
        UPDATE Pedidobase
        SET EstadoPedidoFK = estado_actual + 1
        WHERE CodigoPedido = IdPedido;        
        -- Se elimina el SELECT para que no devuelva un resultset y no interfiera con el SP que lo llama.
    END IF;    
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: CancelarPedido
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-01-28
-- DESCRIPCIÓN: PROCEDIMIENTO PARA CANCELAR UN PEDIDO.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE CancelarPedido(
	IN IdPedido varchar(25)
)
BEGIN
	UPDATE Pedidobase
    SET 
		EstadoPedidoFK = 6
	WHERE CodigoPedido = IdPedido;
    -- Retornar un mensaje de éxito
    SELECT 'Pedido cancelado correctamente' AS mensaje;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: EliminarPedido
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-01-28
-- DESCRIPCIÓN: PROCEDIMIENTO PARA ELIMINAR UN PEDIDO.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE EliminarPedido(
	IN IdPedido varchar(25)
)
BEGIN
	UPDATE Pedidobase
    SET 
		EstadoPedidoFK = 7
	WHERE CodigoPedido = IdPedido;
    -- Retornar un mensaje de éxito
    SELECT 'Pedido Eliminado correctamente' AS mensaje;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarArticulosPedidov3
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-01-28
-- DESCRIPCIÓN: PROCEDIMIENTO PARA INGRESAR LOS ARTICULOS DE UN PEDIDO AL INVENTARIO SOLO CUANDO EL PEDIDO AVANZA DEL ESTADO 4 AL 5.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE IngresarArticulosPedidov3(
    IN p_IdPedido VARCHAR(25),
    IN p_Productos JSON,
    IN p_Accesorios JSON,
    IN p_Insumos JSON
)
BEGIN
    -- Variables comunes
    DECLARE v_CodigoConsolaGenerated VARCHAR(50);
    DECLARE v_CodigoAccesorioGenerated VARCHAR(50);
    DECLARE v_CodigoInsumo VARCHAR(50);
    DECLARE v_Indice INT DEFAULT 0;
    DECLARE v_ProductosCount INT;
    DECLARE v_AccesoriosCount INT;
    DECLARE v_InsumosCount INT;
    DECLARE v_CodigosGenerados TEXT DEFAULT '';
    DECLARE v_ProductosProcesados INT DEFAULT 0;
    DECLARE v_AccesoriosProcesados INT DEFAULT 0;
    DECLARE v_InsumosCantidadTotal INT UNSIGNED DEFAULT 0;
    DECLARE v_JsonResultado JSON;

    -- Variables de producto
    DECLARE v_modeloP INT;
    DECLARE v_colorP VARCHAR(100);
    DECLARE v_EstadoP INT;
    DECLARE v_hackP BOOLEAN;
    DECLARE v_PrecioBaseP DECIMAL(6,2);
    DECLARE v_ComentarioP VARCHAR(255);
    DECLARE v_NumeroSerieP VARCHAR(100);
    DECLARE v_AccesoriosP TEXT;
    DECLARE v_TareasP TEXT;

    -- Variables de accesorio
    DECLARE v_modeloA INT;
    DECLARE v_colorA VARCHAR(100);
    DECLARE v_estadoA INT;
    DECLARE v_precioBaseA DECIMAL(6,2);
    DECLARE v_comentarioA VARCHAR(2000);
    DECLARE v_numeroSerieA VARCHAR(100);
    DECLARE v_productoscomaptiblesA TEXT;
    DECLARE v_tareasA TEXT;

    -- Variables de insumo
    DECLARE v_modeloI INT;
    DECLARE v_estadoI INT;
    DECLARE v_comentarioI VARCHAR(2000);
    DECLARE v_precioBaseI DECIMAL(6,2);
    DECLARE v_cantidadI INT UNSIGNED;
    DECLARE v_numeroSerieI VARCHAR(100);
    DECLARE v_stockMinimoI INT UNSIGNED;

    -- Contadores
    SET v_ProductosCount = JSON_LENGTH(p_Productos);
    SET v_AccesoriosCount = JSON_LENGTH(p_Accesorios);
    SET v_InsumosCount = JSON_LENGTH(p_Insumos);

    -- ================================
    -- Insertar productos
    -- ================================
    SET v_Indice = 0;
    WHILE v_Indice < v_ProductosCount DO
        SET v_modeloP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].articuloId')));
        SET v_colorP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].ColorConsola')));
        SET v_EstadoP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].EstadoConsola')));
        SET v_hackP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].HackConsola')));
        SET v_PrecioBaseP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].PrecioBase')));
        SET v_ComentarioP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].ComentarioConsola')));
        SET v_NumeroSerieP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].NumeroSerie')));
        SET v_AccesoriosP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].Accesorios')));
        SET v_TareasP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].TodoList')));

        CALL IngresarProductoATablaProductoBaseV4(v_modeloP, v_colorP, v_EstadoP, v_hackP, v_PrecioBaseP, v_ComentarioP, v_NumeroSerieP, v_AccesoriosP, v_TareasP);
        SELECT CodigoConsola INTO v_CodigoConsolaGenerated FROM ProductosBases ORDER BY IdIngreso DESC LIMIT 1;

        INSERT INTO DetalleProductoPedido (IdProductoBaseFK, IdCodigoPedidoFK, Comentario)
        VALUES (v_CodigoConsolaGenerated, p_IdPedido, v_ComentarioP);

        SET v_CodigosGenerados = CONCAT(v_CodigosGenerados, 'Producto:', v_CodigoConsolaGenerated, ';');
        SET v_ProductosProcesados = v_ProductosProcesados + 1;
        SET v_Indice = v_Indice + 1;
    END WHILE;

    -- ================================
    -- Insertar accesorios
    -- ================================
    SET v_Indice = 0;
    WHILE v_Indice < v_AccesoriosCount DO
        SET v_modeloA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].articuloId')));
        SET v_colorA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].ColorAccesorio')));
        SET v_estadoA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].EstadoAccesorio')));
        SET v_precioBaseA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].PrecioBase')));
        SET v_comentarioA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].ComentarioAccesorio')));
        SET v_numeroSerieA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].NumeroSerie')));
        SET v_productoscomaptiblesA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].ProductosCompatibles')));
        SET v_tareasA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].TodoList')));

        CALL IngresarAccesorioATablaAccesoriosBaseV2(v_modeloA, v_colorA, v_estadoA, v_precioBaseA, v_comentarioA, v_numeroSerieA, v_productoscomaptiblesA, v_tareasA);
        SELECT CodigoAccesorio INTO v_CodigoAccesorioGenerated FROM AccesoriosBase ORDER BY IdIngreso DESC LIMIT 1;

        INSERT INTO DetalleAccesorioPedido (IdAccesorioBaseFK, IdCodigoPedidoFK, Comentario)
        VALUES (v_CodigoAccesorioGenerated, p_IdPedido, v_comentarioA);

        SET v_CodigosGenerados = CONCAT(v_CodigosGenerados, 'Accesorio:', v_CodigoAccesorioGenerated, ';');
        SET v_AccesoriosProcesados = v_AccesoriosProcesados + 1;
        SET v_Indice = v_Indice + 1;
    END WHILE;

    -- ================================
    -- Insertar insumos (solo si existen)
    -- ================================
    SET v_Indice = 0;
    WHILE v_Indice < v_InsumosCount DO
        SET v_modeloI = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].articuloId')));
        SET v_estadoI = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].EstadoInsumo')));
        SET v_comentarioI = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].ComentarioInsumo')));
        SET v_precioBaseI = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].PrecioBase')));
        SET v_cantidadI = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].Cantidad')));
        SET v_numeroSerieI = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].NumeroSerie')));
        SET v_stockMinimoI = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].StockMinimo')));

        -- Llama al procedimiento que maneja la lógica de inserción o actualización del stock.
        CALL IngresarInsumoATablaInsumosBase(
            v_modeloI, v_estadoI, v_comentarioI, v_precioBaseI, v_cantidadI, v_numeroSerieI, v_stockMinimoI
        );

        -- Obtener código
        SELECT CodigoInsumo INTO v_CodigoInsumo
        FROM InsumosBase
        WHERE ModeloInsumo = v_modeloI
        ORDER BY IdIngreso DESC
        LIMIT 1;

        -- Validación por seguridad
        IF v_CodigoInsumo IS NULL THEN
            SET @error_msg = CONCAT('Insumo con modelo ', v_modeloI, ' no existe.');
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @error_msg;
        END IF;

        -- Insertar en detalle
        INSERT INTO DetalleInsumoPedido (IdInsumoBaseFK, IdCodigoPedidoFK, Comentario)
        VALUES (v_CodigoInsumo, p_IdPedido, v_comentarioI);

        SET v_CodigosGenerados = CONCAT(v_CodigosGenerados, 'Insumo:', v_CodigoInsumo, ' (', v_cantidadI, ');');
        SET v_InsumosCantidadTotal = v_InsumosCantidadTotal + v_cantidadI;
        SET v_Indice = v_Indice + 1;
    END WHILE;

    -- ================================
    -- Avanzar el estado del pedido
    -- ================================
    CALL AvanzarEstadoPedido(p_IdPedido);

    -- ================================
    -- Resultado final en JSON
    -- ================================
    SET v_JsonResultado = JSON_OBJECT(
        'codigosIngresados', v_CodigosGenerados,
        'cantidades', JSON_OBJECT(
            'productos', v_ProductosProcesados,
            'accesorios', v_AccesoriosProcesados,
            'insumos', v_InsumosCantidadTotal
        )
    );

    SELECT v_JsonResultado AS Resultado;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarPedidoATablaPedidos
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-01-28
-- DESCRIPCIÓN: PROCEDIMIENTO PARA INGRESAR LOS DETALLES DE UN PEDIDO.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE IngresarPedidoATablaPedidos(
    IN FechaCreacionPedido DATE,
    IN FechaArrivoUSA DATE,
    IN FechaEstimadaRecepcion DATE,
    IN NumeroTracking1 VARCHAR(100),
    IN NumeroTracking2 VARCHAR(100),
    IN SitioWeb INT,
    IN ViaPedido INT,
    IN Peso DECIMAL(6,2),
    IN Comentarios VARCHAR(2000),
    IN Impuestos DECIMAL(6,2),
    IN ShippingUSA DECIMAL(6,2),
    IN ShippingNic DECIMAL(6,2),
    IN SubTotalArticulos DECIMAL(6,2),
    IN PrecioEstimadoDelPedido DECIMAL(6,2),
    IN articulos JSON
)
BEGIN
    -- Declaración de variables
    DECLARE articulo JSON;
    DECLARE i INT DEFAULT 0;
    DECLARE pedidosHoy INT;
    DECLARE CodigoPedidoGenerado VARCHAR(50);

    -- Contar cuántos pedidos ya se han hecho en la fecha
    SELECT COUNT(*) + 1 INTO pedidosHoy
    FROM PedidoBase
    WHERE DATE(FechaCreacionPedido) = DATE(FechaCreacionPedido);

    -- Generar el código del pedido
    SET CodigoPedidoGenerado = CONCAT(
        'P-',
        DATE_FORMAT(FechaCreacionPedido, '%d%m%Y'),
        '-',
        pedidosHoy
    );

    -- Insertar en la tabla PedidoBase
    INSERT INTO PedidoBase (
        CodigoPedido,
        FechaCreacionPedido,
        FechaArriboEstadosUnidos,
        FechaIngreso,
        NumeroTracking1,
        NumeroTracking2,
        SitioWebFK,
        ViaPedidoFK,
        EstadoPedidoFK,
        TotalPedido,
        Comentarios,
        Peso,
        SubtotalArticulos,
        Impuestos,
        EnvioUSA,
        EnvioNIC
    )
    VALUES (
        CodigoPedidoGenerado,
        FechaCreacionPedido,
        FechaArrivoUSA,
        FechaEstimadaRecepcion,  -- Fecha estimada de recepción
        NumeroTracking1,
        NumeroTracking2,
        SitioWeb,
        ViaPedido,
        1, 
        PrecioEstimadoDelPedido,
        Comentarios,
        Peso,
        SubTotalArticulos,
        Impuestos,
        ShippingUSA,
        ShippingNic
    );

    -- Asignar el valor de 'articulos' a la variable JSON
    SET articulo = articulos;

    -- Insertar en PedidoDetalles usando el parámetro JSON
    WHILE i < JSON_LENGTH(articulo) DO
        INSERT INTO PedidoDetalles (
            IdCodigoPedidoFK,
            TipoArticuloFK,
            FabricanteArticulo,
            CategoriaArticulo,
            SubcategoriaArticulo,
            CantidadArticulo,
            EnlaceArticulo,
            PrecioArticulo,
            IdModeloPK
        )
        SELECT
            CodigoPedidoGenerado,  -- Código del pedido recién generado
            JSON_UNQUOTE(JSON_EXTRACT(articulo, CONCAT('$[', i, '].TipoArticulo'))),
            JSON_UNQUOTE(JSON_EXTRACT(articulo, CONCAT('$[', i, '].Fabricante'))),
            JSON_UNQUOTE(JSON_EXTRACT(articulo, CONCAT('$[', i, '].Cate'))),
            JSON_UNQUOTE(JSON_EXTRACT(articulo, CONCAT('$[', i, '].SubCategoria'))),
            JSON_UNQUOTE(JSON_EXTRACT(articulo, CONCAT('$[', i, '].Cantidad'))),
            JSON_UNQUOTE(JSON_EXTRACT(articulo, CONCAT('$[', i, '].EnlaceCompra'))),
            JSON_UNQUOTE(JSON_EXTRACT(articulo, CONCAT('$[', i, '].Precio'))),
            JSON_UNQUOTE(JSON_EXTRACT(articulo, CONCAT('$[', i, '].IdModeloPK')));
        SET i = i + 1;
    END WHILE;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarPedidoATablaPedidos
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-01-28
-- DESCRIPCIÓN: AGREGAR ARTICULOS DIRECTAMENTE DEL PEDIDO.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE InsertarArticuloPedido(
    IN IdCodigoPedidoFK VARCHAR(25),  -- Código del pedido
    IN TipoArticuloFK INT,  -- Tipo de artículo
    IN FabricanteArticulo INT,  -- Fabricante del artículo
    IN CategoriaArticulo INT,  -- Categoría del artículo
    IN SubcategoriaArticulo INT,  -- Subcategoría del artículo
    IN CantidadArticulo INT,  -- Cantidad de artículo
    IN EnlaceArticulo VARCHAR(1000),  -- Enlace del artículo
    IN PrecioArticulo DECIMAL(6,2),  -- Precio del artículo
    IN IdModeloPK INT,  -- ID del modelo
    IN ActivoArt BOOLEAN
)
BEGIN
    -- Comprobar si el artículo está activo (ActivoArt = 1)
    IF ActivoArt = 0 THEN
        -- Si el artículo no está activo, no se inserta y se retorna un mensaje
        SELECT 'El artículo no se ha agregado porque está inactivo' AS mensaje;
    ELSE
        -- Insertar el nuevo artículo en la tabla PedidoDetalles
        INSERT INTO PedidoDetalles (
            IdCodigoPedidoFK,
            TipoArticuloFK,
            FabricanteArticulo,
            CategoriaArticulo,
            SubcategoriaArticulo,
            CantidadArticulo,
            EnlaceArticulo,
            PrecioArticulo,
            IdModeloPK,
            EstadoArticuloPedido,
            Activo
        )
        VALUES (
            IdCodigoPedidoFK,
            TipoArticuloFK,
            FabricanteArticulo,
            CategoriaArticulo,
            SubcategoriaArticulo,
            CantidadArticulo,
            EnlaceArticulo,
            PrecioArticulo,
            IdModeloPK,
            1,  -- EstadoArticuloPedido por defecto a 1 (activo)
            1   -- Activo por defecto a 1 (activo)
        );

        -- Retornar un mensaje de éxito
        SELECT 'Artículo agregado correctamente' AS mensaje;
    END IF;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarPedidoATablaPedidos
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-01-25
-- DESCRIPCIÓN: LISTA LOS ARTICULOS DEL PEDIDO.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarArticulosXIdPedido(IdCodigoPedido varchar(100))
BEGIN
	SELECT 
    pd.IdPedidoDetallePK,
    pd.IdCodigoPedidoFK,
    pd.TipoArticuloFK,
    ta.DescripcionTipoArticulo AS TipoArticulo,
    CASE 
        WHEN pd.TipoArticuloFK = 1 THEN fp.NombreFabricante
        WHEN pd.TipoArticuloFK = 2 THEN fa.NombreFabricanteAccesorio
        WHEN pd.TipoArticuloFK = 3 THEN fi.NombreFabricanteInsumos
    END AS NombreFabricante,
    CASE 
        WHEN pd.TipoArticuloFK = 1 THEN cp.NombreCategoria
        WHEN pd.TipoArticuloFK = 2 THEN ca.NombreCategoriaAccesorio
        WHEN pd.TipoArticuloFK = 3 THEN ci.NombreCategoriaInsumos
    END AS NombreCategoria,
    CASE 
        WHEN pd.TipoArticuloFK = 1 THEN sp.NombreSubcategoria
        WHEN pd.TipoArticuloFK = 2 THEN sa.NombreSubcategoriaAccesorio
        WHEN pd.TipoArticuloFK = 3 THEN si.NombreSubcategoriaInsumos
    END AS NombreSubCategoria,
    CASE
		WHEN pd.TipoArticuloFK = 1 THEN concat('http://localhost:3000/img-consolas/',pc.LinkImagen)
        WHEN pd.TipoArticuloFK = 2 THEN concat('http://localhost:3000/img-accesorios/',ac.LinkImagen)
        WHEN pd.TipoArticuloFK = 3 THEN concat('http://localhost:3000/img-insumos/',ic.LinkImagen)
    END AS ImagePath,
    pd.FabricanteArticulo,
    pd.CategoriaArticulo,
    pd.SubcategoriaArticulo,
    pd.CantidadArticulo as 'Cantidad',
    pd.EnlaceArticulo as 'EnlaceCompra',
    pd.PrecioArticulo as 'Precio',
    pd.IdModeloPK,
    pd.EstadoArticuloPedido,
    pd.Activo
	FROM PedidoDetalles pd
	JOIN TipoArticulo ta ON pd.TipoArticuloFK = ta.IdTipoArticuloPK
	LEFT JOIN fabricantes fp ON pd.TipoArticuloFK = 1 AND pd.FabricanteArticulo = fp.IdFabricantePK
	LEFT JOIN fabricanteaccesorios fa ON pd.TipoArticuloFK = 2 AND pd.FabricanteArticulo = fa.IdFabricanteAccesorioPK
	LEFT JOIN fabricanteinsumos fi ON pd.TipoArticuloFK = 3 AND pd.FabricanteArticulo = fi.IdFabricanteInsumosPK
	LEFT JOIN categoriasproductos cp ON pd.TipoArticuloFK = 1 AND pd.CategoriaArticulo = cp.IdCategoriaPK
	LEFT JOIN categoriasaccesorios ca ON pd.TipoArticuloFK = 2 AND pd.CategoriaArticulo = ca.IdCategoriaAccesorioPK
	LEFT JOIN categoriasinsumos ci ON pd.TipoArticuloFK = 3 AND pd.CategoriaArticulo = ci.IdCategoriaInsumosPK
	LEFT JOIN subcategoriasproductos sp ON pd.TipoArticuloFK = 1 AND pd.SubcategoriaArticulo = sp.IdSubcategoria
	LEFT JOIN subcategoriasaccesorios sa ON pd.TipoArticuloFK = 2 AND pd.SubcategoriaArticulo = sa.IdSubcategoriaAccesorio
	LEFT JOIN subcategoriasinsumos si ON pd.TipoArticuloFK = 3 AND pd.SubcategoriaArticulo = si.IdSubcategoriaInsumos
	LEFT JOIN catalogoconsolas pc on pd.TipoArticuloFK = 1 AND pc.IdmodeloConsolaPK = IdModeloPK
	LEFT JOIN catalogoaccesorios ac on pd.TipoArticuloFK = 2 AND ac.IdModeloAccesorioPK = IdModeloPK
	LEFT JOIN catalogoinsumos ic on pd.TipoArticuloFK = 3 AND ic.IdModeloInsumosPK = IdmodeloPK
	WHERE pd.TipoArticuloFK IN (1, 2, 3)
    AND IdCodigoPedidoFK = IdCodigoPedido
    AND pd.Activo = 1;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarEstadosPedidos
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-12-16
-- DESCRIPCIÓN: LISTA LOS ESTADOS DE PEDIDO.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE ListarEstadosPedidos()
    BEGIN
		select * FROM base_datos_inventario_taller.estadopedido;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTablaPedidosBase
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-12-16
-- DESCRIPCIÓN: LISTA LOS PEDIDOS.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarTablaPedidosBase ()
       BEGIN
			SELECT 
				A.CodigoPedido,
				DATE_FORMAT(A.FechaCreacionPedido, '%d/%m/%Y') as 'Fecha_Ingreso',
                DATE_FORMAT(A.FechaArriboEstadosUnidos, '%d/%m/%Y') as 'Fecha_USA',
                DATE_FORMAT(A.FechaIngreso, '%d/%m/%Y') as 'Fecha_NIC',
                B.DescripcionEstadoPedido as 'Estado',
                A.EstadoPedidoFK,
                A.NumeroTracking1,
				A.NumeroTracking2,
                A.Comentarios,
                C.DescripcionTipoPedido,
                A.Peso,
                A.SubtotalArticulos,
                A.TotalPedido
			FROM pedidobase A 
            join estadopedido B on A.estadopedidofk = B.codigoEstadopedido
            join tipopedido C on A.viapedidoFK = C.CodigoTipoPedido;
       END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTablaPedidosBasesXId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-01-23
-- DESCRIPCIÓN: LISTA LOS PEDIDOS POR ID.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE ListarTablaPedidosBasesXId(IdCodigoPedido varchar(100))
BEGIN
	SELECT 
				A.CodigoPedido,
                DATE_FORMAT(A.FechaCreacionPedido, '%d/%m/%Y') as 'FechaCreacionPedido',
                DATE_FORMAT(A.FechaArriboEstadosUnidos, '%d/%m/%Y') as 'FechaArriboUSA',
                DATE_FORMAT(A.FechaIngreso, '%d/%m/%Y') 'FechaEstimadaRecepcion',
                A.NumeroTracking1,
                A.NumeroTracking2,
                A.SitioWebFK as 'SitioWeb',
                A.ViaPedidoFK as 'ViaPedido',
                A.EstadoPedidoFK as 'Estado',
                A.TotalPedido as 'PrecioEstimadoDelPedido',
                A.Comentarios,
                A.Peso as 'PesoPedido',
                A.SubtotalArticulos as 'SubTotalArticulos',
                A.Impuestos,
                A.EnvioUSA as 'ShippingUSA',
                A.EnvioNIC as 'ShippingNIC'
			FROM pedidobase A            
			WHERE A.EstadoPedidoFK != 7
            AND A.CodigoPedido = IdCodigoPedido;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTipoArticulo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-12-18
-- DESCRIPCIÓN: LISTA LOS TIPOS DE ARTICULOS.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE ListarTipoArticulo()
    BEGIN
		select * FROM base_datos_inventario_taller.tipoarticulo;
    END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarWebsites
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2024-12-16
-- DESCRIPCIÓN: LISTA LOS SITIOS WEBS.
------------------------------------------------------------------------------*/
DELIMITER //
	CREATE PROCEDURE ListarWebsites()
    BEGIN
		SELECT * FROM sitioweb;
    END //
DELIMITER ;


/*
================================================================================
-- V. SECCIÓN DE SERVICIOS
-- DESCRIPCIÓN: Procedimientos para gestionar los servicios y los insumos asociados.
================================================================================
*/
/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ActualizarServicioConInsumos
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-05-14
-- DESCRIPCIÓN: Actualiza los servicios y sus insumos si se tienen.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE ActualizarServicioConInsumos (
    IN p_CodigoServicio INT,
    IN p_DescripcionServicio VARCHAR(255),
    IN p_PrecioBase DECIMAL(6,2),
    IN p_Comentario VARCHAR(2000),
    IN p_EstadoServicioFK TINYINT(1)
)
BEGIN
    -- Actualiza la tabla de servicios
    UPDATE ServiciosBase
    SET DescripcionServicio = p_DescripcionServicio,
        PrecioBase = p_PrecioBase,
        Comentario = p_Comentario,       
        Estado = p_EstadoServicioFK
    WHERE IdServicioPK = p_CodigoServicio;

    -- Paso 1: Marcar todos los insumos existentes como inactivos (soft delete)
    UPDATE InsumosXServicio
    SET Estado = 0
    WHERE IdServicioFK = p_CodigoServicio;

    -- Nota: Este procedimiento trabaja junto a otro auxiliar para modificar los insumos que contiene un servicio, que se itera desde el backend para llamarlo.
    -- CALL InsertarOActualizarInsumoXServicio(p_CodigoServicio, 'INS-KING-32GB', '32GB Clase 10', 1);

END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: EliminarServicioEInsumos
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-05-14
-- DESCRIPCIÓN: Elimina un servicio y sus insumos si se tienen.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE EliminarServicioEInsumos (
    IN p_IdServicio INT
)
BEGIN
    -- Cambiar el estado del servicio a 0 (soft delete)
    UPDATE ServiciosBase
    SET Estado = 0
    WHERE IdServicioPK = p_IdServicio;

    -- Cambiar el estado de los insumos asociados a 0 (soft delete)
    UPDATE InsumosXServicio
    SET Estado = 0
    WHERE IdServicioFK = p_IdServicio;
END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarServicioConInsumos
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-05-07
-- DESCRIPCIÓN: Inserta un servicio y sus insumos si se tienen.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE IngresarServicioConInsumos(
    IN DescripcionServicio VARCHAR(255),
    IN PrecioBase DECIMAL(6,2),
    IN Comentario VARCHAR(2000),
    IN insumos JSON
)
BEGIN
    DECLARE nuevoIdServicio INT;
    DECLARE i INT DEFAULT 0;

    -- Insertar en tabla ServiciosBase
    INSERT INTO ServiciosBase (
        DescripcionServicio,
        PrecioBase,
        Comentario,
        FechaIngreso
    ) VALUES (
        DescripcionServicio,
        PrecioBase,
        Comentario,
        CURDATE()
    );

    -- Obtener el ID generado
    SET nuevoIdServicio = LAST_INSERT_ID();

    -- Insertar insumos si existen
    WHILE i < JSON_LENGTH(insumos) DO
        INSERT INTO InsumosXServicio (
            IdServicioFK,
            CodigoInsumoFK,
            CantidadDescargue,
            Estado
        )
        SELECT
            nuevoIdServicio,
            JSON_UNQUOTE(JSON_EXTRACT(insumos, CONCAT('$[', i, '].CodigoInsumoFK'))),
            JSON_UNQUOTE(JSON_EXTRACT(insumos, CONCAT('$[', i, '].CantidadDescargue'))),
            1;

        SET i = i + 1;
    END WHILE;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: InsertarOActualizarInsumoXServicio
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-05-07
-- DESCRIPCIÓN: Inserta un servicio y sus insumos si se tienen.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE InsertarOActualizarInsumoXServicio (
    IN p_IdServicioFK INT,
    IN p_CodigoInsumoFK VARCHAR(25),
    IN p_Cantidad INT
)
BEGIN
    DECLARE existe INT DEFAULT 0;
    DECLARE estadoActual TINYINT;

    -- Verificar si el insumo ya existe
    SELECT COUNT(*) INTO existe
    FROM InsumosXServicio
    WHERE IdServicioFK = p_IdServicioFK AND CodigoInsumoFK = p_CodigoInsumoFK;

    IF existe = 0 THEN
        -- Insertar si no existe
        INSERT INTO InsumosXServicio (IdServicioFK, CodigoInsumoFK, CantidadDescargue, Estado)
        VALUES (p_IdServicioFK, p_CodigoInsumoFK, p_Cantidad, 1);
    ELSE
        -- Actualizar si ya existe
        UPDATE InsumosXServicio
        SET CantidadDescargue = p_Cantidad,
            Estado = 1
        WHERE IdServicioFK = p_IdServicioFK AND CodigoInsumoFK = p_CodigoInsumoFK;
    END IF;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarInsumosxServicio
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-05-07
-- DESCRIPCIÓN: Lista los insumos si se tienen de un servicio.
------------------------------------------------------------------------------*/
DELIMITER $$
	CREATE PROCEDURE ListarInsumosxServicio
    (
    IN IdServicio int
    )
    BEGIN 
		SELECT 
			b.IdInsumosXServicio,
			b.CodigoInsumoFK,
			b.CantidadDescargue,
			c.ModeloInsumo,
			c.PrecioBase
		FROM 
			serviciosbase a
		JOIN
			insumosxservicio b
			ON a.IdServicioPK = b.IdServicioFK
		JOIN 
			insumosbase c
			ON b.CodigoInsumoFK = c.CodigoInsumo 
		WHERE 
			a.IdServicioPK = IdServicio
			AND b.Estado = 1;
    END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTablaServiciosBase
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-05-10
-- DESCRIPCIÓN: Lista los servicios.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE ListarTablaServiciosBase()
BEGIN
	SELECT 
		IdServicioPK as CodigoServicio,
        DescripcionServicio,
        Estado,
        DATE_FORMAT(FechaIngreso, '%d/%m/%Y') as 'Fecha_Ingreso',
        Comentario,
        PrecioBase
    FROM serviciosbase
    where Estado = 1 ;
END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTablaServiciosBaseXId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-05-10
-- DESCRIPCIÓN: Lista servicio por id.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE ListarTablaServiciosBaseXId(
IN IdServicio int
)
BEGIN
	SELECT 
		IdServicioPK as CodigoServicio,
        DescripcionServicio,
        Estado,
        DATE_FORMAT(FechaIngreso, '%d/%m/%Y') as 'Fecha_Ingreso',
        Comentario,
        PrecioBase
    FROM serviciosbase
    where IdServicioPK = IdServicio ;
END $$
DELIMITER ;

/*
================================================================================
-- VI. SECCIÓN DE USUARIOS
-- DESCRIPCIÓN: Procedimientos para gestionar los usuarios y los datos de estos.
================================================================================
*/

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ActualizarUsuario
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-18
-- DESCRIPCIÓN: Actualiza un usuario.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE ActualizarUsuario(
    IN p_id INT,
    IN p_nombre VARCHAR(255),
    IN p_correo VARCHAR(255),
    IN p_password VARCHAR(255), 
    IN p_id_estado INT,
    IN p_id_rol INT
)
BEGIN
    UPDATE usuarios
    SET 
        Nombre = p_nombre,
        Correo = p_correo,
        Password = IFNULL(p_password, Password), -- Si no se pasa la nueva contraseña, mantenemos la anterior
        IdEstadoFK = p_id_estado,
        IdRolFK = p_id_rol
    WHERE IdUsuarioPK = p_id;
END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: CambiarPassword
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-18
-- DESCRIPCIÓN: Cambia contraseña de un usuario.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE CambiarPassword(
    IN p_IdUsuario INT,
    IN p_NuevaContraseña VARCHAR(255)
)
BEGIN
    -- Actualizar la contraseña del usuario
    UPDATE usuarios
    SET Password = p_NuevaContraseña
    WHERE IdUsuarioPK = p_IdUsuario;
    
    -- Retornar un mensaje de éxito
    SELECT 'Contraseña actualizada exitosamente' AS Mensaje;
END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: DesactivarUsuario
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-18
-- DESCRIPCIÓN: Desactiva un usuario.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE DesactivarUsuario(
    IN p_IdUsuarioPK INT,
    IN p_IdEstadoFK INT
)
BEGIN
    UPDATE Usuarios
    SET IdEstadoFK = p_IdEstadoFK
    WHERE IdUsuarioPK = p_IdUsuarioPK;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: GetUserPassword
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-23
-- DESCRIPCIÓN: Consigue la contraseña un usuario.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE GetUserPassword (IN userId INT)
BEGIN
    SELECT Password
    FROM usuarios
    WHERE IdUsuarioPK = userId;
END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: InsertarUsuario
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-18
-- DESCRIPCIÓN: Crea un usuario.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE InsertarUsuario(
    IN p_Nombre VARCHAR(100),
    IN p_Correo VARCHAR(100),
    IN p_Password VARCHAR(255),
    IN p_FechaIngresoUsuario DATE,
    IN p_IdEstadoFK INT,
    IN p_IdRolFK INT
)
BEGIN
    INSERT INTO Usuarios (Nombre, Correo, Password, FechaIngresoUsuario, IdEstadoFK, IdRolFK)
    VALUES (p_Nombre, p_Correo, p_Password, p_FechaIngresoUsuario, p_IdEstadoFK, p_IdRolFK);
END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarEstadosUsuarios
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-19
-- DESCRIPCIÓN: LISTAR ESTADOS DE USUARIOS.
------------------------------------------------------------------------------*/
DELIMITER $$
	CREATE PROCEDURE ListarEstadosUsuarios()
    BEGIN
		SELECT * FROM estadousuarios;
    END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarRolesUsuarios
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-19
-- DESCRIPCIÓN: LISTAR ROLES DE USUARIOS.
------------------------------------------------------------------------------*/
DELIMITER $$
	CREATE PROCEDURE ListarRolesUsuarios()
    BEGIN
		SELECT * FROM Roles;
    END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarUsuarioPorId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-18
-- DESCRIPCIÓN: Lista la informacion de un usuario por id.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE ListarUsuarioPorId(
    IN p_IdUsuarioPK INT
)
BEGIN
    SELECT a.IdUsuarioPK, a.Nombre, a.Correo, DATE_FORMAT(a.FechaIngresoUsuario, '%d/%m/%Y') as 'FechaIngresoUsuario', 
           a.IdEstadoFK, a.IdRolFK, a.Password
    FROM Usuarios a    
    WHERE a.IdUsuarioPK = p_IdUsuarioPK;
END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarUsuarios
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-18
-- DESCRIPCIÓN: Lista los usuarios.
------------------------------------------------------------------------------*/
DELIMITER $$
	CREATE PROCEDURE ListarUsuarios()
    BEGIN
		SELECT a.IdUsuarioPK, a.Nombre, a.Correo, DATE_FORMAT(A.FechaIngresoUsuario, '%d/%m/%Y') as 'FechaIngresoUsuario', b.DescripcionEstado, c.NombreRol FROM Usuarios a
        JOIN estadousuarios b on a.IdEstadoFK = b.IdEstadoPK
        JOIN roles c on a.IdRolFK = c.IdRolPK;
	END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: VerificarUsuarioPorCorreo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-18
-- DESCRIPCIÓN: Valida usuario por correo.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE VerificarUsuarioPorCorreo(IN correo_usuario VARCHAR(255))
BEGIN
    SELECT 
        IdUsuarioPK, Nombre, Correo, Password, IdRolFK 
    FROM usuarios
    WHERE Correo = correo_usuario;
END $$
DELIMITER ;

/*
================================================================================
-- VII. SECCIÓN DE VENTAS
-- DESCRIPCIÓN: Procedimientos para gestionar las ventas, clientes, notas de credito,
-- carritos y todas las clases relacionadas a las ventas.
================================================================================
*/

/*-- VII.A. Subsección: Procedimientos carrito de compra ---------------------------*/

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: AgregarArticuloAlCarrito
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-06-25
-- DESCRIPCIÓN: Agrega articulo al carrito.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE AgregarArticuloAlCarrito(
    IN p_IdUsuario INT,
    IN p_IdCliente INT,
    IN p_TipoArticulo ENUM('Producto', 'Accesorio', 'Insumo', 'Servicio'),
    IN p_CodigoArticulo VARCHAR(25),
    IN p_PrecioVenta DECIMAL(10,2),
    IN p_Descuento DECIMAL(10,2),
    IN p_Cantidad INT
)
BEGIN
    DECLARE v_IdCarrito INT;
    DECLARE v_IdDetalleCarrito INT;
    DECLARE v_CantidadActual INT;
    DECLARE estadoAnterior INT;

    -- Buscar o crear carrito activo
    SELECT IdCarritoPK INTO v_IdCarrito
    FROM CarritoVentas
    WHERE IdUsuarioFK = p_IdUsuario AND IdClienteFK = p_IdCliente AND EstadoCarrito = 'En curso'
    LIMIT 1;

    IF v_IdCarrito IS NULL THEN
        INSERT INTO CarritoVentas (IdUsuarioFK, IdClienteFK, EstadoCarrito, Comentario)
        VALUES (p_IdUsuario, p_IdCliente, 'En curso', CONCAT('Carrito creado automáticamente el ', NOW()));
        SET v_IdCarrito = LAST_INSERT_ID();
    END IF;

    -- Verificar si el artículo ya existe
    SELECT IdDetalleCarritoPK, Cantidad INTO v_IdDetalleCarrito, v_CantidadActual
    FROM DetalleCarritoVentas
    WHERE IdCarritoFK = v_IdCarrito
      AND TipoArticulo = p_TipoArticulo
      AND CodigoArticulo = p_CodigoArticulo
    LIMIT 1;

    IF v_IdDetalleCarrito IS NOT NULL THEN
        -- Ya existe en el carrito
        IF v_CantidadActual + p_Cantidad <= 0 THEN
            -- Llama al procedimiento para eliminarlo correctamente
            CALL EliminarArticuloDelCarrito(v_IdDetalleCarrito);
        ELSE
            -- Actualiza cantidad y subtotal
            UPDATE DetalleCarritoVentas
            SET
                Cantidad = v_CantidadActual + p_Cantidad,
                SubtotalSinIVA = (v_CantidadActual + p_Cantidad) * (p_PrecioVenta * (1 - p_Descuento/100))
            WHERE IdDetalleCarritoPK = v_IdDetalleCarrito;
        END IF;

    ELSE
        -- No existe, se agrega nuevo
        INSERT INTO DetalleCarritoVentas (IdCarritoFK, TipoArticulo, CodigoArticulo, PrecioVenta, Descuento, SubtotalSinIVA, Cantidad)
        VALUES (
            v_IdCarrito,
            p_TipoArticulo,
            p_CodigoArticulo,
            p_PrecioVenta,
            p_Descuento,
            p_Cantidad * (p_PrecioVenta * (1 - p_Descuento/100)),
            p_Cantidad
        );
    END IF;

    -- Solo aplica lógica de stock si se está agregando
    IF p_Cantidad > 0 THEN
        IF p_TipoArticulo = 'Producto' THEN
            SELECT Estado INTO estadoAnterior FROM ProductosBases WHERE CodigoConsola = p_CodigoArticulo;
            UPDATE ProductosBases SET Estado = 11 WHERE CodigoConsola = p_CodigoArticulo;
            INSERT INTO HistorialEstadoProducto (CodigoConsola, EstadoAnterior, EstadoNuevo)
            VALUES (p_CodigoArticulo, estadoAnterior, 11);

        ELSEIF p_TipoArticulo = 'Accesorio' THEN
            SELECT EstadoAccesorio INTO estadoAnterior FROM AccesoriosBase WHERE CodigoAccesorio = p_CodigoArticulo;
            UPDATE AccesoriosBase SET EstadoAccesorio = 11 WHERE CodigoAccesorio = p_CodigoArticulo;
            INSERT INTO HistorialEstadoAccesorio (CodigoAccesorio, EstadoAnterior, EstadoNuevo)
            VALUES (p_CodigoArticulo, estadoAnterior, 11);

        ELSEIF p_TipoArticulo = 'Insumo' THEN
            UPDATE InsumosBase
            SET Cantidad = Cantidad - p_Cantidad
            WHERE CodigoInsumo = p_CodigoArticulo;

            INSERT INTO HistorialEstadoInsumo (
                CodigoInsumo, StockAnterior, StockNuevo, EstadoNuevo,
                StockMinimoAnterior, StockMinimoNuevo
            )
            SELECT
                CodigoInsumo,
                Cantidad + p_Cantidad,
                Cantidad,
                EstadoInsumo,
                StockMinimo,
                StockMinimo
            FROM InsumosBase
            WHERE CodigoInsumo = p_CodigoArticulo;

        ELSEIF p_TipoArticulo = 'Servicio' THEN
            UPDATE InsumosBase I
            JOIN InsumosXServicio S ON I.CodigoInsumo = S.CodigoInsumoFK
            SET I.Cantidad = I.Cantidad - (S.CantidadDescargue * p_Cantidad)
            WHERE S.IdServicioFK = CAST(p_CodigoArticulo AS UNSIGNED);

            INSERT INTO HistorialEstadoInsumo (
                CodigoInsumo, StockAnterior, StockNuevo, EstadoNuevo,
                StockMinimoAnterior, StockMinimoNuevo
            )
            SELECT
                I.CodigoInsumo,
                I.Cantidad + (S.CantidadDescargue * p_Cantidad),
                I.Cantidad,
                I.EstadoInsumo,
                I.StockMinimo,
                I.StockMinimo
            FROM InsumosBase I
            JOIN InsumosXServicio S ON I.CodigoInsumo = S.CodigoInsumoFK
            WHERE S.IdServicioFK = CAST(p_CodigoArticulo AS UNSIGNED);
        END IF;
    END IF;

    -- Retornar el ID del carrito usado
    SELECT v_IdCarrito AS IdCarritoUsado;
END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: EliminarArticuloDelCarrito
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-06-25
-- DESCRIPCIÓN: Eliminar articulo al carrito.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE EliminarArticuloDelCarrito(IN p_IdDetalle INT)
BEGIN
  /* Variables */
  DECLARE v_Tipo VARCHAR(20);
  DECLARE v_Codigo VARCHAR(25);
  DECLARE v_Cant   INT DEFAULT 1;     
  DECLARE v_Existe INT DEFAULT 0;
  DECLARE v_IdCarrito INT;

  /* Verificar existencia */
  SELECT COUNT(*) INTO v_Existe
  FROM DetalleCarritoVentas
  WHERE IdDetalleCarritoPK = p_IdDetalle;

  IF v_Existe = 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'El artículo indicado no existe en el carrito.';
  END IF;

  /* Obtener tipo, código, cantidad y carrito */
  SELECT
      TipoArticulo,
      CodigoArticulo,
      COALESCE(Cantidad, 1),
      IdCarritoFK
  INTO  v_Tipo, v_Codigo, v_Cant, v_IdCarrito
  FROM  DetalleCarritoVentas
  WHERE IdDetalleCarritoPK = p_IdDetalle
  LIMIT 1;

  /* Revertir inventario/estado */
  IF v_Tipo = 'Producto' THEN
      UPDATE ProductosBases
         SET Estado = 1
       WHERE CodigoConsola = v_Codigo;

  ELSEIF v_Tipo = 'Accesorio' THEN
      UPDATE AccesoriosBase
         SET EstadoAccesorio = 1
       WHERE CodigoAccesorio = v_Codigo;

  ELSEIF v_Tipo = 'Insumo' THEN
      UPDATE InsumosBase
         SET Cantidad = Cantidad + v_Cant
       WHERE CodigoInsumo = v_Codigo;

  ELSEIF v_Tipo = 'Servicio' THEN
      UPDATE InsumosBase  I
      JOIN   InsumosXServicio S ON I.CodigoInsumo = S.CodigoInsumoFK
      SET    I.Cantidad = I.Cantidad + (S.CantidadDescargue * v_Cant)
      WHERE  S.IdServicioFK = CAST(v_Codigo AS UNSIGNED);
  END IF;

  /* Eliminar el artículo del detalle del carrito */
  DELETE FROM DetalleCarritoVentas
  WHERE IdDetalleCarritoPK = p_IdDetalle;

  /* Verificar si el carrito quedó vacío */
  SELECT COUNT(*) INTO v_Existe
  FROM DetalleCarritoVentas
  WHERE IdCarritoFK = v_IdCarrito;

  IF v_Existe = 0 THEN
    DELETE FROM CarritoVentas
    WHERE IdCarritoPK = v_IdCarrito;
  END IF;

END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarCarritoUsuarioxClienteEnCurso
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-06-25
-- DESCRIPCIÓN: Lista el carrito en curso entre un cliente y usuario, para suministrar esta informacion al punto de venta.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE ListarCarritoUsuarioxClienteEnCurso(
    IN p_IdUsuario INT,
    IN p_IdCliente INT
)
BEGIN
    SELECT
        cv.IdCarritoPK,
        cv.IdUsuarioFK,
        cv.IdClienteFK,
        cv.FechaCreacion,
        cv.Comentario,
        cv.EstadoCarrito,
        dcv.IdDetalleCarritoPK,
        dcv.TipoArticulo,
        dcv.CodigoArticulo,
        dcv.PrecioVenta,
        dcv.Descuento,
        dcv.SubtotalSinIVA,
        dcv.Cantidad,
        -- Construcción dinámica del Nombre del Artículo usando CASE
        CASE
            WHEN dcv.TipoArticulo = 'Producto' THEN CONCAT(f.NombreFabricante, ' - ', cp.NombreCategoria, ' - ', sp.NombreSubcategoria)
            WHEN dcv.TipoArticulo = 'Accesorio' THEN CONCAT(fa.NombreFabricanteAccesorio, ' - ', caa.NombreCategoriaAccesorio, ' - ', saa.NombreSubcategoriaAccesorio)
            WHEN dcv.TipoArticulo = 'Insumo' THEN CONCAT(fi.NombreFabricanteInsumos, ' - ', cii.NombreCategoriaInsumos, ' - ', sii.NombreSubcategoriaInsumos)
            WHEN dcv.TipoArticulo = 'Servicio' THEN sb.DescripcionServicio
            ELSE 'Artículo Desconocido'
        END AS NombreArticulo,
        -- Obtención dinámica del Link de la Imagen usando CASE
        CASE
            WHEN dcv.TipoArticulo = 'Producto' THEN cc.LinkImagen
            WHEN dcv.TipoArticulo = 'Accesorio' THEN ca.LinkImagen
            WHEN dcv.TipoArticulo = 'Insumo' THEN ci.LinkImagen
            WHEN dcv.TipoArticulo = 'Servicio' THEN 'default_servicio.png'
            ELSE ''
        END AS LinkImagen

    FROM CarritoVentas cv
    JOIN DetalleCarritoVentas dcv ON cv.IdCarritoPK = dcv.IdCarritoFK

    -- Joins para obtener la información de Productos
    LEFT JOIN ProductosBases pb ON dcv.CodigoArticulo = pb.CodigoConsola AND dcv.TipoArticulo = 'Producto'
    LEFT JOIN CatalogoConsolas cc ON pb.Modelo = cc.IdModeloConsolaPK
    LEFT JOIN FABRICANTES f ON cc.Fabricante = f.IdFabricantePK
    LEFT JOIN CategoriasProductos cp ON cc.Categoria = cp.IdCategoriaPK
    LEFT JOIN SubcategoriasProductos sp ON cc.Subcategoria = sp.IdSubcategoria

    -- Joins para obtener la información de Accesorios
    LEFT JOIN AccesoriosBase ab ON dcv.CodigoArticulo = ab.CodigoAccesorio AND dcv.TipoArticulo = 'Accesorio'
    LEFT JOIN CatalogoAccesorios ca ON ab.ModeloAccesorio = ca.IdModeloAccesorioPK
    LEFT JOIN FabricanteAccesorios fa ON ca.FabricanteAccesorio = fa.IdFabricanteAccesorioPK
    LEFT JOIN CategoriasAccesorios caa ON ca.CategoriaAccesorio = caa.IdCategoriaAccesorioPK
    LEFT JOIN SubcategoriasAccesorios saa ON ca.SubcategoriaAccesorio = saa.IdSubcategoriaAccesorio

    -- Joins para obtener la información de Insumos
    LEFT JOIN InsumosBase ib ON dcv.CodigoArticulo = ib.CodigoInsumo AND dcv.TipoArticulo = 'Insumo'
    LEFT JOIN CatalogoInsumos ci ON ib.ModeloInsumo = ci.IdModeloInsumosPK
    LEFT JOIN FabricanteInsumos fi ON ci.FabricanteInsumos = fi.IdFabricanteInsumosPK
    LEFT JOIN CategoriasInsumos cii ON ci.CategoriaInsumos = cii.IdCategoriaInsumosPK
    LEFT JOIN SubcategoriasInsumos sii ON ci.SubcategoriaInsumos = sii.IdSubcategoriaInsumos

    -- Join para obtener la información de Servicios
    LEFT JOIN ServiciosBase sb ON CAST(sb.IdServicioPK AS CHAR) = dcv.CodigoArticulo AND dcv.TipoArticulo = 'Servicio'

    WHERE
        cv.IdUsuarioFK = p_IdUsuario
        AND cv.IdClienteFK = p_IdCliente
        AND cv.EstadoCarrito = 'En curso';

END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_Carrito_ActualizarDetalle
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-06-25
-- DESCRIPCIÓN: Actualiza detalle de un carrito.
------------------------------------------------------------------------------*/
DELIMITER //
CREATE PROCEDURE sp_Carrito_ActualizarDetalle(
    IN p_IdUsuario INT,
    IN p_IdCliente INT,
    IN p_CodigoArticulo VARCHAR(25),
    IN p_TipoArticulo ENUM('Producto', 'Accesorio', 'Insumo', 'Servicio'),
    IN p_NuevoDescuento DECIMAL(10,2),
    IN p_NuevoSubtotalSinIVA DECIMAL(10,2)
)
BEGIN
    DECLARE v_IdCarrito INT;

    -- 1. Buscar el carrito activo para el usuario y cliente especificados.
    SELECT IdCarritoPK INTO v_IdCarrito
    FROM CarritoVentas
    WHERE IdUsuarioFK = p_IdUsuario AND IdClienteFK = p_IdCliente AND EstadoCarrito = 'En curso'
    LIMIT 1;

    -- 2. Si se encuentra un carrito, proceder a actualizar el detalle.
    IF v_IdCarrito IS NOT NULL THEN
        UPDATE DetalleCarritoVentas
        SET
            Descuento = p_NuevoDescuento,
            SubtotalSinIVA = p_NuevoSubtotalSinIVA
        WHERE
            IdCarritoFK = v_IdCarrito
            AND CodigoArticulo = p_CodigoArticulo
            AND TipoArticulo = p_TipoArticulo;
    ELSE
        -- 3. Si no se encuentra un carrito, lanzar un error.
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'No se encontró un carrito de venta activo para el usuario y cliente especificado.';
    END IF;
END //
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_Carrito_AgregarArticulo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-06-25
-- DESCRIPCIÓN: Crea el detalle de un carrito.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_Carrito_AgregarArticulo(
    IN p_IdUsuario INT,
    IN p_IdCliente INT,
    IN p_TipoArticulo ENUM('Producto', 'Accesorio', 'Insumo', 'Servicio'),
    IN p_CodigoArticulo VARCHAR(25),
    IN p_PrecioVenta DECIMAL(10,2),
    IN p_Descuento DECIMAL(10,2),
    IN p_Cantidad INT,
    IN p_PrecioBaseOriginal DECIMAL(10,2),
    IN p_MargenAplicado DECIMAL(5,2),
    IN p_IdMargenFK INT -- Se acepta el parámetro, pero no se usa en la inserción
)
BEGIN
    DECLARE v_IdCarrito INT;
    DECLARE v_IdDetalleCarrito INT;
    DECLARE v_CantidadActual INT DEFAULT 0;
    DECLARE v_EstadoActual INT;
    DECLARE v_StockActual INT;

    -- 1. Validar cantidad (sin cambios)
    IF p_Cantidad <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La cantidad debe ser un número positivo.';
    END IF;

    -- 2. Buscar o crear carrito (sin cambios)
    SELECT IdCarritoPK INTO v_IdCarrito
    FROM CarritoVentas
    WHERE IdUsuarioFK = p_IdUsuario AND IdClienteFK = p_IdCliente AND EstadoCarrito = 'En curso'
    LIMIT 1;

    IF v_IdCarrito IS NULL THEN
        INSERT INTO CarritoVentas (IdUsuarioFK, IdClienteFK, EstadoCarrito)
        VALUES (p_IdUsuario, p_IdCliente, 'En curso');
        SET v_IdCarrito = LAST_INSERT_ID();
    END IF;

    -- 3. Lógica de gestión de inventario para reservar artículos
    IF p_TipoArticulo = 'Producto' THEN
        -- Se verifica el estado actual
        SELECT Estado INTO v_EstadoActual FROM ProductosBases WHERE CodigoConsola = p_CodigoArticulo;
        IF v_EstadoActual = 11 THEN -- 'En proceso de venta'
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Este producto ya está en un proceso de venta.';
        END IF;
        -- Se cambia el estado para reservarlo
        UPDATE ProductosBases SET Estado = 11 WHERE CodigoConsola = p_CodigoArticulo;

    ELSEIF p_TipoArticulo = 'Accesorio' THEN
        -- Se hace lo mismo para los accesorios
        SELECT EstadoAccesorio INTO v_EstadoActual FROM AccesoriosBase WHERE CodigoAccesorio = p_CodigoArticulo;
        IF v_EstadoActual = 11 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Este accesorio ya está en un proceso de venta.';
        END IF;
        UPDATE AccesoriosBase SET EstadoAccesorio = 11 WHERE CodigoAccesorio = p_CodigoArticulo;

    ELSEIF p_TipoArticulo = 'Insumo' THEN
        -- Para insumos, se descuenta el stock inmediatamente para reservarlo
        START TRANSACTION;
            SELECT Cantidad INTO v_StockActual FROM InsumosBase WHERE CodigoInsumo = p_CodigoArticulo FOR UPDATE;
            IF v_StockActual < p_Cantidad THEN
                ROLLBACK;
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock insuficiente para el insumo solicitado.';
            END IF;
            UPDATE InsumosBase SET Cantidad = Cantidad - p_Cantidad WHERE CodigoInsumo = p_CodigoArticulo;
        COMMIT;

    END IF;
    
    -- 4. Insertar o actualizar el artículo en la tabla DetalleCarritoVentas
    SELECT IdDetalleCarritoPK, Cantidad INTO v_IdDetalleCarrito, v_CantidadActual
    FROM DetalleCarritoVentas
    WHERE IdCarritoFK = v_IdCarrito AND TipoArticulo = p_TipoArticulo AND CodigoArticulo = p_CodigoArticulo
    LIMIT 1;

    IF v_IdDetalleCarrito IS NOT NULL THEN
        UPDATE DetalleCarritoVentas
        SET Cantidad = v_CantidadActual + p_Cantidad
        WHERE IdDetalleCarritoPK = v_IdDetalleCarrito;
    ELSE
        -- La inserción sigue ignorando IdMargenFK como lo decidimos
        INSERT INTO DetalleCarritoVentas (
            IdCarritoFK, TipoArticulo, CodigoArticulo, PrecioVenta, Descuento, 
            SubtotalSinIVA, Cantidad, PrecioBaseOriginal, MargenAplicado
        )
        VALUES (
            v_IdCarrito, p_TipoArticulo, p_CodigoArticulo, p_PrecioVenta, p_Descuento,
            (p_PrecioVenta * (1 - p_Descuento/100) * p_Cantidad), 
            p_Cantidad, p_PrecioBaseOriginal, p_MargenAplicado
        );
    END IF;

    SELECT v_IdCarrito AS IdCarritoUsado;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_Carrito_DisminuirArticulo
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-06-25
-- DESCRIPCIÓN: Disminuye la cantidad de articulos, accesorios o insumos en el detalle de un carrito.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_Carrito_DisminuirArticulo(
    IN p_IdUsuario INT,
    IN p_IdCliente INT,
    IN p_TipoArticulo ENUM('Producto', 'Accesorio', 'Insumo', 'Servicio'),
    IN p_CodigoArticulo VARCHAR(25)
)
BEGIN
    DECLARE v_IdCarrito INT;
    DECLARE v_IdDetalleCarritoPK INT;
    DECLARE v_CantidadActual INT;
    DECLARE v_IdServicio BIGINT;

    -- 1. Validar que el tipo de artículo sea disminuible
    IF p_TipoArticulo NOT IN ('Insumo', 'Servicio') THEN
        SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Este procedimiento solo puede disminuir Insumos o Servicios. Para Productos y Accesorios, use la eliminación completa.';
    END IF;

    -- 2. Localizar el carrito activo
    SELECT IdCarritoPK INTO v_IdCarrito
    FROM CarritoVentas
    WHERE IdUsuarioFK = p_IdUsuario AND IdClienteFK = p_IdCliente AND EstadoCarrito = 'En curso'
    LIMIT 1;

    IF v_IdCarrito IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontró un carrito activo para el usuario y cliente especificado.';
    END IF;

    -- 3. Localizar la línea de detalle
    SELECT IdDetalleCarritoPK, Cantidad 
    INTO v_IdDetalleCarritoPK, v_CantidadActual
    FROM DetalleCarritoVentas 
    WHERE IdCarritoFK = v_IdCarrito 
      AND TipoArticulo = p_TipoArticulo 
      AND CodigoArticulo = p_CodigoArticulo
    LIMIT 1;

    IF v_IdDetalleCarritoPK IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El artículo especificado no existe en el carrito actual.';
    END IF;
    
    -- 4. Decidir si disminuir o eliminar
    IF v_CantidadActual > 1 THEN
        -- Disminuir y restaurar inventario de UNA unidad
        IF p_TipoArticulo = 'Insumo' THEN
            UPDATE InsumosBase SET Cantidad = Cantidad + 1 WHERE CodigoInsumo = p_CodigoArticulo;
            
        ELSEIF p_TipoArticulo = 'Servicio' THEN
            SET v_IdServicio = CAST(p_CodigoArticulo AS UNSIGNED);
            UPDATE InsumosBase I
            JOIN InsumosXServicio S ON I.CodigoInsumo = S.CodigoInsumoFK
            SET I.Cantidad = I.Cantidad + S.CantidadDescargue
            WHERE S.IdServicioFK = v_IdServicio;
        END IF;

        -- Actualizar cantidad en el carrito
        UPDATE DetalleCarritoVentas
        SET Cantidad = Cantidad - 1,
            SubtotalSinIVA = (Cantidad) * (PrecioVenta * (1 - Descuento/100))
        WHERE IdDetalleCarritoPK = v_IdDetalleCarritoPK;

        SELECT 'Cantidad disminuida en 1.' AS 'Resultado';

    ELSE
        -- Si solo queda uno, se llama al procedimiento de eliminar con los parámetros correctos.
        CALL sp_Carrito_EliminarLinea(p_IdUsuario, p_IdCliente, p_TipoArticulo, p_CodigoArticulo);
        SELECT 'Era el último artículo en la línea, se ha eliminado por completo.' AS 'Resultado';
    END IF;

END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_Carrito_EliminarLineaCompleta
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-06-25
-- DESCRIPCIÓN: Borra la linea completa de un articulo del pedido.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_Carrito_EliminarLineaCompleta(
    IN p_IdUsuario INT,
    IN p_IdCliente INT,
    IN p_TipoArticulo ENUM('Producto', 'Accesorio', 'Insumo', 'Servicio'),
    IN p_CodigoArticulo VARCHAR(25)
)
BEGIN
    DECLARE v_IdCarrito INT;
    DECLARE v_IdDetalleCarritoPK INT;
    DECLARE v_CantidadEnCarrito INT;
    DECLARE v_EstadoAnterior INT;
    DECLARE v_ItemsRestantes INT;

    -- 1. Localizar el carrito activo para el usuario y cliente
    SELECT IdCarritoPK INTO v_IdCarrito
    FROM CarritoVentas
    WHERE IdUsuarioFK = p_IdUsuario AND IdClienteFK = p_IdCliente AND EstadoCarrito = 'En curso'
    LIMIT 1;

    IF v_IdCarrito IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontró un carrito activo para el usuario y cliente especificado.';
    END IF;

    -- 2. Localizar la línea de detalle y obtener su ID y cantidad
    SELECT IdDetalleCarritoPK, Cantidad 
    INTO v_IdDetalleCarritoPK, v_CantidadEnCarrito
    FROM DetalleCarritoVentas
    WHERE IdCarritoFK = v_IdCarrito 
      AND TipoArticulo = p_TipoArticulo 
      AND CodigoArticulo = p_CodigoArticulo
    LIMIT 1;

    IF v_IdDetalleCarritoPK IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El artículo especificado no se encontró en el carrito actual.';
    END IF;

    -- 3. Revertir cambios en el inventario según el tipo de artículo
    IF p_TipoArticulo = 'Producto' THEN
        -- Buscar el estado original en el historial
        SELECT EstadoAnterior INTO v_EstadoAnterior 
        FROM HistorialEstadoProducto 
        WHERE CodigoConsola = p_CodigoArticulo AND EstadoNuevo = 11
        ORDER BY FechaCambio DESC LIMIT 1;
        
        IF v_EstadoAnterior IS NOT NULL THEN
            UPDATE ProductosBases SET Estado = v_EstadoAnterior WHERE CodigoConsola = p_CodigoArticulo;
        END IF;

    ELSEIF p_TipoArticulo = 'Accesorio' THEN
        SELECT EstadoAnterior INTO v_EstadoAnterior 
        FROM HistorialEstadoAccesorio 
        WHERE CodigoAccesorio = p_CodigoArticulo AND EstadoNuevo = 11
        ORDER BY FechaCambio DESC LIMIT 1;
        
        IF v_EstadoAnterior IS NOT NULL THEN
            UPDATE AccesoriosBase SET EstadoAccesorio = v_EstadoAnterior WHERE CodigoAccesorio = p_CodigoArticulo;
        END IF;

    ELSEIF p_TipoArticulo = 'Insumo' THEN
        -- Devolver la cantidad total de la línea al stock
        UPDATE InsumosBase SET Cantidad = Cantidad + v_CantidadEnCarrito WHERE CodigoInsumo = p_CodigoArticulo;

    ELSEIF p_TipoArticulo = 'Servicio' THEN
        -- Devolver la cantidad total de insumos asociados a todas las unidades del servicio en la línea
        UPDATE InsumosBase I
        JOIN InsumosXServicio S ON I.CodigoInsumo = S.CodigoInsumoFK
        SET I.Cantidad = I.Cantidad + (S.CantidadDescargue * v_CantidadEnCarrito)
        WHERE S.IdServicioFK = CAST(p_CodigoArticulo AS UNSIGNED);
    END IF;

    -- 4. Eliminar la línea del detalle del carrito usando el ID que localizamos
    DELETE FROM DetalleCarritoVentas WHERE IdDetalleCarritoPK = v_IdDetalleCarritoPK;

    -- 5. Verificar si el carrito quedó vacío y eliminarlo si es necesario
    SELECT COUNT(*) INTO v_ItemsRestantes FROM DetalleCarritoVentas WHERE IdCarritoFK = v_IdCarrito;
    
    IF v_ItemsRestantes = 0 THEN
        DELETE FROM CarritoVentas WHERE IdCarritoPK = v_IdCarrito;
    END IF;
    
    SELECT 'Línea de artículo eliminada y inventario restaurado correctamente.' AS 'Resultado';

END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_Carrito_LimpiarDetallesPostVenta
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-06-25
-- DESCRIPCIÓN: Este procedimiento elimina de forma segura los artículos del detalle del carrito
-- una vez que la venta ha sido procesada y el inventario ya fue descargado.
-- NO devuelve ningún artículo al stock.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_Carrito_LimpiarDetallesPostVenta (
    IN p_IdCarrito INT
)
BEGIN    
    DELETE FROM DetalleCarritoVentas WHERE IdCarritoFK = p_IdCarrito;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_Carrito_LimpiarPorUsuarioCliente
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-06-25
-- DESCRIPCIÓN: Este procedimiento elimina de forma segura un carrito y devuelve el inventario al estado o stock anterior.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_Carrito_LimpiarPorUsuarioCliente(IN p_IdUsuario INT, IN p_IdCliente INT)
BEGIN
    -- Declaramos variables
    DECLARE v_IdCarrito INT;
    DECLARE v_TipoArticulo ENUM('Producto', 'Accesorio', 'Insumo', 'Servicio');
    DECLARE v_CodigoArticulo VARCHAR(25);
    DECLARE v_Cantidad INT;
    DECLARE v_EstadoAnterior INT; 
    DECLARE done INT DEFAULT FALSE;

    -- Cursor (sin cambios)
    DECLARE cur_articulos CURSOR FOR
        SELECT TipoArticulo, CodigoArticulo, Cantidad
        FROM DetalleCarritoVentas
        WHERE IdCarritoFK = v_IdCarrito;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Encontrar el ID del carrito activo (sin cambios)
    SELECT IdCarritoPK INTO v_IdCarrito
    FROM CarritoVentas
    WHERE IdUsuarioFK = p_IdUsuario AND IdClienteFK = p_IdCliente AND EstadoCarrito = 'En curso'
    LIMIT 1;

    IF v_IdCarrito IS NOT NULL THEN
        START TRANSACTION;

        OPEN cur_articulos;

        read_loop: LOOP
            FETCH cur_articulos INTO v_TipoArticulo, v_CodigoArticulo, v_Cantidad;
            IF done THEN
                LEAVE read_loop;
            END IF;

            CASE v_TipoArticulo
                WHEN 'Producto' THEN                    
                    -- PASO 1: Leer el estado anterior y guardarlo en una variable
                    SELECT EstadoAnterior INTO v_EstadoAnterior
                    FROM HistorialEstadoProducto
                    WHERE CodigoConsola = v_CodigoArticulo AND EstadoNuevo = 11 -- 'En proceso de venta'
                    ORDER BY FechaCambio DESC
                    LIMIT 1;
                    
                    -- PASO 2: Usar la variable para actualizar la tabla.
                    -- Si no se encontró historial, se usa 2 ('Usado') por defecto.
                    UPDATE ProductosBases
                    SET Estado = COALESCE(v_EstadoAnterior, 2)
                    WHERE CodigoConsola = v_CodigoArticulo;

                WHEN 'Accesorio' THEN
                    -- Se aplica la misma lógica de dos pasos para los accesorios
                    SELECT EstadoAnterior INTO v_EstadoAnterior
                    FROM HistorialEstadoAccesorio
                    WHERE CodigoAccesorio = v_CodigoArticulo AND EstadoNuevo = 11
                    ORDER BY FechaCambio DESC
                    LIMIT 1;
                    
                    UPDATE AccesoriosBase
                    SET EstadoAccesorio = COALESCE(v_EstadoAnterior, 2)
                    WHERE CodigoAccesorio = v_CodigoArticulo;                    

                WHEN 'Insumo' THEN
                    UPDATE InsumosBase SET Cantidad = Cantidad + v_Cantidad WHERE CodigoInsumo = v_CodigoArticulo;

                WHEN 'Servicio' THEN
                    UPDATE InsumosBase i
                    JOIN InsumosXServicio ixs ON i.CodigoInsumo = ixs.CodigoInsumoFK
                    SET i.Cantidad = i.Cantidad + (ixs.CantidadDescargue * v_Cantidad)
                    WHERE ixs.IdServicioFK = CAST(v_CodigoArticulo AS UNSIGNED);
            END CASE;

            -- Resetear la variable para la siguiente iteración del bucle
            SET v_EstadoAnterior = NULL;

        END LOOP;

        CLOSE cur_articulos;

        -- Eliminar los registros del carrito (sin cambios)
        DELETE FROM DetalleCarritoVentas WHERE IdCarritoFK = v_IdCarrito;
        DELETE FROM CarritoVentas WHERE IdCarritoPK = v_IdCarrito;

        COMMIT;
    END IF;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_Carrito_LimpiarPorUsuarioCliente
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-06-25
-- DESCRIPCIÓN: Este procedimiento lista los carritos vigentes por usuario.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_ConsultarCarritosVigentes(IN p_IdUsuario INT)
BEGIN
    -- Declarar una variable para almacenar el ID del rol del usuario.
    DECLARE v_IdRol INT;

    -- Obtener el ID del rol directamente desde la tabla Usuarios.
    SELECT IdRolFK INTO v_IdRol
    FROM Usuarios
    WHERE IdUsuarioPK = p_IdUsuario;

    -- Comprobar el ID del rol del usuario y ejecutar la consulta correspondiente.
    -- Si el rol es 1 (Admin), puede ver todos los carritos.
    IF v_IdRol = 1 THEN
        SELECT
            cv.IdCarritoPK,
            cv.FechaCreacion,
            u.Nombre AS UsuarioCreador,
            c.NombreCliente,
            cv.Comentario,
            cv.EstadoCarrito,
            cv.IdClienteFK,
            cv.IdUsuarioFK -- Es buena práctica incluirlo para consistencia
        FROM CarritoVentas cv
        JOIN Usuarios u ON cv.IdUsuarioFK = u.IdUsuarioPK
        LEFT JOIN Clientes c ON cv.IdClienteFK = c.IdClientePK
        WHERE cv.EstadoCarrito = 'En curso'
        ORDER BY cv.FechaCreacion DESC;

    -- Si el rol es 2 (Vendedor), solo puede ver sus propios carritos.
    ELSEIF v_IdRol = 2 THEN
        SELECT
            cv.IdCarritoPK,
            cv.FechaCreacion,
            u.Nombre AS UsuarioCreador,
            c.NombreCliente,
            cv.Comentario,
            cv.EstadoCarrito,
            cv.IdClienteFK,
            cv.IdUsuarioFK
        FROM CarritoVentas cv
        JOIN Usuarios u ON cv.IdUsuarioFK = u.IdUsuarioPK
        LEFT JOIN Clientes c ON cv.IdClienteFK = c.IdClientePK
        WHERE cv.EstadoCarrito = 'En curso' AND cv.IdUsuarioFK = p_IdUsuario
        ORDER BY cv.FechaCreacion DESC;
    END IF;
    -- Nota: Si el rol es 3 (Logística) o cualquier otro, ninguna condición se cumple
    -- y el procedimiento terminará sin devolver resultados.
END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_LiberarCarrito
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-06-25
-- DESCRIPCIÓN: Este procedimiento elimina de forma segura un carrito y devuelve el inventario al estado o stock anterior, se usa en la pantalla de listado de carritos.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_LiberarCarrito(IN p_IdCarrito INT)
BEGIN
    -- Declarar variables para iterar y para guardar el estado anterior
    DECLARE v_TipoArticulo ENUM('Producto', 'Accesorio', 'Insumo', 'Servicio');
    DECLARE v_CodigoArticulo VARCHAR(25);
    DECLARE v_Cantidad INT;
    DECLARE v_EstadoAnterior INT; -- <-- Variable para guardar el estado que leemos
    DECLARE done INT DEFAULT FALSE;

    -- Cursor para leer los artículos del carrito
    DECLARE cur_articulos CURSOR FOR
        SELECT TipoArticulo, CodigoArticulo, Cantidad
        FROM DetalleCarritoVentas
        WHERE IdCarritoFK = p_IdCarrito;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Manejador de errores para la transacción
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: No se pudo liberar el carrito. Se revirtieron los cambios.';
    END;

    -- Iniciar la transacción
    START TRANSACTION;

    OPEN cur_articulos;

    read_loop: LOOP
        FETCH cur_articulos INTO v_TipoArticulo, v_CodigoArticulo, v_Cantidad;
        IF done THEN
            LEAVE read_loop;
        END IF;

        CASE v_TipoArticulo
            WHEN 'Producto' THEN
                -- =============================================================
                -- ## INICIO DE LA CORRECCIÓN ##
                -- PASO 1: Leer el estado anterior y guardarlo en la variable
                SELECT EstadoAnterior INTO v_EstadoAnterior
                FROM HistorialEstadoProducto
                WHERE CodigoConsola = v_CodigoArticulo AND EstadoNuevo = 11 -- 'En proceso de venta'
                ORDER BY FechaCambio DESC
                LIMIT 1;

                -- PASO 2: Usar la variable para actualizar la tabla
                UPDATE ProductosBases
                SET Estado = COALESCE(v_EstadoAnterior, 2) -- Fallback a 'Usado'
                WHERE CodigoConsola = v_CodigoArticulo;

            WHEN 'Accesorio' THEN
                -- Se aplica la misma lógica de dos pasos para los accesorios
                SELECT EstadoAnterior INTO v_EstadoAnterior
                FROM HistorialEstadoAccesorio
                WHERE CodigoAccesorio = v_CodigoArticulo AND EstadoNuevo = 11
                ORDER BY FechaCambio DESC
                LIMIT 1;
                
                UPDATE AccesoriosBase
                SET EstadoAccesorio = COALESCE(v_EstadoAnterior, 2) -- Fallback a 'Usado'
                WHERE CodigoAccesorio = v_CodigoArticulo;
                -- ## FIN DE LA CORRECCIÓN ##
                -- =============================================================

            WHEN 'Insumo' THEN
                UPDATE InsumosBase SET Cantidad = Cantidad + v_Cantidad WHERE CodigoInsumo = v_CodigoArticulo;

            WHEN 'Servicio' THEN
                UPDATE InsumosBase i
                JOIN InsumosXServicio ixs ON i.CodigoInsumo = ixs.CodigoInsumoFK
                SET i.Cantidad = i.Cantidad + (ixs.CantidadDescargue * v_Cantidad)
                WHERE ixs.IdServicioFK = CAST(v_CodigoArticulo AS UNSIGNED);
        END CASE;

        -- Resetear la variable para la siguiente iteración
        SET v_EstadoAnterior = NULL;

    END LOOP;

    CLOSE cur_articulos;

    -- Ahora que el inventario está restaurado, eliminar los registros del carrito
    DELETE FROM DetalleCarritoVentas WHERE IdCarritoFK = p_IdCarrito;
    DELETE FROM CarritoVentas WHERE IdCarritoPK = p_IdCarrito;

    -- Confirmar los cambios
    COMMIT;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_ObtenerContenidoCarrito
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-06-25
-- DESCRIPCIÓN: Este procedimiento consigue los datos de un carrito por id de cliente y usuario, se usa para autocompletar carrito si hay un carrito vigente entre estos dos.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_ObtenerContenidoCarrito(
    IN p_IdUsuarioSesion INT, -- El ID del usuario que está logueado
    IN p_IdCliente INT       -- El ID del cliente del carrito a cargar
)
BEGIN
    DECLARE v_IdRol INT;

    -- Obtiene el rol del usuario que está haciendo la petición.
    SELECT IdRolFK INTO v_IdRol FROM Usuarios WHERE IdUsuarioPK = p_IdUsuarioSesion;

    -- Si es Admin (Rol 1), busca el carrito activo para el cliente, sin importar el dueño.
    IF v_IdRol = 1 THEN
        SELECT
            dc.TipoArticulo,
            dc.CodigoArticulo,
            dc.Cantidad,
            dc.PrecioVenta,
            dc.Descuento,
            dc.SubtotalSinIVA,            
            dc.PrecioBaseOriginal, 
            dc.MargenAplicado  
        FROM DetalleCarritoVentas dc
        JOIN CarritoVentas cv ON dc.IdCarritoFK = cv.IdCarritoPK
        WHERE cv.IdClienteFK = p_IdCliente AND cv.EstadoCarrito = 'En curso';
        
    -- Si es Vendedor (Rol 2), solo puede ver su propio carrito para ese cliente.
    ELSEIF v_IdRol = 2 THEN
        SELECT
            dc.TipoArticulo,
            dc.CodigoArticulo,
            dc.Cantidad,
            dc.PrecioVenta,
            dc.Descuento,
            dc.SubtotalSinIVA,
            dc.PrecioBaseOriginal,
            dc.MargenAplicado
        FROM DetalleCarritoVentas dc
        JOIN CarritoVentas cv ON dc.IdCarritoFK = cv.IdCarritoPK
        WHERE cv.IdUsuarioFK = p_IdUsuarioSesion AND cv.IdClienteFK = p_IdCliente AND cv.EstadoCarrito = 'En curso';
        
    END IF;
END$$
DELIMITER ;

/*-- VII.B. Subsección: Procedimientos clientes ---------------------------*/

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ActualizarCliente
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-29
-- DESCRIPCIÓN: Este procedimiento actualiza el cliente.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE ActualizarCliente(
    IN p_IdClientePK INT,
    IN p_NombreCliente VARCHAR(255),
    IN p_DNI VARCHAR(255),
    IN p_RUC VARCHAR(255),
    IN p_Telefono VARCHAR(255),
    IN p_CorreoElectronico VARCHAR(255),
    IN p_Direccion VARCHAR(255),
    IN p_Comentarios VARCHAR(1000),
    IN p_Estado BOOLEAN
)
BEGIN
    UPDATE Clientes
    SET 
        NombreCliente = p_NombreCliente,
        DNI = p_DNI,
        RUC = p_RUC,
        Telefono = p_Telefono,
        CorreoElectronico = p_CorreoElectronico,
        Direccion = p_Direccion,
        Comentarios = p_Comentarios,
        Estado = p_Estado
    WHERE 
        IdClientePK = p_IdClientePK;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: EliminarCliente
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-29
-- DESCRIPCIÓN: Este procedimiento elimina el cliente.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE EliminarCliente(
    IN p_IdClientePK INT
)
BEGIN
    UPDATE Clientes
    SET Estado = 0
    WHERE IdClientePK = p_IdClientePK;
END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: IngresarCliente
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-29
-- DESCRIPCIÓN: Este procedimiento ingresar un cliente.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE IngresarCliente(
    IN p_NombreCliente VARCHAR(255),
    IN p_DNI VARCHAR(255),
    IN p_RUC VARCHAR(255),
    IN p_Telefono VARCHAR(255),
    IN p_CorreoElectronico VARCHAR(255),
    IN p_Direccion VARCHAR(255),
    IN p_Comentarios VARCHAR(1000)
)
BEGIN
    INSERT INTO Clientes (
        NombreCliente, 
        DNI, 
        RUC, 
        Telefono, 
        CorreoElectronico, 
        Direccion, 
        Comentarios,
        FechaRegistro, 
        Estado
    ) VALUES (
        p_NombreCliente, 
        p_DNI, 
        p_RUC, 
        p_Telefono, 
        p_CorreoElectronico, 
        p_Direccion, 
        p_Comentarios, 
        CURDATE(), 
        1
    );    
    -- Devolver el cliente recién creado para que el backend pueda usarlo.
    -- Esta línea es crucial para que el backend reciba los datos del nuevo cliente.
    SELECT * FROM Clientes WHERE IdClientePK = LAST_INSERT_ID();
END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarClienteXId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-29
-- DESCRIPCIÓN: Este procedimiento para listar un cliente.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE ListarClienteXId(IN clientId INT)
BEGIN
    IF clientId IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El ID del cliente no puede ser NULL';
    END IF;

    SELECT 
        IdClientePK AS idClientePK,
        NombreCliente AS nombreCliente,
        DNI AS dni,
        RUC AS ruc,
        Telefono AS telefono,
        CorreoElectronico AS correoElectronico,
        Direccion AS direccion,
         DATE_FORMAT(FechaRegistro, '%d/%m/%Y') as 'fechaRegistro',
		Comentarios,
        Estado AS estado
    FROM 
        Clientes
    WHERE 
        IdClientePK = clientId;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarTodosLosClientes
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-29
-- DESCRIPCIÓN: Este procedimiento para listar los clientes.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE ListarTodosLosClientes()
BEGIN
    SELECT 
        IdClientePK AS id,
        NombreCliente AS nombre,
        DNI AS dni,
        RUC AS ruc,
        Telefono AS telefono,
        CorreoElectronico AS correo,
        Direccion AS direccion,
        DATE_FORMAT(FechaRegistro, '%d/%m/%Y') as 'fechaRegistro',
        Estado AS estado
    FROM 
        Clientes;
END$$
DELIMITER ;

/*-- VII.C. Subsección: Procedimientos de notas de credito ---------------------------*/

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_AnularNotaCredito
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-29
-- DESCRIPCIÓN: Este procedimiento para anular una nota de credito.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_AnularNotaCredito(
    IN p_IdNotaCreditoPK INT,
    IN p_IdUsuarioAnuladorFK INT,
    IN p_MotivoAnulacion VARCHAR(255)
)
BEGIN
    DECLARE v_done INT DEFAULT FALSE;
    DECLARE v_tipo_articulo ENUM('Producto', 'Accesorio', 'Insumo', 'Servicio');
    DECLARE v_codigo_articulo VARCHAR(25);
    DECLARE v_cantidad INT;
    DECLARE v_estado_actual BOOLEAN;
    DECLARE v_IdVentaFK INT;

    -- Declaración del cursor para recorrer los detalles de la nota de crédito
    DECLARE cur_detalles CURSOR FOR 
        SELECT TipoArticulo, CodigoArticulo, Cantidad 
        FROM DetalleNotaCredito 
        WHERE IdNotaCreditoFK = p_IdNotaCreditoPK;

    -- Handler para el final del cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;

    -- Handler para errores SQL, revertirá toda la operación
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- 1. Verificar si la nota ya está anulada
    SELECT Estado, IdVentaFK INTO v_estado_actual, v_IdVentaFK
    FROM NotasCredito WHERE IdNotaCreditoPK = p_IdNotaCreditoPK;
    
    IF v_estado_actual = FALSE THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La Nota de Crédito ya se encuentra anulada.';
    END IF;

    -- 2. Anular la nota de crédito
    UPDATE NotasCredito
    SET Estado = 0
    WHERE IdNotaCreditoPK = p_IdNotaCreditoPK;

    -- 3. Abrir el cursor y empezar a revertir el inventario
    OPEN cur_detalles;

    read_loop: LOOP
        FETCH cur_detalles INTO v_tipo_articulo, v_codigo_articulo, v_cantidad;
        IF v_done THEN
            LEAVE read_loop;
        END IF;

        -- Revertir el stock según el tipo de artículo
        CASE v_tipo_articulo
            WHEN 'Producto' THEN
                -- CORREGIDO: El producto vuelve a estar 'Vendido' (estado 8), ya que se canceló su devolución.
                UPDATE ProductosBases SET Estado = 8 WHERE CodigoConsola = v_codigo_articulo;
            
            WHEN 'Accesorio' THEN
                -- CORREGIDO: El accesorio vuelve a estar 'Vendido' (estado 8).
                UPDATE AccesoriosBase SET EstadoAccesorio = 8 WHERE CodigoAccesorio = v_codigo_articulo;
            
            WHEN 'Insumo' THEN
                -- Se resta la cantidad que se había sumado al inventario.
                UPDATE InsumosBase SET Cantidad = Cantidad - v_cantidad WHERE CodigoInsumo = v_codigo_articulo;
            
            WHEN 'Servicio' THEN
                -- No hay cambios de inventario para servicios. Se ignora.
                BEGIN END;
        END CASE;
    END LOOP;

    CLOSE cur_detalles;
    
    IF v_IdVentaFK IS NOT NULL THEN
        UPDATE VentasBase SET IdEstadoVentaFK = 2 WHERE IdVentaPK = v_IdVentaFK;
    END IF;

    -- ==================================================================
    -- 4. Registrar la acción de anulación en el historial
    -- ==================================================================
    CALL sp_RegistrarHistorialNotaCredito(
        p_IdNotaCreditoPK,
        p_IdUsuarioAnuladorFK,
        'ANULACION',
        p_MotivoAnulacion
    );

    -- Si todo fue exitoso, confirma los cambios
    COMMIT;

END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_CrearNotaCredito
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-29
-- MODIFICADO: 2025-08-01
-- DESCRIPCIÓN: Este procedimiento para crear una nota de credito.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_CrearNotaCredito(
    IN p_IdVentaFK INT,
    IN p_UsuarioEmisorFK INT,
    IN p_Motivo TEXT,
    IN p_TotalCredito DECIMAL(10,2),
    IN p_DetallesJSON JSON,
    IN p_IdMotivoFK INT,
    IN p_AnularFacturaOriginal BOOLEAN 
)
BEGIN
    -- ... (el resto del código del procedimiento se mantiene igual) ...
    DECLARE v_IdNotaCredito INT;
    DECLARE i INT DEFAULT 0;
    DECLARE totalItems INT;
    
    -- Variables para el bucle
    DECLARE v_TipoArticulo VARCHAR(50);
    DECLARE v_CodigoArticulo VARCHAR(25);
    DECLARE v_Cantidad INT;
    DECLARE v_PrecioUnitario DECIMAL(10,2);
    DECLARE v_Subtotal DECIMAL(10,2);
    DECLARE v_ReingresarAInventario BOOLEAN;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- 1. Insertar la cabecera
    INSERT INTO NotasCredito (IdVentaFK, FechaEmision, Motivo, TotalCredito, UsuarioEmisorFK, IdMotivoFK)
    VALUES (p_IdVentaFK, NOW(), p_Motivo, p_TotalCredito, p_UsuarioEmisorFK, p_IdMotivoFK);

    SET v_IdNotaCredito = LAST_INSERT_ID();

    -- 2. Procesar los detalles del JSON
    SET totalItems = JSON_LENGTH(p_DetallesJSON);

    WHILE i < totalItems DO
        SET v_TipoArticulo = JSON_UNQUOTE(JSON_EXTRACT(p_DetallesJSON, CONCAT('$[', i, '].TipoArticulo')));
        SET v_CodigoArticulo = JSON_UNQUOTE(JSON_EXTRACT(p_DetallesJSON, CONCAT('$[', i, '].CodigoArticulo')));
        SET v_Cantidad = JSON_EXTRACT(p_DetallesJSON, CONCAT('$[', i, '].Cantidad'));
        SET v_PrecioUnitario = JSON_EXTRACT(p_DetallesJSON, CONCAT('$[', i, '].PrecioUnitario'));
        SET v_Subtotal = JSON_EXTRACT(p_DetallesJSON, CONCAT('$[', i, '].Subtotal'));
        SET v_ReingresarAInventario = JSON_EXTRACT(p_DetallesJSON, CONCAT('$[', i, '].ReingresarAInventario'));

        INSERT INTO DetalleNotaCredito (IdNotaCreditoFK, TipoArticulo, CodigoArticulo, Cantidad, PrecioUnitario, Subtotal)
        VALUES (v_IdNotaCredito, v_TipoArticulo, v_CodigoArticulo, v_Cantidad, v_PrecioUnitario, v_Subtotal);

        IF v_ReingresarAInventario = TRUE THEN
            IF v_TipoArticulo = 'Producto' THEN
                UPDATE ProductosBases SET Estado = 9 WHERE CodigoConsola = v_CodigoArticulo;
            ELSEIF v_TipoArticulo = 'Accesorio' THEN
                UPDATE AccesoriosBase SET EstadoAccesorio = 9 WHERE CodigoAccesorio = v_CodigoArticulo;
            ELSEIF v_TipoArticulo = 'Insumo' THEN
                UPDATE InsumosBase SET Cantidad = Cantidad + v_Cantidad WHERE CodigoInsumo = v_CodigoArticulo;
            END IF;
        END IF;

        SET i = i + 1;
    END WHILE;

    -- 4. Anular factura original si corresponde
    IF p_AnularFacturaOriginal = TRUE OR p_IdMotivoFK = 4 THEN
        UPDATE VentasBase SET IdEstadoVentaFK = 3 WHERE IdVentaPK = p_IdVentaFK;
    END IF;

    -- 5. Registrar la acción de creación en el historial
    CALL sp_RegistrarHistorialNotaCredito(
        v_IdNotaCredito,
        p_UsuarioEmisorFK,
        'CREACION',
        p_Motivo
    );

    COMMIT;

    SELECT v_IdNotaCredito AS IdNotaCreditoGenerada;

END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_ListarMotivosNotaCredito
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-29
-- DESCRIPCIÓN: Este procedimiento para listar los motivos de la aplicacion de una nota de credito.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_ListarMotivosNotaCredito()
BEGIN
    SELECT IdMotivoPK, Descripcion FROM MotivosNotaCredito WHERE Activo = TRUE;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_ListarNotasCredito
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-29
-- DESCRIPCIÓN: Este procedimiento para listar las notas de credito.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_ListarNotasCredito()
BEGIN
    SELECT 
        nc.IdNotaCreditoPK,
        nc.FechaEmision,
        vb.NumeroDocumento AS NumeroVentaOriginal,
        c.NombreCliente,
        mnc.Descripcion AS Motivo,
        nc.TotalCredito,
        u.Nombre AS UsuarioEmisor,
        CASE 
            WHEN nc.Estado = 1 THEN 'Activa'
            ELSE 'Anulada'
        END AS EstadoNota
    FROM 
        NotasCredito nc
    JOIN 
        VentasBase vb ON nc.IdVentaFK = vb.IdVentaPK
    JOIN 
        Usuarios u ON nc.UsuarioEmisorFK = u.IdUsuarioPK
    JOIN
        Clientes c ON vb.IdClienteFK = c.IdClientePK
    LEFT JOIN
        MotivosNotaCredito mnc ON nc.IdMotivoFK = mnc.IdMotivoPK
    ORDER BY 
        nc.FechaEmision DESC;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_ObtenerNotaCreditoPorId
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-29
-- DESCRIPCIÓN: Este procedimiento para obtener la informacion de una nota de credito.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_ObtenerNotaCreditoPorId(IN p_IdNotaCreditoPK INT)
BEGIN

    -- 1. Primera consulta: Obtiene los datos del encabezado de la Nota de Crédito.
    SELECT 
        nc.IdNotaCreditoPK,
        nc.FechaEmision,
        nc.TotalCredito,
        CASE 
            WHEN nc.Estado = 1 THEN 'Activa'
            ELSE 'Anulada'
        END AS EstadoNota,
        vb.NumeroDocumento AS VentaOriginal,
        c.NombreCliente,
        c.RUC,
        c.DNI,
        u_emisor.Nombre AS UsuarioEmisor, 
        mnc.Descripcion AS Motivo,
        nc.Motivo AS ObservacionesAdicionales,
        u_anulador.Nombre AS UsuarioAnulador,
        hnc.FechaAccion AS FechaAnulacion,
        hnc.Detalles AS MotivoAnulacion
        
    FROM 
        NotasCredito nc
    JOIN 
        VentasBase vb ON nc.IdVentaFK = vb.IdVentaPK
    JOIN
        Clientes c ON vb.IdClienteFK = c.IdClientePK
    -- Se une con Usuarios para obtener el nombre de QUIEN CREÓ la nota
    JOIN 
        Usuarios u_emisor ON nc.UsuarioEmisorFK = u_emisor.IdUsuarioPK
    LEFT JOIN
        MotivosNotaCredito mnc ON nc.IdMotivoFK = mnc.IdMotivoPK        
    -- Se une con el historial para encontrar el registro específico de anulación (si existe)
    LEFT JOIN 
        HistorialNotasCredito hnc ON nc.IdNotaCreditoPK = hnc.IdNotaCreditoFK AND hnc.TipoAccion = 'ANULACION'
    -- Se une de nuevo con Usuarios para obtener el nombre de QUIEN ANULÓ la nota (si existe)
    LEFT JOIN 
        Usuarios u_anulador ON hnc.IdUsuarioFK = u_anulador.IdUsuarioPK
        
    WHERE 
        nc.IdNotaCreditoPK = p_IdNotaCreditoPK;


    -- 2. Segunda consulta: Obtiene las líneas de detalle (SIN CAMBIOS)
    SELECT 
        dnc.TipoArticulo, 
        dnc.CodigoArticulo, 
        dnc.Cantidad, 
        dnc.PrecioUnitario, 
        dnc.Subtotal
    FROM 
        DetalleNotaCredito dnc
    WHERE 
        dnc.IdNotaCreditoFK = p_IdNotaCreditoPK;

END$$
DELIMITER ;

/*-- VII.D. Subsección: Procedimientos ventas ---------------------------*/

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: InsertarVentaProforma
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-29
-- DESCRIPCIÓN: Este procedimiento para insertar una proforma.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE InsertarVentaProforma (
    IN p_TipoDocumento INT,
    OUT p_NumeroDocumento VARCHAR(255),
    IN p_Subtotal DECIMAL(10,2),
    IN p_IVA DECIMAL(10,2),
    IN p_Total DECIMAL(10,2),
    IN p_Estado INT,
    IN p_MetodoPago INT,
    IN p_Usuario INT,
    IN p_Cliente INT,
    IN p_Observaciones VARCHAR(255),
    IN p_ReferenciaTransferencia VARCHAR(255),
    IN p_Detalles JSON
)
BEGIN
    DECLARE lastVentaId INT;
    DECLARE i INT DEFAULT 0;
    DECLARE totalItems INT;
    DECLARE nuevoCodigo VARCHAR(255);

    -- Generar código único para la proforma (sin cambios)
    SET nuevoCodigo = CONCAT('P-', LPAD((SELECT COUNT(*) + 1 FROM VentasBase WHERE IdTipoDocumentoFK = 2), 6, '0'));
    SET p_NumeroDocumento = nuevoCodigo;

    -- Insertar en tabla principal (VentasBase)
    INSERT INTO VentasBase (
        FechaCreacion, IdTipoDocumentoFK, NumeroDocumento,
        SubtotalVenta, IVA, TotalVenta,
        IdEstadoVentaFK, IdMetodoDePagoFK, 
        IdUsuarioFK, IdClienteFK, Observaciones
    )
    VALUES (
        NOW(), p_TipoDocumento, nuevoCodigo,
        p_Subtotal, p_IVA, p_Total,
        p_Estado, p_MetodoPago, 
        p_Usuario, p_Cliente, p_Observaciones
    );

    SET lastVentaId = LAST_INSERT_ID();

    IF p_ReferenciaTransferencia IS NOT NULL AND p_ReferenciaTransferencia != '' THEN
        INSERT INTO VentasEXT (IdVentaFK, NumeroReferenciaTransferencia)
        VALUES (lastVentaId, p_ReferenciaTransferencia);
    END IF;


    -- Insertar detalle
    SET totalItems = JSON_LENGTH(p_Detalles);
    WHILE i < totalItems DO
        INSERT INTO DetalleVenta (
            IdVentaFK, TipoArticulo, CodigoArticulo,
            PrecioVenta, Descuento, SubtotalSinIVA, Cantidad,
            PrecioBaseOriginal, MargenAplicado, IdMargenFK 
        )
        VALUES (
            lastVentaId,
            JSON_UNQUOTE(JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].Tipo'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].Codigo'))),
            JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].Precio')),
            JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].Descuento')),
            JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].Subtotal')),
            JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].Cantidad')),
            JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].PrecioBaseOriginal')),
            JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].MargenAplicado')),
            JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].IdMargenFK'))
        );
        SET i = i + 1;
    END WHILE;

END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarMetodosDePago
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-31
-- DESCRIPCIÓN: Este procedimiento para listar los metodos de pago.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE ListarMetodosDePago ()
BEGIN
	select * from MetodosDePago;
END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarPreciosVenta
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-30
-- DESCRIPCIÓN: Este procedimiento para listar los metodos precios de venta.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE ListarPreciosVenta ()
BEGIN
	select * from margenesventa;
END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarVentasPorUsuario
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-30
-- DESCRIPCIÓN: Este procedimiento para listar las ventas por usuario.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE ListarVentasPorUsuario (
    IN p_IdUsuario INT
)
ListarVentasPorUsuario: BEGIN
    DECLARE v_IdRol INT;

    -- Obtener el rol del usuario
    SELECT IdRolFK INTO v_IdRol
    FROM Usuarios
    WHERE IdUsuarioPK = p_IdUsuario;

    -- Validar permiso
    IF v_IdRol IS NULL OR v_IdRol NOT IN (1, 2) THEN
        SELECT 'Sin permiso para ver ventas' AS Mensaje;
        LEAVE ListarVentasPorUsuario;
    END IF;

    -- Consulta principal
    SELECT 
        vb.IdVentaPK,
        DATE_FORMAT(vb.FechaCreacion, '%d/%m/%Y %h:%i %p') as 'FechaCreacion',
        vb.IdTipoDocumentoFK,
        td.DescripcionDocumento AS TipoDocumento,
        vb.NumeroDocumento,
        vb.SubtotalVenta,
        vb.IVA,
        vb.TotalVenta,
        vb.IdEstadoVentaFK,
        ev.DescripcionEstadoVenta AS EstadoVenta,
        vb.IdClienteFK,
        c.NombreCliente AS Cliente,
        vb.IdUsuarioFK,
        u.Nombre AS Usuario,
        vb.Observaciones,
        (
            SELECT m.NombreMargen
            FROM DetalleVenta dv
            JOIN MargenesVenta m ON dv.IdMargenFK = m.IdMargenPK
            WHERE dv.IdVentaFK = vb.IdVentaPK
            GROUP BY dv.IdMargenFK, m.NombreMargen
            ORDER BY COUNT(*) DESC
            LIMIT 1
        ) AS MargenVenta
        
    FROM VentasBase vb
    INNER JOIN TipoDocumento td ON vb.IdTipoDocumentoFK = td.IdTipoDocumentoPK
    INNER JOIN EstadoVenta ev ON vb.IdEstadoVentaFK = ev.IdEstadoVentaPK
    INNER JOIN Clientes c ON vb.IdClienteFK = c.IdClientePK
    INNER JOIN Usuarios u ON vb.IdUsuarioFK = u.IdUsuarioPK
    
    WHERE 
        -- Condición 1: Lógica de permisos de rol
        (v_IdRol = 1 OR (v_IdRol = 2 AND vb.IdUsuarioFK = p_IdUsuario))        
        AND vb.IdEstadoVentaFK != 4; -- Excluye explícitamente el estado 'Borrado'

END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: ListarVistaArticulosInventarioV3	
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-30
-- DESCRIPCIÓN: Este procedimiento para listar la vista de articulos para el punto de venta.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE ListarVistaArticulosInventarioV3 (
)
BEGIN
	SELECT * FROM vistaarticulosinventarioV3;
END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: RealizarVentaYDescargarInventario	
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-30
-- DESCRIPCIÓN: Este procedimiento para generar la factura de venta y el descargue de inventario.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE RealizarVentaYDescargarInventario (
    IN p_IdTipoDocumento INT,
    IN p_Subtotal DECIMAL(10,2),
    IN p_IVA DECIMAL(10,2),      
    IN p_Total DECIMAL(10,2),    
    IN p_IdEstadoVenta INT,
    IN p_IdMetodoPago INT,
    IN p_IdUsuario INT,
    IN p_IdCliente INT,
    IN p_Observaciones VARCHAR(255),
    IN p_Detalles JSON
)
BEGIN
    DECLARE v_IdVenta INT;
    DECLARE v_IdCarrito INT;
    DECLARE v_NuevoNumeroDocumento VARCHAR(255);
    DECLARE i INT DEFAULT 0;
    DECLARE totalItems INT;
    DECLARE v_TipoArticulo VARCHAR(20);
    DECLARE v_CodigoArticulo VARCHAR(25);
    DECLARE v_Cantidad INT;
    DECLARE v_Descuento DECIMAL(10,2);
    DECLARE v_MargenAplicado DECIMAL(10,2);
    DECLARE v_IdMargenFK INT;
    DECLARE v_PrecioBaseReal DECIMAL(10,2);
    DECLARE v_PrecioVentaCalculado DECIMAL(10,2);
    DECLARE v_SubtotalCalculado DECIMAL(10,2);

    -- Insertar cabecera de la venta
    INSERT INTO VentasBase (
        FechaCreacion, IdTipoDocumentoFK, NumeroDocumento,
        SubtotalVenta, IVA, TotalVenta, IdEstadoVentaFK,
        IdMetodoDePagoFK, IdUsuarioFK, IdClienteFK, Observaciones
    ) VALUES (
        NOW(), p_IdTipoDocumento, '', p_Subtotal, p_IVA, p_Total, p_IdEstadoVenta,
        p_IdMetodoPago, p_IdUsuario, p_IdCliente, p_Observaciones
    );

    SET v_IdVenta = LAST_INSERT_ID();

    -- Generar número de documento 
    SET v_NuevoNumeroDocumento = CONCAT('F-', YEAR(NOW()), '-', LPAD(v_IdVenta, 5, '0'));
    UPDATE VentasBase SET NumeroDocumento = v_NuevoNumeroDocumento WHERE IdVentaPK = v_IdVenta;


    SET totalItems = JSON_LENGTH(p_Detalles);
    WHILE i < totalItems DO
        -- 1. Extraer solo los datos de identificación y de acción del usuario desde el JSON
        SET v_TipoArticulo   = JSON_UNQUOTE(JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].TipoArticulo')));
        SET v_CodigoArticulo = JSON_UNQUOTE(JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].CodigoArticulo')));
        SET v_Cantidad       = JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].Cantidad'));
        SET v_Descuento      = JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].Descuento'));
        SET v_MargenAplicado = JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].MargenAplicado'));
        SET v_IdMargenFK     = JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].IdMargenFK'));

        -- 2. OBTENER EL PRECIO BASE REAL DESDE LA TABLA MAESTRA, IGNORANDO EL DEL JSON
        SET v_PrecioBaseReal = 0; -- Reiniciar por seguridad en cada ciclo
        IF v_TipoArticulo = 'Producto' THEN
            SELECT PrecioBase INTO v_PrecioBaseReal FROM ProductosBases WHERE CodigoConsola = v_CodigoArticulo;
        ELSEIF v_TipoArticulo = 'Accesorio' THEN
            SELECT PrecioBase INTO v_PrecioBaseReal FROM AccesoriosBase WHERE CodigoAccesorio = v_CodigoArticulo;
        ELSEIF v_TipoArticulo = 'Insumo' THEN
            SELECT PrecioBase INTO v_PrecioBaseReal FROM InsumosBase WHERE CodigoInsumo = v_CodigoArticulo;
        -- Los servicios pueden tener precio base 0 o un valor específico
        ELSEIF v_TipoArticulo = 'Servicio' THEN
            SELECT PrecioBase INTO v_PrecioBaseReal FROM ServiciosBase WHERE IdServicioPK = CAST(v_CodigoArticulo AS UNSIGNED);
        END IF;

        -- 3. RECALCULAR PRECIOS BASADO EN DATOS SEGUROS
        SET v_PrecioVentaCalculado = v_PrecioBaseReal * (1 + (v_MargenAplicado / 100));
        SET v_SubtotalCalculado = v_PrecioVentaCalculado * (1 - (v_Descuento / 100)) * v_Cantidad;

        -- 4. INSERTAR LOS VALORES RECALCULADOS Y SEGUROS EN DetalleVenta
        INSERT INTO DetalleVenta (
            IdVentaFK, TipoArticulo, CodigoArticulo, PrecioVenta, Descuento, SubtotalSinIVA, Cantidad,
            PrecioBaseOriginal, MargenAplicado, IdMargenFK
        ) VALUES (
            v_IdVenta,
            v_TipoArticulo,
            v_CodigoArticulo,
            v_PrecioVentaCalculado, 
            v_Descuento,
            v_SubtotalCalculado,     
            v_Cantidad,
            v_PrecioBaseReal,        
            v_MargenAplicado,
            v_IdMargenFK
        );

        -- Lógica de descarga de inventario 
        IF v_TipoArticulo = 'Producto' THEN
            UPDATE ProductosBases SET Estado = 8 WHERE CodigoConsola = v_CodigoArticulo;
        ELSEIF v_TipoArticulo = 'Accesorio' THEN
            UPDATE AccesoriosBase SET EstadoAccesorio = 8 WHERE CodigoAccesorio = v_CodigoArticulo;
        ELSEIF v_TipoArticulo = 'Insumo' THEN
            UPDATE InsumosBase SET Cantidad = Cantidad - v_Cantidad WHERE CodigoInsumo = v_CodigoArticulo;
        ELSEIF v_TipoArticulo = 'Servicio' THEN
            UPDATE InsumosBase i
            JOIN InsumosXServicio ixs ON i.CodigoInsumo = ixs.CodigoInsumoFK
            SET i.Cantidad = i.Cantidad - (ixs.CantidadDescargue * v_Cantidad)
            WHERE ixs.IdServicioFK = CAST(v_CodigoArticulo AS UNSIGNED);
        END IF;

        SET i = i + 1;
    END WHILE;

    -- Limpieza del carrito
    SELECT IdCarritoPK INTO v_IdCarrito FROM CarritoVentas WHERE IdUsuarioFK = p_IdUsuario AND IdClienteFK = p_IdCliente AND EstadoCarrito = 'En curso' LIMIT 1;
    IF v_IdCarrito IS NOT NULL THEN
        DELETE FROM DetalleCarritoVentas WHERE IdCarritoFK = v_IdCarrito;
        UPDATE CarritoVentas SET EstadoCarrito = 'Completado' WHERE IdCarritoPK = v_IdCarrito;
    END IF;

    -- Devolver los IDs generados
    SELECT v_IdVenta AS CodigoVentaFinal, v_NuevoNumeroDocumento AS NumeroDocumentoFinal;

END$$
DELIMITER ;


/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_EliminarProforma	
-- AUTOR: Rommel Maltez
-- FECHA DE CREACIÓN: 2025-03-30
-- DESCRIPCIÓN: Este procedimiento para eliminar una proforma.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_EliminarProforma(
    IN p_IdVentaPK INT
)
BEGIN
    -- Declaración de variables
    DECLARE v_IdTipoDocumento INT;
    DECLARE v_IdEstadoActual INT;
    DECLARE v_IdEstadoBorrado INT DEFAULT 4; 
    
    -- Obtenemos el tipo de documento y el estado actual de la venta
    SELECT IdTipoDocumentoFK, IdEstadoVentaFK INTO v_IdTipoDocumento, v_IdEstadoActual
    FROM VentasBase
    WHERE IdVentaPK = p_IdVentaPK;

    -- Verificamos si la venta existe
    IF v_IdTipoDocumento IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: La venta no existe.';
    -- Verificamos que sea una proforma (Tipo Documento 2)
    ELSEIF v_IdTipoDocumento != 2 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: El documento no es una proforma.';
    -- Verificamos que no esté ya borrada
    ELSEIF v_IdEstadoActual = v_IdEstadoBorrado THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Esta proforma ya ha sido borrada.';
    ELSE
        -- Actualizamos el estado 
        UPDATE VentasBase
        SET IdEstadoVentaFK = v_IdEstadoBorrado
        WHERE IdVentaPK = p_IdVentaPK;
    END IF;

END $$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_GetProformaDetailsYValidarStock	
-- AUTOR: Gemini
-- FECHA DE CREACIÓN: 2025-07-21
-- DESCRIPCIÓN: Obtiene los detalles de una proforma, validando su vigencia y
-- la disponibilidad de stock de sus artículos.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_GetProformaDetailsYValidarStock(IN p_IdVentaPK INT)
BEGIN
    DECLARE v_FechaCreacion DATETIME;
    DECLARE v_IdTipoDocumento INT;
    DECLARE v_esValida BOOLEAN DEFAULT TRUE;
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_CodigoArticulo VARCHAR(25);
    DECLARE v_TipoArticulo ENUM('Producto', 'Accesorio', 'Insumo', 'Servicio');
    DECLARE v_Cantidad INT;
    DECLARE v_EstadoArticulo INT;
    DECLARE v_StockInsumo INT;

    DECLARE cur_DetallesVenta CURSOR FOR
        SELECT CodigoArticulo, TipoArticulo, Cantidad FROM DetalleVenta WHERE IdVentaFK = p_IdVentaPK;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    CREATE TEMPORARY TABLE IF NOT EXISTS TempUnavailableItems (
        CodigoArticulo VARCHAR(25),
        Motivo VARCHAR(255)
    );

    -- PASO 1: Validación de la Proforma
    SELECT FechaCreacion, IdTipoDocumentoFK INTO v_FechaCreacion, v_IdTipoDocumento
    FROM VentasBase
    WHERE IdVentaPK = p_IdVentaPK;

    IF v_FechaCreacion IS NULL THEN
        SET v_esValida = FALSE;
        SELECT 'Error: La proforma con el ID especificado no existe.' AS Resultado;
    ELSEIF v_IdTipoDocumento != 2 THEN
        SET v_esValida = FALSE;
        SELECT 'Error: El documento solicitado no es una proforma.' AS Resultado;
    ELSEIF DATEDIFF(CURDATE(), v_FechaCreacion) > 15 THEN
        SET v_esValida = FALSE;
        SELECT 'Error: La proforma ha expirado. Solo es válida por 15 días.' AS Resultado;
    END IF;

    -- PASO 2: Verificación de Artículos
    IF v_esValida THEN
        OPEN cur_DetallesVenta;

        read_loop: LOOP
            FETCH cur_DetallesVenta INTO v_CodigoArticulo, v_TipoArticulo, v_Cantidad;
            IF done THEN
                LEAVE read_loop;
            END IF;

            CASE v_TipoArticulo
                WHEN 'Producto' THEN
                    SELECT Estado INTO v_EstadoArticulo FROM ProductosBases WHERE CodigoConsola = v_CodigoArticulo;
                    IF v_EstadoArticulo IN (7, 8, 9, 10, 11) THEN
                        INSERT INTO TempUnavailableItems (CodigoArticulo, Motivo)
                        VALUES (v_CodigoArticulo, CONCAT('Producto no disponible para la venta. Estado actual ID: ', v_EstadoArticulo));
                    END IF;
                WHEN 'Accesorio' THEN
                    SELECT EstadoAccesorio INTO v_EstadoArticulo FROM AccesoriosBase WHERE CodigoAccesorio = v_CodigoArticulo;
                    IF v_EstadoArticulo IN (7, 8, 9, 10, 11) THEN
                        INSERT INTO TempUnavailableItems (CodigoArticulo, Motivo)
                        VALUES (v_CodigoArticulo, CONCAT('Accesorio no disponible para la venta. Estado actual ID: ', v_EstadoArticulo));
                    END IF;
                WHEN 'Insumo' THEN
                    SELECT EstadoInsumo, Cantidad INTO v_EstadoArticulo, v_StockInsumo FROM InsumosBase WHERE CodigoInsumo = v_CodigoArticulo;
                    IF v_EstadoArticulo IN (7, 8, 9, 10, 11) THEN
                        INSERT INTO TempUnavailableItems (CodigoArticulo, Motivo)
                        VALUES (v_CodigoArticulo, CONCAT('Insumo no disponible para la venta. Estado actual ID: ', v_EstadoArticulo));
                    ELSEIF v_StockInsumo < v_Cantidad THEN
                        INSERT INTO TempUnavailableItems (CodigoArticulo, Motivo)
                        VALUES (v_CodigoArticulo, CONCAT('Stock insuficiente. Solicitado: ', v_Cantidad, ', Disponible: ', v_StockInsumo));
                    END IF;
                WHEN 'Servicio' THEN
                    BEGIN END;
            END CASE;
        END LOOP;

        CLOSE cur_DetallesVenta;

        -- PASO 3: Devolver los tres conjuntos de resultados

        -- Conjunto de resultados 1: Información de la cabecera
        SELECT
            vb.IdVentaPK, vb.FechaCreacion, vb.NumeroDocumento, vb.SubtotalVenta, vb.IVA,
            vb.TotalVenta, vb.Observaciones, c.NombreCliente, c.Telefono, c.CorreoElectronico,
            u.Nombre AS Vendedor, ev.DescripcionEstadoVenta AS EstadoVenta, mp.NombreMetodoPago AS MetodoPago,
            vb.IdClienteFK, vb.IdMetodoDePagoFK
        FROM VentasBase vb
        JOIN Clientes c ON vb.IdClienteFK = c.IdClientePK
        JOIN Usuarios u ON vb.IdUsuarioFK = u.IdUsuarioPK
        JOIN ESTADOVENTA ev ON vb.IdEstadoVentaFK = ev.IdEstadoVentaPK
        JOIN MetodosDePago mp ON vb.IdMetodoDePagoFK = mp.IdMetodoPagoPK
        WHERE vb.IdVentaPK = p_IdVentaPK;

        -- Conjunto de resultados 2: Detalle de artículos
        SELECT
            dv.TipoArticulo, dv.CodigoArticulo,
            CASE
                WHEN dv.TipoArticulo = 'Producto' THEN (SELECT CONCAT(cp.NombreCategoria, ' ', sp.NombreSubcategoria) FROM ProductosBases pb JOIN CatalogoConsolas cc ON pb.Modelo = cc.IdModeloConsolaPK JOIN CategoriasProductos cp ON cc.Categoria = cp.IdCategoriaPK JOIN SubcategoriasProductos sp ON cc.Subcategoria = sp.IdSubcategoria WHERE pb.CodigoConsola = dv.CodigoArticulo)
                WHEN dv.TipoArticulo = 'Accesorio' THEN (SELECT CONCAT(ca.NombreCategoriaAccesorio, ' ', sa.NombreSubcategoriaAccesorio) FROM AccesoriosBase ab JOIN CatalogoAccesorios caa ON ab.ModeloAccesorio = caa.IdModeloAccesorioPK JOIN CategoriasAccesorios ca ON caa.CategoriaAccesorio = ca.IdCategoriaAccesorioPK JOIN SubcategoriasAccesorios sa ON caa.SubcategoriaAccesorio = sa.IdSubcategoriaAccesorio WHERE ab.CodigoAccesorio = dv.CodigoArticulo)
                WHEN dv.TipoArticulo = 'Insumo' THEN (SELECT ci.NombreCategoriaInsumos FROM InsumosBase ib JOIN CatalogoInsumos cain ON ib.ModeloInsumo = cain.IdModeloInsumosPK JOIN CategoriasInsumos ci ON cain.CategoriaInsumos = ci.IdCategoriaInsumosPK WHERE ib.CodigoInsumo = dv.CodigoArticulo)
                WHEN dv.TipoArticulo = 'Servicio' THEN (SELECT DescripcionServicio FROM ServiciosBase WHERE IdServicioPK = CAST(dv.CodigoArticulo AS UNSIGNED))
                ELSE 'Descripción no disponible'
            END AS DescripcionArticulo,
            dv.Cantidad, dv.PrecioVenta, dv.Descuento, dv.SubtotalSinIVA,
            dv.PrecioBaseOriginal, dv.MargenAplicado, dv.IdMargenFK
        FROM DetalleVenta dv
        WHERE dv.IdVentaFK = p_IdVentaPK;

        -- Conjunto de resultados 3: Lista de artículos no disponibles
        SELECT DISTINCT * FROM TempUnavailableItems;

    END IF;

    -- Limpieza final
    DROP TEMPORARY TABLE IF EXISTS TempUnavailableItems;

END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_ObtenerDetalleVentaCompleta	
-- AUTOR: Gemini
-- FECHA DE CREACIÓN: 2025-07-21
-- DESCRIPCIÓN: Obtiene los detalles de una venta
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_ObtenerDetalleVentaCompleta(IN `p_IdVentaPK` INT)
BEGIN

    -- ================================================================= --
    --  RESULT SET 1: Información general de la Venta      --
    -- ================================================================= --
    SELECT
        vb.IdVentaPK,
        vb.FechaCreacion,
        vb.NumeroDocumento,
        vb.SubtotalVenta,
        vb.IVA,
        vb.TotalVenta,
        vb.Observaciones,
        c.IdClientePK AS IdCliente,
        c.NombreCliente,
        c.RUC,
        c.DNI,
        c.Telefono,
        c.CorreoElectronico,
        u.IdUsuarioPK AS IdUsuario,
        u.Nombre AS NombreUsuario,
        td.DescripcionDocumento,
        esv.DescripcionEstadoVenta,
        mp.NombreMetodoPago,
        
        -- Se reemplaza el JOIN directo por una subconsulta para obtener el margen más usado
        (
            SELECT m.NombreMargen
            FROM DetalleVenta dv
            JOIN MargenesVenta m ON dv.IdMargenFK = m.IdMargenPK
            WHERE dv.IdVentaFK = vb.IdVentaPK
            GROUP BY m.NombreMargen
            ORDER BY COUNT(*) DESC
            LIMIT 1
        ) AS NombreMargen
        
    FROM
        VentasBase vb
    JOIN Clientes c ON vb.IdClienteFK = c.IdClientePK
    JOIN Usuarios u ON vb.IdUsuarioFK = u.IdUsuarioPK
    JOIN TipoDocumento td ON vb.IdTipoDocumentoFK = td.IdTipoDocumentoPK
    JOIN ESTADOVENTA esv ON vb.IdEstadoVentaFK = esv.IdEstadoVentaPK
    JOIN MetodosDePago mp ON vb.IdMetodoDePagoFK = mp.IdMetodoPagoPK
    WHERE
        vb.IdVentaPK = p_IdVentaPK;


    -- =================================================================== --
    --  RESULT SET 2: Detalle de los artículos de la venta   --
    -- =================================================================== --
    SELECT
        dv.IdDetalleVentaPK,
        dv.TipoArticulo,
        dv.CodigoArticulo,
        dv.Cantidad,
        dv.PrecioVenta AS PrecioUnitario,
        dv.SubtotalSinIVA AS SubtotalLinea,
        dv.PrecioBaseOriginal,
        dv.MargenAplicado,
        mv.NombreMargen,
        (dv.PrecioVenta * dv.Cantidad - dv.SubtotalSinIVA) AS DescuentoValor,
        IF(dv.PrecioVenta > 0, (1 - ((dv.SubtotalSinIVA / dv.Cantidad) / dv.PrecioVenta)) * 100, 0) AS DescuentoPorcentaje,
        COALESCE(
            CONCAT(f.NombreFabricante, ' ', cp.NombreCategoria, ' ', sp.NombreSubcategoria, ' (', pb.Color, ')'),
            CONCAT(fa.NombreFabricanteAccesorio, ' ', ca.NombreCategoriaAccesorio, ' ', sa.NombreSubcategoriaAccesorio),
            CONCAT(fi.NombreFabricanteInsumos, ' - ', ci.NombreCategoriaInsumos, ' ', si.NombreSubcategoriaInsumos),
            srb.DescripcionServicio,
            'Nombre no disponible'
        ) AS NombreArticulo
    FROM
        DetalleVenta dv
    
    -- Se añade un JOIN a MargenesVenta para obtener el nombre del margen de cada línea
    LEFT JOIN MargenesVenta mv ON dv.IdMargenFK = mv.IdMargenPK

    -- Uniones para obtener el nombre de los Productos
    LEFT JOIN ProductosBases pb ON dv.CodigoArticulo = pb.CodigoConsola AND dv.TipoArticulo = 'Producto'
    LEFT JOIN CatalogoConsolas cc ON pb.Modelo = cc.IdModeloConsolaPK
    LEFT JOIN Fabricantes f ON cc.Fabricante = f.IdFabricantePK
    LEFT JOIN CategoriasProductos cp ON cc.Categoria = cp.IdCategoriaPK
    LEFT JOIN SubcategoriasProductos sp ON cc.Subcategoria = sp.IdSubcategoria
    -- (El resto de los JOINs y el WHERE no necesitan cambios)
    LEFT JOIN AccesoriosBase ab ON dv.CodigoArticulo = ab.CodigoAccesorio AND dv.TipoArticulo = 'Accesorio'
    LEFT JOIN CatalogoAccesorios caa ON ab.ModeloAccesorio = caa.IdModeloAccesorioPK
    LEFT JOIN FabricanteAccesorios fa ON caa.FabricanteAccesorio = fa.IdFabricanteAccesorioPK
    LEFT JOIN CategoriasAccesorios ca ON caa.CategoriaAccesorio = ca.IdCategoriaAccesorioPK
    LEFT JOIN SubcategoriasAccesorios sa ON caa.SubcategoriaAccesorio = sa.IdSubcategoriaAccesorio
    LEFT JOIN InsumosBase ib ON dv.CodigoArticulo = ib.CodigoInsumo AND dv.TipoArticulo = 'Insumo'
    LEFT JOIN CatalogoInsumos cii ON ib.ModeloInsumo = cii.IdModeloInsumosPK
    LEFT JOIN FabricanteInsumos fi ON cii.FabricanteInsumos = fi.IdFabricanteInsumosPK
    LEFT JOIN CategoriasInsumos ci ON cii.CategoriaInsumos = ci.IdCategoriaInsumosPK
    LEFT JOIN SubcategoriasInsumos si ON cii.SubcategoriaInsumos = si.IdSubcategoriaInsumos
    LEFT JOIN ServiciosBase srb ON CAST(dv.CodigoArticulo AS UNSIGNED) = srb.IdServicioPK AND dv.TipoArticulo = 'Servicio'
    WHERE
        dv.IdVentaFK = p_IdVentaPK;

END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_ObtenerVentasPorCliente	
-- AUTOR: Gemini
-- FECHA DE CREACIÓN: 2025-08-01
-- DESCRIPCIÓN: Obtiene los detalles de una venta por cliente.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_ObtenerVentasPorCliente(
    IN p_IdCliente INT
)
BEGIN
    SELECT
        vb.IdVentaPK AS VentaID,
        vb.NumeroDocumento,
        c.NombreCliente,
        vb.FechaCreacion,
        vb.TotalVenta,
        ev.DescripcionEstadoVenta AS EstadoVenta,
        COALESCE(mnc.Descripcion, 'N/A') AS MotivoAnulacion
    FROM
        VentasBase vb
    JOIN
        Clientes c ON vb.IdClienteFK = c.IdClientePK
    JOIN
        ESTADOVENTA ev ON vb.IdEstadoVentaFK = ev.IdEstadoVentaPK
    LEFT JOIN
        NotasCredito nc ON vb.IdVentaPK = nc.IdVentaFK
    LEFT JOIN
        MotivosNotaCredito mnc ON nc.IdMotivoFK = mnc.IdMotivoPK
    WHERE
        vb.IdClienteFK = p_IdCliente
        AND vb.IdTipoDocumentoFK != 2 -- Excluye las Proformas (el ID de Proforma es 2)
    ORDER BY
        vb.FechaCreacion DESC;
END$$
DELIMITER ;

/*
================================================================================
-- VIII. SECCIÓN DE PRE-INGRESO DE PEDIDOS
-- DESCRIPCIÓN: Procedimientos para guardar, cargar y limpiar el progreso
-- del ingreso de artículos de un pedido.
================================================================================
*/

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_UpsertPreIngresoProducto
-- AUTOR: Gemini Code Assist
-- FECHA DE CREACIÓN: 2025-09-13
-- DESCRIPCIÓN: Inserta o actualiza un registro en la tabla PreIngresoProductos.
-- NOTA: Requiere un índice único en la tabla: UNIQUE KEY `idx_pedido_usuario_form` (`IdCodigoPedidoFK`, `IdUsuarioFK`, `FormIndex`).
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_UpsertPreIngresoProducto(
    IN p_IdCodigoPedidoFK VARCHAR(25),
    IN p_IdUsuarioFK INT,
    IN p_FormIndex INT,
    IN p_Modelo INT,
    IN p_Color VARCHAR(100),
    IN p_Estado INT,
    IN p_Hackeado BOOLEAN,
    IN p_Comentario VARCHAR(255),
    IN p_PrecioBase DECIMAL(10,2),
    IN p_NumeroSerie VARCHAR(100),
    IN p_Accesorios VARCHAR(500),
    IN p_TareasPendientes VARCHAR(1000),
    IN p_CostoDistribuido DECIMAL(10,2)
)
BEGIN
    INSERT INTO PreIngresoProductos (
        IdCodigoPedidoFK, IdUsuarioFK, FormIndex, Modelo, Color, Estado, Hackeado,
        Comentario, PrecioBase, NumeroSerie, Accesorios, TareasPendientes, CostoDistribuido
    )
    VALUES (
        p_IdCodigoPedidoFK, p_IdUsuarioFK, p_FormIndex, p_Modelo, p_Color, p_Estado, p_Hackeado,
        p_Comentario, p_PrecioBase, p_NumeroSerie, p_Accesorios, p_TareasPendientes, p_CostoDistribuido
    )
    ON DUPLICATE KEY UPDATE
        Modelo = VALUES(Modelo),
        Color = VALUES(Color),
        Estado = VALUES(Estado),
        Hackeado = VALUES(Hackeado),
        Comentario = VALUES(Comentario),
        PrecioBase = VALUES(PrecioBase),
        NumeroSerie = VALUES(NumeroSerie),
        Accesorios = VALUES(Accesorios),
        TareasPendientes = VALUES(TareasPendientes),
        CostoDistribuido = VALUES(CostoDistribuido);
END$$
DELIMITER ;


/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_GetPreIngresoProductos
-- AUTOR: Gemini Code Assist
-- FECHA DE CREACIÓN: 2025-09-13
-- DESCRIPCIÓN: Obtiene todos los productos pre-ingresados para un pedido y usuario.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_GetPreIngresoProductos(
    IN p_IdCodigoPedidoFK VARCHAR(25),
    IN p_IdUsuarioFK INT
)
BEGIN
    SELECT *
    FROM PreIngresoProductos
    WHERE IdCodigoPedidoFK = p_IdCodigoPedidoFK AND IdUsuarioFK = p_IdUsuarioFK
    ORDER BY FormIndex ASC;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_DeletePreIngresoPorPedido
-- AUTOR: Gemini Code Assist
-- FECHA DE CREACIÓN: 2025-09-13
-- DESCRIPCIÓN: Elimina todos los datos de pre-ingreso para un pedido y usuario.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_DeletePreIngresoPorPedido(
    IN p_IdCodigoPedidoFK VARCHAR(25),
    IN p_IdUsuarioFK INT
)
BEGIN
    DELETE FROM PreIngresoProductos WHERE IdCodigoPedidoFK = p_IdCodigoPedidoFK AND IdUsuarioFK = p_IdUsuarioFK;
    DELETE FROM PreIngresoAccesorios WHERE IdCodigoPedidoFK = p_IdCodigoPedidoFK AND IdUsuarioFK = p_IdUsuarioFK;
    DELETE FROM PreIngresoInsumos WHERE IdCodigoPedidoFK = p_IdCodigoPedidoFK AND IdUsuarioFK = p_IdUsuarioFK;
END$$
DELIMITER ;


/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_UpsertPreIngresoAccesorio
-- AUTOR: Gemini Code Assist
-- FECHA DE CREACIÓN: 2025-09-14
-- DESCRIPCIÓN: Inserta o actualiza un borrador para un accesorio.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_UpsertPreIngresoAccesorio(
    IN p_IdPedido VARCHAR(25),
    IN p_IdUsuario INT,
    IN p_FormIndex INT,
    IN p_Modelo INT,
    IN p_Color VARCHAR(100),
    IN p_Estado INT,
    IN p_Comentario VARCHAR(2000),
    IN p_PrecioBase DECIMAL(6,2),
    IN p_CostoDistribuido DECIMAL(10,2),
    IN p_NumeroSerie VARCHAR(100),
    IN p_ProductosCompatibles VARCHAR(500),
    IN p_TareasPendientes VARCHAR(1000)
)
BEGIN
    INSERT INTO PreIngresoAccesorios (
        IdCodigoPedidoFK, IdUsuarioFK, FormIndex, ModeloAccesorio, ColorAccesorio,
        EstadoAccesorio, Comentario, PrecioBase, CostoDistribuido, NumeroSerie,
        ProductosCompatibles, TareasPendientes
    )
    VALUES (
        p_IdPedido, p_IdUsuario, p_FormIndex, p_Modelo, p_Color,
        p_Estado, p_Comentario, p_PrecioBase, p_CostoDistribuido, p_NumeroSerie,
        p_ProductosCompatibles, p_TareasPendientes
    )
    ON DUPLICATE KEY UPDATE
        ModeloAccesorio = VALUES(ModeloAccesorio),
        ColorAccesorio = VALUES(ColorAccesorio),
        EstadoAccesorio = VALUES(EstadoAccesorio),
        Comentario = VALUES(Comentario),
        PrecioBase = VALUES(PrecioBase),
        CostoDistribuido = VALUES(CostoDistribuido),
        NumeroSerie = VALUES(NumeroSerie),
        ProductosCompatibles = VALUES(ProductosCompatibles),
        TareasPendientes = VALUES(TareasPendientes);
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_GetPreIngresoAccesorios
-- AUTOR: Gemini Code Assist
-- FECHA DE CREACIÓN: 2025-09-14
-- DESCRIPCIÓN: Obtiene los borradores de accesorios para un pedido y usuario.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_GetPreIngresoAccesorios(
    IN p_IdPedido VARCHAR(25),
    IN p_IdUsuario INT
)
BEGIN
    SELECT *
    FROM PreIngresoAccesorios
    WHERE IdCodigoPedidoFK = p_IdPedido AND IdUsuarioFK = p_IdUsuario;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_UpsertPreIngresoInsumo
-- AUTOR: Gemini Code Assist
-- FECHA DE CREACIÓN: 2025-09-14
-- DESCRIPCIÓN: Inserta o actualiza un borrador para un insumo.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_UpsertPreIngresoInsumo(
    IN p_IdPedido VARCHAR(25),
    IN p_IdUsuario INT,
    IN p_FormIndex INT,
    IN p_Modelo INT,
    IN p_Estado INT,
    IN p_Comentario VARCHAR(2000),
    IN p_PrecioBase DECIMAL(6,2),
    IN p_CostoDistribuido DECIMAL(10,2),
    IN p_NumeroSerie VARCHAR(100),
    IN p_Cantidad INT,
    IN p_StockMinimo INT
)
BEGIN
    INSERT INTO PreIngresoInsumos (
        IdCodigoPedidoFK, IdUsuarioFK, FormIndex, ModeloInsumo, EstadoInsumo,
        Comentario, PrecioBase, CostoDistribuido, NumeroSerie, Cantidad, StockMinimo
    )
    VALUES (
        p_IdPedido, p_IdUsuario, p_FormIndex, p_Modelo, p_Estado,
        p_Comentario, p_PrecioBase, p_CostoDistribuido, p_NumeroSerie, p_Cantidad, p_StockMinimo
    )
    ON DUPLICATE KEY UPDATE
        ModeloInsumo = VALUES(ModeloInsumo),
        EstadoInsumo = VALUES(EstadoInsumo),
        Comentario = VALUES(Comentario),
        PrecioBase = VALUES(PrecioBase),
        CostoDistribuido = VALUES(CostoDistribuido),
        NumeroSerie = VALUES(NumeroSerie),
        Cantidad = VALUES(Cantidad),
        StockMinimo = VALUES(StockMinimo);
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_GetPreIngresoInsumos
-- AUTOR: Gemini Code Assist
-- FECHA DE CREACIÓN: 2025-09-14
-- DESCRIPCIÓN: Obtiene los borradores de insumos para un pedido y usuario.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_GetPreIngresoInsumos(
    IN p_IdPedido VARCHAR(25),
    IN p_IdUsuario INT
)
BEGIN
    SELECT *
    FROM PreIngresoInsumos
    WHERE IdCodigoPedidoFK = p_IdPedido AND IdUsuarioFK = p_IdUsuario;
END$$
DELIMITER ;

/*
================================================================================
-- IX. SECCIÓN DE MODIFICACION DE TIPOS DE PRODUCTOS
-- DESCRIPCIÓN: Procedimientos para gestionar tipos de productos y sus accesorios.
================================================================================
*/

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_ListarTiposProducto
-- AUTOR: Gemini Code Assist
-- FECHA DE CREACIÓN: 2025-10-22
-- DESCRIPCIÓN: Obtiene la lista de tipos de productos.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_ListarTiposProducto()
BEGIN
    SELECT IdTipoProductoPK, DescripcionTipoProducto, Activo
    FROM TiposProductos;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: CREATE PROCEDURE sp_ListarTiposAccesorio
-- AUTOR: Gemini Code Assist
-- FECHA DE CREACIÓN: 2025-10-22
-- DESCRIPCIÓN: Obtiene la lista de tipos de accesorios activos.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_ListarTiposAccesorio()
BEGIN
    SELECT IdTipoAccesorioPK, DescripcionAccesorio
    FROM TiposAccesorios
    WHERE Activo = 1
    ORDER BY DescripcionAccesorio ASC;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: CREATE PROCEDURE sp_ObtenerTipoProductoConAccesorios
-- AUTOR: Gemini Code Assist
-- FECHA DE CREACIÓN: 2025-10-22
-- DESCRIPCIÓN: Obtiene un tipo de producto junto con sus accesorios asociados.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_ObtenerTipoProductoConAccesorios(IN p_IdTipoProductoPK INT)
BEGIN
    -- Result Set 1: Datos del Tipo de Producto
    SELECT IdTipoProductoPK, DescripcionTipoProducto, Activo
    FROM TiposProductos
    WHERE IdTipoProductoPK = p_IdTipoProductoPK;

    -- Result Set 2: IDs de los accesorios asociados
    SELECT IdTipoAccesorioFK
    FROM CatalogoTiposAccesoriosXProducto
    WHERE IdTipoProductoFK = p_IdTipoProductoPK AND Activo = 1;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: CREATE PROCEDURE sp_CrearTipoProductoConAccesorios
-- AUTOR: Gemini Code Assist
-- FECHA DE CREACIÓN: 2025-10-22
-- DESCRIPCIÓN: Crea un nuevo tipo de producto y asocia accesorios a él.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_CrearTipoProductoConAccesorios(
    IN p_Descripcion VARCHAR(100),
    IN p_AccesoriosIDsJSON JSON -- Ej: '[1, 2, 5]'
)
BEGIN
    DECLARE v_IdTipoProducto INT;
    DECLARE i INT DEFAULT 0;
    DECLARE accesorio_id INT;

    -- Iniciar transacción
    START TRANSACTION;

    -- Insertar el nuevo tipo de producto
    INSERT INTO TiposProductos (DescripcionTipoProducto, Activo)
    VALUES (p_Descripcion, 1);
    SET v_IdTipoProducto = LAST_INSERT_ID();

    -- Iterar sobre el JSON de IDs de accesorios
    WHILE i < JSON_LENGTH(p_AccesoriosIDsJSON) DO
        SET accesorio_id = JSON_UNQUOTE(JSON_EXTRACT(p_AccesoriosIDsJSON, CONCAT('$[', i, ']')));
        
        INSERT INTO CatalogoTiposAccesoriosXProducto (IdTipoAccesorioFK, IdTipoProductoFK, Activo)
        VALUES (accesorio_id, v_IdTipoProducto, 1);
        
        SET i = i + 1;
    END WHILE;

    COMMIT;
    
    SELECT v_IdTipoProducto AS IdTipoProductoCreado;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: CREATE PROCEDURE sp_ActualizarTipoProductoConAccesorios
-- AUTOR: Gemini Code Assist
-- FECHA DE CREACIÓN: 2025-10-22
-- DESCRIPCIÓN: Actualiza un tipo de producto y sus accesorios asociados.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_ActualizarTipoProductoConAccesorios(
    IN p_IdTipoProductoPK INT,
    IN p_Descripcion VARCHAR(100),
    IN p_Activo BOOLEAN,
    IN p_AccesoriosIDsJSON JSON -- Ej: '[1, 5]'
)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE accesorio_id INT;

    START TRANSACTION;

    -- Actualizar la descripción y estado del Tipo de Producto
    UPDATE TiposProductos
    SET DescripcionTipoProducto = p_Descripcion,
        Activo = p_Activo
    WHERE IdTipoProductoPK = p_IdTipoProductoPK;

    -- "Limpiar" las asociaciones anteriores (soft delete)
    UPDATE CatalogoTiposAccesoriosXProducto
    SET Activo = 0
    WHERE IdTipoProductoFK = p_IdTipoProductoPK;

    -- Insertar las nuevas asociaciones o reactivar las existentes
    WHILE i < JSON_LENGTH(p_AccesoriosIDsJSON) DO
        SET accesorio_id = JSON_UNQUOTE(JSON_EXTRACT(p_AccesoriosIDsJSON, CONCAT('$[', i, ']')));
        
        -- Inserta si no existe, o actualiza si ya existía (para reactivarlo)
        INSERT INTO CatalogoTiposAccesoriosXProducto (IdTipoAccesorioFK, IdTipoProductoFK, Activo)
        VALUES (accesorio_id, p_IdTipoProductoPK, 1)
        ON DUPLICATE KEY UPDATE Activo = 1;
        
        SET i = i + 1;
    END WHILE;

    COMMIT;
END$$
DELIMITER ;

/*
================================================================================
-- IX. SECCIÓN DE TIPOS DE ACCESORIOS (CRUD)
-- DESCRIPCIÓN: Procedimientos para gestionar el catálogo base de TiposAccesorios.
================================================================================
*/

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_ListarTiposAccesorio
-- AUTOR: Gemini Code Assist
-- FECHA DE CREACIÓN: 2025-10-22
-- DESCRIPCIÓN: Obtiene la lista de tipos de accesorios activos.
--              Utilizado para poblar dropdowns.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_ListarTiposAccesorio()
BEGIN
    SELECT IdTipoAccesorioPK, DescripcionAccesorio
    FROM TiposAccesorios
    WHERE Activo = 1
    ORDER BY DescripcionAccesorio ASC;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_ListarTodosTiposAccesorio
-- AUTOR: Rommel Maltez (Modificado por Gemini)
-- FECHA DE CREACIÓN: 2025-10-22
-- DESCRIPCIÓN: Obtiene la lista COMPLETA de tipos de accesorios (activos e inactivos).
--              Útil para la pantalla de administración.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_ListarTodosTiposAccesorio()
BEGIN
    SELECT IdTipoAccesorioPK, CodigoAccesorio, DescripcionAccesorio, Activo
    FROM TiposAccesorios
    ORDER BY DescripcionAccesorio ASC;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_GetTipoAccesorioById
-- AUTOR: Rommel Maltez (Generado por Gemini)
-- FECHA DE CREACIÓN: 2025-10-22
-- DESCRIPCIÓN: Obtiene los detalles de un tipo de accesorio específico por su ID.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_GetTipoAccesorioById(
    IN p_IdTipoAccesorioPK INT
)
BEGIN
    SELECT IdTipoAccesorioPK, CodigoAccesorio, DescripcionAccesorio, Activo
    FROM TiposAccesorios
    WHERE IdTipoAccesorioPK = p_IdTipoAccesorioPK;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_InsertTipoAccesorio
-- AUTOR: Rommel Maltez (Generado por Gemini)
-- FECHA DE CREACIÓN: 2025-10-22
-- DESCRIPCIÓN: Inserta un nuevo tipo de accesorio en el catálogo.
--              Por defecto, se inserta como activo.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_InsertTipoAccesorio(
    IN p_CodigoAccesorio VARCHAR(25),
    IN p_DescripcionAccesorio VARCHAR(100)
)
BEGIN
    INSERT INTO TiposAccesorios (CodigoAccesorio, DescripcionAccesorio, Activo)
    VALUES (p_CodigoAccesorio, p_DescripcionAccesorio, 1);

    SELECT LAST_INSERT_ID() AS IdTipoAccesorioCreado; -- Devuelve el ID generado
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_UpdateTipoAccesorio
-- AUTOR: Rommel Maltez (Generado por Gemini)
-- FECHA DE CREACIÓN: 2025-10-22
-- DESCRIPCIÓN: Actualiza los datos de un tipo de accesorio existente,
--              incluyendo su código, descripción y estado de activación.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_UpdateTipoAccesorio(
    IN p_IdTipoAccesorioPK INT,
    IN p_CodigoAccesorio VARCHAR(25),
    IN p_DescripcionAccesorio VARCHAR(100),
    IN p_Activo BOOLEAN
)
BEGIN
    UPDATE TiposAccesorios
    SET
        CodigoAccesorio = p_CodigoAccesorio,
        DescripcionAccesorio = p_DescripcionAccesorio,
        Activo = p_Activo
    WHERE IdTipoAccesorioPK = p_IdTipoAccesorioPK;
END$$
DELIMITER ;

/*------------------------------------------------------------------------------
-- PROCEDIMIENTO: sp_DeactivateTipoAccesorio
-- AUTOR: Rommel Maltez (Generado por Gemini)
-- FECHA DE CREACIÓN: 2025-10-22
-- DESCRIPCIÓN: Desactiva un tipo de accesorio (soft delete) poniéndolo inactivo.
-- NOTA: Considerar si se debe desactivar también en CatalogoTiposAccesoriosXProducto.
------------------------------------------------------------------------------*/
DELIMITER $$
CREATE PROCEDURE sp_DeactivateTipoAccesorio(
    IN p_IdTipoAccesorioPK INT
)
BEGIN
    UPDATE TiposAccesorios
    SET Activo = 0
    WHERE IdTipoAccesorioPK = p_IdTipoAccesorioPK;

    -- Opcional: Desactivar las asociaciones existentes para este tipo de accesorio
    -- UPDATE CatalogoTiposAccesoriosXProducto
    -- SET Activo = 0
    -- WHERE IdTipoAccesorioFK = p_IdTipoAccesorioPK;
END$$
DELIMITER ;


