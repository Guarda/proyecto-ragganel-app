/*DISPARADORES*/

DELIMITER $$

CREATE TRIGGER trg_Historial_Estado

/*DISPARADOR PARA LLEVAR EL HISTORIAL DE LOS PEDIDOS*/
BEFORE UPDATE ON PedidoBase
FOR EACH ROW
BEGIN
    -- Solo registrar si el estado realmente cambió
    IF OLD.EstadoPedidoFK <> NEW.EstadoPedidoFK THEN
        INSERT INTO HistorialEstadoPedido (CodigoPedido, EstadoAnterior, EstadoNuevo, FechaCambio)
        VALUES (OLD.CodigoPedido, OLD.EstadoPedidoFK, NEW.EstadoPedidoFK, NOW());
    END IF;
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_Insert_Historial_Pedido
AFTER INSERT ON PedidoBase
FOR EACH ROW
BEGIN
    INSERT INTO HistorialEstadoPedido (CodigoPedido, EstadoAnterior, EstadoNuevo, FechaCambio)
    VALUES (NEW.CodigoPedido, NULL, NEW.EstadoPedidoFK, NOW());
END $$

DELIMITER ;


/*DISPARADORES HISTORIAL DE PRODUCTOS 18/02/2025*/

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

DELIMITER $$

CREATE TRIGGER trg_Insert_Historial_Producto
AFTER INSERT ON ProductosBases
FOR EACH ROW
BEGIN
    INSERT INTO HistorialEstadoProducto (CodigoConsola, EstadoAnterior, EstadoNuevo, FechaCambio)
    VALUES (NEW.CodigoConsola, NULL, NEW.Estado, NOW());
END $$

DELIMITER ;

/*DISPARADORES HISTORIAL DE ACCESORIOS 18/02/2025*/
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

DELIMITER $$

CREATE TRIGGER trg_Insert_Historial_Accesorio
AFTER INSERT ON AccesoriosBase
FOR EACH ROW
BEGIN
    INSERT INTO HistorialEstadoAccesorio (CodigoAccesorio, EstadoAnterior, EstadoNuevo, FechaCambio)
    VALUES (NEW.CodigoAccesorio, NULL, NEW.EstadoAccesorio, NOW());
END $$

DELIMITER ;


/*DISPARADORES HISTORIAL DE INSUMOS 18/02/2025*/
DELIMITER $$

CREATE TRIGGER trg_Historial_Estado_Insumo
BEFORE UPDATE ON InsumosBase
FOR EACH ROW
BEGIN
    IF OLD.EstadoInsumo <> NEW.EstadoInsumo THEN
        INSERT INTO HistorialEstadoInsumo (CodigoInsumo, EstadoAnterior, EstadoNuevo, FechaCambio)
        VALUES (OLD.CodigoInsumo, OLD.EstadoInsumo, NEW.EstadoInsumo, NOW());
    END IF;
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_Insert_Historial_Insumo
AFTER INSERT ON InsumosBase
FOR EACH ROW
BEGIN
    INSERT INTO HistorialEstadoInsumo (CodigoInsumo, EstadoAnterior, EstadoNuevo, FechaCambio)
    VALUES (NEW.CodigoInsumo, NULL, NEW.EstadoInsumo, NOW());
END $$

DELIMITER ;



