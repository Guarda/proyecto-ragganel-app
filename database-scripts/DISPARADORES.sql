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



