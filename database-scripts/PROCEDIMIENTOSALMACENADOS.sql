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
                NumeroSerie
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




