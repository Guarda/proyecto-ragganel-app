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

DELIMITER $$

CREATE PROCEDURE IngresarPedidoATablaPedidos(
    IN FechaCreacionPedido DATE,
    IN FechaArrivoUSA DATE,
    IN FechaEstimadaRecepcion DATE,
    IN NumeroTracking1 VARCHAR(100),
    IN NumeroTracking2 VARCHAR(100),
    IN SitioWeb INT,
    IN ViaPedido INT,
    IN Peso DECIMAL(6,2),
    IN Comentarios VARCHAR(2000),
    IN Impuestos DECIMAL(6,2),
    IN ShippingUSA DECIMAL(6,2),
    IN ShippingNic DECIMAL(6,2),
    IN SubTotalArticulos DECIMAL(6,2),
    IN PrecioEstimadoDelPedido DECIMAL(6,2),
    IN articulos JSON
)
BEGIN
    -- Declaración de variables
    DECLARE articulo JSON;
    DECLARE i INT DEFAULT 0;
    DECLARE pedidosHoy INT;
    DECLARE CodigoPedidoGenerado VARCHAR(50);

    -- Contar cuántos pedidos ya se han hecho en la fecha
    SELECT COUNT(*) + 1 INTO pedidosHoy
    FROM PedidoBase
    WHERE DATE(FechaCreacionPedido) = DATE(FechaCreacionPedido);

    -- Generar el código del pedido
    SET CodigoPedidoGenerado = CONCAT(
        'P-',
        DATE_FORMAT(FechaCreacionPedido, '%d%m%Y'),
        '-',
        pedidosHoy
    );

    -- Insertar en la tabla PedidoBase
    INSERT INTO PedidoBase (
        CodigoPedido,
        FechaCreacionPedido,
        FechaArriboEstadosUnidos,
        FechaIngreso,
        NumeroTracking1,
        NumeroTracking2,
        SitioWebFK,
        ViaPedidoFK,
        EstadoPedidoFK,
        TotalPedido,
        Comentarios,
        Peso,
        SubtotalArticulos,
        Impuestos,
        EnvioUSA,
        EnvioNIC
    )
    VALUES (
        CodigoPedidoGenerado,
        FechaCreacionPedido,
        FechaArrivoUSA,
        FechaEstimadaRecepcion,  -- Fecha estimada de recepción
        NumeroTracking1,
        NumeroTracking2,
        SitioWeb,
        ViaPedido,
        1,  -- Estado de pedido (ajustado según tus necesidades)
        PrecioEstimadoDelPedido,
        Comentarios,
        Peso,
        SubTotalArticulos,
        Impuestos,
        ShippingUSA,
        ShippingNic
    );

    -- Asignar el valor de 'articulos' a la variable JSON
    SET articulo = articulos;

    -- Insertar en PedidoDetalles usando el parámetro JSON
    WHILE i < JSON_LENGTH(articulo) DO
        INSERT INTO PedidoDetalles (
            IdCodigoPedidoFK,
            TipoArticuloFK,
            FabricanteArticulo,
            CategoriaArticulo,
            SubcategoriaArticulo,
            CantidadArticulo,
            EnlaceArticulo,
            PrecioArticulo,
            IdModeloPK
        )
        SELECT
            CodigoPedidoGenerado,  -- Código del pedido recién generado
            JSON_UNQUOTE(JSON_EXTRACT(articulo, CONCAT('$[', i, '].TipoArticulo'))),
            JSON_UNQUOTE(JSON_EXTRACT(articulo, CONCAT('$[', i, '].Fabricante'))),
            JSON_UNQUOTE(JSON_EXTRACT(articulo, CONCAT('$[', i, '].Cate'))),
            JSON_UNQUOTE(JSON_EXTRACT(articulo, CONCAT('$[', i, '].SubCategoria'))),
            JSON_UNQUOTE(JSON_EXTRACT(articulo, CONCAT('$[', i, '].Cantidad'))),
            JSON_UNQUOTE(JSON_EXTRACT(articulo, CONCAT('$[', i, '].EnlaceCompra'))),
            JSON_UNQUOTE(JSON_EXTRACT(articulo, CONCAT('$[', i, '].Precio'))),
            JSON_UNQUOTE(JSON_EXTRACT(articulo, CONCAT('$[', i, '].IdModeloPK')));
        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;



/*LISTAR PRODUCTOS EN LA TABLA PRODUCTOSBASES*/
DELIMITER //
CREATE PROCEDURE ListarTablaPedidosBase ()
       BEGIN
			SELECT 
				A.CodigoPedido,
				DATE_FORMAT(A.FechaCreacionPedido, '%d/%m/%Y') as 'Fecha_Ingreso',
                DATE_FORMAT(A.FechaArriboEstadosUnidos, '%d/%m/%Y') as 'Fecha_USA',
                DATE_FORMAT(A.FechaIngreso, '%d/%m/%Y') as 'Fecha_NIC',
                B.DescripcionEstadoPedido as 'Estado',
                A.EstadoPedidoFK,
                A.NumeroTracking1,
				A.NumeroTracking2,
                A.Comentarios,
                C.DescripcionTipoPedido,
                A.Peso,
                A.SubtotalArticulos,
                A.TotalPedido
			FROM pedidobase A 
            join estadopedido B on A.estadopedidofk = B.codigoEstadopedido
            join tipopedido C on A.viapedidoFK = C.CodigoTipoPedido;
       END //
DELIMITER ;





DELIMITER //
CREATE PROCEDURE `ListarTablaPedidosBasesXId`(IdCodigoPedido varchar(100))
/* procedimiento almacenado ListarTablaProductosBasesXIdV2 23/01/2025 seguir trabajando*/
BEGIN
	SELECT 
				A.CodigoPedido,
                DATE_FORMAT(A.FechaCreacionPedido, '%d/%m/%Y') as 'FechaCreacionPedido',
                DATE_FORMAT(A.FechaArriboEstadosUnidos, '%d/%m/%Y') as 'FechaArriboUSA',
                DATE_FORMAT(A.FechaIngreso, '%d/%m/%Y') 'FechaEstimadaRecepcion',
                A.NumeroTracking1,
                A.NumeroTracking2,
                A.SitioWebFK as 'SitioWeb',
                A.ViaPedidoFK as 'ViaPedido',
                A.EstadoPedidoFK as 'Estado',
                A.TotalPedido as 'PrecioEstimadoDelPedido',
                A.Comentarios,
                A.Peso as 'PesoPedido',
                A.SubtotalArticulos as 'SubTotalArticulos',
                A.Impuestos,
                A.EnvioUSA as 'ShippingUSA',
                A.EnvioNIC as 'ShippingNIC'
			FROM pedidobase A            
			WHERE A.EstadoPedidoFK != 7
            AND A.CodigoPedido = IdCodigoPedido;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE `ListarArticulosXIdPedido`(IdCodigoPedido varchar(100))
/* procedimiento almacenado ListarArticulosXIdPedido 25/01/2025 seguir trabajando*/
BEGIN
	SELECT 
    pd.IdPedidoDetallePK,
    pd.IdCodigoPedidoFK,
    pd.TipoArticuloFK,
    ta.DescripcionTipoArticulo AS TipoArticulo,
    CASE 
        WHEN pd.TipoArticuloFK = 1 THEN fp.NombreFabricante
        WHEN pd.TipoArticuloFK = 2 THEN fa.NombreFabricanteAccesorio
        WHEN pd.TipoArticuloFK = 3 THEN fi.NombreFabricanteInsumos
    END AS NombreFabricante,
    CASE 
        WHEN pd.TipoArticuloFK = 1 THEN cp.NombreCategoria
        WHEN pd.TipoArticuloFK = 2 THEN ca.NombreCategoriaAccesorio
        WHEN pd.TipoArticuloFK = 3 THEN ci.NombreCategoriaInsumos
    END AS NombreCategoria,
    CASE 
        WHEN pd.TipoArticuloFK = 1 THEN sp.NombreSubcategoria
        WHEN pd.TipoArticuloFK = 2 THEN sa.NombreSubcategoriaAccesorio
        WHEN pd.TipoArticuloFK = 3 THEN si.NombreSubcategoriaInsumos
    END AS NombreSubCategoria,
    CASE
		WHEN pd.TipoArticuloFK = 1 THEN concat('http://localhost:3000/img-consolas/',pc.LinkImagen)
        WHEN pd.TipoArticuloFK = 2 THEN concat('http://localhost:3000/img-accesorios/',ac.LinkImagen)
        WHEN pd.TipoArticuloFK = 3 THEN concat('http://localhost:3000/img-insumos/',ic.LinkImagen)
    END AS ImagePath,
    pd.FabricanteArticulo,
    pd.CategoriaArticulo,
    pd.SubcategoriaArticulo,
    pd.CantidadArticulo as 'Cantidad',
    pd.EnlaceArticulo as 'EnlaceCompra',
    pd.PrecioArticulo as 'Precio',
    pd.IdModeloPK,
    pd.EstadoArticuloPedido,
    pd.Activo
	FROM PedidoDetalles pd
	JOIN TipoArticulo ta ON pd.TipoArticuloFK = ta.IdTipoArticuloPK
	LEFT JOIN fabricantes fp ON pd.TipoArticuloFK = 1 AND pd.FabricanteArticulo = fp.IdFabricantePK
	LEFT JOIN fabricanteaccesorios fa ON pd.TipoArticuloFK = 2 AND pd.FabricanteArticulo = fa.IdFabricanteAccesorioPK
	LEFT JOIN fabricanteinsumos fi ON pd.TipoArticuloFK = 3 AND pd.FabricanteArticulo = fi.IdFabricanteInsumosPK
	LEFT JOIN categoriasproductos cp ON pd.TipoArticuloFK = 1 AND pd.CategoriaArticulo = cp.IdCategoriaPK
	LEFT JOIN categoriasaccesorios ca ON pd.TipoArticuloFK = 2 AND pd.CategoriaArticulo = ca.IdCategoriaAccesorioPK
	LEFT JOIN categoriasinsumos ci ON pd.TipoArticuloFK = 3 AND pd.CategoriaArticulo = ci.IdCategoriaInsumosPK
	LEFT JOIN subcategoriasproductos sp ON pd.TipoArticuloFK = 1 AND pd.SubcategoriaArticulo = sp.IdSubcategoria
	LEFT JOIN subcategoriasaccesorios sa ON pd.TipoArticuloFK = 2 AND pd.SubcategoriaArticulo = sa.IdSubcategoriaAccesorio
	LEFT JOIN subcategoriasinsumos si ON pd.TipoArticuloFK = 3 AND pd.SubcategoriaArticulo = si.IdSubcategoriaInsumos
	LEFT JOIN catalogoconsolas pc on pd.TipoArticuloFK = 1 AND pc.IdmodeloConsolaPK = IdModeloPK
	LEFT JOIN catalogoaccesorios ac on pd.TipoArticuloFK = 2 AND ac.IdModeloAccesorioPK = IdModeloPK
	LEFT JOIN catalogoinsumos ic on pd.TipoArticuloFK = 3 AND ic.IdModeloInsumosPK = IdmodeloPK
	WHERE pd.TipoArticuloFK IN (1, 2, 3)
    AND IdCodigoPedidoFK = IdCodigoPedido
    AND pd.Activo = 1;
END //
DELIMITER ;


DELIMITER $$

CREATE PROCEDURE ActualizarDatosGeneralesPedido(
/*procedimiento almacenado ListarArticulosXIdPedido 28/01/2025 seguir trabajando*/
    IN IdPedido Varchar(25),  -- ID del pedido a actualizar
    IN FechaCreacionPedido DATE,  -- Fecha de creación del pedido
    IN FechaArrivoUSA DATE,
    IN FechaEstimadaRecepcion DATE,
    IN NumeroTracking1 VARCHAR(100),
    IN NumeroTracking2 VARCHAR(100),
    IN SitioWeb INT,
    IN ViaPedido INT,
    IN Peso DECIMAL(6,2),
    IN Comentarios VARCHAR(2000),
    IN Impuestos DECIMAL(6,2),
    IN ShippingUSA DECIMAL(6,2),
    IN ShippingNic DECIMAL(6,2),
    IN SubTotalArticulos DECIMAL(6,2),
    IN PrecioEstimadoDelPedido DECIMAL(6,2),
    IN EstadoPedido INT
)
BEGIN
    -- Actualizar los datos sin comprobación de cambios
    UPDATE PedidoBase
    SET 
        FechaCreacionPedido = FechaCreacionPedido,
        FechaArriboEstadosUnidos = FechaArrivoUSA,
        FechaIngreso = FechaEstimadaRecepcion,
        NumeroTracking1 = NumeroTracking1,
        NumeroTracking2 = NumeroTracking2,
        SitioWebFK = SitioWeb,
        ViaPedidoFK = ViaPedido,
        Peso = Peso,
        Comentarios = Comentarios,
        Impuestos = Impuestos,
        EnvioUSA = ShippingUSA,
        EnvioNIC = ShippingNic,
        SubtotalArticulos = SubTotalArticulos,
        TotalPedido = PrecioEstimadoDelPedido,
        EstadoPedidoFK = EstadoPedido
    WHERE CodigoPedido = IdPedido;

    -- Retornar un mensaje
    SELECT 'Datos del pedido actualizados correctamente' AS mensaje;
END$$

DELIMITER ;


DELIMITER $$

/* AGREGAR ARTICULOS DIRECTAMENTE DEL PEDIDO */
CREATE PROCEDURE InsertarArticuloPedido(
    IN IdCodigoPedidoFK VARCHAR(25),  -- Código del pedido
    IN TipoArticuloFK INT,  -- Tipo de artículo
    IN FabricanteArticulo INT,  -- Fabricante del artículo
    IN CategoriaArticulo INT,  -- Categoría del artículo
    IN SubcategoriaArticulo INT,  -- Subcategoría del artículo
    IN CantidadArticulo INT,  -- Cantidad de artículo
    IN EnlaceArticulo VARCHAR(1000),  -- Enlace del artículo
    IN PrecioArticulo DECIMAL(6,2),  -- Precio del artículo
    IN IdModeloPK INT,  -- ID del modelo
    IN ActivoArt BOOLEAN
)
BEGIN
    -- Comprobar si el artículo está activo (ActivoArt = 1)
    IF ActivoArt = 0 THEN
        -- Si el artículo no está activo, no se inserta y se retorna un mensaje
        SELECT 'El artículo no se ha agregado porque está inactivo' AS mensaje;
    ELSE
        -- Insertar el nuevo artículo en la tabla PedidoDetalles
        INSERT INTO PedidoDetalles (
            IdCodigoPedidoFK,
            TipoArticuloFK,
            FabricanteArticulo,
            CategoriaArticulo,
            SubcategoriaArticulo,
            CantidadArticulo,
            EnlaceArticulo,
            PrecioArticulo,
            IdModeloPK,
            EstadoArticuloPedido,
            Activo
        )
        VALUES (
            IdCodigoPedidoFK,
            TipoArticuloFK,
            FabricanteArticulo,
            CategoriaArticulo,
            SubcategoriaArticulo,
            CantidadArticulo,
            EnlaceArticulo,
            PrecioArticulo,
            IdModeloPK,
            1,  -- EstadoArticuloPedido por defecto a 1 (activo)
            1   -- Activo por defecto a 1 (activo)
        );

        -- Retornar un mensaje de éxito
        SELECT 'Artículo agregado correctamente' AS mensaje;
    END IF;
END$$

DELIMITER $$


CREATE PROCEDURE ActualizarArticuloPedido(

/*ACTUALIZAR ARTICULOS 28/01/2025*/
    IN IdPedidoDPK INT,  -- ID del detalle del pedido a actualizar
    IN IdCodigoPFK varchar(25),
    IN TipoArtFK INT,  -- Tipo de artículo
    IN FabricanteArt INT,  -- Fabricante del artículo
    IN CategoriaArt INT,  -- Categoría del artículo
    IN SubcategoriaArt INT,  -- Subcategoría del artículo
    IN CantidadArt INT,  -- Cantidad de artículo
    IN EnlaceArt VARCHAR(1000),  -- Enlace del artículo
    IN PrecioArt DECIMAL(6,2),  -- Precio del artículo
    IN IdModeloPK INT,  -- ID del modelo
    IN EstadoArtPedido BOOLEAN,  -- Estado del artículo en el pedido
    IN ActivoArt BOOLEAN  -- Si el artículo está activo
)
BEGIN
    -- Actualizar los detalles del artículo en la tabla PedidoDetalles
    UPDATE PedidoDetalles
    SET 
        TipoArticuloFK = TipoArtFK,
        IdCodigoPedidoFK = IdCodigoPFK,
        FabricanteArticulo = FabricanteArt,
        CategoriaArticulo = CategoriaArt,
        SubcategoriaArticulo = SubcategoriaArt,
        CantidadArticulo = CantidadArt,
        EnlaceArticulo = EnlaceArt,
        PrecioArticulo = PrecioArt,
        IdModeloPK = IdModeloPK,
        EstadoArticuloPedido = EstadoArtPedido,
        Activo = ActivoArt
    WHERE IdPedidoDetallePK = IdPedidoDPK;

    -- Retornar un mensaje de éxito
    SELECT 'Artículo actualizado correctamente' AS mensaje;
END$$

DELIMITER ;

DELIMITER $$
CREATE PROCEDURE CancelarPedido(
	IN IdPedido varchar(25)
)
BEGIN
	UPDATE Pedidobase
    SET 
		EstadoPedidoFK = 6
	WHERE CodigoPedido = IdPedido;
    -- Retornar un mensaje de éxito
    SELECT 'Pedido cancelado correctamente' AS mensaje;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE EliminarPedido(
	IN IdPedido varchar(25)
)
BEGIN
	UPDATE Pedidobase
    SET 
		EstadoPedidoFK = 7
	WHERE CodigoPedido = IdPedido;
    -- Retornar un mensaje de éxito
    SELECT 'Pedido Eliminado correctamente' AS mensaje;
END$$
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE AvanzarEstadoPedido(
    IN IdPedido VARCHAR(25)
)
BEGIN
    DECLARE estado_actual INT;

    -- Obtener el estado actual del pedido
    SELECT EstadoPedidoFK INTO estado_actual 
    FROM Pedidobase 
    WHERE CodigoPedido = IdPedido;

    -- Verificar si el estado está entre 1 y 4 antes de actualizar (NO actualiza si es 5, 6 o 7)
    IF estado_actual BETWEEN 1 AND 4 THEN
        UPDATE Pedidobase
        SET EstadoPedidoFK = estado_actual + 1
        WHERE CodigoPedido = IdPedido;
        
        SELECT 'Estado del pedido actualizado correctamente' AS mensaje;
    ELSE
        SELECT 'El estado del pedido no permite actualización' AS mensaje;
    END IF;
    
END$$

DELIMITER ;


/*DELIMITER $$

CREATE PROCEDURE ListarHistorialEstadoPedidoXId
/*PROCEDIMIENTO ALMACENADO CREADO EL 05/02/2025
(
	IN IdPedido VARCHAR(25)
)
BEGIN
	SELECT * FROM historialestadopedido
    ORDER BY FechaCambio ASC;
END$$

DELIMITER ;*/

DELIMITER $$

CREATE PROCEDURE ListarHistorialEstadoPedidoXId(
	IN IdPedido VARCHAR(25)
)
BEGIN
    SELECT 
        h.IdHistorial,
        h.CodigoPedido,
        h.EstadoAnterior,
        ea.DescripcionEstadoPedido AS EstadoAnteriorDescripcion,
        h.EstadoNuevo,
        en.DescripcionEstadoPedido AS EstadoNuevoDescripcion,
        h.FechaCambio
    FROM HistorialEstadoPedido h
    LEFT JOIN EstadoPedido ea ON h.EstadoAnterior = ea.CodigoEstadoPedido
    INNER JOIN EstadoPedido en ON h.EstadoNuevo = en.CodigoEstadoPedido
    WHERE h.CodigoPedido = IdPedido
    ORDER BY h.FechaCambio ASC;
END $$

DELIMITER ;


/*PROCEDIMIENTO CREADO POR CHAT GPT 18/02/2025*/
/**DELIMITER //

CREATE PROCEDURE IngresarArticulosPedido(
    IN p_IdPedido VARCHAR(25), 
    IN p_Productos JSON, 
    IN p_Accesorios JSON
)
BEGIN
    DECLARE v_CodigoConsolaGenerated VARCHAR(50);
    DECLARE v_CodigoAccesorioGenerated VARCHAR(50);
    DECLARE v_Indice INT DEFAULT 0;
    DECLARE v_ProductosCount INT;
    DECLARE v_AccesoriosCount INT;
    DECLARE v_CodigosGenerados TEXT DEFAULT ''; -- Almacena los códigos generados

    -- Variables para productos
    DECLARE v_modeloP INT;
    DECLARE v_colorP VARCHAR(100);
    DECLARE v_EstadoP INT;
    DECLARE v_hackP BOOLEAN;
    DECLARE v_PrecioBaseP DECIMAL(6,2);  -- Renombrado
    DECLARE v_ComentarioP VARCHAR(255);
    DECLARE v_NumeroSerieP VARCHAR(100);  -- Renombrado
    DECLARE v_AccesoriosP TEXT;
    DECLARE v_TareasP TEXT;

    -- Variables para accesorios
    DECLARE v_modeloA INT;
    DECLARE v_colorA VARCHAR(100);
    DECLARE v_estadoA INT;
    DECLARE v_precioBaseA DECIMAL(6,2);  -- Renombrado
    DECLARE v_comentarioA VARCHAR(2000);  -- Renombrado
    DECLARE v_numeroSerieA VARCHAR(100);  -- Renombrado
    DECLARE v_productoscomaptiblesA TEXT;
    DECLARE v_tareasA TEXT;

    -- Obtener la cantidad de productos y accesorios en los JSONs
    SET v_ProductosCount = JSON_LENGTH(p_Productos);
    SET v_AccesoriosCount = JSON_LENGTH(p_Accesorios);


    -- Insertar productos
    WHILE v_Indice < v_ProductosCount DO
        SET v_modeloP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].articuloId')));
        SET v_colorP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].ColorConsola')));
        SET v_EstadoP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].EstadoConsola')));
        SET v_hackP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].HackConsola')));
        SET v_PrecioBaseP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].PrecioBase')));
        SET v_ComentarioP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].ComentarioConsola')));
        SET v_NumeroSerieP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].NumeroSerie')));
        SET v_AccesoriosP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].Accesorios')));
        SET v_TareasP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].TodoList')));

        -- Insertar producto
        CALL IngresarProductoATablaProductoBaseV4(v_modeloP, v_colorP, v_EstadoP, v_hackP, v_PrecioBaseP, v_ComentarioP, v_NumeroSerieP, v_AccesoriosP, v_TareasP);
        
        -- Obtener el último código insertado
        SELECT CodigoConsola INTO v_CodigoConsolaGenerated FROM ProductosBases ORDER BY IdIngreso DESC LIMIT 1;

        -- Insertar en DetalleProductoPedido
        INSERT INTO DetalleProductoPedido (IdProductoBaseFK, IdCodigoPedidoFK, Comentario) 
        VALUES (v_CodigoConsolaGenerated, p_IdPedido, v_ComentarioP);

        -- Concatenar el código generado
        SET v_CodigosGenerados = CONCAT(v_CodigosGenerados, 'Producto:', v_CodigoConsolaGenerated, ';');

        SET v_Indice = v_Indice + 1;
    END WHILE;

    -- Reset index
    SET v_Indice = 0;

    -- Insertar accesorios
    WHILE v_Indice < v_AccesoriosCount DO
        SET v_modeloA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].articuloId')));
        SET v_colorA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].ColorAccesorio')));
        SET v_estadoA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].EstadoAccesorio')));
        SET v_precioBaseA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].PrecioBase')));
        SET v_comentarioA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].ComentarioAccesorio')));
        SET v_numeroSerieA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].NumeroSerie')));
        SET v_productoscomaptiblesA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].ProductosCompatibles')));
        SET v_tareasA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].TodoList')));

        -- Insertar accesorio
        CALL IngresarAccesorioATablaAccesoriosBaseV2(v_modeloA, v_colorA, v_estadoA, v_precioBaseA, v_comentarioA, v_numeroSerieA, v_productoscomaptiblesA, v_tareasA);
        
        -- Obtener el último código insertado
        SELECT CodigoAccesorio INTO v_CodigoAccesorioGenerated FROM AccesoriosBase ORDER BY IdIngreso DESC LIMIT 1;

        -- Insertar en DetalleAccesorioPedido
        INSERT INTO DetalleAccesorioPedido (IdAccesorioBaseFK, IdCodigoPedidoFK, Comentario) 
        VALUES (v_CodigoAccesorioGenerated, p_IdPedido, v_comentarioA);

        -- Concatenar el código generado
        SET v_CodigosGenerados = CONCAT(v_CodigosGenerados, 'Accesorio:', v_CodigoAccesorioGenerated, ';');

        SET v_Indice = v_Indice + 1;
    END WHILE;

    -- Retornar los códigos generados
    SELECT v_CodigosGenerados AS CodigosIngresados;

END //

DELIMITER ;*/

DELIMITER //

CREATE PROCEDURE IngresarArticulosPedidov2(
    IN p_IdPedido VARCHAR(25), 
    IN p_Productos JSON, 
    IN p_Accesorios JSON,
    IN p_Insumos JSON
)
BEGIN
    -- Variables comunes
    DECLARE v_CodigoConsolaGenerated VARCHAR(50);
    DECLARE v_CodigoAccesorioGenerated VARCHAR(50);
    DECLARE v_CodigoInsumoGenerated VARCHAR(50);
    DECLARE v_CodigoInsumo VARCHAR(50); -- Declaración añadida
    DECLARE v_Indice INT DEFAULT 0;
    DECLARE v_ProductosCount INT;
    DECLARE v_AccesoriosCount INT;
    DECLARE v_InsumosCount INT;
    DECLARE v_CodigosGenerados TEXT DEFAULT ''; -- Almacena los códigos generados

    -- Variables para productos
    DECLARE v_modeloP INT;
    DECLARE v_colorP VARCHAR(100);
    DECLARE v_EstadoP INT;
    DECLARE v_hackP BOOLEAN;
    DECLARE v_PrecioBaseP DECIMAL(6,2);
    DECLARE v_ComentarioP VARCHAR(255);
    DECLARE v_NumeroSerieP VARCHAR(100);
    DECLARE v_AccesoriosP TEXT;
    DECLARE v_TareasP TEXT;

    -- Variables para accesorios
    DECLARE v_modeloA INT;
    DECLARE v_colorA VARCHAR(100);
    DECLARE v_estadoA INT;
    DECLARE v_precioBaseA DECIMAL(6,2);
    DECLARE v_comentarioA VARCHAR(2000);
    DECLARE v_numeroSerieA VARCHAR(100);
    DECLARE v_productoscomaptiblesA TEXT;
    DECLARE v_tareasA TEXT;

    -- Variables para insumos
    DECLARE v_modeloI INT;
    DECLARE v_estadoI INT;
    DECLARE v_comentarioI VARCHAR(2000);
    DECLARE v_precioBaseI DECIMAL(6,2);
    DECLARE v_numeroSerieI VARCHAR(100);
    DECLARE v_serviciosCompatiblesI VARCHAR(500);
    DECLARE v_cantidadI INT UNSIGNED;
    DECLARE v_stockMinimoI INT UNSIGNED;

    -- Cantidades
    SET v_ProductosCount = JSON_LENGTH(p_Productos);
    SET v_AccesoriosCount = JSON_LENGTH(p_Accesorios);
    SET v_InsumosCount = JSON_LENGTH(p_Insumos);

    -- Insertar productos
    WHILE v_Indice < v_ProductosCount DO
        SET v_modeloP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].articuloId')));
        SET v_colorP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].ColorConsola')));
        SET v_EstadoP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].EstadoConsola')));
        SET v_hackP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].HackConsola')));
        SET v_PrecioBaseP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].PrecioBase')));
        SET v_ComentarioP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].ComentarioConsola')));
        SET v_NumeroSerieP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].NumeroSerie')));
        SET v_AccesoriosP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].Accesorios')));
        SET v_TareasP = JSON_UNQUOTE(JSON_EXTRACT(p_Productos, CONCAT('$[', v_Indice, '].TodoList')));

        CALL IngresarProductoATablaProductoBaseV4(v_modeloP, v_colorP, v_EstadoP, v_hackP, v_PrecioBaseP, v_ComentarioP, v_NumeroSerieP, v_AccesoriosP, v_TareasP);
        SELECT CodigoConsola INTO v_CodigoConsolaGenerated FROM ProductosBases ORDER BY IdIngreso DESC LIMIT 1;

        INSERT INTO DetalleProductoPedido (IdProductoBaseFK, IdCodigoPedidoFK, Comentario) 
        VALUES (v_CodigoConsolaGenerated, p_IdPedido, v_ComentarioP);

        SET v_CodigosGenerados = CONCAT(v_CodigosGenerados, 'Producto:', v_CodigoConsolaGenerated, ';');
        SET v_Indice = v_Indice + 1;
    END WHILE;

    -- Reset índice
    SET v_Indice = 0;

    -- Insertar accesorios
    WHILE v_Indice < v_AccesoriosCount DO
        SET v_modeloA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].articuloId')));
        SET v_colorA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].ColorAccesorio')));
        SET v_estadoA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].EstadoAccesorio')));
        SET v_precioBaseA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].PrecioBase')));
        SET v_comentarioA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].ComentarioAccesorio')));
        SET v_numeroSerieA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].NumeroSerie')));
        SET v_productoscomaptiblesA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].ProductosCompatibles')));
        SET v_tareasA = JSON_UNQUOTE(JSON_EXTRACT(p_Accesorios, CONCAT('$[', v_Indice, '].TodoList')));

        CALL IngresarAccesorioATablaAccesoriosBaseV2(v_modeloA, v_colorA, v_estadoA, v_precioBaseA, v_comentarioA, v_numeroSerieA, v_productoscomaptiblesA, v_tareasA);
        SELECT CodigoAccesorio INTO v_CodigoAccesorioGenerated FROM AccesoriosBase ORDER BY IdIngreso DESC LIMIT 1;

        INSERT INTO DetalleAccesorioPedido (IdAccesorioBaseFK, IdCodigoPedidoFK, Comentario) 
        VALUES (v_CodigoAccesorioGenerated, p_IdPedido, v_comentarioA);

        SET v_CodigosGenerados = CONCAT(v_CodigosGenerados, 'Accesorio:', v_CodigoAccesorioGenerated, ';');
        SET v_Indice = v_Indice + 1;
    END WHILE;

    -- Insertar insumos
    SET v_Indice = 0;
    WHILE v_Indice < v_InsumosCount DO
        SET v_modeloI       = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].articuloId')));
        SET v_estadoI       = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].EstadoInsumo')));
        SET v_comentarioI   = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].ComentarioInsumo')));
        SET v_precioBaseI   = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].PrecioBase')));
        SET v_cantidadI     = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].Cantidad')));
        SET v_numeroSerieI  = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].NumeroSerie')));
        SET v_stockMinimoI  = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].StockMinimo')));

        -- Insertar o actualizar insumo
        CALL IngresarInsumoATablaInsumosBase(
            v_modeloI, v_estadoI, v_comentarioI, v_precioBaseI,
            v_cantidadI, v_numeroSerieI, v_stockMinimoI
        );

        -- Obtener el código actual del insumo
        SELECT CodigoInsumo
        -- INTO v_CodigoInsumo
        FROM InsumosBase
       -- WHERE ModeloInsumo = v_modeloI
        ORDER BY IdIngreso DESC
        LIMIT 1;

        -- Insertar en DetalleInsumoPedido
        INSERT INTO DetalleInsumoPedido (IdInsumoBaseFK, IdCodigoPedidoFK, Comentario)
        VALUES (v_CodigoInsumo, p_IdPedido, v_comentarioI);

        SET v_CodigosGenerados = CONCAT(v_CodigosGenerados, 'Insumo:', v_CodigoInsumo, ';');
        SET v_Indice = v_Indice + 1;
    END WHILE;

    -- Retornar los códigos generados
    SELECT v_CodigosGenerados AS CodigosIngresados;
END //

DELIMITER ;



/*Listar historial producto 01/03/2025*/
DELIMITER $$

CREATE PROCEDURE ListarHistorialEstadoProductoXId(
	IN IdProducto VARCHAR(25)
)
BEGIN
    SELECT 
        h.IdHistorial,
        h.CodigoConsola,
        h.EstadoAnterior,
        ea.DescripcionEstado AS EstadoAnteriorDescripcion,
        h.EstadoNuevo,
        en.DescripcionEstado AS EstadoNuevoDescripcion,
        h.FechaCambio
    FROM historialestadoproducto h
    LEFT JOIN  catalogoestadosconsolas ea ON h.EstadoAnterior = ea.CodigoEstado
    INNER JOIN catalogoestadosconsolas en ON h.EstadoNuevo = en.CodigoEstado
    WHERE h.CodigoConsola = IdProducto
    -- WHERE h.CodigoConsola = 'GCI003-19'
    ORDER BY h.FechaCambio ASC;
END $$

DELIMITER ;


/*Listar historial accesorio 01/03/2025*/
DELIMITER $$

CREATE PROCEDURE ListarHistorialEstadoAccesorioXId(
	IN IdAccesorio VARCHAR(25)
)
BEGIN
    SELECT 
        h.IdHistorial,
        h.CodigoAccesorio,
        h.EstadoAnterior,
        ea.DescripcionEstado AS EstadoAnteriorDescripcion,
        h.EstadoNuevo,
        en.DescripcionEstado AS EstadoNuevoDescripcion,
        h.FechaCambio
    FROM historialestadoaccesorio h
    LEFT JOIN  catalogoestadosconsolas ea ON h.EstadoAnterior = ea.CodigoEstado
    INNER JOIN catalogoestadosconsolas en ON h.EstadoNuevo = en.CodigoEstado
    WHERE h.CodigoAccesorio = IdAccesorio
    -- WHERE h.CodigoConsola = 'GCI003-19'
    ORDER BY h.FechaCambio ASC;
END $$

DELIMITER ;


DELIMITER $$
	CREATE PROCEDURE ListarUsuarios()
    /*PROCEDIMIENTOS ALMACENADOS DE USUARIOS 18/03/2025*/
    BEGIN
		SELECT a.IdUsuarioPK, a.Nombre, a.Correo, DATE_FORMAT(A.FechaIngresoUsuario, '%d/%m/%Y') as 'FechaIngresoUsuario', b.DescripcionEstado, c.NombreRol FROM Usuarios a
        JOIN estadousuarios b on a.IdEstadoFK = b.IdEstadoPK
        JOIN roles c on a.IdRolFK = c.IdRolPK;
	END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE InsertarUsuario(
    IN p_Nombre VARCHAR(100),
    IN p_Correo VARCHAR(100),
    IN p_Password VARCHAR(255),
    IN p_FechaIngresoUsuario DATE,
    IN p_IdEstadoFK INT,
    IN p_IdRolFK INT
)
BEGIN
    INSERT INTO Usuarios (Nombre, Correo, Password, FechaIngresoUsuario, IdEstadoFK, IdRolFK)
    VALUES (p_Nombre, p_Correo, p_Password, p_FechaIngresoUsuario, p_IdEstadoFK, p_IdRolFK);
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE ListarUsuarioPorId(
    IN p_IdUsuarioPK INT
)
/*PROCEDIMIENTOS ALMACENADOS DE USUARIOS, ListarPorId 18/03/2025*/
BEGIN
    SELECT a.IdUsuarioPK, a.Nombre, a.Correo, DATE_FORMAT(a.FechaIngresoUsuario, '%d/%m/%Y') as 'FechaIngresoUsuario', 
           a.IdEstadoFK, a.IdRolFK, a.Password
    FROM Usuarios a    
    WHERE a.IdUsuarioPK = p_IdUsuarioPK;
END $$
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE ActualizarUsuario(
    IN p_id INT,
    IN p_nombre VARCHAR(255),
    IN p_correo VARCHAR(255),
    IN p_password VARCHAR(255), -- Aquí es donde recibimos la nueva contraseña
    IN p_id_estado INT,
    IN p_id_rol INT
)
BEGIN
    UPDATE usuarios
    SET 
        Nombre = p_nombre,
        Correo = p_correo,
        Password = IFNULL(p_password, Password), -- Si no se pasa la nueva contraseña, mantenemos la anterior
        IdEstadoFK = p_id_estado,
        IdRolFK = p_id_rol
    WHERE IdUsuarioPK = p_id;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE DesactivarUsuario(
    IN p_IdUsuarioPK INT,
    IN p_IdEstadoFK INT
)
BEGIN
    UPDATE Usuarios
    SET IdEstadoFK = p_IdEstadoFK
    WHERE IdUsuarioPK = p_IdUsuarioPK;
END$$

DELIMITER ;


DELIMITER $$
	CREATE PROCEDURE ListarRolesUsuarios()
    /*PROCEDIMIENTO ALMACENADO LISTAR ROLES DE USUARIOS 19/03/2025*/
    BEGIN
		SELECT * FROM Roles;
    END $$
DELIMITER ;

DELIMITER $$
	CREATE PROCEDURE ListarEstadosUsuarios()
    /*PROCEDIMIENTO ALMACENADO LISTAR ROLES DE USUARIOS 19/03/2025*/
    BEGIN
		SELECT * FROM estadousuarios;
    END $$
DELIMITER ;

/*INICIO DE SESION*/

DELIMITER //

CREATE PROCEDURE VerificarUsuario(
/*VALIDAR CORREO*/
IN correo_usuario VARCHAR(100), 
IN password_usuario VARCHAR(255)
)
BEGIN
    SELECT *
    FROM usuarios
    WHERE Correo = correo_usuario
    LIMIT 1;
END //

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE VerificarUsuarioPorCorreo(IN correo_usuario VARCHAR(255))
BEGIN
    SELECT 
        IdUsuarioPK, Nombre, Correo, Password, IdRolFK 
    FROM usuarios
    WHERE Correo = correo_usuario;
END $$

DELIMITER ;


/*CAMBIAR PASSWORD*/
DELIMITER $$

CREATE PROCEDURE CambiarPassword(
    IN p_IdUsuario INT,
    IN p_NuevaContraseña VARCHAR(255)
)
BEGIN
    -- Actualizar la contraseña del usuario
    UPDATE usuarios
    SET Password = p_NuevaContraseña
    WHERE IdUsuarioPK = p_IdUsuario;
    
    -- Retornar un mensaje de éxito
    SELECT 'Contraseña actualizada exitosamente' AS Mensaje;
END $$

DELIMITER ;



DELIMITER $$
/*PROCEDIMIENTO GETUSERPASSWORD 23/03/2025*/
CREATE PROCEDURE `GetUserPassword` (IN userId INT)
BEGIN
    SELECT Password
    FROM usuarios
    WHERE IdUsuarioPK = userId;
END $$

DELIMITER ;

/**CLIENTES*/


DELIMITER $$

CREATE PROCEDURE ListarTodosLosClientes()
/*PROCEDIMIENTO ALMANCEANADO PARA TRAER LOS CLIENTES 29/03/2025*/
BEGIN
    SELECT 
        IdClientePK AS id,
        NombreCliente AS nombre,
        DNI AS dni,
        RUC AS ruc,
        Telefono AS telefono,
        CorreoElectronico AS correo,
        Direccion AS direccion,
        DATE_FORMAT(FechaRegistro, '%d/%m/%Y') as 'fechaRegistro',
        Estado AS estado
    FROM 
        Clientes;
    -- WHERE 
    --    Estado = 1; -- Solo traer clientes activos
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE IngresarCliente(
/*PROCEDIMIENTO ALMANCEANADO PARA INGRESAR UN CLIENTE 29/03/2025*/
    IN p_NombreCliente VARCHAR(255),
    IN p_DNI VARCHAR(255),
    IN p_RUC VARCHAR(255),
    IN p_Telefono VARCHAR(255),
    IN p_CorreoElectronico VARCHAR(255),
    IN p_Direccion VARCHAR(255)
)
BEGIN
    INSERT INTO Clientes (
        NombreCliente, DNI, RUC, Telefono, CorreoElectronico, Direccion, FechaRegistro, Estado
    ) VALUES (
        p_NombreCliente, p_DNI, p_RUC, p_Telefono, p_CorreoElectronico, p_Direccion, CURDATE(), DEFAULT
    );
END $$

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
    IN p_Estado BOOLEAN
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
        Estado = p_Estado
    WHERE 
        IdClientePK = p_IdClientePK;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE EliminarCliente(
    IN p_IdClientePK INT
)
/*PROCEDIMIENTO ELIMINAR CLIENTE 29/03/2025*/
BEGIN
    -- Cambiar el estado del cliente a 0 (inactivo)
    UPDATE Clientes
    SET Estado = 0
    WHERE IdClientePK = p_IdClientePK;
END $$

DELIMITER ;

/*LISTAR INSUMOS EN LA TABLA INSUMOSBASE 17/04/2025*/
DELIMITER //
CREATE PROCEDURE ListarTablaInsumosBase ()
       BEGIN
			SELECT A.CodigoInsumo, concat(NombreCategoriaInsumos,' ',NombreSubcategoriaInsumos) as DescripcionInsumo, C.DescripcionEstado As 'Estado',
                DATE_FORMAT(A.FechaIngreso, '%d/%m/%Y') as 'Fecha_Ingreso',
                A.Comentario, 
                A.PrecioBase,
                A.NumeroSerie,
                A.Cantidad,
                A.StockMinimo
			FROM InsumosBase A 
            join CatalogoInsumos B on A.ModeloInsumo = B.IdModeloInsumosPK
            join CatalogoEstadosConsolas C on A.EstadoInsumo = C.CodigoEstado
            join categoriasinsumos D on B.CategoriaInsumos = D.IdCategoriaInsumosPK
            join subcategoriasinsumos E on B.SubcategoriaInsumos = E.IdSubcategoriaInsumos
			WHERE A.EstadoInsumo != 7;
       END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR TODOS LOS FABRICANTES INSUMOS CREADO 17/04/2025*/
CREATE PROCEDURE ListarFabricantesInsumos()
		BEGIN
			SELECT * FROM fabricanteinsumos 
            WHERE Activo = 1;
        END //
DELIMITER ;




DELIMITER //CALL `base_datos_inventario_taller`.`ListarTablaInsumosBasesXId`('INS-ADATA-DDR4');

/*PROCEDIMIENTO LISTAR TODOS LOS FABRICANTES DE INSUMOS CON UN MODELO ASOCIADO CREADO 17/04/2025*/
CREATE PROCEDURE ListarFabricantesInsumosModelo()
		BEGIN
			SELECT DISTINCT a.IdFabricanteInsumosPK, a.NombreFabricanteInsumos FROM fabricanteinsumos a
            JOIN catalogoinsumos b ON a.IdFabricanteInsumosPK = b.FabricanteInsumos
            WHERE a.Activo = 1
            AND b.Activo = 1;
        END //
DELIMITER ;


DELIMITER //
/*PROCEDIMIENTO LISTAR TODOS LOS FABRICANTES INSUMOS EN CUALQUIER ESTADO CREADO 17/04/2025*/
CREATE PROCEDURE ListarFabricantesInsumosBase()
		BEGIN
			SELECT * FROM FabricanteInsumos;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO CONSEGUIR INFORMACION ESPECIFICA DE FABRICANTE INSUMO POR ID CREADO 17/04/2025*/
CREATE PROCEDURE ListarInformacionFabricanteInsumoxId(IdFabricante int)
	BEGIN
		SELECT * FROM fabricanteinsumos
        WHERE IdFabricanteInsumosPK = IdFabricante;
    END //
DELIMITER ;

DELIMITER $$
/*PROCEDIMIENTO ALMACENADO INSERTAR FABRICANTE INSUMO 17/04/2025*/
CREATE PROCEDURE IngresarFabricanteInsumo(PNombreFabricante varchar(100))
BEGIN
   INSERT INTO fabricanteinsumos (NombreFabricanteInsumos, Activo) values (PNombreFabricante, 1);   
END$$

DELIMITER $$
/*PROCEDIMIENTO BORRAR FABRICANTE DE INSUMOS y ASOCIADOS CREADO 16/11/2024*/
CREATE PROCEDURE SoftDeleteFabricanteInsumo(IN IdFabricantePKA INT)
BEGIN
    -- Step 1: Soft delete the fabricante by setting Activo to 0
    UPDATE fabricanteinsumos
    SET Activo = 0
    WHERE IdFabricanteInsumosPK = IdFabricantePKA;

    -- Step 2: Soft delete all categories related to this fabricante
    UPDATE categoriasinsumos
    SET Activo = 0
    WHERE IdFabricanteInsumosFK = IdFabricantePKA;

    -- Step 3: Soft delete all subcategories related to the affected categories
    UPDATE subcategoriasinsumos
    SET Activo = 0
    WHERE IdCategoriaInsumosFK IN (
        SELECT IdCategoriaInsumosPK 
        FROM categoriasinsumos 
        WHERE IdFabricanteInsumosFK = IdFabricantePKA
    );
    
    -- Step 4: Soft delete all categories of products with the fabricante
    UPDATE catalogoinsumos
    SET Activo = 0
    WHERE fabricanteinsumos = IdFabricantePKA;    
END$$

DELIMITER //
/*categorias subcategorias insumos*/
CREATE PROCEDURE ListarCategoriasInsumos()
/*LISTAR CATEGORIAS INSUMOS ACTIVOS 17/04/2025*/
		BEGIN
			SELECT * FROM categoriasinsumos 
            WHERE Activo = 1;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO ListarCategoriasAccesoriosBase creado 17/04/2025*/
CREATE PROCEDURE ListarCategoriasInsumosBase ()
BEGIN	
    SELECT * FROM catalogoinsumos a
    join Fabricanteinsumos b on a.FabricanteInsumos = b.IdFabricanteInsumosPK
    join categoriasinsumos c on a.CategoriaInsumos = c.IdCategoriaInsumosPK
    join Subcategoriasinsumos d on a.Subcategoriainsumos = d.IdSubcategoriainsumos
    WHERE a.ACTIVO = 1;
END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR TODOS LAS SUBCATEGORIAS INSUMOS CREADO 17/04/2025*/
CREATE PROCEDURE ListarSubCategoriasInsumos()
		BEGIN
			SELECT * FROM subcategoriasinsumos
            WHERE Activo = 1;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR CATEGORIAS POR FABRICANTE INSUMOS CREADO 17/04/2025*/
CREATE PROCEDURE ListarCategoriasInsumosxFabricante(IdFabricanteI int)
	BEGIN
		SELECT a.IdCategoriaInsumosPK, a.NombreCategoriaInsumos from categoriasinsumos a
        join fabricanteinsumos b on a.IdFabricanteInsumosFK = b.IdFabricanteInsumosPK
        WHERE b.IdFabricanteInsumosPK = IdFabricanteI
        AND a.Activo = 1;
    END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR TODAS LAS CATEGORIAS DE INSUMOS CON UN MODELO ASOCIADO CREADO 17/04/2025*/
CREATE PROCEDURE ListarCategoriasInsumosxModeloActivo(FabricanteP INT)
		BEGIN
			SELECT DISTINCT a.IdCategoriaInsumosPK, a.NombreCategoriaInsumos FROM categoriasinsumos a
            JOIN catalogoinsumos b ON a.IdCategoriaInsumosPK = b.CategoriaInsumos
            WHERE a.Activo = 1
            AND b.Activo = 1
            AND b.FabricanteInsumos = FabricanteP;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO CONSEGUIR INFORMACION ESPECIFICA DE CATEGORIA DE INSUMOS POR ID CREADO 17/04/2025*/
CREATE PROCEDURE ListarInformacionCategoriaInsumosxId(IdCategoria int)
	BEGIN
		SELECT * FROM categoriasinsumos
        WHERE IdCategoriaInsumosPK = IdCategoria;
    END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR SUBCATEGORIAS POR CATEGORIA DE INSUMOS CREADO 17/04/2025*/
CREATE PROCEDURE ListarSubCategoriasInsumosxCategoria(IdCategoriaI int)
	BEGIN
		SELECT a.IdSubcategoriaInsumos, a.NombreSubcategoriaInsumos from subcategoriasinsumos a
        join categoriasinsumos b on a.IdCategoriaInsumosFK = b.IdCategoriaInsumosPK
        WHERE b.IdCategoriaInsumosPK = IdCategoriaI
        AND a.Activo = 1;
    END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO LISTAR TODAS LAS SUBCATEGORIAS DE INSUMOS CON UN MODELO ASOCIADO CREADO 17/04/2025*/
CREATE PROCEDURE ListarSubCategoriasInsumosxModeloActivo(CategoriaP INT)
		BEGIN
			SELECT DISTINCT a.IdSubcategoriaInsumos, a.NombreSubcategoriaInsumos FROM subcategoriasinsumos a
            JOIN catalogoinsumos b ON a.IdSubcategoriaInsumos = b.SubcategoriaInsumos
            WHERE a.Activo = 1
            AND b.Activo = 1
            AND b.CategoriaInsumos = CategoriaP;
        END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO IngresarCategoriaProductoV2 Creado 16/09/24 */
	CREATE PROCEDURE IngresarCategoriaInsumo(FabricanteI int, CategoriaI int, SubcategoriaI int, PrefijoInsumo varchar(25), NombreArchivoImagen varchar(100), TipoProductoI int)
    BEGIN
		DECLARE cantidad varchar(24);
        select count(IdModeloInsumosPK)+1 from catalogoinsumos into cantidad;        
		INSERT INTO catalogoinsumos(FabricanteInsumos, CategoriaInsumos, SubcategoriaInsumos, CodigoModeloInsumos, LinkImagen) 
        values (FabricanteP, CategoriaP, SubcategoriaP,concat(PrefijoProducto,cantidad), NombreArchivoImagen);
    END //
DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO CONSEGUIR INFORMACION ESPECIFICA DE SUBCATEGORIA DE INSUMO POR ID CREADO 17/04/2025*/
CREATE PROCEDURE ListarInformacionSubCategoriaInsumoxId(IdSubcategoriaInsumo int)
	BEGIN
		SELECT IdSubcategoriaInsumos, NombreSubcategoriaInsumos as NombreSubCategoria, IdCategoriaInsumosFK, Activo FROM subcategoriasinsumos
        WHERE IdSubcategoriainsumos = IdSubcategoriaInsumo;
    END //
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE SofDeleteCategoriaInsumo(IN IdCategoriaI INT)
BEGIN
    -- Step 1: Soft delete the fabricante by setting Activo to 0
    UPDATE categoriasinsumos
    SET Activo = 0
    WHERE IdCategoriaInsumosPK = IdCategoriaI;

    -- Step 2: Soft delete all categories related to this fabricante
    UPDATE subcategoriasinsumos
    SET Activo = 0
    WHERE IdCategoriaInsumosFK = IdCategoriaI;
    
     -- Step 3: Soft delete all categories of products with the categorie
    UPDATE catalogoinsumos
    SET Activo = 0
    WHERE Categoriainsumos = IdCategoriaI;   
END$$

DELIMITER $$
/*PROCEDIMIENTO ALMACENADO INSERTAR SUBCATEGORIA INSUMOS 17/04/2025*/
CREATE PROCEDURE IngresarSubcategoriaInsumos(NombreSubcategoriaInsumo varchar(100), IdCategoriaInsumo int)
BEGIN
   INSERT INTO subcategoriasinsumos (NombreSubcategoriainsumos, IdCategoriainsumosFK, Activo) values (NombreSubcategoriaInsumo, IdCategoriaInsumo, 1);   
END$$

DELIMITER $$
/*PROCEDIMIENTO BORRAR CATEGORIA y ASOCIADOS CREADO 17/04/2025*/
CREATE PROCEDURE SofDeleteSubCategoriaInsumo(IN p_IdSubCategoria INT)
BEGIN
    -- Step 1: Soft delete the subcategoria by setting Activo to 0
    UPDATE Subcategoriasinsumos
    SET Activo = 0
    WHERE IdSubcategoriainsumos = p_IdSubCategoria;

    -- Step 3: Soft delete all categories of products with the categorie
    UPDATE catalogoinsumos
    SET Activo = 0
    WHERE subcategoriainsumos = p_IdSubCategoria;
   
END$$

DELIMITER ;

DELIMITER //
/*PROCEDIMIENTO ListarCategoriasAccesoriosBase creado 12/11/2024*/
CREATE PROCEDURE ListarCategoriasInsumosBase ()
BEGIN	
    SELECT * FROM catalogoinsumos a
    join Fabricanteinsumos b on a.FabricanteInsumos = b.IdFabricanteInsumosPK
    join categoriasinsumos c on a.CategoriaInsumos = c.IdCategoriaInsumosPK
    join Subcategoriasinsumos d on a.SubcategoriaInsumos = d.IdSubcategoriainsumos
    WHERE a.ACTIVO = 1;
END //
DELIMITER ;

/*PROCEDIMIENTO ListarTablacatalogoainsumosXId creado 19/04/25*/
DELIMITER //
	CREATE PROCEDURE ListarTablaCatalogoInsumosXId(IdCategoria int)
    BEGIN
		SELECT 
			*
        FROM catalogoinsumos 
        where IdModeloInsumosPK = IdCategoria;    
    END //
DELIMITER ;

delimiter //
/*PROCEDIMIENTO ALMACENADO BuscarIdCategoriaInsumoCatalogo creado 19/04/25*/
	CREATE PROCEDURE BuscarIdCategoriaInsumoCatalogo(IdFabricanteI int, IdCategoriaI int, IdSubcategoriaI int)
    BEGIN
		SELECT IdModeloInsumosPK FROM catalogoinsumos     
        WHERE FabricanteInsumos = IdFabricanteI
        AND CategoriaInsumos = IdCategoriaI
        AND SubcategoriaInsumos = IdSubcategoriaI;
    END //
DELIMITER ;

delimiter //
/*PROCEDIMIENTO ALMACENADO BuscarIdCategoriaInsumoCatalogob creado 19/04/25*/
	CREATE PROCEDURE BuscarIdCategoriaInsumoCatalogob(IdFabricanteI int, IdCategoriaI int, IdSubcategoriaI int)
    BEGIN
		SELECT a.IdModeloInsumosPK, b.CodigoInsumo  FROM catalogoinsumos a
        join insumosbase b
        on a.IdModeloInsumosPK = b.ModeloInsumo
        WHERE FabricanteInsumos = IdFabricanteI
        AND CategoriaInsumos = IdCategoriaI
        AND SubcategoriaInsumos = IdSubcategoriaI;
    END //
DELIMITER ;


/*
DELIMITER 

CREATE PROCEDURE IngresarInsumoATablaInsumosBase (
/*CREADO EL 19/04/2025
    IN IdModeloInsumosPK INT,
    IN EstadoInsumo INT,
    IN ComentarioInsumo VARCHAR(2000),
    IN PrecioBase DECIMAL(6,2),
    IN Cantidad INT UNSIGNED,
    IN NumeroSerie VARCHAR(100),
    IN StockMinimo INT UNSIGNED
)
BEGIN
    DECLARE CodigoGenerado VARCHAR(50);
    DECLARE CodigoModelo VARCHAR(25);
    DECLARE CantidadExistente INT;
    DECLARE StockMinimoExistente INT;
    DECLARE PrecioBaseExistente DECIMAL(6,2);
    DECLARE Existe INT;

    -- Verifica si ya existe un insumo para ese modelo
    SELECT COUNT(*) INTO Existe
    FROM InsumosBase
    WHERE ModeloInsumo = IdModeloInsumosPK;

    IF Existe > 0 THEN
        -- Ya existe: obtener datos actuales
        SELECT Cantidad, StockMinimo, PrecioBase INTO CantidadExistente, StockMinimoExistente, PrecioBaseExistente
        FROM InsumosBase
        WHERE ModeloInsumo = IdModeloInsumosPK
        LIMIT 1;

        -- Actualizar campos necesarios
        UPDATE InsumosBase
        SET 
            Cantidad = CantidadExistente + Cantidad,
            StockMinimo = IF(StockMinimoExistente != StockMinimo, StockMinimo, StockMinimoExistente),
            PrecioBase = IF(PrecioBase > PrecioBaseExistente, PrecioBase, PrecioBaseExistente)
        WHERE ModeloInsumo = IdModeloInsumosPK;

    ELSE
        -- No existe: obtener código del modelo desde el catálogo
        SELECT CodigoModeloInsumo INTO CodigoModelo
        FROM CatalogoInsumos
        WHERE IdModeloInsumosPK = IdModeloInsumosPK;

        -- Generar código único
        SET CodigoGenerado = CONCAT(CodigoModelo, '-', (SELECT COUNT(*) + 1 FROM InsumosBase));

        -- Insertar nuevo registro
        INSERT INTO InsumosBase (
            CodigoInsumo, ModeloInsumo, EstadoInsumo, FechaIngreso, Comentario,
            PrecioBase, NumeroSerie, Cantidad, StockMinimo
        )
        VALUES (
            CodigoGenerado, IdModeloInsumosPK, EstadoInsumo, CURDATE(), ComentarioInsumo,
            PrecioBase, NumeroSerie, Cantidad, StockMinimo
        );
    END IF;

END //

DELIMITER ;*/
DELIMITER //

CREATE PROCEDURE IngresarInsumoATablaInsumosBase (
    IN IdModeloInsumosPK INT,
    IN EstadoInsumo INT,
    IN ComentarioInsumo VARCHAR(2000),
    IN PrecioBase DECIMAL(6,2),
    IN Cantidad INT UNSIGNED,
    IN NumeroSerie VARCHAR(100),
    IN StockMinimo INT UNSIGNED
)
BEGIN
    DECLARE CodigoGenerado VARCHAR(50);
    DECLARE CodigoModelo VARCHAR(25);
    DECLARE CantidadExistente INT;
    DECLARE StockMinimoExistente INT;
    DECLARE PrecioBaseExistente DECIMAL(6,2);
    DECLARE Existe INT;

    -- Verifica si ya existe un insumo para ese modelo
    SELECT COUNT(*) INTO Existe
    FROM InsumosBase
    WHERE ModeloInsumo = IdModeloInsumosPK;

    IF Existe > 0 THEN
        -- Ya existe: obtener datos actuales
        SELECT Cantidad, StockMinimo, PrecioBase INTO CantidadExistente, StockMinimoExistente, PrecioBaseExistente
        FROM InsumosBase
        WHERE ModeloInsumo = IdModeloInsumosPK
        LIMIT 1;

        -- Actualizar campos necesarios
        UPDATE InsumosBase
        SET 
            Cantidad = CantidadExistente + Cantidad,
            StockMinimo = IF(StockMinimoExistente != StockMinimo, StockMinimo, StockMinimoExistente),
            PrecioBase = IF(PrecioBase > PrecioBaseExistente, PrecioBase, PrecioBaseExistente)
        WHERE ModeloInsumo = IdModeloInsumosPK;

    ELSE
        -- No existe: obtener código del modelo desde el catálogo
        -- CAMBIO: Agregado LIMIT 1 para asegurar un solo resultado
        SELECT CodigoModeloInsumos INTO CodigoModelo
        FROM CatalogoInsumos
        WHERE IdModeloInsumosPK = IdModeloInsumosPK
        LIMIT 1;

        -- Generar código único
        SET CodigoGenerado = CONCAT(CodigoModelo, '-', (SELECT COUNT(*) + 1 FROM InsumosBase));

        -- Insertar nuevo registro
        INSERT INTO InsumosBase (
            CodigoInsumo, ModeloInsumo, EstadoInsumo, FechaIngreso, Comentario,
            PrecioBase, NumeroSerie, Cantidad, StockMinimo
        )
        VALUES (
            CodigoGenerado, IdModeloInsumosPK, EstadoInsumo, CURDATE(), ComentarioInsumo,
            PrecioBase, NumeroSerie, Cantidad, StockMinimo
        );
    END IF;
END //

DELIMITER ;

DELIMITER //
CREATE PROCEDURE `ListarTablaInsumosBasesXId`(IdCodigoInsumo varchar(100))
/* procedimiento almacenado ListarTablaInsumosBasesXId 19/04/2025*/
BEGIN
	SELECT 
		A.CodigoInsumo, A.ModeloInsumo, A.EstadoInsumo, A.FechaIngreso, A.Comentario, A.PrecioBase, A.NumeroSerie, A.StockMinimo, A.Cantidad,
        B.FabricanteInsumos, B.CategoriaInsumos, B.SubcategoriaInsumos
    FROM insumosbase A
    JOIN catalogoinsumos B
    ON A.ModeloInsumo = B.IdModeloInsumosPK 
    WHERE A.CodigoInsumo = IdCodigoInsumo;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ActualizarInsumoBase (
    CodigoInsumoA VARCHAR(25),       -- Código del insumo a actualizar
    ModeloInsumoA INT,               -- Nuevo modelo
    EstadoInsumoA INT,               -- Nuevo estado
    PrecioInsumoA DECIMAL(6,2),      -- Nuevo precio base
    ComentarioInsumoA VARCHAR(2000), -- Comentario actualizado
    NumeroSerieInsumoA VARCHAR(100), -- Número de serie
    CantidadInsumoA INT UNSIGNED,    -- Cantidad actualizada
    StockMinimoInsumoA INT UNSIGNED  -- Stock mínimo actualizado
)
BEGIN
    /* PROCEDURE ActualizarInsumoBase 19/04/2025 */

    -- Actualizar el insumo en la tabla InsumosBase
    UPDATE InsumosBase
    SET 
        ModeloInsumo = ModeloInsumoA,
        EstadoInsumo = EstadoInsumoA,
        Comentario = ComentarioInsumoA,
        PrecioBase = PrecioInsumoA,
        NumeroSerie = NumeroSerieInsumoA,
        Cantidad = CantidadInsumoA,
        StockMinimo = StockMinimoInsumoA
    WHERE CodigoInsumo = CodigoInsumoA;

    -- Mensaje de confirmación
    SELECT 'Insumo actualizado correctamente' AS mensaje;
END //
DELIMITER ;

/*PROCEDIMIENTO BORRAR INSUMO 21/04/2025*/
DELIMITER //
	CREATE PROCEDURE BorrarInsumo(IdCodigoInsumo varchar(100))
    BEGIN
    /*PROCEDIMIENTO BORRAR INSUMO CREADO 21/04/2025*/
		UPDATE InsumosBase
        SET
			EstadoInsumo = 7
        WHERE CodigoInsumo = IdCodigoInsumo;
    END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ActualizarCategoriaInsumo(IdModeloI int, FabricanteI int, CategoriaI int, SubcategoriaI int, CodigoI varchar(25), LinkI varchar(100))
BEGIN
/*PROCEDIMIENTO ActualizarCategoriaAccesorio creado el dia 23 / 04 / 25*/
	UPDATE catalogoinsumos 
    SET  
        fabricanteinsumos = FabricanteI, 
        categoriainsumos = CategoriaI, 
        subcategoriainsumos = SubcategoriaI,
        codigomodeloinsumos = CodigoI,
        LinkImagen = LinkI
	WHERE IdmodeloInsumosPK = IdModeloI;
END //
DELIMITER ;

DELIMITER //
	CREATE PROCEDURE BorrarCategoriaInsumo(IdCategoria int)
    BEGIN
    /*PROCEDIMIENTO BORRAR CATEGORIA ACCESORIO 23/04/2025*/
		UPDATE catalogoinsumos
        SET
			Activo = 0
        WHERE IdModeloInsumosPK = IdCategoria;
    END //
DELIMITER ;

DELIMITER $$
/*PROCEDIMIENTO ALMACENADO INSERTAR CATEGORIA 25/04/2025*/
CREATE PROCEDURE IngresarCategoriaInsumoB(NombreCategoriaI varchar(100), IdFabricanteI int)
BEGIN
   INSERT INTO categoriasinsumos (NombreCategoriaInsumos, IdFabricanteInsumosFK, Activo) values (NombreCategoriaI, IdFabricanteI, 1);   
END$$

/*CALL ActualizarCategoriaInsumo(1, 1, 1, 1, 'KSD32C11', 'kingston-32gb-clase10.jpg');*/


/**
DELIMITER //
/*PROCEDIMIENTO IngresarCategoriaInsumo Creado 22/04/25 
	CREATE PROCEDURE IngresarCategoriaInsumo(FabricanteI int, CategoriaI int, SubcategoriaI int, PrefijoAccesorio varchar(25), NombreArchivoImagen varchar(100))
    BEGIN
		DECLARE cantidad varchar(24);
        select count(IdModeloInsumosPK)+1 from catalogoinsumos into cantidad;        
		INSERT INTO catalogoinsumos(FabricanteInsumos, CategoriaInsumos, SubcategoriaInsumos, CodigoModeloInsumos, LinkImagen) 
        values (FabricanteI, CategoriaI, SubcategoriaI,concat(PrefijoAccesorio,cantidad), NombreArchivoImagen);
    END //
DELIMITER ;*/

DELIMITER $$

CREATE PROCEDURE ListarHistorialEstadoInsumoXId(
	IN IdInsumo VARCHAR(25)
)
BEGIN
    SELECT 
        h.IdHistorial,
        h.CodigoInsumo,
        h.EstadoAnterior,
        ea.DescripcionEstado AS EstadoAnteriorDescripcion,
        h.EstadoNuevo,
        en.DescripcionEstado AS EstadoNuevoDescripcion,
        h.StockAnterior,
        h.StockNuevo,
        h.StockMinimoAnterior,
        h.StockMinimoNuevo,
        h.FechaCambio
    FROM HistorialEstadoInsumo h
    LEFT JOIN CatalogoEstadosConsolas ea ON h.EstadoAnterior = ea.CodigoEstado
    INNER JOIN CatalogoEstadosConsolas en ON h.EstadoNuevo = en.CodigoEstado
    WHERE h.CodigoInsumo = IdInsumo
    ORDER BY h.FechaCambio ASC;
END $$

DELIMITER ;

DELIMITER $$
/*procedimiento almacenado IngresarServicioConInsumos creado el 07/05/2025*/
CREATE PROCEDURE IngresarServicioConInsumos(
    IN DescripcionServicio VARCHAR(255),
    IN PrecioBase DECIMAL(6,2),
    IN Comentario VARCHAR(2000),
    IN insumos JSON
)
BEGIN
    DECLARE nuevoIdServicio INT;
    DECLARE i INT DEFAULT 0;

    -- Insertar en tabla ServiciosBase
    INSERT INTO ServiciosBase (
        DescripcionServicio,
        PrecioBase,
        Comentario,
        FechaIngreso
    ) VALUES (
        DescripcionServicio,
        PrecioBase,
        Comentario,
        CURDATE()
    );

    -- Obtener el ID generado
    SET nuevoIdServicio = LAST_INSERT_ID();

    -- Insertar insumos si existen
    WHILE i < JSON_LENGTH(insumos) DO
        INSERT INTO InsumosXServicio (
            IdServicioFK,
            CodigoInsumoFK,
            CantidadDescargue,
            Estado
        )
        SELECT
            nuevoIdServicio,
            JSON_UNQUOTE(JSON_EXTRACT(insumos, CONCAT('$[', i, '].CodigoInsumoFK'))),
            JSON_UNQUOTE(JSON_EXTRACT(insumos, CONCAT('$[', i, '].CantidadDescargue'))),
            1;

        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;

DELIMITER $$
CREATE PROCEDURE ListarTablaServiciosBase()
/**/
BEGIN
	SELECT 
		IdServicioPK as CodigoServicio,
        DescripcionServicio,
        Estado,
        DATE_FORMAT(FechaIngreso, '%d/%m/%Y') as 'Fecha_Ingreso',
        Comentario,
        PrecioBase
    FROM serviciosbase
    where Estado = 1 ;
END $$

DELIMITER ;

DELIMITER $$
CREATE PROCEDURE ListarTablaServiciosBaseXId(
IN IdServicio int
)
/**/
BEGIN
	SELECT 
		IdServicioPK as CodigoServicio,
        DescripcionServicio,
        Estado,
        DATE_FORMAT(FechaIngreso, '%d/%m/%Y') as 'Fecha_Ingreso',
        Comentario,
        PrecioBase
    FROM serviciosbase
    where IdServicioPK = IdServicio ;
END $$

DELIMITER ;


DELIMITER $$
	CREATE PROCEDURE ListarInsumosxServicio
    (
    IN IdServicio int
    )
    BEGIN 
		SELECT 
			b.IdInsumosXServicio,
			b.CodigoInsumoFK,
			b.CantidadDescargue,
			c.ModeloInsumo,
			c.PrecioBase
		FROM 
			serviciosbase a
		JOIN
			insumosxservicio b
			ON a.IdServicioPK = b.IdServicioFK
		JOIN 
			insumosbase c
			ON b.CodigoInsumoFK = c.CodigoInsumo -- <--- corrección clave
		WHERE 
			a.IdServicioPK = IdServicio
			AND b.Estado = 1;
    END $$
DELIMITER ;

/*PROCEDIMIENTO ListarTablacatalogoainsumosXIdB creado 10/05/25*/
DELIMITER //
	CREATE PROCEDURE ListarTablacatalogoainsumosXIdB(IdCategoria int)
    BEGIN
		SELECT 
			a.*,
            b.IdFabricanteInsumosPK, b.NombreFabricanteInsumos,
            c.IdCategoriaInsumosPK, c.NombreCategoriaInsumos,
            d.IdSubcategoriaInsumos, d.NombreSubcategoriaInsumos
        FROM catalogoinsumos a
        join fabricanteinsumos b
        on a.FabricanteInsumos = b.IdFabricanteInsumosPK
        join categoriasinsumos c 
        on a.CategoriaInsumos = c.IdCategoriaInsumosPK
        join subcategoriasinsumos d
        on a.SubcategoriaInsumos = d.IdSubcategoriaInsumos
        where IdModeloInsumosPK = IdCategoria;    
    END //
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE ActualizarServicioConInsumos (
/*PROCEDIMIENTO CREADO EL 14/05/2025*/
    IN p_CodigoServicio INT,
    IN p_DescripcionServicio VARCHAR(255),
    IN p_PrecioBase DECIMAL(6,2),
    IN p_Comentario VARCHAR(2000),
    IN p_EstadoServicioFK TINYINT(1)
)
BEGIN
    -- Actualiza la tabla de servicios
    UPDATE ServiciosBase
    SET DescripcionServicio = p_DescripcionServicio,
        PrecioBase = p_PrecioBase,
        Comentario = p_Comentario,       
        Estado = p_EstadoServicioFK
    WHERE IdServicioPK = p_CodigoServicio;

    -- Paso 1: Marcar todos los insumos existentes como inactivos (soft delete)
    UPDATE InsumosXServicio
    SET Estado = 0
    WHERE IdServicioFK = p_CodigoServicio;

    -- Nota: Aquí asumimos que se llamará múltiples veces a este SP con los datos de insumos
    -- usando un procedimiento por cada insumo.

    -- Luego, para cada insumo en el payload, se debe llamar a este SP auxiliar:
    -- CALL InsertarOActualizarInsumoXServicio(p_CodigoServicio, 'INS-KING-32GB', '32GB Clase 10', 1);

END$$

DELIMITER ;

/*DELIMITER $$

CREATE PROCEDURE InsertarOActualizarInsumoXServicio (
/*PROCEDIMIENTO CREADO EL 14/05/2025
    IN p_IdServicioFK INT,
    IN p_CodigoInsumoFK VARCHAR(25),
    IN p_Cantidad INT
)
BEGIN
    DECLARE existe INT;
    DECLARE estadoActual TINYINT;

    -- Verifica si el insumo ya existe para el servicio
    SELECT COUNT(*), Estado INTO existe, estadoActual
    FROM InsumosXServicio
    WHERE IdServicioFK = p_IdServicioFK AND CodigoInsumoFK = p_CodigoInsumoFK
    LIMIT 1;

    IF existe = 0 THEN
        -- No existe, lo insertamos
        INSERT INTO InsumosXServicio (IdServicioFK, CodigoInsumoFK, CantidadDescargue, Estado)
        VALUES (p_IdServicioFK, p_CodigoInsumoFK, p_Cantidad, 1);

    ELSE
        -- Existe: actualiza cantidad y re-activa si estaba inactivo
        UPDATE InsumosXServicio
        SET CantidadDescargue = p_Cantidad,
            Estado = 1
        WHERE IdServicioFK = p_IdServicioFK AND CodigoInsumoFK = p_CodigoInsumoFK;
    END IF;
END$$

DELIMITER ;*/

DELIMITER $$

CREATE PROCEDURE InsertarOActualizarInsumoXServicio (
    IN p_IdServicioFK INT,
    IN p_CodigoInsumoFK VARCHAR(25),
    IN p_Cantidad INT
)
BEGIN
    DECLARE existe INT DEFAULT 0;
    DECLARE estadoActual TINYINT;

    -- Verificar si el insumo ya existe
    SELECT COUNT(*) INTO existe
    FROM InsumosXServicio
    WHERE IdServicioFK = p_IdServicioFK AND CodigoInsumoFK = p_CodigoInsumoFK;

    IF existe = 0 THEN
        -- Insertar si no existe
        INSERT INTO InsumosXServicio (IdServicioFK, CodigoInsumoFK, CantidadDescargue, Estado)
        VALUES (p_IdServicioFK, p_CodigoInsumoFK, p_Cantidad, 1);
    ELSE
        -- Actualizar si ya existe
        UPDATE InsumosXServicio
        SET CantidadDescargue = p_Cantidad,
            Estado = 1
        WHERE IdServicioFK = p_IdServicioFK AND CodigoInsumoFK = p_CodigoInsumoFK;
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE EliminarServicioEInsumos (
    IN p_IdServicio INT
)
BEGIN
    -- Cambiar el estado del servicio a 0 (soft delete)
    UPDATE ServiciosBase
    SET Estado = 0
    WHERE IdServicioPK = p_IdServicio;

    -- Cambiar el estado de los insumos asociados a 0 (soft delete)
    UPDATE InsumosXServicio
    SET Estado = 0
    WHERE IdServicioFK = p_IdServicio;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE ListarVistaArticulosInventarioV3 (
)
BEGIN
	SELECT * FROM vistaarticulosinventarioV3;
END $$

DELIMITER ;

DELIMITER $$
/*PROCEDIMIENTO LISTAR PRECIOS DE VENTAS CREADO EL 30/05/2025*/
CREATE PROCEDURE ListarPreciosVenta ()
BEGIN
	select * from margenesventa;
END $$

DELIMITER ;

DELIMITER $$
/*PROCEDIMIENTO LISTAR METODOS DE PAGO CREADO EL 31/05/2025*/
CREATE PROCEDURE ListarMetodosDePago ()
BEGIN
	select * from MetodosDePago;
END $$

DELIMITER ;








