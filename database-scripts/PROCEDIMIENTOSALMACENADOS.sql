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

DELIMITER //

CREATE PROCEDURE IngresarArticulosPedidov3(
    IN p_IdPedido VARCHAR(25),
    IN p_Productos JSON,
    IN p_Accesorios JSON,
    IN p_Insumos JSON
)
BEGIN
    -- Variables comunes
    DECLARE v_CodigoConsolaGenerated VARCHAR(50);
    DECLARE v_CodigoAccesorioGenerated VARCHAR(50);
    DECLARE v_CodigoInsumo VARCHAR(50);
    DECLARE v_Indice INT DEFAULT 0;
    DECLARE v_ProductosCount INT;
    DECLARE v_AccesoriosCount INT;
    DECLARE v_InsumosCount INT;
    DECLARE v_CodigosGenerados TEXT DEFAULT '';
    DECLARE v_ProductosProcesados INT DEFAULT 0;
    DECLARE v_AccesoriosProcesados INT DEFAULT 0;
    DECLARE v_InsumosCantidadTotal INT UNSIGNED DEFAULT 0;
    DECLARE v_JsonResultado JSON;

    -- Variables de producto
    DECLARE v_modeloP INT;
    DECLARE v_colorP VARCHAR(100);
    DECLARE v_EstadoP INT;
    DECLARE v_hackP BOOLEAN;
    DECLARE v_PrecioBaseP DECIMAL(6,2);
    DECLARE v_ComentarioP VARCHAR(255);
    DECLARE v_NumeroSerieP VARCHAR(100);
    DECLARE v_AccesoriosP TEXT;
    DECLARE v_TareasP TEXT;

    -- Variables de accesorio
    DECLARE v_modeloA INT;
    DECLARE v_colorA VARCHAR(100);
    DECLARE v_estadoA INT;
    DECLARE v_precioBaseA DECIMAL(6,2);
    DECLARE v_comentarioA VARCHAR(2000);
    DECLARE v_numeroSerieA VARCHAR(100);
    DECLARE v_productoscomaptiblesA TEXT;
    DECLARE v_tareasA TEXT;

    -- Variables de insumo
    DECLARE v_modeloI INT;
    DECLARE v_estadoI INT;
    DECLARE v_comentarioI VARCHAR(2000);
    DECLARE v_precioBaseI DECIMAL(6,2);
    DECLARE v_cantidadI INT UNSIGNED;
    DECLARE v_stockMinimoI INT UNSIGNED;

    -- Contadores
    SET v_ProductosCount = JSON_LENGTH(p_Productos);
    SET v_AccesoriosCount = JSON_LENGTH(p_Accesorios);
    SET v_InsumosCount = JSON_LENGTH(p_Insumos);

    -- ================================
    -- Insertar productos
    -- ================================
    SET v_Indice = 0;
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
        SET v_ProductosProcesados = v_ProductosProcesados + 1;
        SET v_Indice = v_Indice + 1;
    END WHILE;

    -- ================================
    -- Insertar accesorios
    -- ================================
    SET v_Indice = 0;
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
        SET v_AccesoriosProcesados = v_AccesoriosProcesados + 1;
        SET v_Indice = v_Indice + 1;
    END WHILE;

    -- ================================
    -- Insertar insumos (solo si existen)
    -- ================================
    SET v_Indice = 0;
    WHILE v_Indice < v_InsumosCount DO
        SET v_modeloI = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].articuloId')));
        SET v_estadoI = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].EstadoInsumo')));
        SET v_comentarioI = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].ComentarioInsumo')));
        SET v_precioBaseI = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].PrecioBase')));
        SET v_cantidadI = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].Cantidad')));
        SET v_stockMinimoI = JSON_UNQUOTE(JSON_EXTRACT(p_Insumos, CONCAT('$[', v_Indice, '].StockMinimo')));

        -- Actualizar stock del insumo existente
        UPDATE InsumosBase
        SET EstadoInsumo = v_estadoI,
            Comentario = v_comentarioI,
            PrecioBase = v_precioBaseI,
            StockMinimo = v_stockMinimoI,
            Cantidad = Cantidad + v_cantidadI
        WHERE ModeloInsumo = v_modeloI;

        -- Obtener código
        SELECT CodigoInsumo INTO v_CodigoInsumo
        FROM InsumosBase
        WHERE ModeloInsumo = v_modeloI
        ORDER BY IdIngreso DESC
        LIMIT 1;

        -- Validación por seguridad
        IF v_CodigoInsumo IS NULL THEN
            SET @error_msg = CONCAT('Insumo con modelo ', v_modeloI, ' no existe.');
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @error_msg;
        END IF;

        -- Insertar en detalle
        INSERT INTO DetalleInsumoPedido (IdInsumoBaseFK, IdCodigoPedidoFK, Comentario)
        VALUES (v_CodigoInsumo, p_IdPedido, v_comentarioI);

        SET v_CodigosGenerados = CONCAT(v_CodigosGenerados, 'Insumo:', v_CodigoInsumo, ' (', v_cantidadI, ');');
        SET v_InsumosCantidadTotal = v_InsumosCantidadTotal + v_cantidadI;
        SET v_Indice = v_Indice + 1;
    END WHILE;

    -- ================================
    -- Resultado final en JSON
    -- ================================
    SET v_JsonResultado = JSON_OBJECT(
        'codigosIngresados', v_CodigosGenerados,
        'cantidades', JSON_OBJECT(
            'productos', v_ProductosProcesados,
            'accesorios', v_AccesoriosProcesados,
            'insumos', v_InsumosCantidadTotal
        )
    );

    SELECT v_JsonResultado AS Resultado;
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
     --   Estado = 1; -- Solo traer clientes activos
END$$

DELIMITER ;

DELIMITER $$

DROP PROCEDURE IF EXISTS IngresarCliente; -- Elimina el procedimiento viejo

CREATE PROCEDURE IngresarCliente(
    IN p_NombreCliente VARCHAR(255),
    IN p_DNI VARCHAR(255),
    IN p_RUC VARCHAR(255),
    IN p_Telefono VARCHAR(255),
    IN p_CorreoElectronico VARCHAR(255),
    IN p_Direccion VARCHAR(255),
    IN p_Comentarios VARCHAR(1000) -- 1. Añadimos el nuevo parámetro
)
BEGIN
    INSERT INTO Clientes (
        NombreCliente, 
        DNI, 
        RUC, 
        Telefono, 
        CorreoElectronico, 
        Direccion, 
        Comentarios, -- 2. Añadimos la columna a la lista
        FechaRegistro, 
        Estado
    ) VALUES (
        p_NombreCliente, 
        p_DNI, 
        p_RUC, 
        p_Telefono, 
        p_CorreoElectronico, 
        p_Direccion, 
        p_Comentarios, -- 3. Añadimos el valor del parámetro
        CURDATE(), 
        1
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
    IN p_Comentarios VARCHAR(1000),
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
        Comentarios = p_Comentarios,
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




DELIMITER //

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

-- Elimina el procedimiento existente para poder crearlo de nuevo
DROP PROCEDURE IF EXISTS InsertarVentaProforma;
DELIMITER $$

CREATE PROCEDURE InsertarVentaProforma (
    -- Se elimina p_Fecha, se usará NOW()
    IN p_TipoDocumento INT,
    OUT p_NumeroDocumento VARCHAR(255),
    IN p_Subtotal DECIMAL(10,2),
    IN p_IVA DECIMAL(10,2),
    IN p_Total DECIMAL(10,2),
    IN p_Estado INT,
    IN p_MetodoPago INT,
    -- SE ELIMINA EL PARÁMETRO p_Margen INT
    IN p_Usuario INT,
    IN p_Cliente INT,
    IN p_Observaciones VARCHAR(255),
    IN p_ReferenciaTransferencia VARCHAR(255),
    IN p_Detalles JSON
)
BEGIN
    DECLARE lastVentaId INT;
    DECLARE i INT DEFAULT 0;
    DECLARE totalItems INT;
    DECLARE nuevoCodigo VARCHAR(255);

    -- Generar código único para la proforma (sin cambios)
    SET nuevoCodigo = CONCAT('P-', LPAD((SELECT COUNT(*) + 1 FROM VentasBase WHERE IdTipoDocumentoFK = 2), 6, '0'));
    SET p_NumeroDocumento = nuevoCodigo;

    -- Insertar en tabla principal (VentasBase)
    INSERT INTO VentasBase (
        FechaCreacion, IdTipoDocumentoFK, NumeroDocumento,
        SubtotalVenta, IVA, TotalVenta,
        IdEstadoVentaFK, IdMetodoDePagoFK, -- SE QUITA IdMargenVentaFK
        IdUsuarioFK, IdClienteFK, Observaciones
    )
    VALUES (
        NOW(), p_TipoDocumento, nuevoCodigo,
        p_Subtotal, p_IVA, p_Total,
        p_Estado, p_MetodoPago, -- SE QUITA p_Margen
        p_Usuario, p_Cliente, p_Observaciones
    );

    SET lastVentaId = LAST_INSERT_ID();

    -- Insertar en tabla EXT (sin cambios)
    IF p_ReferenciaTransferencia IS NOT NULL AND p_ReferenciaTransferencia != '' THEN
        INSERT INTO VentasEXT (IdVentaFK, NumeroReferenciaTransferencia)
        VALUES (lastVentaId, p_ReferenciaTransferencia);
    END IF;

    -- --- INICIO DE LA CORRECCIÓN CLAVE EN EL DETALLE ---
    -- Insertar detalle, ahora incluyendo los nuevos campos
    SET totalItems = JSON_LENGTH(p_Detalles);
    WHILE i < totalItems DO
        INSERT INTO DetalleVenta (
            IdVentaFK, TipoArticulo, CodigoArticulo,
            PrecioVenta, Descuento, SubtotalSinIVA, Cantidad,
            PrecioBaseOriginal, MargenAplicado, IdMargenFK -- <-- CAMPOS AÑADIDOS
        )
        VALUES (
            lastVentaId,
            JSON_UNQUOTE(JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].Tipo'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].Codigo'))),
            JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].Precio')),
            JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].Descuento')),
            JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].Subtotal')),
            JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].Cantidad')),
            -- EXTRACCIÓN DE LOS NUEVOS CAMPOS DEL JSON
            JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].PrecioBaseOriginal')),
            JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].MargenAplicado')),
            JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].IdMargenFK'))
        );
        SET i = i + 1;
    END WHILE;
    -- --- FIN DE LA CORRECCIÓN CLAVE ---

END$$

DELIMITER ;



select * from ventasbase;
DROP PROCEDURE IF EXISTS ListarVentasPorUsuario;
DELIMITER $$

CREATE PROCEDURE ListarVentasPorUsuario (
    IN p_IdUsuario INT
)
ListarVentasPorUsuario: BEGIN
    DECLARE v_IdRol INT;

    -- Obtener el rol del usuario
    SELECT IdRolFK INTO v_IdRol
    FROM Usuarios
    WHERE IdUsuarioPK = p_IdUsuario;

    -- Validar permiso
    IF v_IdRol IS NULL OR v_IdRol NOT IN (1, 2) THEN
        SELECT 'Sin permiso para ver ventas' AS Mensaje;
        LEAVE ListarVentasPorUsuario;
    END IF;

    -- Consulta principal
    SELECT 
        vb.IdVentaPK,
        DATE_FORMAT(vb.FechaCreacion, '%d/%m/%Y %h:%i %p') as 'FechaCreacion',
        vb.IdTipoDocumentoFK,
        td.DescripcionDocumento AS TipoDocumento,
        vb.NumeroDocumento,
        vb.SubtotalVenta,
        vb.IVA,
        vb.TotalVenta,
        vb.IdEstadoVentaFK,
        ev.DescripcionEstadoVenta AS EstadoVenta,
        vb.IdClienteFK,
        c.NombreCliente AS Cliente,
        vb.IdUsuarioFK,
        u.Nombre AS Usuario,
        vb.Observaciones,
        (
            SELECT m.NombreMargen
            FROM DetalleVenta dv
            JOIN MargenesVenta m ON dv.IdMargenFK = m.IdMargenPK
            WHERE dv.IdVentaFK = vb.IdVentaPK
            GROUP BY dv.IdMargenFK, m.NombreMargen
            ORDER BY COUNT(*) DESC
            LIMIT 1
        ) AS MargenVenta
        
    FROM VentasBase vb
    INNER JOIN TipoDocumento td ON vb.IdTipoDocumentoFK = td.IdTipoDocumentoPK
    INNER JOIN EstadoVenta ev ON vb.IdEstadoVentaFK = ev.IdEstadoVentaPK
    INNER JOIN Clientes c ON vb.IdClienteFK = c.IdClientePK
    INNER JOIN Usuarios u ON vb.IdUsuarioFK = u.IdUsuarioPK
    
    WHERE 
        -- Condición 1: Lógica de permisos de rol
        (v_IdRol = 1 OR (v_IdRol = 2 AND vb.IdUsuarioFK = p_IdUsuario))
        
        -- ===== LÍNEA AÑADIDA PARA DOBLE SEGURIDAD =====
        AND vb.IdEstadoVentaFK != 4; -- Excluye explícitamente el estado 'Borrado'

END$$

DELIMITER ;



DELIMITER $$

DROP PROCEDURE IF EXISTS RealizarVentaYDescargarInventario$$

CREATE PROCEDURE RealizarVentaYDescargarInventario (
    IN p_IdTipoDocumento INT,
    IN p_Subtotal DECIMAL(10,2), -- Nota: Este subtotal general de la cabecera es correcto
    IN p_IVA DECIMAL(10,2),      -- Este IVA es correcto
    IN p_Total DECIMAL(10,2),    -- Este total es correcto
    IN p_IdEstadoVenta INT,
    IN p_IdMetodoPago INT,
    IN p_IdUsuario INT,
    IN p_IdCliente INT,
    IN p_Observaciones VARCHAR(255),
    IN p_Detalles JSON
)
BEGIN
    DECLARE v_IdVenta INT;
    DECLARE v_IdCarrito INT;
    DECLARE v_NuevoNumeroDocumento VARCHAR(255);
    DECLARE i INT DEFAULT 0;
    DECLARE totalItems INT;

    -- Variables para el bucle
    DECLARE v_TipoArticulo VARCHAR(20);
    DECLARE v_CodigoArticulo VARCHAR(25);
    DECLARE v_Cantidad INT;
    DECLARE v_Descuento DECIMAL(10,2);
    DECLARE v_MargenAplicado DECIMAL(10,2);
    DECLARE v_IdMargenFK INT;

    -- =============================================================
    -- ## INICIO DE LA CORRECCIÓN CLAVE ##
    --
    -- Nuevas variables para realizar cálculos seguros DENTRO del procedimiento
    DECLARE v_PrecioBaseReal DECIMAL(10,2);
    DECLARE v_PrecioVentaCalculado DECIMAL(10,2);
    DECLARE v_SubtotalCalculado DECIMAL(10,2);
    --
    -- ## FIN DE LA CORRECCIÓN CLAVE ##
    -- =============================================================

    -- Insertar cabecera de la venta (sin cambios, esta parte ya funcionaba bien)
    INSERT INTO VentasBase (
        FechaCreacion, IdTipoDocumentoFK, NumeroDocumento,
        SubtotalVenta, IVA, TotalVenta, IdEstadoVentaFK,
        IdMetodoDePagoFK, IdUsuarioFK, IdClienteFK, Observaciones
    ) VALUES (
        NOW(), p_IdTipoDocumento, '', p_Subtotal, p_IVA, p_Total, p_IdEstadoVenta,
        p_IdMetodoPago, p_IdUsuario, p_IdCliente, p_Observaciones
    );

    SET v_IdVenta = LAST_INSERT_ID();

    -- Generar número de documento (sin cambios)
    SET v_NuevoNumeroDocumento = CONCAT('F-', YEAR(NOW()), '-', LPAD(v_IdVenta, 5, '0'));
    UPDATE VentasBase SET NumeroDocumento = v_NuevoNumeroDocumento WHERE IdVentaPK = v_IdVenta;


    SET totalItems = JSON_LENGTH(p_Detalles);
    WHILE i < totalItems DO
        -- 1. Extraer solo los datos de identificación y de acción del usuario desde el JSON
        SET v_TipoArticulo   = JSON_UNQUOTE(JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].TipoArticulo')));
        SET v_CodigoArticulo = JSON_UNQUOTE(JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].CodigoArticulo')));
        SET v_Cantidad       = JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].Cantidad'));
        SET v_Descuento      = JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].Descuento'));
        SET v_MargenAplicado = JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].MargenAplicado'));
        SET v_IdMargenFK     = JSON_EXTRACT(p_Detalles, CONCAT('$[', i, '].IdMargenFK'));

        -- 2. OBTENER EL PRECIO BASE REAL DESDE LA TABLA MAESTRA, IGNORANDO EL DEL JSON
        SET v_PrecioBaseReal = 0; -- Reiniciar por seguridad en cada ciclo
        IF v_TipoArticulo = 'Producto' THEN
            SELECT PrecioBase INTO v_PrecioBaseReal FROM ProductosBases WHERE CodigoConsola = v_CodigoArticulo;
        ELSEIF v_TipoArticulo = 'Accesorio' THEN
            SELECT PrecioBase INTO v_PrecioBaseReal FROM AccesoriosBase WHERE CodigoAccesorio = v_CodigoArticulo;
        ELSEIF v_TipoArticulo = 'Insumo' THEN
            SELECT PrecioBase INTO v_PrecioBaseReal FROM InsumosBase WHERE CodigoInsumo = v_CodigoArticulo;
        -- Los servicios pueden tener precio base 0 o un valor específico
        ELSEIF v_TipoArticulo = 'Servicio' THEN
            SELECT PrecioBase INTO v_PrecioBaseReal FROM ServiciosBase WHERE IdServicioPK = CAST(v_CodigoArticulo AS UNSIGNED);
        END IF;

        -- 3. RECALCULAR PRECIOS BASADO EN DATOS SEGUROS
        SET v_PrecioVentaCalculado = v_PrecioBaseReal * (1 + (v_MargenAplicado / 100));
        SET v_SubtotalCalculado = v_PrecioVentaCalculado * (1 - (v_Descuento / 100)) * v_Cantidad;

        -- 4. INSERTAR LOS VALORES RECALCULADOS Y SEGUROS EN DetalleVenta
        INSERT INTO DetalleVenta (
            IdVentaFK, TipoArticulo, CodigoArticulo, PrecioVenta, Descuento, SubtotalSinIVA, Cantidad,
            PrecioBaseOriginal, MargenAplicado, IdMargenFK
        ) VALUES (
            v_IdVenta,
            v_TipoArticulo,
            v_CodigoArticulo,
            v_PrecioVentaCalculado,  -- Valor seguro
            v_Descuento,
            v_SubtotalCalculado,     -- Valor seguro
            v_Cantidad,
            v_PrecioBaseReal,        -- Valor seguro y real de la BD
            v_MargenAplicado,
            v_IdMargenFK
        );

        -- Lógica de descarga de inventario (sin cambios, ahora funcionará bien)
        IF v_TipoArticulo = 'Producto' THEN
            UPDATE ProductosBases SET Estado = 8 WHERE CodigoConsola = v_CodigoArticulo;
        ELSEIF v_TipoArticulo = 'Accesorio' THEN
            UPDATE AccesoriosBase SET EstadoAccesorio = 8 WHERE CodigoAccesorio = v_CodigoArticulo;
        ELSEIF v_TipoArticulo = 'Insumo' THEN
            UPDATE InsumosBase SET Cantidad = Cantidad - v_Cantidad WHERE CodigoInsumo = v_CodigoArticulo;
        ELSEIF v_TipoArticulo = 'Servicio' THEN
            UPDATE InsumosBase i
            JOIN InsumosXServicio ixs ON i.CodigoInsumo = ixs.CodigoInsumoFK
            SET i.Cantidad = i.Cantidad - (ixs.CantidadDescargue * v_Cantidad)
            WHERE ixs.IdServicioFK = CAST(v_CodigoArticulo AS UNSIGNED);
        END IF;

        SET i = i + 1;
    END WHILE;

    -- Limpieza del carrito (sin cambios)
    SELECT IdCarritoPK INTO v_IdCarrito FROM CarritoVentas WHERE IdUsuarioFK = p_IdUsuario AND IdClienteFK = p_IdCliente AND EstadoCarrito = 'En curso' LIMIT 1;
    IF v_IdCarrito IS NOT NULL THEN
        DELETE FROM DetalleCarritoVentas WHERE IdCarritoFK = v_IdCarrito;
        UPDATE CarritoVentas SET EstadoCarrito = 'Completado' WHERE IdCarritoPK = v_IdCarrito;
    END IF;

    -- Devolver los IDs generados (sin cambios)
    SELECT v_IdVenta AS CodigoVentaFinal, v_NuevoNumeroDocumento AS NumeroDocumentoFinal;

END$$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_Carrito_LimpiarDetallesPostVenta;
DELIMITER $$

CREATE PROCEDURE sp_Carrito_LimpiarDetallesPostVenta (
    IN p_IdCarrito INT
)
BEGIN
    -- Este procedimiento elimina de forma segura los artículos del detalle del carrito
    -- una vez que la venta ha sido procesada y el inventario ya fue descargado.
    -- NO devuelve ningún artículo al stock.
    DELETE FROM DetalleCarritoVentas WHERE IdCarritoFK = p_IdCarrito;
END$$

DELIMITER ;

DELIMITER $$

DROP PROCEDURE IF EXISTS sp_Carrito_AgregarArticulo$$

CREATE PROCEDURE sp_Carrito_AgregarArticulo(
    IN p_IdUsuario INT,
    IN p_IdCliente INT,
    IN p_TipoArticulo ENUM('Producto', 'Accesorio', 'Insumo', 'Servicio'),
    IN p_CodigoArticulo VARCHAR(25),
    IN p_PrecioVenta DECIMAL(10,2),
    IN p_Descuento DECIMAL(10,2),
    IN p_Cantidad INT,
    IN p_PrecioBaseOriginal DECIMAL(10,2),
    IN p_MargenAplicado DECIMAL(5,2),
    IN p_IdMargenFK INT -- Se acepta el parámetro, pero no se usa en la inserción
)
BEGIN
    DECLARE v_IdCarrito INT;
    DECLARE v_IdDetalleCarrito INT;
    DECLARE v_CantidadActual INT DEFAULT 0;
    DECLARE v_EstadoActual INT;
    DECLARE v_StockActual INT;

    -- 1. Validar cantidad (sin cambios)
    IF p_Cantidad <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La cantidad debe ser un número positivo.';
    END IF;

    -- 2. Buscar o crear carrito (sin cambios)
    SELECT IdCarritoPK INTO v_IdCarrito
    FROM CarritoVentas
    WHERE IdUsuarioFK = p_IdUsuario AND IdClienteFK = p_IdCliente AND EstadoCarrito = 'En curso'
    LIMIT 1;

    IF v_IdCarrito IS NULL THEN
        INSERT INTO CarritoVentas (IdUsuarioFK, IdClienteFK, EstadoCarrito)
        VALUES (p_IdUsuario, p_IdCliente, 'En curso');
        SET v_IdCarrito = LAST_INSERT_ID();
    END IF;

    -- =============================================================
    -- ## INICIO DE LA CORRECCIÓN CLAVE ##
    -- 3. Se REINTEGRA la lógica de gestión de inventario para reservar artículos
    IF p_TipoArticulo = 'Producto' THEN
        -- Se verifica el estado actual
        SELECT Estado INTO v_EstadoActual FROM ProductosBases WHERE CodigoConsola = p_CodigoArticulo;
        IF v_EstadoActual = 11 THEN -- 'En proceso de venta'
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Este producto ya está en un proceso de venta.';
        END IF;
        -- Se cambia el estado para reservarlo
        UPDATE ProductosBases SET Estado = 11 WHERE CodigoConsola = p_CodigoArticulo;

    ELSEIF p_TipoArticulo = 'Accesorio' THEN
        -- Se hace lo mismo para los accesorios
        SELECT EstadoAccesorio INTO v_EstadoActual FROM AccesoriosBase WHERE CodigoAccesorio = p_CodigoArticulo;
        IF v_EstadoActual = 11 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Este accesorio ya está en un proceso de venta.';
        END IF;
        UPDATE AccesoriosBase SET EstadoAccesorio = 11 WHERE CodigoAccesorio = p_CodigoArticulo;

    ELSEIF p_TipoArticulo = 'Insumo' THEN
        -- Para insumos, se descuenta el stock inmediatamente para reservarlo
        START TRANSACTION;
            SELECT Cantidad INTO v_StockActual FROM InsumosBase WHERE CodigoInsumo = p_CodigoArticulo FOR UPDATE;
            IF v_StockActual < p_Cantidad THEN
                ROLLBACK;
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock insuficiente para el insumo solicitado.';
            END IF;
            UPDATE InsumosBase SET Cantidad = Cantidad - p_Cantidad WHERE CodigoInsumo = p_CodigoArticulo;
        COMMIT;
    
    -- La lógica para Servicios también se puede reintegrar si es necesario
    -- (Por ahora, la dejamos fuera para simplificar, pero se añadiría aquí)

    END IF;
    -- ## FIN DE LA CORRECCIÓN CLAVE ##
    -- =============================================================

    -- 4. Insertar o actualizar el artículo en la tabla DetalleCarritoVentas
    SELECT IdDetalleCarritoPK, Cantidad INTO v_IdDetalleCarrito, v_CantidadActual
    FROM DetalleCarritoVentas
    WHERE IdCarritoFK = v_IdCarrito AND TipoArticulo = p_TipoArticulo AND CodigoArticulo = p_CodigoArticulo
    LIMIT 1;

    IF v_IdDetalleCarrito IS NOT NULL THEN
        UPDATE DetalleCarritoVentas
        SET Cantidad = v_CantidadActual + p_Cantidad
        WHERE IdDetalleCarritoPK = v_IdDetalleCarrito;
    ELSE
        -- La inserción sigue ignorando IdMargenFK como lo decidimos
        INSERT INTO DetalleCarritoVentas (
            IdCarritoFK, TipoArticulo, CodigoArticulo, PrecioVenta, Descuento, 
            SubtotalSinIVA, Cantidad, PrecioBaseOriginal, MargenAplicado
        )
        VALUES (
            v_IdCarrito, p_TipoArticulo, p_CodigoArticulo, p_PrecioVenta, p_Descuento,
            (p_PrecioVenta * (1 - p_Descuento/100) * p_Cantidad), 
            p_Cantidad, p_PrecioBaseOriginal, p_MargenAplicado
        );
    END IF;

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
    -- Declaramos variables
    DECLARE v_IdCarrito INT;
    DECLARE v_TipoArticulo ENUM('Producto', 'Accesorio', 'Insumo', 'Servicio');
    DECLARE v_CodigoArticulo VARCHAR(25);
    DECLARE v_Cantidad INT;
    DECLARE v_EstadoAnterior INT; -- <-- Variable para guardar el estado que leemos
    DECLARE done INT DEFAULT FALSE;

    -- Cursor (sin cambios)
    DECLARE cur_articulos CURSOR FOR
        SELECT TipoArticulo, CodigoArticulo, Cantidad
        FROM DetalleCarritoVentas
        WHERE IdCarritoFK = v_IdCarrito;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Encontrar el ID del carrito activo (sin cambios)
    SELECT IdCarritoPK INTO v_IdCarrito
    FROM CarritoVentas
    WHERE IdUsuarioFK = p_IdUsuario AND IdClienteFK = p_IdCliente AND EstadoCarrito = 'En curso'
    LIMIT 1;

    IF v_IdCarrito IS NOT NULL THEN
        START TRANSACTION;

        OPEN cur_articulos;

        read_loop: LOOP
            FETCH cur_articulos INTO v_TipoArticulo, v_CodigoArticulo, v_Cantidad;
            IF done THEN
                LEAVE read_loop;
            END IF;

            CASE v_TipoArticulo
                WHEN 'Producto' THEN
                    -- =============================================================
                    -- ## INICIO DE LA CORRECCIÓN ##
                    -- PASO 1: Leer el estado anterior y guardarlo en una variable
                    SELECT EstadoAnterior INTO v_EstadoAnterior
                    FROM HistorialEstadoProducto
                    WHERE CodigoConsola = v_CodigoArticulo AND EstadoNuevo = 11 -- 'En proceso de venta'
                    ORDER BY FechaCambio DESC
                    LIMIT 1;

                    -- PASO 2: Usar la variable para actualizar la tabla.
                    -- Si no se encontró historial, se usa 2 ('Usado') por defecto.
                    UPDATE ProductosBases
                    SET Estado = COALESCE(v_EstadoAnterior, 2)
                    WHERE CodigoConsola = v_CodigoArticulo;

                WHEN 'Accesorio' THEN
                    -- Se aplica la misma lógica de dos pasos para los accesorios
                    SELECT EstadoAnterior INTO v_EstadoAnterior
                    FROM HistorialEstadoAccesorio
                    WHERE CodigoAccesorio = v_CodigoArticulo AND EstadoNuevo = 11
                    ORDER BY FechaCambio DESC
                    LIMIT 1;
                    
                    UPDATE AccesoriosBase
                    SET EstadoAccesorio = COALESCE(v_EstadoAnterior, 2)
                    WHERE CodigoAccesorio = v_CodigoArticulo;
                    -- ## FIN DE LA CORRECCIÓN ##
                    -- =============================================================

                WHEN 'Insumo' THEN
                    UPDATE InsumosBase SET Cantidad = Cantidad + v_Cantidad WHERE CodigoInsumo = v_CodigoArticulo;

                WHEN 'Servicio' THEN
                    UPDATE InsumosBase i
                    JOIN InsumosXServicio ixs ON i.CodigoInsumo = ixs.CodigoInsumoFK
                    SET i.Cantidad = i.Cantidad + (ixs.CantidadDescargue * v_Cantidad)
                    WHERE ixs.IdServicioFK = CAST(v_CodigoArticulo AS UNSIGNED);
            END CASE;

            -- Resetear la variable para la siguiente iteración del bucle
            SET v_EstadoAnterior = NULL;

        END LOOP;

        CLOSE cur_articulos;

        -- Eliminar los registros del carrito (sin cambios)
        DELETE FROM DetalleCarritoVentas WHERE IdCarritoFK = v_IdCarrito;
        DELETE FROM CarritoVentas WHERE IdCarritoPK = v_IdCarrito;

        COMMIT;
    END IF;

END$$

DELIMITER ;

DELIMITER $$

-- Eliminamos el procedimiento anterior para asegurar una actualización limpia
DROP PROCEDURE IF EXISTS ListarCarritoUsuarioxClienteEnCurso$$

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
        dcv.PrecioBaseOriginal,
        dcv.MargenAplicado, -- El porcentaje que ya tienes
        
        -- =============================================================
        -- ## INICIO DE LA CORRECCIÓN CLAVE ##
        -- Obtenemos el ID y el Nombre del Margen uniendo directamente por el PORCENTAJE
        mv.IdMargenPK AS IdMargenFK,
        COALESCE(mv.NombreMargen, 'Personalizado') AS NombreMargen,
        -- ## FIN DE LA CORRECCIÓN CLAVE ##
        -- =============================================================

        -- Construcción dinámica del Nombre del Artículo (sin cambios)
        CASE
            WHEN dcv.TipoArticulo = 'Producto' THEN CONCAT(f.NombreFabricante, ' - ', cp.NombreCategoria, ' - ', sp.NombreSubcategoria)
            WHEN dcv.TipoArticulo = 'Accesorio' THEN CONCAT(fa.NombreFabricanteAccesorio, ' - ', caa.NombreCategoriaAccesorio, ' - ', saa.NombreSubcategoriaAccesorio)
            WHEN dcv.TipoArticulo = 'Insumo' THEN CONCAT(fi.NombreFabricanteInsumos, ' - ', cii.NombreCategoriaInsumos, ' - ', sii.NombreSubcategoriaInsumos)
            WHEN dcv.TipoArticulo = 'Servicio' THEN sb.DescripcionServicio
            ELSE 'Artículo Desconocido'
        END AS NombreArticulo,
        
        -- Obtención dinámica del Link de la Imagen (sin cambios)
        CASE
            WHEN dcv.TipoArticulo = 'Producto' THEN cc.LinkImagen
            WHEN dcv.TipoArticulo = 'Accesorio' THEN ca.LinkImagen
            WHEN dcv.TipoArticulo = 'Insumo' THEN ci.LinkImagen
            WHEN dcv.TipoArticulo = 'Servicio' THEN 'default_servicio.png'
            ELSE ''
        END AS LinkImagen

    FROM CarritoVentas cv
    JOIN DetalleCarritoVentas dcv ON cv.IdCarritoPK = dcv.IdCarritoFK

    -- =============================================================
    -- ## JOIN CORREGIDO ##
    -- Se une la tabla MargenesVenta usando la columna de porcentaje
    LEFT JOIN MargenesVenta mv ON dcv.MargenAplicado = mv.Porcentaje
    -- =============================================================

    -- El resto de los JOINs para obtener nombres de artículos se mantienen igual
    LEFT JOIN ProductosBases pb ON dcv.CodigoArticulo = pb.CodigoConsola AND dcv.TipoArticulo = 'Producto'
    LEFT JOIN CatalogoConsolas cc ON pb.Modelo = cc.IdModeloConsolaPK
    LEFT JOIN FABRICANTES f ON cc.Fabricante = f.IdFabricantePK
    LEFT JOIN CategoriasProductos cp ON cc.Categoria = cp.IdCategoriaPK
    LEFT JOIN SubcategoriasProductos sp ON cc.Subcategoria = sp.IdSubcategoria

    LEFT JOIN AccesoriosBase ab ON dcv.CodigoArticulo = ab.CodigoAccesorio AND dcv.TipoArticulo = 'Accesorio'
    LEFT JOIN CatalogoAccesorios ca ON ab.ModeloAccesorio = ca.IdModeloAccesorioPK
    LEFT JOIN FabricanteAccesorios fa ON ca.FabricanteAccesorio = fa.IdFabricanteAccesorioPK
    LEFT JOIN CategoriasAccesorios caa ON ca.CategoriaAccesorio = caa.IdCategoriaAccesorioPK
    LEFT JOIN SubcategoriasAccesorios saa ON ca.SubcategoriaAccesorio = saa.IdSubcategoriaAccesorio

    LEFT JOIN InsumosBase ib ON dcv.CodigoArticulo = ib.CodigoInsumo AND dcv.TipoArticulo = 'Insumo'
    LEFT JOIN CatalogoInsumos ci ON ib.ModeloInsumo = ci.IdModeloInsumosPK
    LEFT JOIN FabricanteInsumos fi ON ci.FabricanteInsumos = fi.IdFabricanteInsumosPK
    LEFT JOIN CategoriasInsumos cii ON ci.CategoriaInsumos = cii.IdCategoriaInsumosPK
    LEFT JOIN SubcategoriasInsumos sii ON ci.SubcategoriaInsumos = sii.IdSubcategoriaInsumos

    LEFT JOIN ServiciosBase sb ON CAST(sb.IdServicioPK AS CHAR) = dcv.CodigoArticulo AND dcv.TipoArticulo = 'Servicio'

    WHERE
        cv.IdUsuarioFK = p_IdUsuario
        AND cv.IdClienteFK = p_IdCliente
        AND cv.EstadoCarrito = 'En curso';

END$$

DELIMITER ;
-- Elimina el procedimiento existente para poder crearlo de nuevo
DROP PROCEDURE IF EXISTS `sp_ObtenerDetalleVentaCompleta`;
DELIMITER $$

CREATE PROCEDURE `sp_ObtenerDetalleVentaCompleta`(IN `p_IdVentaPK` INT)
BEGIN

    -- ================================================================= --
    --  RESULT SET 1: Información general de la Venta (CORREGIDO)        --
    -- ================================================================= --
    SELECT
        vb.IdVentaPK,
        vb.FechaCreacion,
        vb.NumeroDocumento,
        vb.SubtotalVenta,
        vb.IVA,
        vb.TotalVenta,
        vb.Observaciones,
        c.IdClientePK AS IdCliente,
        c.NombreCliente,
        c.RUC,
        c.DNI,
        c.Telefono,
        c.CorreoElectronico,
        u.IdUsuarioPK AS IdUsuario,
        u.Nombre AS NombreUsuario,
        td.DescripcionDocumento,
        esv.DescripcionEstadoVenta,
        mp.NombreMetodoPago,
        
        -- ## INICIO DE LA CORRECCIÓN ##
        -- Se reemplaza el JOIN directo por una subconsulta para obtener el margen más usado
        (
            SELECT m.NombreMargen
            FROM DetalleVenta dv
            JOIN MargenesVenta m ON dv.IdMargenFK = m.IdMargenPK
            WHERE dv.IdVentaFK = vb.IdVentaPK
            GROUP BY m.NombreMargen
            ORDER BY COUNT(*) DESC
            LIMIT 1
        ) AS NombreMargen
        -- ## FIN DE LA CORRECCIÓN ##
        
    FROM
        VentasBase vb
    JOIN Clientes c ON vb.IdClienteFK = c.IdClientePK
    JOIN Usuarios u ON vb.IdUsuarioFK = u.IdUsuarioPK
    JOIN TipoDocumento td ON vb.IdTipoDocumentoFK = td.IdTipoDocumentoPK
    JOIN ESTADOVENTA esv ON vb.IdEstadoVentaFK = esv.IdEstadoVentaPK
    JOIN MetodosDePago mp ON vb.IdMetodoDePagoFK = mp.IdMetodoPagoPK
    -- ## SE ELIMINA EL JOIN A MARGENESVENTA DESDE AQUÍ ##
    WHERE
        vb.IdVentaPK = p_IdVentaPK;


    -- =================================================================== --
    --  RESULT SET 2: Detalle de los artículos de la venta (CORREGIDO)     --
    -- =================================================================== --
    SELECT
        dv.IdDetalleVentaPK,
        dv.TipoArticulo,
        dv.CodigoArticulo,
        dv.Cantidad,
        dv.PrecioVenta AS PrecioUnitario,
        dv.SubtotalSinIVA AS SubtotalLinea,
        
        -- ## INICIO DE LA CORRECCIÓN ##
        -- Se añaden los campos de costo y margen para cada línea de detalle
        dv.PrecioBaseOriginal,
        dv.MargenAplicado,
        mv.NombreMargen,
        -- ## FIN DE LA CORRECCIÓN ##

        -- Cálculos de descuento (sin cambios)
        (dv.PrecioVenta * dv.Cantidad - dv.SubtotalSinIVA) AS DescuentoValor,
        IF(dv.PrecioVenta > 0, (1 - ((dv.SubtotalSinIVA / dv.Cantidad) / dv.PrecioVenta)) * 100, 0) AS DescuentoPorcentaje,
        
        -- Reconstrucción del nombre del artículo (sin cambios)
        COALESCE(
            CONCAT(f.NombreFabricante, ' ', cp.NombreCategoria, ' ', sp.NombreSubcategoria, ' (', pb.Color, ')'),
            CONCAT(fa.NombreFabricanteAccesorio, ' ', ca.NombreCategoriaAccesorio, ' ', sa.NombreSubcategoriaAccesorio),
            CONCAT(fi.NombreFabricanteInsumos, ' - ', ci.NombreCategoriaInsumos, ' ', si.NombreSubcategoriaInsumos),
            srb.DescripcionServicio,
            'Nombre no disponible'
        ) AS NombreArticulo
    FROM
        DetalleVenta dv
    
    -- ## INICIO DE LA CORRECCIÓN ##
    -- Se añade un JOIN a MargenesVenta para obtener el nombre del margen de cada línea
    LEFT JOIN MargenesVenta mv ON dv.IdMargenFK = mv.IdMargenPK
    -- ## FIN DE LA CORRECCIÓN ##

    -- Uniones para obtener el nombre de los Productos
    LEFT JOIN ProductosBases pb ON dv.CodigoArticulo = pb.CodigoConsola AND dv.TipoArticulo = 'Producto'
    LEFT JOIN CatalogoConsolas cc ON pb.Modelo = cc.IdModeloConsolaPK
    LEFT JOIN Fabricantes f ON cc.Fabricante = f.IdFabricantePK
    LEFT JOIN CategoriasProductos cp ON cc.Categoria = cp.IdCategoriaPK
    LEFT JOIN SubcategoriasProductos sp ON cc.Subcategoria = sp.IdSubcategoria
    -- (El resto de los JOINs y el WHERE no necesitan cambios)
    LEFT JOIN AccesoriosBase ab ON dv.CodigoArticulo = ab.CodigoAccesorio AND dv.TipoArticulo = 'Accesorio'
    LEFT JOIN CatalogoAccesorios caa ON ab.ModeloAccesorio = caa.IdModeloAccesorioPK
    LEFT JOIN FabricanteAccesorios fa ON caa.FabricanteAccesorio = fa.IdFabricanteAccesorioPK
    LEFT JOIN CategoriasAccesorios ca ON caa.CategoriaAccesorio = ca.IdCategoriaAccesorioPK
    LEFT JOIN SubcategoriasAccesorios sa ON caa.SubcategoriaAccesorio = sa.IdSubcategoriaAccesorio
    LEFT JOIN InsumosBase ib ON dv.CodigoArticulo = ib.CodigoInsumo AND dv.TipoArticulo = 'Insumo'
    LEFT JOIN CatalogoInsumos cii ON ib.ModeloInsumo = cii.IdModeloInsumosPK
    LEFT JOIN FabricanteInsumos fi ON cii.FabricanteInsumos = fi.IdFabricanteInsumosPK
    LEFT JOIN CategoriasInsumos ci ON cii.CategoriaInsumos = ci.IdCategoriaInsumosPK
    LEFT JOIN SubcategoriasInsumos si ON cii.SubcategoriaInsumos = si.IdSubcategoriaInsumos
    LEFT JOIN ServiciosBase srb ON CAST(dv.CodigoArticulo AS UNSIGNED) = srb.IdServicioPK AND dv.TipoArticulo = 'Servicio'
    WHERE
        dv.IdVentaFK = p_IdVentaPK;

END$$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_CrearNotaCredito;

DELIMITER $$

CREATE PROCEDURE `sp_CrearNotaCredito`(
    IN p_IdVentaFK INT,
    IN p_UsuarioEmisorFK INT,
    IN p_Motivo TEXT,
    IN p_TotalCredito DECIMAL(10,2),
    IN p_DetallesJSON JSON,
    IN p_IdMotivoFK INT
)
BEGIN
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
        -- Extraer datos del JSON
        SET v_TipoArticulo = JSON_UNQUOTE(JSON_EXTRACT(p_DetallesJSON, CONCAT('$[', i, '].TipoArticulo')));
        SET v_CodigoArticulo = JSON_UNQUOTE(JSON_EXTRACT(p_DetallesJSON, CONCAT('$[', i, '].CodigoArticulo')));
        SET v_Cantidad = JSON_EXTRACT(p_DetallesJSON, CONCAT('$[', i, '].Cantidad'));
        SET v_PrecioUnitario = JSON_EXTRACT(p_DetallesJSON, CONCAT('$[', i, '].PrecioUnitario'));
        SET v_Subtotal = JSON_EXTRACT(p_DetallesJSON, CONCAT('$[', i, '].Subtotal'));
        SET v_ReingresarAInventario = JSON_EXTRACT(p_DetallesJSON, CONCAT('$[', i, '].ReingresarAInventario'));

        -- Insertar el detalle de la nota de crédito
        INSERT INTO DetalleNotaCredito (IdNotaCreditoFK, TipoArticulo, CodigoArticulo, Cantidad, PrecioUnitario, Subtotal)
        VALUES (v_IdNotaCredito, v_TipoArticulo, v_CodigoArticulo, v_Cantidad, v_PrecioUnitario, v_Subtotal);

        -- 3. Actualizar inventario si es necesario (con el estado corregido)
        IF v_ReingresarAInventario = TRUE THEN
            IF v_TipoArticulo = 'Producto' THEN
                -- CORREGIDO: El producto devuelto entra en estado 9 ('En garantia') para revisión.
                UPDATE ProductosBases SET Estado = 9 WHERE CodigoConsola = v_CodigoArticulo;
            ELSEIF v_TipoArticulo = 'Accesorio' THEN
                -- CORREGIDO: El accesorio devuelto entra en estado 9 ('En garantia') para revisión.
                UPDATE AccesoriosBase SET EstadoAccesorio = 9 WHERE CodigoAccesorio = v_CodigoArticulo;
            ELSEIF v_TipoArticulo = 'Insumo' THEN
                -- Los insumos solo reingresan al stock.
                UPDATE InsumosBase SET Cantidad = Cantidad + v_Cantidad WHERE CodigoInsumo = v_CodigoArticulo;
            END IF;
        END IF;

        SET i = i + 1;
    END WHILE;

    -- 4. Anular factura original si corresponde
    IF p_AnularFacturaOriginal = TRUE OR p_IdMotivoFK = 4 THEN -- ID 4 = 'Cancelación de factura completa'
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

DROP PROCEDURE IF EXISTS sp_ListarMotivosNotaCredito;
DELIMITER $$
CREATE PROCEDURE sp_ListarMotivosNotaCredito()
BEGIN
    SELECT IdMotivoPK, Descripcion FROM MotivosNotaCredito WHERE Activo = TRUE;
END$$
DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_ListarNotasCredito()
BEGIN
    SELECT 
        nc.IdNotaCreditoPK,
        nc.FechaEmision,
        vb.NumeroDocumento AS NumeroVentaOriginal,
        c.NombreCliente,
        mnc.Descripcion AS Motivo,
        nc.TotalCredito,
        u.Nombre AS UsuarioEmisor,
        CASE 
            WHEN nc.Estado = 1 THEN 'Activa'
            ELSE 'Anulada'
        END AS EstadoNota
    FROM 
        NotasCredito nc
    JOIN 
        VentasBase vb ON nc.IdVentaFK = vb.IdVentaPK
    JOIN 
        Usuarios u ON nc.UsuarioEmisorFK = u.IdUsuarioPK
    JOIN
        Clientes c ON vb.IdClienteFK = c.IdClientePK
    LEFT JOIN
        MotivosNotaCredito mnc ON nc.IdMotivoFK = mnc.IdMotivoPK
    ORDER BY 
        nc.FechaEmision DESC;
END$$

DELIMITER ;




DROP PROCEDURE IF EXISTS sp_ObtenerNotaCreditoPorId;

DELIMITER $$

CREATE PROCEDURE sp_ObtenerNotaCreditoPorId(IN p_IdNotaCreditoPK INT)
BEGIN

    -- 1. Primera consulta: Obtiene los datos del encabezado de la Nota de Crédito.
    SELECT 
        nc.IdNotaCreditoPK,
        nc.FechaEmision,
        nc.TotalCredito,
        CASE 
            WHEN nc.Estado = 1 THEN 'Activa'
            ELSE 'Anulada'
        END AS EstadoNota,
        vb.NumeroDocumento AS VentaOriginal,
        c.NombreCliente,
        c.RUC,
        c.DNI,
        u_emisor.Nombre AS UsuarioEmisor, -- Alias cambiado para claridad
        mnc.Descripcion AS Motivo,
        nc.Motivo AS ObservacionesAdicionales,
        
        -- === NUEVOS CAMPOS DEL HISTORIAL DE ANULACIÓN ===
        u_anulador.Nombre AS UsuarioAnulador,
        hnc.FechaAccion AS FechaAnulacion,
        hnc.Detalles AS MotivoAnulacion
        
    FROM 
        NotasCredito nc
    JOIN 
        VentasBase vb ON nc.IdVentaFK = vb.IdVentaPK
    JOIN
        Clientes c ON vb.IdClienteFK = c.IdClientePK
    -- Se une con Usuarios para obtener el nombre de QUIEN CREÓ la nota
    JOIN 
        Usuarios u_emisor ON nc.UsuarioEmisorFK = u_emisor.IdUsuarioPK
    LEFT JOIN
        MotivosNotaCredito mnc ON nc.IdMotivoFK = mnc.IdMotivoPK
        
    -- === NUEVOS JOINS PARA OBTENER DATOS DE ANULACIÓN ===
    -- Se une con el historial para encontrar el registro específico de anulación (si existe)
    LEFT JOIN 
        HistorialNotasCredito hnc ON nc.IdNotaCreditoPK = hnc.IdNotaCreditoFK AND hnc.TipoAccion = 'ANULACION'
    -- Se une de nuevo con Usuarios para obtener el nombre de QUIEN ANULÓ la nota (si existe)
    LEFT JOIN 
        Usuarios u_anulador ON hnc.IdUsuarioFK = u_anulador.IdUsuarioPK
        
    WHERE 
        nc.IdNotaCreditoPK = p_IdNotaCreditoPK;


    -- 2. Segunda consulta: Obtiene las líneas de detalle (SIN CAMBIOS)
    SELECT 
        dnc.TipoArticulo, 
        dnc.CodigoArticulo, 
        dnc.Cantidad, 
        dnc.PrecioUnitario, 
        dnc.Subtotal
    FROM 
        DetalleNotaCredito dnc
    WHERE 
        dnc.IdNotaCreditoFK = p_IdNotaCreditoPK;

END$$

DELIMITER ;



DELIMITER $$

CREATE PROCEDURE sp_RegistrarHistorialNotaCredito(
    IN p_IdNotaCreditoFK INT,
    IN p_IdUsuarioFK INT,
    IN p_TipoAccion VARCHAR(20),
    IN p_Detalles VARCHAR(255)
)
BEGIN
    -- Inserta un nuevo registro en la tabla de historial con los datos proporcionados.
    INSERT INTO HistorialNotasCredito (
        IdNotaCreditoFK, 
        IdUsuarioFK, 
        TipoAccion, 
        Detalles
    ) 
    VALUES (
        p_IdNotaCreditoFK, 
        p_IdUsuarioFK, 
        p_TipoAccion, 
        p_Detalles
    );
END$$

DELIMITER ;


DROP PROCEDURE IF EXISTS sp_AnularNotaCredito;

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
    SELECT Estado INTO v_estado_actual FROM NotasCredito WHERE IdNotaCreditoPK = p_IdNotaCreditoPK;
    
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


DROP PROCEDURE IF EXISTS sp_ListarCarritosActivos;

DELIMITER $$

CREATE PROCEDURE sp_ListarCarritosActivos()
BEGIN
    SELECT
        cv.IdCarritoPK,
        cv.FechaCreacion,
        u.Nombre AS Usuario,
        -- Si no hay un cliente asignado, se muestra 'Consumidor Final'
        IFNULL(c.NombreCliente, 'Consumidor Final') AS Cliente,
        -- Calcula el total de artículos distintos en el carrito
        COUNT(dcv.IdDetalleCarritoPK) AS CantidadItems,
        -- Calcula el monto total del carrito sumando los subtotales de sus detalles
        IFNULL(SUM(dcv.SubtotalSinIVA), 0.00) AS TotalCarrito,
        cv.Comentario,
        cv.EstadoCarrito
    FROM
        CarritoVentas cv
    -- Se une con Usuarios para obtener el nombre de quien creó el carrito
    JOIN
        Usuarios u ON cv.IdUsuarioFK = u.IdUsuarioPK
    -- Se usa LEFT JOIN para Clientes porque puede ser nulo
    LEFT JOIN
        Clientes c ON cv.IdClienteFK = c.IdClientePK
    -- Se usa LEFT JOIN para los detalles por si un carrito está vacío
    LEFT JOIN
        DetalleCarritoVentas dcv ON cv.IdCarritoPK = dcv.IdCarritoFK
    WHERE
        -- El filtro principal para traer solo los carritos 'En curso'
        cv.EstadoCarrito = 'En curso'
    -- Agrupamos por cada carrito para poder usar las funciones de agregación (COUNT y SUM)
    GROUP BY
        cv.IdCarritoPK,
        cv.FechaCreacion,
        u.Nombre,
        c.NombreCliente,
        cv.Comentario,
        cv.EstadoCarrito
    -- Ordenamos para mostrar los más recientes primero
    ORDER BY
        cv.FechaCreacion DESC;

END$$

DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS `sp_ConsultarCarritosVigentes`;

CREATE PROCEDURE `sp_ConsultarCarritosVigentes`(IN p_IdUsuario INT)
BEGIN
    -- Declarar una variable para almacenar el ID del rol del usuario.
    DECLARE v_IdRol INT;

    -- Obtener el ID del rol directamente desde la tabla Usuarios.
    SELECT IdRolFK INTO v_IdRol
    FROM Usuarios
    WHERE IdUsuarioPK = p_IdUsuario;

    -- Comprobar el ID del rol del usuario y ejecutar la consulta correspondiente.
    -- Si el rol es 1 (Admin), puede ver todos los carritos.
    IF v_IdRol = 1 THEN
        SELECT
            cv.IdCarritoPK,
            cv.FechaCreacion,
            u.Nombre AS UsuarioCreador,
            c.NombreCliente,
            cv.Comentario,
            cv.EstadoCarrito,
            cv.IdClienteFK,
            cv.IdUsuarioFK -- Es buena práctica incluirlo para consistencia
        FROM CarritoVentas cv
        JOIN Usuarios u ON cv.IdUsuarioFK = u.IdUsuarioPK
        LEFT JOIN Clientes c ON cv.IdClienteFK = c.IdClientePK
        WHERE cv.EstadoCarrito = 'En curso'
        ORDER BY cv.FechaCreacion DESC;

    -- Si el rol es 2 (Vendedor), solo puede ver sus propios carritos.
    ELSEIF v_IdRol = 2 THEN
        SELECT
            cv.IdCarritoPK,
            cv.FechaCreacion,
            u.Nombre AS UsuarioCreador,
            c.NombreCliente,
            cv.Comentario,
            cv.EstadoCarrito,
            cv.IdClienteFK,
            cv.IdUsuarioFK
        FROM CarritoVentas cv
        JOIN Usuarios u ON cv.IdUsuarioFK = u.IdUsuarioPK
        LEFT JOIN Clientes c ON cv.IdClienteFK = c.IdClientePK
        WHERE cv.EstadoCarrito = 'En curso' AND cv.IdUsuarioFK = p_IdUsuario
        ORDER BY cv.FechaCreacion DESC;
    END IF;
    -- Nota: Si el rol es 3 (Logística) o cualquier otro, ninguna condición se cumple
    -- y el procedimiento terminará sin devolver resultados.
END $$
DELIMITER ;


DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_LiberarCarrito`$$

CREATE PROCEDURE `sp_LiberarCarrito`(IN p_IdCarrito INT)
BEGIN
    -- Declarar variables para iterar y para guardar el estado anterior
    DECLARE v_TipoArticulo ENUM('Producto', 'Accesorio', 'Insumo', 'Servicio');
    DECLARE v_CodigoArticulo VARCHAR(25);
    DECLARE v_Cantidad INT;
    DECLARE v_EstadoAnterior INT; -- <-- Variable para guardar el estado que leemos
    DECLARE done INT DEFAULT FALSE;

    -- Cursor para leer los artículos del carrito
    DECLARE cur_articulos CURSOR FOR
        SELECT TipoArticulo, CodigoArticulo, Cantidad
        FROM DetalleCarritoVentas
        WHERE IdCarritoFK = p_IdCarrito;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Manejador de errores para la transacción
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: No se pudo liberar el carrito. Se revirtieron los cambios.';
    END;

    -- Iniciar la transacción
    START TRANSACTION;

    OPEN cur_articulos;

    read_loop: LOOP
        FETCH cur_articulos INTO v_TipoArticulo, v_CodigoArticulo, v_Cantidad;
        IF done THEN
            LEAVE read_loop;
        END IF;

        CASE v_TipoArticulo
            WHEN 'Producto' THEN
                -- =============================================================
                -- ## INICIO DE LA CORRECCIÓN ##
                -- PASO 1: Leer el estado anterior y guardarlo en la variable
                SELECT EstadoAnterior INTO v_EstadoAnterior
                FROM HistorialEstadoProducto
                WHERE CodigoConsola = v_CodigoArticulo AND EstadoNuevo = 11 -- 'En proceso de venta'
                ORDER BY FechaCambio DESC
                LIMIT 1;

                -- PASO 2: Usar la variable para actualizar la tabla
                UPDATE ProductosBases
                SET Estado = COALESCE(v_EstadoAnterior, 2) -- Fallback a 'Usado'
                WHERE CodigoConsola = v_CodigoArticulo;

            WHEN 'Accesorio' THEN
                -- Se aplica la misma lógica de dos pasos para los accesorios
                SELECT EstadoAnterior INTO v_EstadoAnterior
                FROM HistorialEstadoAccesorio
                WHERE CodigoAccesorio = v_CodigoArticulo AND EstadoNuevo = 11
                ORDER BY FechaCambio DESC
                LIMIT 1;
                
                UPDATE AccesoriosBase
                SET EstadoAccesorio = COALESCE(v_EstadoAnterior, 2) -- Fallback a 'Usado'
                WHERE CodigoAccesorio = v_CodigoArticulo;
                -- ## FIN DE LA CORRECCIÓN ##
                -- =============================================================

            WHEN 'Insumo' THEN
                UPDATE InsumosBase SET Cantidad = Cantidad + v_Cantidad WHERE CodigoInsumo = v_CodigoArticulo;

            WHEN 'Servicio' THEN
                UPDATE InsumosBase i
                JOIN InsumosXServicio ixs ON i.CodigoInsumo = ixs.CodigoInsumoFK
                SET i.Cantidad = i.Cantidad + (ixs.CantidadDescargue * v_Cantidad)
                WHERE ixs.IdServicioFK = CAST(v_CodigoArticulo AS UNSIGNED);
        END CASE;

        -- Resetear la variable para la siguiente iteración
        SET v_EstadoAnterior = NULL;

    END LOOP;

    CLOSE cur_articulos;

    -- Ahora que el inventario está restaurado, eliminar los registros del carrito
    DELETE FROM DetalleCarritoVentas WHERE IdCarritoFK = p_IdCarrito;
    DELETE FROM CarritoVentas WHERE IdCarritoPK = p_IdCarrito;

    -- Confirmar los cambios
    COMMIT;

END$$

DELIMITER ;

DROP PROCEDURE IF EXISTS `sp_ObtenerContenidoCarrito`;
DELIMITER $$

CREATE PROCEDURE `sp_ObtenerContenidoCarrito`(
    IN p_IdUsuarioSesion INT, -- El ID del usuario que está logueado
    IN p_IdCliente INT       -- El ID del cliente del carrito a cargar
)
BEGIN
    DECLARE v_IdRol INT;

    -- Obtiene el rol del usuario que está haciendo la petición.
    SELECT IdRolFK INTO v_IdRol FROM Usuarios WHERE IdUsuarioPK = p_IdUsuarioSesion;

    -- Si es Admin (Rol 1), busca el carrito activo para el cliente, sin importar el dueño.
    IF v_IdRol = 1 THEN
        SELECT
            dc.TipoArticulo,
            dc.CodigoArticulo,
            dc.Cantidad,
            dc.PrecioVenta,
            dc.Descuento,
            dc.SubtotalSinIVA,
            -- --- INICIO DE LA CORRECCIÓN ---
            dc.PrecioBaseOriginal, -- <-- AÑADIDO
            dc.MargenAplicado      -- <-- AÑADIDO
            -- Nota: Aquí se podrían añadir JOINs a las tablas de productos/accesorios
            -- para obtener también el NombreArticulo y LinkImagen si se desea.
            -- --- FIN DE LA CORRECCIÓN ---
        FROM DetalleCarritoVentas dc
        JOIN CarritoVentas cv ON dc.IdCarritoFK = cv.IdCarritoPK
        WHERE cv.IdClienteFK = p_IdCliente AND cv.EstadoCarrito = 'En curso';
        
    -- Si es Vendedor (Rol 2), solo puede ver su propio carrito para ese cliente.
    ELSEIF v_IdRol = 2 THEN
        SELECT
            dc.TipoArticulo,
            dc.CodigoArticulo,
            dc.Cantidad,
            dc.PrecioVenta,
            dc.Descuento,
            dc.SubtotalSinIVA,
            -- --- INICIO DE LA CORRECCIÓN ---
            dc.PrecioBaseOriginal, -- <-- AÑADIDO
            dc.MargenAplicado      -- <-- AÑADIDO
            -- --- FIN DE LA CORRECCIÓN ---
        FROM DetalleCarritoVentas dc
        JOIN CarritoVentas cv ON dc.IdCarritoFK = cv.IdCarritoPK
        WHERE cv.IdUsuarioFK = p_IdUsuarioSesion AND cv.IdClienteFK = p_IdCliente AND cv.EstadoCarrito = 'En curso';
        
    END IF;
END$$

DELIMITER ;

DROP PROCEDURE IF EXISTS `sp_GetProformaDetailsYValidarStock`;
DELIMITER $$

CREATE PROCEDURE `sp_GetProformaDetailsYValidarStock`(IN p_IdVentaPK INT)
BEGIN
    -- ==========================================================================================
    -- AUTOR: Gemini
    -- FECHA: 2025-07-21
    -- DESCRIPCIÓN: Obtiene los detalles de una proforma, validando su vigencia y
    -- la disponibilidad de stock de sus artículos.
    -- ==========================================================================================

    -- (El resto del procedimiento no necesita cambios...)
    DECLARE v_FechaCreacion DATETIME;
    DECLARE v_IdTipoDocumento INT;
    DECLARE v_esValida BOOLEAN DEFAULT TRUE;
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_CodigoArticulo VARCHAR(25);
    DECLARE v_TipoArticulo ENUM('Producto', 'Accesorio', 'Insumo', 'Servicio');
    DECLARE v_Cantidad INT;
    DECLARE v_EstadoArticulo INT;
    DECLARE v_StockInsumo INT;

    DECLARE cur_DetallesVenta CURSOR FOR
        SELECT CodigoArticulo, TipoArticulo, Cantidad FROM DetalleVenta WHERE IdVentaFK = p_IdVentaPK;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    CREATE TEMPORARY TABLE IF NOT EXISTS TempUnavailableItems (
        CodigoArticulo VARCHAR(25),
        Motivo VARCHAR(255)
    );

    -- PASO 1: Validación de la Proforma (sin cambios)
    SELECT FechaCreacion, IdTipoDocumentoFK INTO v_FechaCreacion, v_IdTipoDocumento
    FROM VentasBase
    WHERE IdVentaPK = p_IdVentaPK;

    IF v_FechaCreacion IS NULL THEN
        SET v_esValida = FALSE;
        SELECT 'Error: La proforma con el ID especificado no existe.' AS Resultado;
    ELSEIF v_IdTipoDocumento != 2 THEN
        SET v_esValida = FALSE;
        SELECT 'Error: El documento solicitado no es una proforma.' AS Resultado;
    ELSEIF DATEDIFF(CURDATE(), v_FechaCreacion) > 15 THEN
        SET v_esValida = FALSE;
        SELECT 'Error: La proforma ha expirado. Solo es válida por 15 días.' AS Resultado;
    END IF;

    -- PASO 2: Verificación de Artículos (sin cambios)
    IF v_esValida THEN
        OPEN cur_DetallesVenta;

        read_loop: LOOP
            FETCH cur_DetallesVenta INTO v_CodigoArticulo, v_TipoArticulo, v_Cantidad;
            IF done THEN
                LEAVE read_loop;
            END IF;

            CASE v_TipoArticulo
                WHEN 'Producto' THEN
                    SELECT Estado INTO v_EstadoArticulo FROM ProductosBases WHERE CodigoConsola = v_CodigoArticulo;
                    IF v_EstadoArticulo IN (7, 8, 9, 10, 11) THEN
                        INSERT INTO TempUnavailableItems (CodigoArticulo, Motivo)
                        VALUES (v_CodigoArticulo, CONCAT('Producto no disponible para la venta. Estado actual ID: ', v_EstadoArticulo));
                    END IF;
                WHEN 'Accesorio' THEN
                    SELECT EstadoAccesorio INTO v_EstadoArticulo FROM AccesoriosBase WHERE CodigoAccesorio = v_CodigoArticulo;
                    IF v_EstadoArticulo IN (7, 8, 9, 10, 11) THEN
                        INSERT INTO TempUnavailableItems (CodigoArticulo, Motivo)
                        VALUES (v_CodigoArticulo, CONCAT('Accesorio no disponible para la venta. Estado actual ID: ', v_EstadoArticulo));
                    END IF;
                WHEN 'Insumo' THEN
                    SELECT EstadoInsumo, Cantidad INTO v_EstadoArticulo, v_StockInsumo FROM InsumosBase WHERE CodigoInsumo = v_CodigoArticulo;
                    IF v_EstadoArticulo IN (7, 8, 9, 10, 11) THEN
                        INSERT INTO TempUnavailableItems (CodigoArticulo, Motivo)
                        VALUES (v_CodigoArticulo, CONCAT('Insumo no disponible para la venta. Estado actual ID: ', v_EstadoArticulo));
                    ELSEIF v_StockInsumo < v_Cantidad THEN
                        INSERT INTO TempUnavailableItems (CodigoArticulo, Motivo)
                        VALUES (v_CodigoArticulo, CONCAT('Stock insuficiente. Solicitado: ', v_Cantidad, ', Disponible: ', v_StockInsumo));
                    END IF;
                WHEN 'Servicio' THEN
                    BEGIN END;
            END CASE;
        END LOOP;

        CLOSE cur_DetallesVenta;

        -- PASO 3: Devolver los tres conjuntos de resultados

        -- Conjunto de resultados 1: Información de la cabecera (sin cambios)
        SELECT
            vb.IdVentaPK, vb.FechaCreacion, vb.NumeroDocumento, vb.SubtotalVenta, vb.IVA,
            vb.TotalVenta, vb.Observaciones, c.NombreCliente, c.Telefono, c.CorreoElectronico,
            u.Nombre AS Vendedor, ev.DescripcionEstadoVenta AS EstadoVenta, mp.NombreMetodoPago AS MetodoPago,
            vb.IdClienteFK, vb.IdMetodoDePagoFK
        FROM VentasBase vb
        JOIN Clientes c ON vb.IdClienteFK = c.IdClientePK
        JOIN Usuarios u ON vb.IdUsuarioFK = u.IdUsuarioPK
        JOIN ESTADOVENTA ev ON vb.IdEstadoVentaFK = ev.IdEstadoVentaPK
        JOIN MetodosDePago mp ON vb.IdMetodoDePagoFK = mp.IdMetodoPagoPK
        WHERE vb.IdVentaPK = p_IdVentaPK;

        -- Conjunto de resultados 2: Detalle de artículos (sin cambios)
        SELECT
            dv.TipoArticulo, dv.CodigoArticulo,
            CASE
                WHEN dv.TipoArticulo = 'Producto' THEN (SELECT CONCAT(cp.NombreCategoria, ' ', sp.NombreSubcategoria) FROM ProductosBases pb JOIN CatalogoConsolas cc ON pb.Modelo = cc.IdModeloConsolaPK JOIN CategoriasProductos cp ON cc.Categoria = cp.IdCategoriaPK JOIN SubcategoriasProductos sp ON cc.Subcategoria = sp.IdSubcategoria WHERE pb.CodigoConsola = dv.CodigoArticulo)
                WHEN dv.TipoArticulo = 'Accesorio' THEN (SELECT CONCAT(ca.NombreCategoriaAccesorio, ' ', sa.NombreSubcategoriaAccesorio) FROM AccesoriosBase ab JOIN CatalogoAccesorios caa ON ab.ModeloAccesorio = caa.IdModeloAccesorioPK JOIN CategoriasAccesorios ca ON caa.CategoriaAccesorio = ca.IdCategoriaAccesorioPK JOIN SubcategoriasAccesorios sa ON caa.SubcategoriaAccesorio = sa.IdSubcategoriaAccesorio WHERE ab.CodigoAccesorio = dv.CodigoArticulo)
                WHEN dv.TipoArticulo = 'Insumo' THEN (SELECT ci.NombreCategoriaInsumos FROM InsumosBase ib JOIN CatalogoInsumos cain ON ib.ModeloInsumo = cain.IdModeloInsumosPK JOIN CategoriasInsumos ci ON cain.CategoriaInsumos = ci.IdCategoriaInsumosPK WHERE ib.CodigoInsumo = dv.CodigoArticulo)
                WHEN dv.TipoArticulo = 'Servicio' THEN (SELECT DescripcionServicio FROM ServiciosBase WHERE IdServicioPK = CAST(dv.CodigoArticulo AS UNSIGNED))
                ELSE 'Descripción no disponible'
            END AS DescripcionArticulo,
            dv.Cantidad, dv.PrecioVenta, dv.Descuento, dv.SubtotalSinIVA,
            dv.PrecioBaseOriginal, dv.MargenAplicado, dv.IdMargenFK
        FROM DetalleVenta dv
        WHERE dv.IdVentaFK = p_IdVentaPK;

        -- Conjunto de resultados 3: Lista de artículos no disponibles
        -- ==========================================================
        --                  --- CORRECCIÓN ---
        --   Se añade DISTINCT para eliminar filas duplicadas.
        -- ==========================================================
        SELECT DISTINCT * FROM TempUnavailableItems;

    END IF;

    -- Limpieza final
    DROP TEMPORARY TABLE IF EXISTS TempUnavailableItems;

END$$

DELIMITER ;



DELIMITER $$

CREATE PROCEDURE ListarVistaInventarioGeneral (
)
BEGIN
	SELECT * FROM VistaInventarioGeneral;
END $$

DELIMITER ;


DELIMITER $$

-- Eliminamos el procedimiento anterior si existe para evitar errores
DROP PROCEDURE IF EXISTS sp_EliminarProforma $$

-- Creamos el nuevo procedimiento con la lógica de "soft delete"
CREATE PROCEDURE sp_EliminarProforma(
    IN p_IdVentaPK INT
)
BEGIN
    -- Declaración de variables
    DECLARE v_IdTipoDocumento INT;
    DECLARE v_IdEstadoActual INT;
    DECLARE v_IdEstadoBorrado INT DEFAULT 4; -- ID del nuevo estado 'Borrado'

    -- Obtenemos el tipo de documento y el estado actual de la venta
    SELECT IdTipoDocumentoFK, IdEstadoVentaFK INTO v_IdTipoDocumento, v_IdEstadoActual
    FROM VentasBase
    WHERE IdVentaPK = p_IdVentaPK;

    -- Verificamos si la venta existe
    IF v_IdTipoDocumento IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: La venta no existe.';
    -- Verificamos que sea una proforma (Tipo Documento 2)
    ELSEIF v_IdTipoDocumento != 2 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: El documento no es una proforma.';
    -- Verificamos que no esté ya borrada
    ELSEIF v_IdEstadoActual = v_IdEstadoBorrado THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Esta proforma ya ha sido borrada.';
    ELSE
        -- ¡ACCIÓN PRINCIPAL! Actualizamos el estado en lugar de borrar
        UPDATE VentasBase
        SET IdEstadoVentaFK = v_IdEstadoBorrado
        WHERE IdVentaPK = p_IdVentaPK;
    END IF;

END$$

DELIMITER ;

DELIMITER $$

DROP PROCEDURE IF EXISTS sp_ListarArticulosEnGarantia;
CREATE PROCEDURE sp_ListarArticulosEnGarantia()
BEGIN
    DECLARE var_id_estado_garantia INT DEFAULT 9; -- El ID para 'En garantia'

    -- Consulta para PRODUCTOS
    SELECT 
        'Producto' AS TipoArticulo,
        pb.CodigoConsola AS CodigoArticulo,
        CONCAT(f.NombreFabricante, ' ', cp.NombreCategoria, ' ', sp.NombreSubcategoria, ' (Color: ', pb.Color, ')') AS Descripcion,
        pb.FechaIngreso,
        pb.PrecioBase,
        cec.DescripcionEstado AS Estado,
        pb.Estado AS IdEstado, -- <--- LÍNEA AÑADIDA
        pb.NumeroSerie,
        pb.Comentario
    FROM 
        ProductosBases pb
    JOIN CatalogoEstadosConsolas cec ON pb.Estado = cec.CodigoEstado
    JOIN CatalogoConsolas cc ON pb.Modelo = cc.IdModeloConsolaPK
    JOIN Fabricantes f ON cc.Fabricante = f.IdFabricantePK
    JOIN CategoriasProductos cp ON cc.Categoria = cp.IdCategoriaPK
    JOIN SubcategoriasProductos sp ON cc.Subcategoria = sp.IdSubcategoria
    WHERE pb.Estado = var_id_estado_garantia

    UNION ALL

    -- Consulta para ACCESORIOS
    SELECT 
        'Accesorio' AS TipoArticulo,
        ab.CodigoAccesorio AS CodigoArticulo,
        CONCAT(fa.NombreFabricanteAccesorio, ' ', ca.NombreCategoriaAccesorio, ' ', sa.NombreSubcategoriaAccesorio, ' (Color: ', ab.ColorAccesorio, ')') AS Descripcion,
        ab.FechaIngreso,
        ab.PrecioBase,
        cec.DescripcionEstado AS Estado,
        ab.EstadoAccesorio AS IdEstado, -- <--- LÍNEA AÑADIDA
        ab.NumeroSerie,
        ab.Comentario
    FROM 
        AccesoriosBase ab
    JOIN CatalogoEstadosConsolas cec ON ab.EstadoAccesorio = cec.CodigoEstado
    JOIN CatalogoAccesorios cacc ON ab.ModeloAccesorio = cacc.IdModeloAccesorioPK
    JOIN FabricanteAccesorios fa ON cacc.FabricanteAccesorio = fa.IdFabricanteAccesorioPK
    JOIN CategoriasAccesorios ca ON cacc.CategoriaAccesorio = ca.IdCategoriaAccesorioPK
    JOIN SubcategoriasAccesorios sa ON cacc.SubcategoriaAccesorio = sa.IdSubcategoriaAccesorio
    WHERE ab.EstadoAccesorio = var_id_estado_garantia;

END$$

DELIMITER ;


DELIMITER $$
DROP PROCEDURE IF EXISTS sp_ActualizarEstadoArticulo;

CREATE PROCEDURE sp_ActualizarEstadoArticulo(
    IN p_TipoArticulo VARCHAR(50),
    IN p_CodigoArticulo VARCHAR(25),
    IN p_NuevoEstadoID INT
)
BEGIN
    -- Determina qué tabla actualizar basado en el tipo de artículo
    IF p_TipoArticulo = 'Producto' THEN
        UPDATE ProductosBases
        SET Estado = p_NuevoEstadoID
        WHERE CodigoConsola = p_CodigoArticulo;
        
    ELSEIF p_TipoArticulo = 'Accesorio' THEN
        UPDATE AccesoriosBase
        SET EstadoAccesorio = p_NuevoEstadoID
        WHERE CodigoAccesorio = p_CodigoArticulo;
    END IF;

    -- Puedes añadir lógica de historial aquí si lo deseas en el futuro
    
END$$

DELIMITER ;



DROP PROCEDURE IF EXISTS sp_ObtenerHistorialArticulo;
DELIMITER $$
CREATE PROCEDURE sp_ObtenerHistorialArticulo(
    IN p_TipoArticulo VARCHAR(50),
    IN p_CodigoArticulo VARCHAR(25)
)
BEGIN
    IF p_TipoArticulo = 'Producto' THEN
        SELECT 
            FechaCambio,
            EstadoAnterior,
            EstadoNuevo,
            (SELECT DescripcionEstado FROM CatalogoEstadosConsolas WHERE CodigoEstado = hep.EstadoAnterior) AS EstadoAnteriorDescripcion,
            (SELECT DescripcionEstado FROM CatalogoEstadosConsolas WHERE CodigoEstado = hep.EstadoNuevo) AS EstadoNuevoDescripcion,
            NULL AS StockAnterior, -- Columnas de Insumo en NULL
            NULL AS StockNuevo
        FROM HistorialEstadoProducto hep
        WHERE CodigoConsola = p_CodigoArticulo
        ORDER BY FechaCambio ASC;
        
    ELSEIF p_TipoArticulo = 'Accesorio' THEN
        SELECT 
            FechaCambio,
            EstadoAnterior,
            EstadoNuevo,
            (SELECT DescripcionEstado FROM CatalogoEstadosConsolas WHERE CodigoEstado = hea.EstadoAnterior) AS EstadoAnteriorDescripcion,
            (SELECT DescripcionEstado FROM CatalogoEstadosConsolas WHERE CodigoEstado = hea.EstadoNuevo) AS EstadoNuevoDescripcion,
            NULL AS StockAnterior,
            NULL AS StockNuevo
        FROM HistorialEstadoAccesorio hea
        WHERE CodigoAccesorio = p_CodigoArticulo
        ORDER BY FechaCambio ASC;

    ELSEIF p_TipoArticulo = 'Insumo' THEN
        SELECT 
            FechaCambio,
            EstadoAnterior,
            EstadoNuevo,
            (SELECT DescripcionEstado FROM CatalogoEstadosConsolas WHERE CodigoEstado = hei.EstadoAnterior) AS EstadoAnteriorDescripcion,
            (SELECT DescripcionEstado FROM CatalogoEstadosConsolas WHERE CodigoEstado = hei.EstadoNuevo) AS EstadoNuevoDescripcion,
            StockAnterior,
            StockNuevo
        FROM HistorialEstadoInsumo hei
        WHERE CodigoInsumo = p_CodigoArticulo
        ORDER BY FechaCambio ASC;
    END IF;
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
END


