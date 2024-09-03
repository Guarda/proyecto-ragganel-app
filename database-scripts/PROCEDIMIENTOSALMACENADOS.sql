/* CREAR PROCEDIMIENTOS ALMACENADOS POR ROMMEL MALTEZ 28-03-2024*/

use base_datos_inventario_taller;

/*LISTAR PRODUCTOS EN LA TABLA PRODUCTOSBASES*/
DELIMITER //
CREATE PROCEDURE ListarTablaProductosBases ()
       BEGIN
			SELECT A.CodigoConsola, B.DescripcionConsola, A.Color, C.DescripcionEstado As 'Estado',
				A.Hackeado as 'Hack',
                DATE_FORMAT(A.FechaIngreso, '%d/%m/%Y') as 'Fecha_Ingreso',
                Comentario
			FROM ProductosBases A 
            join CatalogoConsolas B on A.Modelo = B.IdModeloConsolaPK
            join CatalogoEstadosConsolas C on A.Estado = C.CodigoEstado
			WHERE A.Estado != 7;
       END //
DELIMITER ;

/*PROCEDIMIENTO IngresarProductoATablaProductoBase*/
DELIMITER //
CREATE PROCEDURE IngresarProductoATablaProductoBase (modeloP int, colorP varchar(100),EstadoP int, hackP boolean, ComentarioP varchar(100))	
       BEGIN
			DECLARE fecha varchar(25) default '010120';
            DECLARE ModeloCatCons varchar(25);
            DECLARE cantidadhoy int default 0;
			SELECT DATE_FORMAT(NOW(), '%d%m%Y') into fecha;
            SELECT CodigoModeloConsola from CatalogoConsolas where modelop = IdModeloConsolaPK into ModeloCatCons;
            SELECT count(*) into cantidadhoy from ProductosBases where date(FechaIngreso)=date(date_sub(now(),interval 0 day));
			INSERT into ProductosBases values(concat(ModeloCatCons,'-',fecha,cantidadhoy), modeloP, colorP, EstadoP, hackP, DATE_FORMAT(NOW(), '%Y%m%d'), ComentarioP);			
       END //
DELIMITER ;

/*PROCEDIMIENTO ListarCategoriasConsolasBase*/
DELIMITER //
CREATE PROCEDURE ListarCategoriasConsolasBase ()
BEGIN
	SELECT * FROM catalogoconsolas;
END//
DELIMITER ;

/*PROCEDIMIENTO ListarTablaProductosBasesXId modificado el dia 14 / 08 / 24*/
/*
CREATE DEFINER=`root`@`localhost` PROCEDURE `ListarTablaProductosBasesXId`(IdCodigoConsola varchar(100))
BEGIN
			SELECT A.CodigoConsola, B.DescripcionConsola, A.Color, C.DescripcionEstado As 'Estado',
				A.Hackeado as 'Hack',
                DATE_FORMAT(A.FechaIngreso, '%d/%m/%Y') as 'Fecha_Ingreso',
                Comentario
			FROM ProductosBases A 
            join CatalogoConsolas B on A.Modelo = B.IdModeloConsolaPK
            join CatalogoEstadosConsolas C on A.Estado = C.CodigoEstado
			where A.CodigoConsola = IdCodigoConsola;
       END
DELIMITER //
*/
DELIMITER //
CREATE PROCEDURE ListarTablaProductosBasesXId(IdCodigoConsola varchar(100))
BEGIN
			SELECT A.CodigoConsola, B.IdModeloConsolaPK, A.Color, C.CodigoEstado,
				A.Hackeado as 'Hack',
                DATE_FORMAT(A.FechaIngreso, '%d/%m/%Y') as 'Fecha_Ingreso',
                Comentario
			FROM ProductosBases A 
            join CatalogoConsolas B on A.Modelo = B.IdModeloConsolaPK
            join CatalogoEstadosConsolas C on A.Estado = C.CodigoEstado
			where A.CodigoConsola = IdCodigoConsola;
END//
DELIMITER ;

/*PROCEDIMIENTO ListarEstadosConsolas modificado 24 / 08 / 24*/
DELIMITER //
	CREATE PROCEDURE ListarEstadosConsolas()
    BEGIN
		SELECT * FROM catalogoestadosconsolas;
    END//
DELIMITER;

CALL ListarEstadosConsolas();

/*PROCEDIMIENTO ActualizarProductoBase modificado el dia 19 / 08 / 24*/
DELIMITER //
CREATE PROCEDURE ActualizarProductoBase(IdCodigoConsola varchar(100), ModeloConsola int, ColorConsola varchar(100), EstadoConsola int, HackConsola boolean, ComentarioConsola varchar(100))
BEGIN
	UPDATE ProductosBases 
    SET  
        Modelo = ModeloConsola, 
        Color = ColorConsola, 
        Estado = EstadoConsola, 
        Hackeado = HackConsola,        
        Comentario = ComentarioConsola
	WHERE CodigoConsola = IdCodigoConsola;
END //
DELIMITER ;

/*PROCEDIMIENTO BORRAR PRODUCTO*/
DELIMITER //
	CREATE PROCEDURE BorrarProducto(IdCodigoConsola varchar(100))
    BEGIN
		UPDATE ProductosBases
        SET
			Estado = 7
        WHERE CodigoConsola = IdCodigoConsola;
    END //
DELIMITER ;

CALL BorrarProducto('N06-0064-240820240');


/*PROCEDIMIENTO IngresarCategoriaProducto*/
DELIMITER //
	CREATE PROCEDURE IngresarCategoriaProducto(PrefijoProducto varchar(25), DescripcionProducto varchar(100), FabricanteProducto varchar(100), NombreArchivoImagen varchar(100))
    BEGIN
		DECLARE cantidad varchar(24);
        select count(idmodeloconsolapk)+1 from catalogoconsolas into cantidad;
		INSERT INTO catalogoconsolas(CodigoModeloConsola, DescripcionConsola, Fabricante, LinkImagen) values (concat(PrefijoProducto,'00',cantidad), DescripcionProducto, FabricanteProducto, NombreArchivoImagen);
    END //
DELIMITER ;



CALL IngresarCategoriaProducto('P', 'SONY Play Station 2 - FAT - SCPH-18000 (2000)','Sony','ps2fat18000.png');
CALL IngresarCategoriaProducto('P', 'SONY Play Station 2 - SLIM - SCPH-900XX (2007-2013)','Sony','ps2slim900xx.jpg');

DELETE FROM catalogoconsolas where idmodeloconsolapk = 91;
    


