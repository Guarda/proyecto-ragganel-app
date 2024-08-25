/* CREAR PROCEDIMIENTOS ALMACENADOS POR ROMMEL MALTEZ 28-03-2024*/

use base_datos_inventario_taller;

/*LISTAR PRODUCTOS EN LA TABLA PRODUCTOSBASES*/
DELIMITER //
CREATE PROCEDURE ListarTablaProductosBases ()
       BEGIN
			SELECT A.CodigoConsola, B.DescripcionConsola, A.Color, C.DescripcionEstado As 'Estado',
				Case A.Hackeado 
				When 0 then 'No'
				When 1 then 'Si'
				End as 'Hack',
                DATE_FORMAT(A.FechaIngreso, '%d/%m/%Y') as 'Fecha Ingreso',
                Comentario
			FROM ProductosBases A 
            join CatalogoConsolas B on A.Modelo = B.IdModeloConsolaPK
            join CatalogoEstadosConsolas C on A.Estado = C.CodigoEstado;			
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

/*PROCEDIMIENTO LISTAR ESTADO CONSOLAS modificado 24 /08 / 24 */
DELIMITER //
CREATE PROCEDURE ListarEstadosConsolas()
BEGIN
	SELECT * FROM CatalogoEstadosConsolas;
END//
DELIMITER ;

