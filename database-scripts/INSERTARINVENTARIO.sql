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








