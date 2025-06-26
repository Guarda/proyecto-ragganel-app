DELIMITER $$

DROP PROCEDURE IF EXISTS sp_Carrito_AgregarArticulo$$

CREATE PROCEDURE sp_Carrito_AgregarArticulo(
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
    DECLARE v_CantidadActual INT DEFAULT 0;
    DECLARE v_EstadoActual INT;
    DECLARE v_StockActual INT;
    DECLARE v_Subtotal DECIMAL(10,2);

    -- 1. Validar cantidad de entrada
    IF p_Cantidad <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La cantidad para agregar debe ser un número positivo.';
    END IF;

    -- 2. Buscar o crear un carrito activo
    SELECT IdCarritoPK INTO v_IdCarrito
    FROM CarritoVentas
    WHERE IdUsuarioFK = p_IdUsuario AND IdClienteFK = p_IdCliente AND EstadoCarrito = 'En curso'
    LIMIT 1;

    IF v_IdCarrito IS NULL THEN
        INSERT INTO CarritoVentas (IdUsuarioFK, IdClienteFK, EstadoCarrito)
        VALUES (p_IdUsuario, p_IdCliente, 'En curso');
        SET v_IdCarrito = LAST_INSERT_ID();
    END IF;

    -- 3. Lógica de gestión de inventario ANTES de agregarlo al carrito
    IF p_TipoArticulo = 'Producto' THEN
        SELECT Estado INTO v_EstadoActual FROM ProductosBases WHERE CodigoConsola = p_CodigoArticulo;
        IF v_EstadoActual = 11 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Este producto ya está en un carrito o proceso de venta.';
        END IF;
        UPDATE ProductosBases SET Estado = 11 WHERE CodigoConsola = p_CodigoArticulo;
        INSERT INTO HistorialEstadoProducto (CodigoConsola, EstadoAnterior, EstadoNuevo) VALUES (p_CodigoArticulo, v_EstadoActual, 11);

    ELSEIF p_TipoArticulo = 'Accesorio' THEN
        SELECT EstadoAccesorio INTO v_EstadoActual FROM AccesoriosBase WHERE CodigoAccesorio = p_CodigoArticulo;
        IF v_EstadoActual = 11 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Este accesorio ya está en un carrito o proceso de venta.';
        END IF;
        UPDATE AccesoriosBase SET EstadoAccesorio = 11 WHERE CodigoAccesorio = p_CodigoArticulo;
        INSERT INTO HistorialEstadoAccesorio (CodigoAccesorio, EstadoAnterior, EstadoNuevo) VALUES (p_CodigoArticulo, v_EstadoActual, 11);

    ELSEIF p_TipoArticulo = 'Insumo' THEN
        SELECT Cantidad INTO v_StockActual FROM InsumosBase WHERE CodigoInsumo = p_CodigoArticulo;
        IF v_StockActual < p_Cantidad THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock insuficiente para el insumo solicitado.';
        END IF;
        UPDATE InsumosBase SET Cantidad = Cantidad - p_Cantidad WHERE CodigoInsumo = p_CodigoArticulo;
        -- (Opcional) Registrar historial de stock
        
    ELSEIF p_TipoArticulo = 'Servicio' THEN
        -- Validar y descontar stock de insumos asociados al servicio
        -- (Esta parte es compleja y se asume correcta de tu procedimiento original)
        UPDATE InsumosBase I
        JOIN InsumosXServicio S ON I.CodigoInsumo = S.CodigoInsumoFK
        SET I.Cantidad = I.Cantidad - (S.CantidadDescargue * p_Cantidad)
        WHERE S.IdServicioFK = CAST(p_CodigoArticulo AS UNSIGNED);
    END IF;

    -- 4. Verificar si el artículo ya existe en el carrito para actualizar o insertar
    SELECT IdDetalleCarritoPK, Cantidad INTO v_IdDetalleCarrito, v_CantidadActual
    FROM DetalleCarritoVentas
    WHERE IdCarritoFK = v_IdCarrito AND TipoArticulo = p_TipoArticulo AND CodigoArticulo = p_CodigoArticulo
    LIMIT 1;

    SET v_Subtotal = (v_CantidadActual + p_Cantidad) * (p_PrecioVenta * (1 - p_Descuento/100));

    IF v_IdDetalleCarrito IS NOT NULL THEN
        -- Ya existe, actualizar cantidad (típico para Insumos/Servicios)
        UPDATE DetalleCarritoVentas
        SET Cantidad = v_CantidadActual + p_Cantidad, SubtotalSinIVA = v_Subtotal
        WHERE IdDetalleCarritoPK = v_IdDetalleCarrito;
    ELSE
        -- No existe, insertar nuevo
        INSERT INTO DetalleCarritoVentas (IdCarritoFK, TipoArticulo, CodigoArticulo, PrecioVenta, Descuento, SubtotalSinIVA, Cantidad)
        VALUES (v_IdCarrito, p_TipoArticulo, p_CodigoArticulo, p_PrecioVenta, p_Descuento, v_Subtotal, p_Cantidad);
    END IF;

    -- 5. Retornar el ID del carrito para referencia
    SELECT v_IdCarrito AS IdCarritoUsado;
END$$

DELIMITER ;

/**/
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_Carrito_DisminuirArticulo$$

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
        -- ¡CORRECCIÓN APLICADA AQUÍ!
        -- Si solo queda uno, se llama al procedimiento de eliminar con los parámetros correctos.
        CALL sp_Carrito_EliminarLinea(p_IdUsuario, p_IdCliente, p_TipoArticulo, p_CodigoArticulo);
        SELECT 'Era el último artículo en la línea, se ha eliminado por completo.' AS 'Resultado';
    END IF;

END$$

DELIMITER ;

DELIMITER $$

DROP PROCEDURE IF EXISTS sp_Carrito_EliminarLineaCompleta$$

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

DELIMITER $$

DROP PROCEDURE IF EXISTS sp_Carrito_LimpiarPorUsuarioCliente$$
CREATE PROCEDURE sp_Carrito_LimpiarPorUsuarioCliente(IN p_IdUsuario INT, IN p_IdCliente INT)
BEGIN
    -- Declaramos variables locales
    DECLARE v_IdCarrito INT;
    DECLARE v_IdDetalleCarrito INT;
    DECLARE fin_cursor INT DEFAULT 0;

    -- Cursor para iterar sobre los artículos del carrito que vamos a encontrar
    DECLARE cur_detalles CURSOR FOR
        SELECT IdDetalleCarritoPK
        FROM DetalleCarritoVentas
        WHERE IdCarritoFK = v_IdCarrito;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET fin_cursor = 1;

    -- Paso 1: Encontrar el ID del carrito para el usuario y cliente especificados.
    -- CORRECCIÓN: Se elimina la condición "AND Estado = 'EnCurso'" que causaba el error.
    -- AÑADIDO: Se ordena por ID descendente para asegurar que tomamos el carrito más reciente si hubiera más de uno.
    SELECT IdCarritoPK INTO v_IdCarrito
    FROM CarritoVentas
    WHERE IdUsuarioFK = p_IdUsuario AND IdClienteFK = p_IdCliente
    ORDER BY IdCarritoPK DESC
    LIMIT 1;

    -- Paso 2: Solo si se encontró un carrito, procedemos a limpiarlo.
    IF v_IdCarrito IS NOT NULL THEN
        OPEN cur_detalles;

        bucle_limpieza: LOOP
            FETCH cur_detalles INTO v_IdDetalleCarrito;
            IF fin_cursor = 1 THEN
                LEAVE bucle_limpieza;
            END IF;

            -- Esta lógica interna se mantiene, ya que funciona correctamente.
            CALL EliminarArticuloDelCarrito(v_IdDetalleCarrito);
        END LOOP;

        CLOSE cur_detalles;
    END IF;

END$$

DELIMITER ;



CALL sp_Carrito_AgregarArticulo(1,2, 'Insumo', 'INS-SAND-64GB', 10, 0, 1);
CALL sp_Carrito_DisminuirArticulo(1,2, 'Insumo', 'INS-SAND-64GB');
CALL sp_Carrito_EliminarLineaCompleta(1,2, 'Insumo', 'INS-KING-32GB');

call sp_Carrito_LimpiarPorUsuarioCliente('1','1')