/*******************************************************************************
** ARCHIVO: SCRIPT_DISPARADORES.sql
** PROYECTO: Sistema de Inventario y Taller
** AUTOR: Rommel Maltez
** FECHA DE CREACIÓN: 2025-09-06
** DESCRIPCIÓN:
** Script completo para la creación de todos los disparadores del sistema
** para productos, pedidos, insumos, accesorios.alter
** NOTA: Estos disparadores serán borrados por motivo de cambios en la funcionalidad del historial y en la forma en la que se ingresan los datos.
** ETA Octubre 2025.
*******************************************************************************/

-- Seleccionamos la base de datos sobre la cual se crearán los procedimientos
USE base_datos_inventario_taller_prueba;
-- USE base_datos_inventario_taller;

-- ===================================================================================
-- 1. DISPARADOR PARA INSERTAR HISTORIAL DE PEDIDO.
-- FECHA DE CREACIÓN: 2025-02-18
-- ===================================================================================
DELIMITER $$
CREATE TRIGGER trg_Historial_Estado
BEFORE UPDATE ON PedidoBase
FOR EACH ROW
BEGIN
    IF OLD.EstadoPedidoFK <> NEW.EstadoPedidoFK THEN
        INSERT INTO HistorialEstadoPedido (CodigoPedido, EstadoAnterior, EstadoNuevo, FechaCambio)
        VALUES (OLD.CodigoPedido, OLD.EstadoPedidoFK, NEW.EstadoPedidoFK, NOW());
    END IF;
END $$
DELIMITER ;

-- ===================================================================================
-- 2. DISPARADOR PARA INSERTAR HISTORIAL DE PEDIDO INSERT.
-- FECHA DE CREACIÓN: 2025-02-18
-- ===================================================================================
DELIMITER $$
CREATE TRIGGER trg_Insert_Historial_Pedido
AFTER INSERT ON PedidoBase
FOR EACH ROW
BEGIN
    INSERT INTO HistorialEstadoPedido (CodigoPedido, EstadoAnterior, EstadoNuevo, FechaCambio)
    VALUES (NEW.CodigoPedido, NULL, NEW.EstadoPedidoFK, NOW());
END $$
DELIMITER ;

-- ===================================================================================
-- 3. DISPARADOR PARA INSERTAR HISTORIAL DE PRODUCTO CUANDO HAY CAMBIOS.
-- FECHA DE CREACIÓN: 2025-02-18
-- ===================================================================================
DELIMITER $$
CREATE TRIGGER trg_Historial_Estado_Producto
BEFORE UPDATE ON ProductosBases
FOR EACH ROW
BEGIN
    -- Solo registrar si el estado realmente cambió
    IF OLD.Estado <> NEW.Estado THEN
        INSERT INTO HistorialEstadoProducto (CodigoConsola, EstadoAnterior, EstadoNuevo, FechaCambio)
        VALUES (OLD.CodigoConsola, OLD.Estado, NEW.Estado, NOW());
    END IF;
END $$
DELIMITER ;

-- ===================================================================================
-- 4. DISPARADOR PARA INSERTAR HISTORIAL DE PRODUCTO CUANDO SE CREA.
-- FECHA DE CREACIÓN: 2025-02-18
-- ===================================================================================
DELIMITER $$
CREATE TRIGGER trg_Insert_Historial_Producto
AFTER INSERT ON ProductosBases
FOR EACH ROW
BEGIN
    INSERT INTO HistorialEstadoProducto (CodigoConsola, EstadoAnterior, EstadoNuevo, FechaCambio)
    VALUES (NEW.CodigoConsola, NULL, NEW.Estado, NOW());
END $$
DELIMITER ;

-- ===================================================================================
-- 5. DISPARADOR PARA INSERTAR HISTORIAL DE ACCESORIO CUANDO  HAY CAMBIOS.
-- FECHA DE CREACIÓN: 2025-02-18
-- ===================================================================================
DELIMITER $$
CREATE TRIGGER trg_Historial_Estado_Accesorio
BEFORE UPDATE ON AccesoriosBase
FOR EACH ROW
BEGIN
    IF OLD.EstadoAccesorio <> NEW.EstadoAccesorio THEN
        INSERT INTO HistorialEstadoAccesorio (CodigoAccesorio, EstadoAnterior, EstadoNuevo, FechaCambio)
        VALUES (OLD.CodigoAccesorio, OLD.EstadoAccesorio, NEW.EstadoAccesorio, NOW());
    END IF;
END $$
DELIMITER ;

-- ===================================================================================
-- 6. DISPARADOR PARA INSERTAR HISTORIAL DE ACCESORIO CUANDO SE CREA.
-- FECHA DE CREACIÓN: 2025-02-18
-- ===================================================================================
DELIMITER $$
CREATE TRIGGER trg_Insert_Historial_Accesorio
AFTER INSERT ON AccesoriosBase
FOR EACH ROW
BEGIN
    INSERT INTO HistorialEstadoAccesorio (CodigoAccesorio, EstadoAnterior, EstadoNuevo, FechaCambio)
    VALUES (NEW.CodigoAccesorio, NULL, NEW.EstadoAccesorio, NOW());
END $$
DELIMITER ;

-- ===================================================================================
-- 7. DISPARADOR PARA INSERTAR HISTORIAL DE INSUMO CUANDO HAY CAMBIOS.
-- FECHA DE CREACIÓN: 2025-04-25
-- ===================================================================================
DELIMITER $$
CREATE TRIGGER trg_Historial_Estado_Insumo
BEFORE UPDATE ON InsumosBase
FOR EACH ROW
BEGIN
    IF OLD.EstadoInsumo <> NEW.EstadoInsumo OR
       OLD.Cantidad <> NEW.Cantidad OR
       OLD.StockMinimo <> NEW.StockMinimo THEN
       
        INSERT INTO HistorialEstadoInsumo (
            CodigoInsumo, 
            EstadoAnterior, EstadoNuevo, 
            StockAnterior, StockNuevo, 
            StockMinimoAnterior, StockMinimoNuevo, 
            FechaCambio
        )
        VALUES (
            OLD.CodigoInsumo, 
            OLD.EstadoInsumo, NEW.EstadoInsumo, 
            OLD.Cantidad, NEW.Cantidad, 
            OLD.StockMinimo, NEW.StockMinimo, 
            NOW()
        );
    END IF;
END $$
DELIMITER ;

-- ===================================================================================
-- 6. DISPARADOR PARA INSERTAR HISTORIAL DE INSUMO CUANDO SE CREA.
-- FECHA DE CREACIÓN: 2025-04-25
-- ===================================================================================
DELIMITER $$
CREATE TRIGGER trg_Insert_Historial_Insumo
AFTER INSERT ON InsumosBase
FOR EACH ROW
BEGIN
    INSERT INTO HistorialEstadoInsumo (
        CodigoInsumo, 
        EstadoAnterior, EstadoNuevo, 
        StockAnterior, StockNuevo, 
        StockMinimoAnterior, StockMinimoNuevo, 
        FechaCambio
    )
    VALUES (
        NEW.CodigoInsumo, 
        NULL, NEW.EstadoInsumo, 
        NULL, NEW.Cantidad, 
        NULL, NEW.StockMinimo, 
        NOW()
    );
END $$
DELIMITER ;



