/* CREAR PROCEDIMIENTOS ALMACENADOS POR ROMMEL MALTEZ 28-03-2024*/

use base_datos_inventario_taller;

/*LISTAR PRODUCTOS EN LA TABLA PRODUCTOSBASES*/
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

/*PROCEDIMIENTO IngresarProductoATablaProductoBaseV4 25 / 09 / 24*/
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
    TareasP TEXT -- Add the TodoList parameter (comma-separated)
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

    -- Get the console model code
    SELECT CodigoModeloConsola INTO ModeloCatCons 
    FROM CatalogoConsolas 
    WHERE IdModeloConsolaPK = modeloP;

    -- Get the total number of records for creating a unique CodigoConsola
    SELECT COUNT(*) INTO cantidadRegistros 
    FROM ProductosBases;

    -- Generate the CodigoConsola
    SET CodigoConsolaGenerated = CONCAT(ModeloCatCons, '-', cantidadRegistros);

    -- Format the Accesorios array as a comma-separated string
    SET AccesoriosConcatenados = REPLACE(AccesoriosP, '","', ',');

    -- Insert the new product base into the table
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

    -- Insert tasks (TodoList) into TareasdeProductos using the generated CodigoConsola
    WHILE LENGTH(TareasP) > 0 DO
        SET next_comma = LOCATE(',', TareasP);
        
        IF next_comma = 0 THEN
            -- No more commas, insert the last task
            SET tarea = TRIM(TareasP);
            INSERT INTO TareasdeProductos (DescripcionTarea, Realizado, Activo, IdCodigoConsolaFK)
            VALUES (tarea, 0, 1, CodigoConsolaGenerated);
            SET TareasP = '';
        ELSE
            -- Extract the task before the next comma
            SET tarea = TRIM(SUBSTRING(TareasP, 1, next_comma - 1));
            INSERT INTO TareasdeProductos (DescripcionTarea, Realizado, Activo, IdCodigoConsolaFK)
            VALUES (tarea, 0, 1, CodigoConsolaGenerated);
            
            -- Update the string to exclude the inserted task
            SET TareasP = SUBSTRING(TareasP, next_comma + 1);
        END IF;
    END WHILE;
    
END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO ListarCategoriasConsolasBase actualizado 16/09/2024*/
CREATE PROCEDURE ListarCategoriasConsolasBase ()
BEGIN	
    SELECT * FROM catalogoconsolas a
    join Fabricantes b on a.Fabricante = b.IdFabricantePK
    join Categoriasproductos c on a.Categoria = c.IdCategoriaPK
    join Subcategoriasproductos d on a.Subcategoria = d.IdSubcategoria
    join Tiposproductos e on a.TipoProducto = e.IdTipoProductoPK
    WHERE a.ACTIVO = 1;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE `ListarTablaProductosBasesXIdV2`(IdCodigoConsola varchar(100))
/* procedimiento almacenado ListarTablaProductosBasesXIdV2 02/10/2024*/
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

DELIMITER //
CREATE PROCEDURE ListarTablaProductosBasesXId(IdCodigoConsola varchar(100))
BEGIN
			SELECT A.CodigoConsola, B.IdModeloConsolaPK, A.Color, C.CodigoEstado,
				A.Hackeado as 'Hack',
                DATE_FORMAT(A.FechaIngreso, '%d/%m/%Y') as 'Fecha_Ingreso',
                Comentario,
                PrecioBase,
                Moneda
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
    END //
DELIMITER ;

/* PROCEDURE Actualizarproductobasev2 05/10/2024*/
DELIMITER //
CREATE PROCEDURE Actualizarproductobasev2 (
    CodigoConsolaP VARCHAR(50), -- Assuming you want to update by CodigoConsola
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

    -- Format the Accesorios array as a comma-separated string
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

    -- Optionally, you can return a message or status here if needed
    SELECT 'Product updated successfully' AS message;
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

DELIMITER //
/*PROCEDIMIENTO IngresarCategoriaProductoV2 Creado 16/09/24 */
	CREATE PROCEDURE IngresarCategoriaProducto(FabricanteP int, CategoriaP int, SubcategoriaP int, PrefijoProducto varchar(25), NombreArchivoImagen varchar(100), TipoProductoP int)
    BEGIN
		DECLARE cantidad varchar(24);
        select count(idmodeloconsolapk)+1 from catalogoconsolas into cantidad;        
		INSERT INTO catalogoconsolas(Fabricante, Categoria, Subcategoria, CodigoModeloConsola, LinkImagen, TipoProducto) 
        values (FabricanteP, CategoriaP, SubcategoriaP,concat(PrefijoProducto,cantidad), NombreArchivoImagen, TipoProductoP);
    END //
DELIMITER ;

/*PROCEDIMIENTO ListarTablacatalogoconsolasXId creado 03 / 08 / 24*/
DELIMITER //
	CREATE PROCEDURE ListarTablacatalogoconsolasXId(IdCategoria int)
    BEGIN
		SELECT 
			*
        FROM catalogoconsolas 
        where IdModeloConsolaPK = IdCategoria;    
    END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO ALMACENADO BuscarIdCategoriaCatalogo creado 16/09/24*/
	CREATE PROCEDURE BuscarIdCategoriaCatalogo(IdFabricanteP int, IdCategoriaP int, IdSubcategoriaP int)
    BEGIN
		SELECT IdModeloConsolaPK, TipoProducto FROM catalogoconsolas
        WHERE Fabricante = IdFabricanteP
        AND Categoria = IdCategoriaP
        AND Subcategoria = IdSubcategoriaP;
    END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO ActualizarCategoria creado el dia 03 / 08 / 24
Actualizado el 11/09/24*/
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

/*PROCEDIMIENTO BORRAR CATEGORIA*/
DELIMITER //
	CREATE PROCEDURE BorrarCategoria(IdCategoria int)
    BEGIN
		UPDATE catalogoconsolas
        SET
			Activo = 0
        WHERE IdModeloConsolaPK = IdCategoria;
    END //
DELIMITER ;

/*PROCEDIMIENTO LLAMAR TODOS LOS TIPOS DE PRODUCTOS 11/09/24*/
DELIMITER // 
	CREATE PROCEDURE ListarTiposProductos()
    BEGIN
		SELECT IdTipoProductoPK, DescripcionTipoProducto FROM TiposProductos; 
    END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LLAMAR LOS TIPOS DE ACCESORIOS POR TIPO DE PRODUCTO*/
	CREATE PROCEDURE ListarAccesoriosXIdTipoProducto(IdTipoProductoP int)
    BEGIN
		select DescripcionAccesorio from TiposAccesorios a 
		inner join CatalogoTiposAccesoriosXProducto b on a.IdTipoAccesorioPK = b.IdTipoAccesorioFK
		inner join TiposProductos c on b.IdTipoProductoFK = c.IdTipoProductoPK
		where c.IdTipoProductoPK = IdTipoProductoP;
    END //
DELIMITER ;

call ListarAccesoriosXIdTipoProducto(1);

/*PROCEDIMIENTO LLAMAR CATEGORIAS POR FABRICANTE CREADO 11/09/24*/
DELIMITER //
	CREATE PROCEDURE ListarCategoriasXFabricante(FabricanteP varchar(100))
		BEGIN
			SELECT * FROM catalogoconsolas 
            where Fabricante = FabricanteP
            AND Activo = 1;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR TODOS LOS FABRICANTES CREADO 14/09/2024*/
CREATE PROCEDURE ListarFabricantes()
		BEGIN
			SELECT * FROM Fabricantes 
            WHERE Activo = 1;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR TODOS LAS CATEGORIAS CREADO 14/09/2024*/
CREATE PROCEDURE ListarCategoriasProductos()
		BEGIN
			SELECT * FROM categoriasproductos 
            WHERE Activo = 1;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR TODOS LAS SUBCATEGORIAS CREADO 14/09/2024*/
CREATE PROCEDURE ListarSubCategoriasProductos()
		BEGIN
			SELECT * FROM subcategoriasproductos 
            WHERE Activo = 1;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR CATEGORIAS POR FABRICANTE CREADO 16/09/2024*/
CREATE PROCEDURE ListarCategoriasProductosxFabricante(IdFabricanteP int)
	BEGIN
		SELECT a.IdCategoriaPK, a.NombreCategoria from categoriasproductos a
        join Fabricantes b on a.IdFabricanteFK = b.IdFabricantePK
        WHERE b.IdFabricantePK = IdFabricanteP
        AND a.Activo = 1;
    END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR SUBCATEGORIAS POR CATEGORIA CREADO 16/09/2024*/
CREATE PROCEDURE ListarSubCategoriasProductosxCategoria(IdCategoriaP int)
	BEGIN
		SELECT a.IdSubcategoria, a.NombreSubCategoria from Subcategoriasproductos a
        join categoriasproductos b on a.IdCategoriaFK = b.IdCategoriaPK
        WHERE b.IdCategoriaPK = IdCategoriaP
        AND a.Activo = 1;
    END //
DELIMITER ;

DELIMITER //

CREATE PROCEDURE InsertTareas(
    IN IdCodigoConsolaFK VARCHAR(25), 
    IN Tareas TEXT -- Passed as a comma-separated string
)
BEGIN
    DECLARE tarea VARCHAR(100);
    DECLARE pos INT DEFAULT 1;
    DECLARE next_comma INT;

    -- Loop through the comma-separated string of tasks
    WHILE LENGTH(Tareas) > 0 DO
        SET next_comma = LOCATE(',', Tareas);
        
        IF next_comma = 0 THEN
            -- No more commas, insert the last task
            SET tarea = TRIM(Tareas);
            INSERT INTO TareasdeProductos (DescripcionTarea, Realizado, Activo, IdCodigoConsolaFK)
            VALUES (tarea, 0, 1, IdCodigoConsolaFK);
            SET Tareas = '';
        ELSE
            -- Extract the task before the next comma
            SET tarea = TRIM(SUBSTRING(Tareas, 1, next_comma - 1));
            INSERT INTO TareasdeProductos (DescripcionTarea, Realizado, Activo, IdCodigoConsolaFK)
            VALUES (tarea, 0, 1, IdCodigoConsolaFK);
            
            -- Update the string to exclude the inserted task
            SET Tareas = SUBSTRING(Tareas, next_comma + 1);
        END IF;
    END WHILE;
END //

DELIMITER ;


DELIMITER //
CREATE PROCEDURE ListarTareasxProducto(Codigoproducto varchar(25))
/*PROCEDIMIENTO ALMACENADO ListarTareasxProducto creado 02/10/2024*/
BEGIN
	SELECT * FROM Tareasdeproductos
    WHERE IdCodigoConsolaFK = Codigoproducto;
END //
DELIMITER ; 


CALL InsertTareas('12345', "Reparar pantalla, Chipear, Pintar");
CALL ListarTareasxProducto('GCSO004-3');

DELIMITER //

CREATE PROCEDURE ActualizarTareaRealizado(
    IN p_IdTareaPK INT,
    IN p_Realizado BOOLEAN
)
BEGIN
    -- Update the Realizado field for the specific task
    UPDATE TareasdeProductos
    SET Realizado = p_Realizado
    WHERE IdTareaPK = p_IdTareaPK;
END //

DELIMITER ;



DELIMITER $$
/*PROCEDIMIENTO BORRAR FABRICANTE y ASOCIADOS CREADO 17/10/2024*/
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


DELIMITER $$
/*PROCEDIMIENTO BORRAR CATEGORIA y ASOCIADOS CREADO 17/10/2024*/
CREATE PROCEDURE SofDeleteCategoria(IN p_IdCategoria INT)
BEGIN
    -- Step 1: Soft delete the fabricante by setting Activo to 0
    UPDATE CategoriasProductos
    SET Activo = 0
    WHERE IdCategoriaPK = p_IdCategoria;

    -- Step 2: Soft delete all categories related to this fabricante
    UPDATE SubcategoriasProductos
    SET Activo = 0
    WHERE IdCategoriaFK = p_IdCategoria;
    
     -- Step 3: Soft delete all categories of products with the categorie
    UPDATE catalogoconsolas
    SET Activo = 0
    WHERE Categoria = p_IdCategoria;
   
END$$

DELIMITER ;

DELIMITER $$
/*PROCEDIMIENTO BORRAR CATEGORIA y ASOCIADOS CREADO 19/10/2024*/
CREATE PROCEDURE SofDeleteSubCategoria(IN p_IdSubCategoria INT)
BEGIN
    -- Step 1: Soft delete the subcategoria by setting Activo to 0
    UPDATE SubcategoriasProductos
    SET Activo = 0
    WHERE IdSubcategoria = p_IdSubCategoria;

    -- Step 3: Soft delete all categories of products with the categorie
    UPDATE catalogoconsolas
    SET Activo = 0
    WHERE Subcategoria = p_IdSubCategoria;
   
END$$

DELIMITER ;




DELIMITER $$
/*PROCEDIMIENTO ALMACENADO INSERTAR FABRICANTE 22/10/2024*/
CREATE PROCEDURE IngresarFabricante(PNombreFabricante varchar(100))
BEGIN
   INSERT INTO FABRICANTES (NombreFabricante, Activo) values (PNombreFabricante, 1);   
END$$

DELIMITER ;

DELIMITER $$
/*PROCEDIMIENTO ALMACENADO INSERTAR CATEGORIA 22/10/2024*/
CREATE PROCEDURE IngresarCategoria(PNombreCategoria varchar(100), PIdFabricante int)
BEGIN
   INSERT INTO CATEGORIASPRODUCTOS (NombreCategoria, IdFabricanteFK, Activo) values (PNombreCategoria, PIdFabricante, 1);   
END$$

DELIMITER ;

DELIMITER $$
/*PROCEDIMIENTO ALMACENADO INSERTAR SUBCATEGORIA 22/10/2024*/
CREATE PROCEDURE IngresarSubcategoria(PNombreSubcategoria varchar(100), PIdCategoria int)
BEGIN
   INSERT INTO SUBCATEGORIASPRODUCTOS (NombreSubcategoria, IdCategoriaFK, Activo) values (PNombreSubcategoria, PIdCategoria, 1);   
END$$

DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR TODOS LOS FABRICANTES EN CUALQUIER ESTADO CREADO 30/10/2024*/
CREATE PROCEDURE ListarFabricantesBase()
		BEGIN
			SELECT * FROM Fabricantes;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR TODOS LAS CATEGORIAS CREADO 30/10/2024*/
CREATE PROCEDURE ListarCategoriasProductosBase()
		BEGIN
			SELECT * FROM categoriasproductos;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR TODOS LAS SUBCATEGORIAS CREADO 30/10/2024*/
CREATE PROCEDURE ListarSubCategoriasProductosBase()
		BEGIN
			SELECT * FROM subcategoriasproductos ;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR SUBCATEGORIAS POR CATEGORIA EN CUALQUIER ESTADO CREADO 30/10/2024*/
CREATE PROCEDURE ListarSubCategoriasProductosxCategoriaBase(IdCategoriaP int)
	BEGIN
		SELECT a.IdSubcategoria, a.NombreSubCategoria from Subcategoriasproductos a
        join categoriasproductos b on a.IdCategoriaFK = b.IdCategoriaPK
        WHERE b.IdCategoriaPK = IdCategoriaP;
    END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR ACCESORIOS BASE*/
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

DELIMITER //
/*PROCEDIMIENTO ListarCategoriasAccesoriosBase creado 12/11/2024*/
CREATE PROCEDURE ListarCategoriasAccesoriosBase ()
BEGIN	
    SELECT * FROM catalogoaccesorios a
    join Fabricanteaccesorios b on a.FabricanteAccesorio = b.IdFabricanteAccesorioPK
    join CategoriasAccesorios c on a.CategoriaAccesorio = c.IdCategoriaAccesorioPK
    join Subcategoriasaccesorios d on a.Subcategoriaaccesorio = d.IdSubcategoriaaccesorio
    WHERE a.ACTIVO = 1;
END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR TODOS LOS FABRICANTES DE ACCESORIOS CREADO 13/10/2024*/
CREATE PROCEDURE ListarFabricantesAccesorios()
		BEGIN
			SELECT * FROM Fabricanteaccesorios 
            WHERE Activo = 1;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR TODOS LAS CATEGORIAS DE ACCESORIOS CREADO 13/10/2024*/
CREATE PROCEDURE ListarCategoriasAccesorios()
		BEGIN
			SELECT * FROM categoriasaccesorios 
            WHERE Activo = 1;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR TODOS LAS SUBCATEGORIAS DE ACCESORIOS CREADO 13/10/2024*/
CREATE PROCEDURE ListarSubCategoriasAccesorios()
		BEGIN
			SELECT * FROM subcategoriasaccesorios 
            WHERE Activo = 1;
        END //
DELIMITER ;

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

DELIMITER //
/*PROCEDIMIENTO LISTAR SUBCATEGORIAS POR CATEGORIA CREADO 16/09/2024*/
CREATE PROCEDURE ListarSubCategoriasAccesoriossxCategoria(IdCategoriaA int)
	BEGIN
		SELECT a.IdSubcategoriaAccesorio, a.NombreSubcategoriaAccesorio from Subcategoriasaccesorios a
        join categoriasaccesorios b on a.IdCategoriaAccesorioFK = b.IdCategoriaAccesorioPK
        WHERE b.IdCategoriaAccesorioPK = IdCategoriaA
        AND a.Activo = 1;
    END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO ALMACENADO BuscarIdCategoriaAccesorioCatalogo creado 14/11/24*/
	CREATE PROCEDURE BuscarIdCategoriaAccesorioCatalogo(IdFabricanteA int, IdCategoriaA int, IdSubcategoriaA int)
    BEGIN
		SELECT IdModeloAccesorioPK FROM catalogoaccesorios
        WHERE FabricanteAccesorio = IdFabricanteA
        AND CategoriaAccesorio = IdCategoriaA
        AND SubcategoriaAccesorio = IdSubcategoriaA;
    END //
DELIMITER ;

/*PROCEDIMIENTO ListarTablacatalogoaccesoriosXId creado 14/11/24*/
DELIMITER //
	CREATE PROCEDURE ListarTablacatalogoaccesoriosXId(IdCategoria int)
    BEGIN
		SELECT 
			*
        FROM catalogoaccesorios 
        where IdModeloAccesorioPK = IdCategoria;    
    END //
DELIMITER ;


/* PROCEDIMIENTO IngresarAccesorioATablaAccesoriosBase 14/11/24 */
DELIMITER //
CREATE PROCEDURE IngresarAccesorioATablaAccesoriosBase (
    modeloAcc INT, 
    colorAcc VARCHAR(100), 
    estadoAcc INT, 
    precioBase DECIMAL(6,2), 
    comentarioAcc VARCHAR(2000), 
    numeroSerie VARCHAR(100), 
    tareasP TEXT -- Comma-separated list of tasks
)
BEGIN
    DECLARE codigoAccesorioGenerated VARCHAR(50);
    DECLARE cantidadRegistros INT DEFAULT 0;
    DECLARE tarea VARCHAR(100);
    DECLARE next_comma INT;
    DECLARE ModeloCatCons VARCHAR(25); 
    
    -- Get the console model code
    SELECT CodigoModeloAccesorio INTO ModeloCatCons 
    FROM CatalogoAccesorios 
    WHERE IdModeloAccesorioPK = modeloAcc;
    
    -- Get the total count of records for creating a unique CodigoAccesorio
    SELECT COUNT(*) INTO cantidadRegistros 
    FROM AccesoriosBase;

    -- Generate a unique CodigoAccesorio by combining modeloAcc with record count
    SET codigoAccesorioGenerated = CONCAT(ModeloCatCons, '-', cantidadRegistros + 1);

    -- Insert the new accessory into AccesoriosBase
    INSERT INTO AccesoriosBase (
        CodigoAccesorio, ModeloAccesorio, ColorAccesorio, EstadoAccesorio, FechaIngreso, Comentario, PrecioBase, NumeroSerie
    )
    VALUES (
        codigoAccesorioGenerated, 
        modeloAcc, 
        colorAcc, 
        estadoAcc, 
        DATE_FORMAT(NOW(), '%Y%m%d'), 
        comentarioAcc, 
        precioBase, 
        numeroSerie
    );

    -- Insert tasks into TareasdeAccesorios for the accessory
    WHILE LENGTH(tareasP) > 0 DO
        SET next_comma = LOCATE(',', tareasP);

        IF next_comma = 0 THEN
            -- No more commas, insert the last task
            SET tarea = TRIM(tareasP);
            INSERT INTO TareasdeAccesorios (DescripcionTarea, Realizado, Activo, IdCodigoAccesorioFK)
            VALUES (tarea, 0, 1, codigoAccesorioGenerated);
            SET tareasP = '';
        ELSE
            -- Extract the task before the next comma
            SET tarea = TRIM(SUBSTRING(tareasP, 1, next_comma - 1));
            INSERT INTO TareasdeAccesorios (DescripcionTarea, Realizado, Activo, IdCodigoAccesorioFK)
            VALUES (tarea, 0, 1, codigoAccesorioGenerated);
            
            -- Update the string to exclude the inserted task
            SET tareasP = SUBSTRING(tareasP, next_comma + 1);
        END IF;
    END WHILE;

END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ListarTareasxAccesorio(Codigoaccesorio varchar(25))
/*PROCEDIMIENTO ALMACENADO ListarTareasxAccesorio creado 14/11/2024*/
BEGIN
	SELECT * FROM Tareasdeaccesorios
    WHERE IdCodigoAccesorioFK = Codigoaccesorio;
END //
DELIMITER ; 


DELIMITER //

CREATE PROCEDURE ActualizarTareaAccesorioRealizado(
    IN p_IdTareaPK INT,
    IN p_Realizado BOOLEAN
)
/*PROCEDIMIENTO ALMACENADO ActualizarTareaRealizado creado 14/11/2024*/
BEGIN
    -- Update the Realizado field for the specific task
    UPDATE Tareasdeaccesorios
    SET Realizado = p_Realizado
    WHERE IdTareaAccesorioPK = p_IdTareaPK;
END //

DELIMITER ;

DELIMITER //
CREATE PROCEDURE `ListarTablaAccesoriosBasesXId`(IdCodigoAccesorio varchar(100))
/* procedimiento almacenado ListarTablaProductosBasesXIdV2 14/11/2024*/
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

DELIMITER //
/*PROCEDIMIENTO LISTAR TODOS LOS FABRICANTES ACCESORIOS EN CUALQUIER ESTADO CREADO 14/11/2024*/
CREATE PROCEDURE ListarFabricantesAccesoriosBase()
		BEGIN
			SELECT * FROM Fabricanteaccesorios;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR TODOS LAS CATEGORIAS ACCESORIOS CREADO 14/11/2024*/
CREATE PROCEDURE ListarCategoriasAccesoriosB()
		BEGIN
			SELECT * FROM categoriasaccesorios;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR SUBCATEGORIAS POR CATEGORIA DE ACCESORIOS EN CUALQUIER ESTADO CREADO 14/11/2024*/
CREATE PROCEDURE ListarSubCategoriasAccesoriosxCategoriaBase(IdCategoriaP int)
	BEGIN
		SELECT a.IdSubcategoriaaccesorio, a.NombreSubCategoriaaccesorio from Subcategoriasaccesorios a
        join categoriasaccesorios b on a.IdCategoriaAccesorioFK = b.IdCategoriaAccesorioPK
        WHERE b.IdCategoriaAccesorioPK = IdCategoriaP;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ActualizarAccesorioBase (
    CodigoAccesorioA VARCHAR(50), -- Código del accesorio a actualizar
    modeloAccesorioA INT, 
    colorAccesorioA VARCHAR(100), 
    EstadoAccesorioA INT, 
    PrecioAccesorioA DECIMAL(6,2), 
    ComentariAccesorioA VARCHAR(100), 
    NumeroSAccesorioA VARCHAR(100),
    ProductosCompatiblesA TEXT -- Lista de productos compatibles (cadena separada por comas)
)
BEGIN
    /* PROCEDURE ActualizarAccesorioBase 14/11/2024 */
    
    -- Procesar la cadena de productos compatibles (en caso de necesitar limpieza o formateo)
    DECLARE productosConcatenados TEXT;
    SET productosConcatenados = REPLACE(ProductosCompatiblesA, '","', ',');

    -- Actualizar el accesorio en la tabla AccesoriosBase
    UPDATE AccesoriosBase
    SET 
        ModeloAccesorio = modeloAccesorioA, 
        ColorAccesorio = colorAccesorioA, 
        EstadoAccesorio = EstadoAccesorioA, 
        Comentario = ComentariAccesorioA, 
        PrecioBase = PrecioAccesorioA, 
        NumeroSerie = NumeroSAccesorioA, 
        ProductosCompatibles = productosConcatenados -- Actualizar la lista de productos compatibles
    WHERE CodigoAccesorio = CodigoAccesorioA;

    -- Opcionalmente, devolver un mensaje de éxito
    SELECT 'Accesorio actualizado correctamente' AS mensaje;
END //
DELIMITER ;

/*PROCEDIMIENTO BORRAR ACCESORIO*/
DELIMITER //
	CREATE PROCEDURE BorrarAccesorio(IdCodigoAccesorio varchar(100))
    BEGIN
    /*PROCEDIMIENTO BORRAR ACCESORIO CREADO 14/11/24*/
		UPDATE AccesoriosBase
        SET
			EstadoAccesorio = 7
        WHERE CodigoAccesorio = IdCodigoAccesorio;
    END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO IngresarCategoriaAccesorio Creado 16/11/24 */
	CREATE PROCEDURE IngresarCategoriaAccesorio(FabricanteA int, CategoriaA int, SubcategoriaA int, PrefijoAccesorio varchar(25), NombreArchivoImagen varchar(100))
    BEGIN
		DECLARE cantidad varchar(24);
        select count(idmodeloaccesoriopk)+1 from catalogoaccesorios into cantidad;        
		INSERT INTO catalogoaccesorios(FabricanteAccesorio, CategoriaAccesorio, SubcategoriaAccesorio, CodigoModeloAccesorio, LinkImagen) 
        values (FabricanteA, CategoriaA, SubcategoriaA,concat(PrefijoAccesorio,cantidad), NombreArchivoImagen);
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ActualizarCategoriaAccesorio(IdModeloA int, FabricanteA int, CategoriaA int, SubcategoriaA int, CodigoA varchar(25), LinkA varchar(100))
BEGIN
/*PROCEDIMIENTO ActualizarCategoriaAccesorio creado el dia 16 / 11 / 24*/
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


DELIMITER //
	CREATE PROCEDURE BorrarCategoriaAccesorio(IdCategoria int)
    BEGIN
    /*PROCEDIMIENTO BORRAR CATEGORIA ACCESORIO*/
		UPDATE catalogoaccesorios
        SET
			Activo = 0
        WHERE IdModeloAccesorioPK = IdCategoria;
    END //
DELIMITER ;

DELIMITER $$
/*PROCEDIMIENTO ALMACENADO INSERTAR CATEGORIA 16/11/2024*/
CREATE PROCEDURE IngresarCategoriaAccesorioB(NombreCategoriaA varchar(100), IdFabricanteA int)
BEGIN
   INSERT INTO categoriasaccesorios (NombreCategoriaAccesorio, IdFabricanteAccesorioFK, Activo) values (NombreCategoriaA, IdFabricanteA, 1);   
END$$

DELIMITER $$
/*PROCEDIMIENTO ALMACENADO INSERTAR FABRICANTE ACCESORIO 16/11/2024*/
CREATE PROCEDURE IngresarFabricanteAccesorio(NombreFabricanteAccesorio varchar(100))
BEGIN
   INSERT INTO FABRICANTEACCESORIOS (NombreFabricanteAccesorio, Activo) values (NombreFabricanteAccesorio, 1);   
END$$


DELIMITER $$
/*PROCEDIMIENTO BORRAR FABRICANTE DE ACCESORIOS y ASOCIADOS CREADO 16/11/2024*/
CREATE PROCEDURE SoftDeleteFabricanteAccesorio(IN IdFabricantePKA INT)
BEGIN
    -- Step 1: Soft delete the fabricante by setting Activo to 0
    UPDATE fabricanteaccesorios
    SET Activo = 0
    WHERE IdFabricanteAccesorioPK = IdFabricantePKA;

    -- Step 2: Soft delete all categories related to this fabricante
    UPDATE categoriasaccesorios
    SET Activo = 0
    WHERE IdFabricanteAccesorioFK = IdFabricantePKA;

    -- Step 3: Soft delete all subcategories related to the affected categories
    UPDATE subcategoriasaccesorios
    SET Activo = 0
    WHERE IdCategoriaAccesorioFK IN (
        SELECT IdCategoriaAccesorioPK 
        FROM categoriasaccesorios 
        WHERE IdFabricanteAccesorioFK = IdFabricantePKA
    );
    
    -- Step 4: Soft delete all categories of products with the fabricante
    UPDATE catalogoaccesorios
    SET Activo = 0
    WHERE FabricanteAccesorio = IdFabricantePKA;    
END$$

DELIMITER $$
/*PROCEDIMIENTO ALMACENADO INSERTAR SUBCATEGORIA 16/11/2024*/
CREATE PROCEDURE IngresarSubcategoriaAccesorio(NombreSubcategoriaAccesorio varchar(100), IdCategoriaAccesorio int)
BEGIN
   INSERT INTO SUBCATEGORIASACCESORIOS (NombreSubcategoriaAccesorio, IdCategoriaAccesorioFK, Activo) values (NombreSubcategoriaAccesorio, IdCategoriaAccesorio, 1);   
END$$

DELIMITER $$
/*PROCEDIMIENTO BORRAR CATEGORIA DE ACCESORIOS y ASOCIADOS CREADO 16/11/2024*/
CREATE PROCEDURE SofDeleteSubCategoriaAccesorio(IN IdSubCategoriaA INT)
BEGIN
    -- Step 1: Soft delete the subcategoria by setting Activo to 0
    UPDATE subcategoriasaccesorios
    SET Activo = 0
    WHERE IdSubcategoriaAccesorio = IdSubCategoriaA;

    -- Step 3: Soft delete all categories of products with the categorie
    UPDATE catalogoaccesorios
    SET Activo = 0
    WHERE SubcategoriaAccesorio = IdSubCategoriaA;   
END$$

DELIMITER $$
CREATE PROCEDURE SofDeleteCategoriaAccesorio(IN IdCategoriaA INT)
BEGIN
    -- Step 1: Soft delete the fabricante by setting Activo to 0
    UPDATE categoriasaccesorios
    SET Activo = 0
    WHERE IdCategoriaAccesorioPK = IdCategoriaA;

    -- Step 2: Soft delete all categories related to this fabricante
    UPDATE subcategoriasaccesorios
    SET Activo = 0
    WHERE IdCategoriaAccesorioFK = IdCategoriaA;
    
     -- Step 3: Soft delete all categories of products with the categorie
    UPDATE catalogoaccesorios
    SET Activo = 0
    WHERE CategoriaAccesorio = IdCategoriaA;   
END$$

DELIMITER //
CREATE PROCEDURE IngresarAccesorioATablaAccesoriosBaseV2 (
    modeloAcc INT, 
    colorAcc VARCHAR(100), 
    estadoAcc INT, 
    precioBase DECIMAL(6,2), 
    comentarioAcc VARCHAR(2000), 
    numeroSerie VARCHAR(100), 
    productosCompatibles TEXT, -- Comma-separated list of compatible products
    tareasP TEXT -- Comma-separated list of tasks
)
BEGIN
    DECLARE codigoAccesorioGenerated VARCHAR(50);
    DECLARE cantidadRegistros INT DEFAULT 0;
    DECLARE tarea VARCHAR(100);
    DECLARE next_comma INT;
    DECLARE ModeloCatCons VARCHAR(25);
    DECLARE productosConcatenados TEXT;

    -- Get the accessory model code
    SELECT CodigoModeloAccesorio INTO ModeloCatCons 
    FROM CatalogoAccesorios 
    WHERE IdModeloAccesorioPK = modeloAcc;
    
    -- Get the total count of records for creating a unique CodigoAccesorio
    SELECT COUNT(*) INTO cantidadRegistros 
    FROM AccesoriosBase;

    -- Generate a unique CodigoAccesorio by combining modeloAcc with record count
    SET codigoAccesorioGenerated = CONCAT(ModeloCatCons, '-', cantidadRegistros + 1);

    -- Clean and process the ProductosCompatibles list
    SET productosConcatenados = REPLACE(productosCompatibles, '","', ',');

    -- Insert the new accessory into AccesoriosBase
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

    -- Insert tasks into TareasdeAccesorios for the accessory
    WHILE LENGTH(tareasP) > 0 DO
        SET next_comma = LOCATE(',', tareasP);

        IF next_comma = 0 THEN
            -- No more commas, insert the last task
            SET tarea = TRIM(tareasP);
            INSERT INTO TareasdeAccesorios (DescripcionTarea, Realizado, Activo, IdCodigoAccesorioFK)
            VALUES (tarea, 0, 1, codigoAccesorioGenerated);
            SET tareasP = '';
        ELSE
            -- Extract the task before the next comma
            SET tarea = TRIM(SUBSTRING(tareasP, 1, next_comma - 1));
            INSERT INTO TareasdeAccesorios (DescripcionTarea, Realizado, Activo, IdCodigoAccesorioFK)
            VALUES (tarea, 0, 1, codigoAccesorioGenerated);
            
            -- Update the string to exclude the inserted task
            SET tareasP = SUBSTRING(tareasP, next_comma + 1);
        END IF;
    END WHILE;

END //
DELIMITER ;

/*PEDIDOS*/

/*PROCEDIMIENTO ListarTiposPedidos modificado 16 / 12 / 24*/
DELIMITER //
	CREATE PROCEDURE ListarTiposPedidos()
    BEGIN
		SELECT * FROM tipopedido;
    END //
DELIMITER ;

/*PROCEDIMIENTO ListarWebsites modificado 16 / 12 / 24*/
DELIMITER //
	CREATE PROCEDURE ListarWebsites()
    BEGIN
		SELECT * FROM sitioweb;
    END //
DELIMITER ;

/*PROCEDIMIENTO ListarEstadosPedidos modificado 16 / 12 / 24*/
DELIMITER //
	CREATE PROCEDURE ListarEstadosPedidos()
    BEGIN
		select * FROM base_datos_inventario_taller.estadopedido;
    END //
DELIMITER ;

/*PROCEDIMIENTO ListarTipoArticulo creado 18 / 12 / 24*/
DELIMITER //
	CREATE PROCEDURE ListarTipoArticulo()
    BEGIN
		select * FROM base_datos_inventario_taller.tipoarticulo;
    END //
DELIMITER ;


/*ADICION DE PROCEDIMIENTOS ALMACENADOS PARA FABRICANTES, CATEGORIAS, SUBCATEGORIAS de TODOS LOS TIPOS DE ARTICULOS*/

DELIMITER //
/*PROCEDIMIENTO LISTAR TODOS LOS FABRICANTES DE PRODUCTOS CON UN MODELO ASOCIADO CREADO 28/12/2024*/
CREATE PROCEDURE ListarFabricantesModelo()
		BEGIN
			SELECT DISTINCT a.IdFabricantePK, a.NombreFabricante FROM fabricantes a
            JOIN catalogoconsolas b ON a.IdFabricantePK = b.Fabricante
            WHERE a.Activo = 1
            AND b.Activo = 1;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR TODAS LAS CATEGORIAS DE PRODUCTOS CON UN MODELO ASOCIADO CREADO 28/12/2024*/
CREATE PROCEDURE ListarCategoriasProductosxModeloActivo(FabricanteP INT)
		BEGIN
			SELECT DISTINCT a.IdCategoriaPK, a.NombreCategoria FROM categoriasproductos a
            JOIN catalogoconsolas b ON a.IdCategoriaPK = b.Categoria
            WHERE a.Activo = 1
            AND b.Activo = 1
            AND b.Fabricante = FabricanteP;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR TODAS LAS SUBCATEGORIAS DE PRODUCTOS CON UN MODELO ASOCIADO CREADO 28/12/2024*/
CREATE PROCEDURE ListarSubCategoriasProductosxModeloActivo(CategoriaP INT)
		BEGIN
			SELECT DISTINCT a.IdSubcategoria, a.NombreSubCategoria FROM subcategoriasproductos a
            JOIN catalogoconsolas b ON a.IdSubcategoria = b.Subcategoria
            WHERE a.Activo = 1
            AND b.Activo = 1
            AND b.Categoria = CategoriaP;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR TODOS LOS FABRICANTES DE ACCESORIOS CON UN MODELO ASOCIADO CREADO 28/12/2024*/
CREATE PROCEDURE ListarFabricantesAccesoriosModelo()
		BEGIN
			SELECT DISTINCT a.IdFabricanteAccesorioPK, a.NombreFabricanteAccesorio FROM fabricanteaccesorios a
            JOIN catalogoaccesorios b ON a.IdFabricanteAccesorioPK = b.FabricanteAccesorio
            WHERE a.Activo = 1
            AND b.Activo = 1;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR TODAS LAS CATEGORIAS DE ACCESORIOS CON UN MODELO ASOCIADO CREADO 28/12/2024*/
CREATE PROCEDURE ListarCategoriasAccesoriosxModeloActivo(FabricanteP INT)
		BEGIN
			SELECT DISTINCT a.IdCategoriaAccesorioPK, a.NombreCategoriaAccesorio FROM categoriasaccesorios a
            JOIN catalogoaccesorios b ON a.IdCategoriaAccesorioPK = b.CategoriaAccesorio
            WHERE a.Activo = 1
            AND b.Activo = 1
            AND b.FabricanteAccesorio = FabricanteP;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR TODAS LAS SUBCATEGORIAS DE ACCESORIOS CON UN MODELO ASOCIADO CREADO 28/12/2024*/
CREATE PROCEDURE ListarSubCategoriasAccesoriosxModeloActivo(CategoriaP INT)
		BEGIN
			SELECT DISTINCT a.IdSubcategoriaAccesorio, a.NombreSubcategoriaAccesorio FROM subcategoriasaccesorios a
            JOIN catalogoaccesorios b ON a.IdSubcategoriaAccesorio = b.SubcategoriaAccesorio
            WHERE a.Activo = 1
            AND b.Activo = 1
            AND b.CategoriaAccesorio = CategoriaP;
        END //
DELIMITER ;


DELIMITER //
/*PROCEDIMIENTO CONSEGUIR INFORMACION ESPECIFICA DE FABRICANTE POR ID CREADO 30/12/2024*/
CREATE PROCEDURE ListarInformacionFabricantexId(IdFabricante int)
	BEGIN
		SELECT * FROM fabricantes
        WHERE IdFabricantePK = IdFabricante;
    END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO CONSEGUIR INFORMACION ESPECIFICA DE CATEGORIA DE PRODUCTO POR ID CREADO 30/12/2024*/
CREATE PROCEDURE ListarInformacionCategoriaxId(IdCategoria int)
	BEGIN
		SELECT * FROM categoriasproductos
        WHERE IdCategoriaPK = IdCategoria;
    END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO CONSEGUIR INFORMACION ESPECIFICA DE SUBCATEGORIA DE PRODUCTO POR ID CREADO 30/12/2024*/
CREATE PROCEDURE ListarInformacionSubCategoriaxId(IdSubcategoriaProducto int)
	BEGIN
		SELECT IdSubcategoria, NombreSubcategoria as NombreSubCategoria, IdCategoriaFK, Activo FROM subcategoriasproductos
        WHERE IdSubcategoria = IdSubcategoriaProducto;
    END //
DELIMITER ;


/*ACCESORIOS*/

DELIMITER //
/*PROCEDIMIENTO CONSEGUIR INFORMACION ESPECIFICA DE FABRICANTE POR ID CREADO 01/01/2025*/
CREATE PROCEDURE ListarInformacionFabricanteAccesorioxId(IdFabricante int)
	BEGIN
		SELECT * FROM fabricanteaccesorios
        WHERE IdFabricanteAccesorioPK = IdFabricante;
    END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO CONSEGUIR INFORMACION ESPECIFICA DE CATEGORIA DE ACCESORIO POR ID CREADO 01/01/2025*/
CREATE PROCEDURE ListarInformacionCategoriaAccesorioxId(IdCategoria int)
	BEGIN
		SELECT * FROM categoriasaccesorios
        WHERE IdCategoriaAccesorioPK = IdCategoria;
    END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO CONSEGUIR INFORMACION ESPECIFICA DE SUBCATEGORIA DE ACCESORIO POR ID CREADO 01/01/2025*/
CREATE PROCEDURE ListarInformacionSubCategoriaAccesorioxId(IdSubcategoriaAccesorio int)
	BEGIN
		SELECT * FROM subcategoriasaccesorios
        WHERE IdSubcategoriaAccesorio = IdSubcategoriaAccesorio;
    END //
DELIMITER ;

/*INFORMACION TIPO ARTICULO*/
DELIMITER //
/*PROCEDIMIENTO CONSEGUIR INFORMACION ESPECIFICA DE TIPO ARTICULO CREADO 01/01/2025*/
CREATE PROCEDURE ListarInformacionTipoArticuloXId(TipoArticuloid int)
	BEGIN
		SELECT * FROM tipoarticulo
        WHERE IdTipoArticuloPK = TipoArticuloid;
    END //
DELIMITER ;





