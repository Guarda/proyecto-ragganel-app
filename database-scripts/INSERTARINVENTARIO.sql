/*INGRESO DE INVENTARIO*/

/*SOBREMESA*/

CALL IngresarProductoATablaProductoBase(41,'Naranja',2,0,'');
CALL IngresarProductoATablaProductoBase(41,'Naranja',2,0,'');
CALL IngresarProductoATablaProductoBase(41,'Naranja',2,0,'');
CALL IngresarProductoATablaProductoBase(38,'Índigo',2,0,'');
CALL IngresarProductoATablaProductoBase(38,'Índigo',2,0,'');
CALL IngresarProductoATablaProductoBase(38,'Índigo',2,0,'');
CALL IngresarProductoATablaProductoBase(38,'Índigo',2,0,'');
CALL IngresarProductoATablaProductoBase(38,'Índigo',2,0,'');
CALL IngresarProductoATablaProductoBase(38,'Índigo',2,0,'');
CALL IngresarProductoATablaProductoBase(39,'Negro Transparente',6,0,'');
CALL IngresarProductoATablaProductoBase(39,'Negro',2,0,'');
CALL IngresarProductoATablaProductoBase(39,'Negro',2,0,'');
CALL IngresarProductoATablaProductoBase(39,'Negro',2,0,'');
CALL IngresarProductoATablaProductoBase(78,'Blanca CIB',2,0,'');
CALL IngresarProductoATablaProductoBase(78,'Blanca',2,0,'');
CALL IngresarProductoATablaProductoBase(86,'Negro',6,0,'Dañada, necesita tarjeta nueva');
CALL IngresarProductoATablaProductoBase(18,'Negro',2,0,'Recap');

/*PORTATILES*/
CALL IngresarProductoATablaProductoBase(75,'Azul',2,0,'');
CALL IngresarProductoATablaProductoBase(75,'Azul',6,0,'Pantalla superior dañada');
CALL IngresarProductoATablaProductoBase(75,'Rojo CIB',2,0,'');
CALL IngresarProductoATablaProductoBase(76,'Negro',2,0,'');
CALL IngresarProductoATablaProductoBase(76,'Rojo',2,0,'');
CALL IngresarProductoATablaProductoBase(76,'Navy Blue',2,0,'');
CALL IngresarProductoATablaProductoBase(77,'Negro',2,0,'');
CALL IngresarProductoATablaProductoBase(77,'Azul',6,0,'L dañado');
CALL IngresarProductoATablaProductoBase(77,'Rojo Quemado',2,0,'');
CALL IngresarProductoATablaProductoBase(15,'Custom',4,0,'IPS + reshell + bateria');
CALL IngresarProductoATablaProductoBase(15,'Morado',2,0,'');
CALL IngresarProductoATablaProductoBase(15,'Glacier',2,0,'');
CALL IngresarProductoATablaProductoBase(15,'Glacier Reshell',2,0,'');
CALL IngresarProductoATablaProductoBase(15,'Clear Pink',2,0,'');
CALL IngresarProductoATablaProductoBase(15,'Gold',2,0,'Cambio Shell');
CALL IngresarProductoATablaProductoBase(16,'Custom',6,0,'IPS + Reshell con pantalla quemada');
CALL IngresarProductoATablaProductoBase(16,'Rojo',6,0,'Pantalla Quemada');
CALL IngresarProductoATablaProductoBase(16,'Plateado',6,0,'Pantalla Quemada');
CALL IngresarProductoATablaProductoBase(16,'Plateado',6,0,'Desarmado');
CALL IngresarProductoATablaProductoBase(14,'Clear',2,0,'');
CALL IngresarProductoATablaProductoBase(14,'Clear Purple',2,0,'');
CALL IngresarProductoATablaProductoBase(14,'Aqua',6,0,'Falta pantalla');
CALL IngresarProductoATablaProductoBase(14,'Morado',6,0,'Falta tapa de bateria');
CALL IngresarProductoATablaProductoBase(14,'Amarillo',2,0,'');
CALL IngresarProductoATablaProductoBase(12,'Clear Purple',2,0,'');
CALL IngresarProductoATablaProductoBase(85,'Negro con Azul',6,0,'Desarmado');
CALL IngresarProductoATablaProductoBase(85,'Negro con Azul',6,0,'Desarmado');
CALL IngresarProductoATablaProductoBase(83,'Negro',2,0,'');
CALL IngresarProductoATablaProductoBase(84,'Azul',2,0,'');
CALL IngresarProductoATablaProductoBase(80,'Rojo',2,0,'');
CALL IngresarProductoATablaProductoBase(80,'Azul',2,0,'');
CALL IngresarProductoATablaProductoBase(80,'Celeste Matte',2,0,'');
CALL IngresarProductoATablaProductoBase(80,'Blanco',2,0,'');
CALL IngresarProductoATablaProductoBase(80,'Rosa',2,0,'');
CALL IngresarProductoATablaProductoBase(80,'Negro',2,0,'');
CALL IngresarProductoATablaProductoBase(80,'Rosa',6,0,'Dañado');
CALL IngresarProductoATablaProductoBase(80,'Blanco',6,0,'Dañado');
CALL IngresarProductoATablaProductoBase(80,'Negro',6,0,'Dañado');
CALL IngresarProductoATablaProductoBase(81,'Gris',6,0,'Parte atras dañada');
CALL IngresarProductoATablaProductoBase(81,'Blanco',2,0,'');
CALL IngresarProductoATablaProductoBase(81,'Blanco',2,1,'');

CALL IngresarProductoATablaProductoBaseV3(
    9,                                   -- modeloP (IdModeloConsolaPK)
    'Verde',                             -- colorP (ColorConsola)
    1,                                   -- EstadoP (EstadoConsola)
    0,                                   -- hackP (HackConsola)
    160.00,                              -- Preciob (PrecioBase)
    'Reservado para cliente especial',   -- ComentarioP (ComentarioConsola)
    'XXX2',                              -- NumeroS (NumeroSerie)
    'Mando de juego,Cable HDMI'          -- AccesoriosP (comma-separated accessories)
);

CALL IngresarProductoATablaProductoBaseV4(
    9,                                   -- modeloP (IdModeloConsolaPK)
    'Verde',                             -- colorP (ColorConsola)
    1,                                   -- EstadoP (EstadoConsola)
    0,                                   -- hackP (HackConsola)
    160.00,                              -- Preciob (PrecioBase)
    'Reservado para cliente especial',   -- ComentarioP (ComentarioConsola)
    'XXX2',                              -- NumeroS (NumeroSerie)
    'Mando de juego,Cable HDMI',         -- AccesoriosP (comma-separated accessories)
    'Limpiar, Poner Fibra de vidrio'                            -- TareasP (comma-separated TodoList)
);

/**/

INSERT INTO FabricanteInsumos (NombreFabricanteInsumos) VALUES ('Kingston');
INSERT INTO FabricanteInsumos (NombreFabricanteInsumos) VALUES ('Sandisk');
INSERT INTO FabricanteInsumos (NombreFabricanteInsumos) VALUES ('ADATA');

/*categorias de insumos*/
-- Supongamos que Kingston = 1, Sandisk = 2, ADATA = 3
INSERT INTO CategoriasInsumos (NombreCategoriaInsumos, IdFabricanteInsumosFK) VALUES ('Memoria Micro SD', 1);
INSERT INTO CategoriasInsumos (NombreCategoriaInsumos, IdFabricanteInsumosFK) VALUES ('Pendrive', 2);
INSERT INTO CategoriasInsumos (NombreCategoriaInsumos, IdFabricanteInsumosFK) VALUES ('Memoria RAM', 3);

-- Supongamos: Memoria Micro SD = 1, Pendrive = 2, Memoria RAM = 3
INSERT INTO SubcategoriasInsumos (NombreSubcategoriaInsumos, IdCategoriaInsumosFK) VALUES ('32GB Clase 10', 1);
INSERT INTO SubcategoriasInsumos (NombreSubcategoriaInsumos, IdCategoriaInsumosFK) VALUES ('64GB USB 3.0', 2);
INSERT INTO SubcategoriasInsumos (NombreSubcategoriaInsumos, IdCategoriaInsumosFK) VALUES ('DDR4 8GB 2666MHz', 3);

/*catalogo*/
-- Supongamos:
-- FabricanteInsumos: Kingston = 1, Sandisk = 2, ADATA = 3
-- CategoriasInsumos: Micro SD = 1, Pendrive = 2, RAM = 3
-- SubcategoriasInsumos: 32GB Clase 10 = 1, 64GB USB 3.0 = 2, DDR4 8GB = 3

INSERT INTO CatalogoInsumos (FabricanteInsumos, CategoriaInsumos, SubcategoriaInsumos, CodigoModeloInsumos, LinkImagen)
VALUES (1, 1, 1, 'KSD32C10', 'kingston-32gb-clase10.png');

INSERT INTO CatalogoInsumos (FabricanteInsumos, CategoriaInsumos, SubcategoriaInsumos, CodigoModeloInsumos, LinkImagen)
VALUES (2, 2, 2, 'SND64U3', 'sandisk-64gb-usb3.png');

INSERT INTO CatalogoInsumos (FabricanteInsumos, CategoriaInsumos, SubcategoriaInsumos, CodigoModeloInsumos, LinkImagen)
VALUES (3, 3, 3, 'ADT8G2666', 'adata-8gb-ddr4.png');


/*inventario*/
INSERT INTO InsumosBase 
(CodigoInsumo, ModeloInsumo, EstadoInsumo, FechaIngreso, Comentario, PrecioBase, NumeroSerie, ServiciosCompatibles, Cantidad, StockMinimo)
VALUES
('INS-KING-32GB', 1, 1, '2025-04-17', 'Stock inicial de MicroSD Kingston 32GB Clase 10', 12.50, 'SN-KING-BASE', 'Cámaras, Drones, Reproductores', 120, 20),

('INS-SAND-64GB', 2, 1, '2025-04-17', 'Pendrives Sandisk 64GB USB 3.0 para venta general', 10.99, 'SN-SAND-BASE', 'PC, TV, Consolas', 60, 10),

('INS-ADATA-DDR4', 3, 1, '2025-04-17', 'Memoria RAM ADATA DDR4 8GB 2666MHz', 25.00, 'SN-ADATA-BASE', 'Laptops, PC Escritorio', 40, 15);








