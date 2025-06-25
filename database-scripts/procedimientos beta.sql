/*PROCEDIMIENTOS BETA*/
DELIMITER $$

DROP PROCEDURE IF EXISTS AgregarArticuloAlCarrito $$

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

/*2*/
DELIMITER $$

DROP PROCEDURE IF EXISTS EliminarArticuloDelCarrito $$
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



/*3*/
DELIMITER $$

DROP PROCEDURE IF EXISTS VaciarCarrito $$
CREATE PROCEDURE VaciarCarrito(IN p_IdCarrito INT)
BEGIN
  DECLARE fin INT DEFAULT 0;
  DECLARE v_id INT;

  -- Cursor que recorre los ID de los artículos del carrito
  DECLARE cur CURSOR FOR
    SELECT IdDetalleCarritoPK
    FROM DetalleCarritoVentas
    WHERE IdCarritoFK = p_IdCarrito;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET fin = 1;

  OPEN cur;

  bucle: LOOP
    FETCH cur INTO v_id;
    IF fin = 1 THEN
      LEAVE bucle;
    END IF;

    -- Eliminar cada artículo y revertir su estado/inventario
    CALL EliminarArticuloDelCarrito(v_id);
  END LOOP;

  CLOSE cur;

  -- Reiniciar el AUTO_INCREMENT de la tabla
  -- ALTER TABLE DetalleCarritoVentas AUTO_INCREMENT = 1;
END$$

DELIMITER ;

/*
INSERT INTO CarritoVentas (
  FechaCreacion,
  IdUsuarioFK,
  IdClienteFK,
  EstadoCarrito,
  Comentario
) VALUES (
  CURDATE(),       -- fecha actual
  3, -- ID del usuario (ajústalo al que esté autenticado)
  2,
  'En curso'       -- estado inicial del carrito
  ,''
);*/

/**CALL AgregarArticuloAlCarrito(2, 'Producto', 'GCI003-11', 270, 0, 270, 1);
CALL AgregarArticuloAlCarrito(2, 'Producto', 'GCJB007-5', 243, 20, 194.40, 1);
CALL AgregarArticuloAlCarrito(2, 'Insumo', 'INS-SAND-64GB', 10, 0, 10, 5);
CALL EliminarArticuloDelCarrito(20);
CALL EliminarArticuloDelCarrito(21);
call VaciarCarrito(6);*/

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







