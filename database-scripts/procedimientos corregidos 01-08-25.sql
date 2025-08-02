/*procedimientos corregidos*/


DELIMITER $$

DROP PROCEDURE IF EXISTS IngresarCliente;

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

    -- Devuelve el ID del registro que acabas de insertar
    SELECT LAST_INSERT_ID() AS id; 
END$$

DELIMITER ;

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

DELIMITER $$

CREATE PROCEDURE ActualizarCliente(
    IN p_IdClientePK INT,
    IN p_NombreCliente VARCHAR(255),
    IN p_DNI VARCHAR(255),
    IN p_RUC VARCHAR(255),
    IN p_Telefono VARCHAR(255),
    IN p_CorreoElectronico VARCHAR(255),
    IN p_Direccion VARCHAR(255),    
    IN p_Estado BOOLEAN,
    IN p_Comentarios VARCHAR(1000)
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



delimiter //

CREATE PROCEDURE `sp_Carrito_ActualizarDetalle`(
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
END ;

DELIMITER ;



ALTER TABLE CLIENTES
ADD COLUMN Comentarios varchar(1000);

/*
INSERT INTO MargenesVenta (NombreMargen, Porcentaje, Descripcion) VALUES
('Precio de Costo', 0, 'Precio al costo sin ganancia'),
('Precio Personalizado',-1,' Precio personalizado'); */



DELIMITER $$

-- DROP PROCEDURE IF EXISTS sp_ObtenerVentasPorCliente;

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

CALL sp_ObtenerVentasPorCliente(1);

DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_CrearNotaCredito`;

CREATE PROCEDURE `sp_CrearNotaCredito`(
    IN p_IdVentaFK INT,
    IN p_UsuarioEmisorFK INT,
    IN p_Motivo TEXT,
    IN p_TotalCredito DECIMAL(10,2),
    IN p_DetallesJSON JSON,
    IN p_IdMotivoFK INT,
    IN p_AnularFacturaOriginal BOOLEAN -- <<-- PARÁMETRO AÑADIDO
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
        -- ... (lógica del while sin cambios) ...
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

DELIMITER $$

CREATE PROCEDURE sp_AnularNotaCredito(
    IN p_IdNotaCreditoPK INT,
    IN p_IdUsuarioAnuladorFK INT,
    IN p_MotivoAnulacion VARCHAR(255)
)
BEGIN
    -- Declaración de variables para el cursor
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

    -- Inicia la transacción
    START TRANSACTION;

    -- 1. Verificar si la nota ya está anulada
    SELECT Estado, IdVentaFK INTO v_estado_actual, v_IdVentaFK
    FROM NotasCredito WHERE IdNotaCreditoPK = p_IdNotaCreditoPK;
    
    IF v_estado_actual = FALSE THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La Nota de Crédito ya se encuentra anulada.';
    END IF;

    -- 2. Anular la nota de crédito (soft delete)
    UPDATE NotasCredito
    SET Estado = 0 -- 0 para Inactivo/Anulado
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

    -- Cerrar el cursor
    CLOSE cur_detalles;
    
    IF v_IdVentaFK IS NOT NULL THEN
        UPDATE VentasBase SET IdEstadoVentaFK = 2 WHERE IdVentaPK = v_IdVentaFK;
    END IF;

    -- ==================================================================
    -- 4. (NUEVO) Registrar la acción de anulación en el historial
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

call sp_AnularNotaCredito(11,)
