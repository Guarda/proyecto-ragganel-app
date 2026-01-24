-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: base_datos_inventario_taller
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accesoriosbase`
--

DROP TABLE IF EXISTS `accesoriosbase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accesoriosbase` (
  `CodigoAccesorio` varchar(25) NOT NULL,
  `ModeloAccesorio` int NOT NULL,
  `ColorAccesorio` varchar(100) NOT NULL,
  `EstadoAccesorio` int NOT NULL,
  `FechaIngreso` date DEFAULT NULL,
  `Comentario` varchar(10000) DEFAULT NULL,
  `PrecioBase` decimal(6,2) DEFAULT NULL,
  `NumeroSerie` varchar(100) DEFAULT NULL,
  `ProductosCompatibles` varchar(500) DEFAULT NULL,
  `IdIngreso` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`CodigoAccesorio`),
  UNIQUE KEY `IdIngreso` (`IdIngreso`),
  KEY `ModeloAccesorio` (`ModeloAccesorio`),
  KEY `EstadoAccesorio` (`EstadoAccesorio`),
  CONSTRAINT `accesoriosbase_ibfk_1` FOREIGN KEY (`ModeloAccesorio`) REFERENCES `catalogoaccesorios` (`IdModeloAccesorioPK`),
  CONSTRAINT `accesoriosbase_ibfk_2` FOREIGN KEY (`EstadoAccesorio`) REFERENCES `catalogoestadosconsolas` (`CodigoEstado`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accesoriosbase`
--

LOCK TABLES `accesoriosbase` WRITE;
/*!40000 ALTER TABLE `accesoriosbase` DISABLE KEYS */;
INSERT INTO `accesoriosbase` VALUES ('CGWB13-78',13,'Plateado',7,'2025-09-04','',36.00,'','GameCube,Switch,Wii',78),('CGWB13-79',13,'Plateado',7,'2025-09-04','',36.00,'','Switch,GameCube,Wii,WiiU',79),('CGWB13-80',13,'Plateado',7,'2025-09-04','Limpiar y ver si funciona',36.00,'','Switch,Wii,WiiU,GameCube',80),('CGWB13-81',13,'Plateado',7,'2025-09-04','limpieza y ver si sirve',36.00,'','Switch,Wii,WiiU,GameCube',81),('DCC-105',27,'Blanco',2,'2025-09-05','Revisar y limpiar',10.00,'','Dreamcast',105),('DCVMUA-106',28,'Transparente Verde',2,'2025-09-05','Revisar funcion',10.00,'','',106),('DCVMUA-107',28,'Transparente Celeste',2,'2025-09-05','Revisar funcion',10.00,'','Dreamcast',107),('DCVMUJ-109',29,'Rojo',2,'2025-09-05','Revisar funcion',10.00,'','Dreamcast',109),('DCVMUJ29-108',29,'Rojo',7,'2025-09-05','Revisar funcion',10.00,'','Dreamcast',108),('DSBT-100',25,'Original',7,'2025-09-05','Probar',15.00,'','DS,DSi,DSi Lite',100),('GBFCGB-103',26,'Transparente',2,'2025-09-05','Revisar y Limpiar',20.00,'','GameBoy Pocket,GameBoy Color',103),('GBFCGB-104',26,'Transparente',2,'2025-09-05','Revisar y limpiar',20.00,'','GameBoy Pocket,GameBoy Color',104),('GBFCGB26-101',26,'Transparente',7,'2025-09-05','Revisar y probar',15.00,'','GameBoy Color,GameBoy Pocket',101),('GBFCGB26-102',26,'Transparente',7,'2025-09-05','Revisar y probar',15.00,'','GameBoy Color,GameBoy Pocket',102),('GCB-18',2,'Negro',2,'2024-11-20','Revisado, T3, sigue en inventario.',30.00,'','Switch,Wiiu,Wii,Gamecube',1),('GCB-19',2,'Negro',2,'2024-11-20','Revisado',25.00,'','Switch,Wiiu,Wii,Gamecube',2),('GCB-20',2,'Negro',2,'2024-11-20','Revisado, sigue en inventario.',25.00,'','Switch,Wiiu,Wii,Gamecube',3),('GCB-21',2,'Negro',2,'2024-11-20','Revisado',25.00,'','Switch,Wiiu,Wii,Gamecube',4),('GCB-31',2,'Negro',2,'2024-11-20','Revisado',25.00,'','Switch,Wiiu,Wii,Gamecube',5),('GCB-32',2,'Negro',2,'2024-11-20','Revisado',25.00,'','Switch,Wiiu,Wii,Gamecube',6),('GCB-33',2,'Negro',2,'2024-11-20','Revisado',25.00,'','Switch,Wiiu,Wii,Gamecube',7),('GCB-34',2,'Negro',2,'2024-11-20','Revisado',25.00,'','Switch,Wiiu,Wii,Gamecube',8),('GCB-35',2,'Negro',2,'2024-11-20','Revisado',25.00,'','Switch,Wiiu,Wii,Gamecube',9),('GCB-36',2,'Negro',7,'2024-11-20','Revisado',25.00,'','Switch,Wiiu,Wii,Gamecube',10),('GCB-37',2,'Negro',2,'2025-01-08','Ya esta listo, solo es revisar el L digital, sigue en inventario.',25.00,'','Switch,GameCube,Wii,WiiU',11),('GCB-53',2,'Negro',2,'2025-02-09','Ya esta listo, solo de probar, sigue en inventario.',25.00,'','Gamecube,Wii,WiiU,Switch',12),('GCB-54',2,'Negro',2,'2025-02-09','Ya esta listo, solo de probar',25.00,'','Gamecube,Wii,WiiU,Switch',13),('GCB-55',2,'Negro',2,'2025-02-09','Ya esta listo, solo de probar, sigue en inventario.',25.00,'','Gamecube,Wii,WiiU,Switch',14),('GCB-73',2,'Negro',2,'2025-02-12','Listo, solo de revisar, sigue en inventario.',23.00,'','Gamecube,Wii,WiiU,Switch',15),('GCCI-38',1,'Morado',2,'2025-01-08','Ya esta listo, solo de revisar L & Drift, sigue en inventario.',25.00,'','Switch,GameCube,Wii,WiiU',16),('GCCI-39',1,'Morado',2,'2025-01-08','Ya esta listo, solo de revisar L & drift, sigue en inventario.',25.00,'','Switch,GameCube,Wii,WiiU',17),('GCCI-56',1,'Morado',2,'2025-02-09','Ya esta listo, solo de probar',25.00,'','Gamecube,Wii,WiiU',18),('GCCI-57',1,'Morado',2,'2025-02-09','Ya esta listo, solo de probar, sigue en inventario.',25.00,'','Gamecube,Wii,WiiU,Switch',19),('GCCI-58',1,'Morado',2,'2025-02-09','Ya esta listo, solo de probar',25.00,'','Gamecube,Wii,WiiU,Switch',20),('GCCI-59',1,'Morado',2,'2025-02-09','Ya esta listo, solo de probar',25.00,'','Gamecube,Wii,WiiU,Switch',21),('GCCI-60',1,'Morado',2,'2025-02-09','Ya esta listo, solo de probar',25.00,'','Gamecube,Wii,WiiU,Switch',22),('GCCI-61',1,'Morado',2,'2025-02-09','Ya esta listo, solo de probar, sigue en inventario.',25.00,'','Gamecube,Wii,WiiU,WiiU',23),('GCCI-62',1,'Morado',2,'2025-02-09','Ya esta listo, solo de probar',25.00,'','Gamecube,Wii,WiiU,Switch',24),('GCE-23',5,'Verde',8,'2024-11-20','Revisado',45.00,'','Switch,Wiiu,Wii,Gamecube',25),('GCM-22',8,'Rojo/Azul Mario',2,'2024-11-20','Revisado',100.00,'','Switch,Wiiu,Wii,Gamecube',26),('GCO-11',3,'Naranja',2,'2024-11-20','Revisado, T3, sigue en inventario.',30.00,'','Switch,Wiiu,Wii,Gamecube',27),('GCO-12',3,'Naranja',2,'2024-11-20','Revisado',30.00,'','Switch,Wiiu,Wii,Gamecube',28),('GCO-13',3,'Naranja',2,'2024-11-20','Revisado',30.00,'','Gamecube,Switch,Wiiu,Wii',29),('GCO-14',3,'Naranja',2,'2024-11-20','Revisado',30.00,'','Switch,Wiiu,Wii,Gamecube',30),('GCO-15',3,'Naranja',2,'2024-11-20','Revisad, sigue en inventario.',30.00,'','Switch,Wiiu,Wii,Gamecube',31),('GCO-16',3,'Naranja',2,'2024-11-20','Revisado',30.00,'','Switch,Wiiu,Wii,Gamecube',32),('GCO-17',3,'Naranja',2,'2024-11-20','Revisad, sigue en inventario.',30.00,'','Switch,Wiiu,Wii,Gamecube',33),('GCO-24',3,'Naranja',2,'2024-11-20','Revisado',30.00,'','Gamecube,Switch,Wiiu,Wii',34),('GCO-25',3,'Naranja',2,'2024-11-20','Revisado',30.00,'','Switch,Wiiu,Gamecube,Wii',35),('GCO-26',3,'Naranja',7,'2024-11-20','Revisado',30.00,'','Switch,Wiiu,Wii,Gamecube',36),('GCO-63',3,'Naranja',2,'2025-02-09','Ya esta listo, solo de probar',27.84,'','Gamecube,Wii,WiiU,Switch',37),('GCO-64',3,'Naranja',2,'2025-02-09','Ya esta listo, solo de probar, sigue en inventario.',27.84,'','Gamecube,Wii,WiiU,Switch',38),('GCO-65',3,'Naranja',2,'2025-02-09','Ya esta listo, solo de probar',27.84,'','Gamecube,Wii,WiiU,Switch',39),('GCO-66',3,'Naranja',2,'2025-02-09','Ya esta listo, solo de probar',27.84,'','Gamecube,Wii,WiiU,Switch',40),('GCO-67',3,'Naranja',2,'2025-02-09','Ya esta listo, solo de probar',27.84,'','Gamecube,Wii,WiiU,Switch',41),('GCO-68',3,'Naranja',2,'2025-02-09','Ya esta listo, solo de probar',27.84,'','Gamecube,Wii,Switch,WiiU',42),('GCO-69',3,'Naranja',2,'2025-02-09','Ya esta listo, solo de probar',27.84,'','Gamecube,Wii,WiiU,Switch',43),('GCO-70',3,'Naranja',2,'2025-02-09','Ya esta listo, solo de probar',27.84,'','Gamecube,Wii,WiiU,Switch',44),('GCO-71',3,'Naranja',2,'2025-02-09','Ya esta listo, solo de probar',27.84,'','Gamecube,Wii,WiiU,Switch',45),('GCO-72',3,'Naranja',8,'2025-02-09','Ya esta listo, solo de probar',27.84,'','Gamecube,Wii,WiiU,Switch',46),('GCO-76',3,'N/A',7,'2025-03-02','P-03032025-4',49.95,'N/A','Gamecube,Wii',76),('GCS-10',6,'Plateado',2,'2024-11-20','Revisado, sigue en inventario.',25.00,'','Gamecube,Switch,Wiiu,Wii',47),('GCS-27',6,'Plateado',8,'2024-11-20','Revisado',25.00,'','Switch,Wiiu,Wii,Gamecube',48),('GCS-28',6,'Plateado',8,'2024-11-20','Revisado',25.00,'','Switch,Wiiu,Wii,Gamecube',49),('GCS-29',6,'Plateado',8,'2024-11-20','Revisado',25.00,'','Switch,Wiiu,Wii,Gamecube',50),('GCS-30',6,'Plateado',2,'2024-11-20','Revisado',25.00,'','Switch,Wiiu,Wii,Gamecube',51),('GCS-40',6,'Plateado',2,'2025-01-08','Ya esta listo, solo de probar',25.00,'','WiiU,Wii,GameCube,Switch',52),('GCS-41',6,'Plateado',2,'2025-01-08','Ya esta listo, solo de probar, sigue en inventario.',25.00,'','WiiU,Wii,GameCube,Switch',53),('GCS-42',6,'Plateado',2,'2025-01-08','Ya esta listo, solo de probar',25.00,'','WiiU,Wii,GameCube,Switch',54),('GCS-48',6,'Plateado',2,'2025-02-09','Ya esta listo, solo de probar, sigue en inventario.',25.00,'','Gamecube,Wii,WiiU,Switch',55),('GCS-49',6,'Plateado',2,'2025-02-09','Ya esta listo, solo de probar, sigue en inventario.',25.00,'','Gamecube,Wii,WiiU,Switch',56),('GCS-5',6,'Plateado',2,'2024-11-20','Revisado, T3, sigue en inventario.',30.00,'','Switch,Wiiu,Wii,Gamecube',57),('GCS-50',6,'Plateado',2,'2025-02-09','Ya esta listo, solo de probar, sigue en inventario.',25.00,'','Gamecube,Wii,WiiU,Switch',58),('GCS-51',6,'Plateado',2,'2025-02-09','Ya esta listo, solo de probar, sigue en inventario.',25.00,'','Gamecube,Wii,WiiU,Switch',59),('GCS-6',6,'\nPlateado',2,'2024-11-20','Revisado, T3',30.00,'','Switch,Wiiu,Wii,Gamecube',60),('GCS-7',6,'Pleteado',2,'2024-11-20','Revisado, T3, sigue en inventario.',30.00,'','Switch,Wiiu,Wii,Gamecube',61),('GCS-74',6,'Plateado',2,'2025-02-12','Listo, solo de probar, sigue en inventario.',25.00,'','Gamecube,Wii,WiiU,Switch',62),('GCS-75',6,'Plateado',2,'2025-02-12','Listo, solo de probar',25.00,'','Gamecube,Wii,WiiU,Switch',63),('GCS-77',6,'N/A',8,'2025-07-27','',46.56,'N/A','Gamecube',77),('GCS-8',6,'Plateado',2,'2024-11-20','Revisado, sigue en inventario.',25.00,'','',64),('GCS-9',6,'Plateado',2,'2024-11-20','Revisado, sigue en inventario.',25.00,'','Switch,Wiiu,Wii,Gamecube',65),('GCSM4-52',9,'Amarillo',2,'2025-02-09','Ya esta listo, solo de probar',30.00,'','Gamecube,Wii,WiiU,Switch',66),('GCW-1',4,'Blanco',1,'2024-11-17','Minimo trabajo solo preparar para la foto',45.00,'N/A','Gamecube,Wii,Wii U,Switch',67),('GCW-2',4,'Blanco',8,'2024-11-20','Revisado, T3',45.00,'','Gamecube,Wii,Wiiu,Switch',68),('GCW-3',4,'Blanco',2,'2024-11-20','Revisado, T3',45.00,'','Gamecube,Wii,Wiiu,Switch',69),('GCW-4',4,'Blanco',2,'2024-11-20','Revisado, T3, sigue en inventario.',45.00,'','Switch,Wiiu,Wii,Gamecube',70),('GCW-43',4,'Blanco',2,'2025-01-08','Ya esta listo, solo de probar. T3, sigue en inventario.',45.00,'','WiiU,Wii,GameCube,Switch',71),('GCW-44',4,'Blanco',2,'2025-01-08','Ya esta listo, solo de probar. T3, sigue en inventario.',45.00,'','WiiU,Wii,GameCube,Switch',72),('GCW-45',4,'Blanco',2,'2025-01-08','Ya esta listo, solo de probar. T3, sigue en inventario.',45.00,'','WiiU,Wii,GameCube,Switch',73),('GCW-46',4,'Blanco',2,'2025-02-09','Revisado, T3',45.00,'','Gamecube,Wii,WiiU,Switch',74),('GCW-47',4,'Blanco',2,'2025-02-09','Ya esta listo, solo de probar',45.00,'','Gamecube,Wii,WiiU,Switch',75),('GPB-87',19,'Negro',2,'2025-09-04','Listo',30.00,'','Gamecube',87),('GPI-88',20,'Indigo',2,'2025-09-04','Listo',30.00,'','Gamecube',88),('GPI-89',20,'Indigo',2,'2025-09-04','Listo',30.00,'','Gamecube',89),('GPI-90',20,'Indigo',2,'2025-09-04','Listo',30.00,'','Gamecube',90),('GPS-82',18,'Plateado',2,'2025-09-04','Listo',30.00,'','GameCube',82),('GPS-83',18,'Plateado',2,'2025-09-04','Listo',30.00,'','',83),('GPS-84',18,'Plateado',2,'2025-09-04','Listo',30.00,'','Gamecube',84),('GPS-85',18,'Plateado',2,'2025-09-04','Listo',30.00,'','Gamecube',85),('GPS-86',18,'Plateado',2,'2025-09-04','Listo',30.00,'','Gamecube',86),('N64CH-96',24,'Azul',2,'2025-09-05','Revisar',30.00,'','N64',96),('N64CH-97',24,'Rojo',2,'2025-09-05','Revisar',30.00,'','N64',97),('N64CH-98',24,'Negro',2,'2025-09-05','Revisar',30.00,'','N64',98),('N64CH-99',24,'Transparente',2,'2025-09-05','Revisar',30.00,'','N64',99),('N64CH23-92',23,'Azul',7,'2025-09-05','Revisar',30.00,'','',92),('N64CH23-93',23,'Rojo',7,'2025-09-05','Revisar',30.00,'','N64',93),('N64CH23-94',23,'Negro',7,'2025-09-05','Revisar',30.00,'','N64',94),('N64CH23-95',23,'Transparente',7,'2025-09-05','Revisar',30.00,'','N64',95),('PGBASP22-91',22,'Transparente',1,'2025-09-04','Listo',3.50,'','',91),('PS1G-117',34,'Gris',2,'2025-09-05','Revisar funciones y limpiar',10.00,'','PS1',117),('PS1G-118',34,'Gris',2,'2025-09-05','Revisar funciones y limpiar',10.00,'','',118),('PS1G34-113',34,'Gris',7,'2025-09-05','Revisar funciones y limpiar',10.00,'','',113),('PS1G34-114',34,'Gris',7,'2025-09-05','Revisar funciones y limpiar',10.00,'','PS1',114),('PS2AC-126',35,'Original Negro',2,'2025-09-05','Revisar funciones y limpiar',10.00,'','PS2',126),('PS2AC-127',35,'Original negro',2,'2025-09-05','Revisar funciones y limpiar',10.00,'','PS2',127),('PS2AC135-124',35,'Original',7,'2025-09-05','Revisar funciones y limpiar',10.00,'','PS2',124),('PS2AC135-125',35,'Original',7,'2025-09-05','Revisar funciones y limpiar',10.00,'','PS2',125),('PS2CBL-115',32,'Negro',2,'2025-09-05','Revisar funciones y limpiar',10.00,'','PS2',115),('PS2CBL-116',32,'Negro',2,'2025-09-05','Revisar funciones y limpiar',10.00,'','PS2',116),('PS2CBL32-111',32,'Negro',7,'2025-09-05','Revisar funciones y limpiar',10.00,'','PS2',111),('PS2CBL32-112',32,'Negro',7,'2025-09-05','Revisar funciones y limpiar',10.00,'','PS2',112),('PS2CW-119',33,'Blanco',2,'2025-09-05','Revisar funciones y limpiar',10.00,'','PS2',119),('PS2CW-120',33,'Blanco',2,'2025-09-05','Revisar funciones y limpiar',10.00,'','PS2',120),('PS2CW-121',33,'Blanco',2,'2025-09-05','Revisar funciones y limpiar',10.00,'','PS2',121),('PS2CW-122',33,'Blanco',2,'2025-09-05','Revisar funciones y limpiar',10.00,'','PS2',122),('PS2CW-123',33,'Blanco',7,'2025-09-05','Revisar funciones y limpiar',10.00,'','PS2',123),('PS2O-128',36,'Negro Original',2,'2025-09-05','Revisar funciones y limpiar',10.00,'','PS2',128),('SFCM-110',31,'Original',2,'2025-09-05','Revisar funcion',10.00,'','Super Famicom Mini',110);
/*!40000 ALTER TABLE `accesoriosbase` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_Insert_Historial_Accesorio` AFTER INSERT ON `accesoriosbase` FOR EACH ROW BEGIN
    INSERT INTO HistorialEstadoAccesorio (CodigoAccesorio, EstadoAnterior, EstadoNuevo, FechaCambio)
    VALUES (NEW.CodigoAccesorio, NULL, NEW.EstadoAccesorio, NOW());
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_Historial_Estado_Accesorio` BEFORE UPDATE ON `accesoriosbase` FOR EACH ROW BEGIN
    IF OLD.EstadoAccesorio <> NEW.EstadoAccesorio THEN
        INSERT INTO HistorialEstadoAccesorio (CodigoAccesorio, EstadoAnterior, EstadoNuevo, FechaCambio)
        VALUES (OLD.CodigoAccesorio, OLD.EstadoAccesorio, NEW.EstadoAccesorio, NOW());
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `carritoventas`
--

DROP TABLE IF EXISTS `carritoventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carritoventas` (
  `IdCarritoPK` int NOT NULL AUTO_INCREMENT,
  `IdUsuarioFK` int NOT NULL,
  `IdClienteFK` int DEFAULT NULL,
  `FechaCreacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Comentario` varchar(10000) DEFAULT NULL,
  `EstadoCarrito` varchar(50) DEFAULT 'En curso',
  PRIMARY KEY (`IdCarritoPK`),
  KEY `IdUsuarioFK` (`IdUsuarioFK`),
  KEY `IdClienteFK` (`IdClienteFK`),
  CONSTRAINT `carritoventas_ibfk_1` FOREIGN KEY (`IdUsuarioFK`) REFERENCES `usuarios` (`IdUsuarioPK`),
  CONSTRAINT `carritoventas_ibfk_2` FOREIGN KEY (`IdClienteFK`) REFERENCES `clientes` (`IdClientePK`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carritoventas`
--

LOCK TABLES `carritoventas` WRITE;
/*!40000 ALTER TABLE `carritoventas` DISABLE KEYS */;
INSERT INTO `carritoventas` VALUES (2,2,1,'2025-07-27 21:52:50',NULL,'Completado'),(8,2,2,'2025-07-27 22:31:59',NULL,'Completado'),(9,2,1,'2025-07-27 22:41:12',NULL,'Completado'),(10,2,3,'2025-07-28 03:08:53',NULL,'Completado'),(11,2,4,'2025-08-02 22:46:34',NULL,'Completado'),(12,2,5,'2025-09-14 19:03:11',NULL,'Completado'),(13,2,1,'2025-09-17 21:29:50',NULL,'En curso'),(15,2,7,'2025-09-17 21:38:20',NULL,'Completado'),(16,2,7,'2025-09-17 21:42:36',NULL,'Completado');
/*!40000 ALTER TABLE `carritoventas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogoaccesorios`
--

DROP TABLE IF EXISTS `catalogoaccesorios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogoaccesorios` (
  `IdModeloAccesorioPK` int NOT NULL AUTO_INCREMENT,
  `FabricanteAccesorio` int DEFAULT NULL,
  `CategoriaAccesorio` int DEFAULT NULL,
  `SubcategoriaAccesorio` int DEFAULT NULL,
  `CodigoModeloAccesorio` varchar(25) DEFAULT NULL,
  `LinkImagen` varchar(100) DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IdModeloAccesorioPK`),
  KEY `FabricanteAccesorio` (`FabricanteAccesorio`),
  KEY `CategoriaAccesorio` (`CategoriaAccesorio`),
  KEY `SubcategoriaAccesorio` (`SubcategoriaAccesorio`),
  CONSTRAINT `catalogoaccesorios_ibfk_1` FOREIGN KEY (`FabricanteAccesorio`) REFERENCES `fabricanteaccesorios` (`IdFabricanteAccesorioPK`),
  CONSTRAINT `catalogoaccesorios_ibfk_2` FOREIGN KEY (`CategoriaAccesorio`) REFERENCES `categoriasaccesorios` (`IdCategoriaAccesorioPK`),
  CONSTRAINT `catalogoaccesorios_ibfk_3` FOREIGN KEY (`SubcategoriaAccesorio`) REFERENCES `subcategoriasaccesorios` (`IdSubcategoriaAccesorio`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogoaccesorios`
--

LOCK TABLES `catalogoaccesorios` WRITE;
/*!40000 ALTER TABLE `catalogoaccesorios` DISABLE KEYS */;
INSERT INTO `catalogoaccesorios` VALUES (1,1,1,1,'GCCI','Control-gamecube-indigo-1731881674968.webp',1),(2,1,1,2,'GCB','control-gamecube-jet-black-1731881751925.png',1),(3,1,1,3,'GCO','Control-gamecube-orange-1731881923884.jpg',1),(4,1,1,4,'GCW','control-gamecube-blanco-1731882069279.jpg',1),(5,1,1,5,'GCE','control-gamecube-emerald-green-1731883684410.jpg',1),(6,1,1,6,'GCS','control-gamecube-silver-1731883795802.png',1),(7,1,1,7,'GCD','control-gamecube-gold-1731883911097.webp',1),(8,1,1,8,'GCM','control-gamecube-club-nintendo-mario-1731884118262.webp',1),(9,1,1,9,'GCSM4','control-gamecube-smash4-1731884199810.jpg',1),(10,1,1,10,'GCSMU','control-gamecube-smashu-1731884286819.jpg',1),(11,1,1,12,'CGWB11','upload.wikimedia.org/wikipedia/commons/9/91/Nintendo-GameCube-Wavebird-Silver.jpg',0),(12,1,1,12,'CGWB','Nintendo-GameCube-Wavebird-Silver-1757021807139.jpg',0),(13,1,1,13,'CGWB13','Nintendo-GameCube-Wavebird-Silver-1757022104098.jpg',0),(14,1,1,13,'GCWB','Nintendo-GameCube-Wavebird-Silver.jpg',0),(15,1,1,13,'GCWB','Nintendo-GameCube-Wavebird-Silver-1757022797046.jpg',0),(16,1,1,13,'GCWB16','Nintendo-GameCube-Wavebird-Silver-1757022797046-1757022930646.jpg',0),(17,1,1,13,'GCWB','Nintendo-GameCube-Wavebird-Silver-1757023335415.jpg',1),(18,1,4,15,'GPS','Gameboy player silver-1757023933092.jpg',1),(19,1,4,16,'GPB','Gameboy player black-1757023957116.jpg',1),(20,1,4,17,'GPI','Gameboy player indigo-1757023983019.jpg',1),(21,1,5,18,'PGBSPT21','Screenshot 2025-09-04 183316-1757032440281.png',0),(22,1,5,19,'PGBASP22','Sf736dd72422c4bbdb6d0523bc0191e64G.jpg_640x640q90-1757032571731.webp',1),(23,1,6,20,'N64CH','s-l1200-1757112632505.jpg',0),(24,1,7,21,'N64CH','s-l1200-1757113065561.jpg',1),(25,1,8,23,'DSBT','51YdIXT8mGL._UF894,1000_QL80_-1757114014062.jpg',0),(26,1,9,24,'GBFCGB','41+KPysOEbL._UF894,1000_QL80_-1757114309165.jpg',1),(27,3,10,25,'DCC','the-dreamcast-controller-is-the-controller-sega-has-ever-v0-oqsoltm3zbu81-1757114813682.webp',1),(28,3,11,26,'DCVMUA','Sega-Dreamcast-VMU-1757115188026.jpg',1),(29,3,11,27,'DCVMUJ','$_57-1757115252409.JPG',1),(30,1,12,28,'GBASPAC','61w-Cu5zDIL._AC_SL1500_-1757115943271.jpg',1),(31,1,14,30,'SFCM','D_NQ_NP_670000-MLA78249491306_082024-O-1757116278664.webp',1),(32,2,2,31,'PS2CBL','D_NQ_NP_939177-MLU54965102209_042023-O-1757116902641.webp',1),(33,2,2,11,'PS2CW','51py2DFuKAL-1757116930652.jpg',1),(34,2,15,32,'PS1G','PSX-Original-Controller-1757116963437.jpg',1),(35,2,16,33,'PS2AC','614Zs6GYitL._AC_SL1500_-1757118939380.jpg',1),(36,2,17,35,'PS2O','7126d6iqShL-1757119018522.jpg',1),(37,1,8,37,'BTDSL','51YdIXT8mGL._UF894,1000_QL80_-1757120115180.jpg',1);
/*!40000 ALTER TABLE `catalogoaccesorios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogoconsolas`
--

DROP TABLE IF EXISTS `catalogoconsolas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogoconsolas` (
  `IdModeloConsolaPK` int NOT NULL AUTO_INCREMENT,
  `Fabricante` int DEFAULT NULL,
  `Categoria` int DEFAULT NULL,
  `Subcategoria` int DEFAULT NULL,
  `CodigoModeloConsola` varchar(25) DEFAULT NULL,
  `LinkImagen` varchar(100) DEFAULT NULL,
  `TipoProducto` int DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IdModeloConsolaPK`),
  KEY `TipoProducto` (`TipoProducto`),
  KEY `Fabricante` (`Fabricante`),
  KEY `Categoria` (`Categoria`),
  KEY `Subcategoria` (`Subcategoria`),
  CONSTRAINT `catalogoconsolas_ibfk_1` FOREIGN KEY (`TipoProducto`) REFERENCES `tiposproductos` (`IdTipoProductoPK`),
  CONSTRAINT `catalogoconsolas_ibfk_2` FOREIGN KEY (`Fabricante`) REFERENCES `fabricantes` (`IdFabricantePK`),
  CONSTRAINT `catalogoconsolas_ibfk_3` FOREIGN KEY (`Categoria`) REFERENCES `categoriasproductos` (`IdCategoriaPK`),
  CONSTRAINT `catalogoconsolas_ibfk_4` FOREIGN KEY (`Subcategoria`) REFERENCES `subcategoriasproductos` (`IdSubcategoria`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogoconsolas`
--

LOCK TABLES `catalogoconsolas` WRITE;
/*!40000 ALTER TABLE `catalogoconsolas` DISABLE KEYS */;
INSERT INTO `catalogoconsolas` VALUES (1,1,5,37,'NDSi1','ndsi.jpg',4,1),(2,1,1,2,'GCI','gamecube-indigo.jpg',1,1),(3,1,1,3,'GCJB','gamecube-jet-black.jpg',1,1),(4,1,1,4,'GCPS','gamecube-platinum-silver.jpg',1,1),(5,1,1,5,'GCSO','gamecube-spice-orange.jpg',1,1),(6,1,1,6,'GCPW','gamecube-pearl-white.webp',1,1),(7,1,1,7,'GCME','gamecube-metroid.webp',1,1),(8,1,2,8,'O3DS','n3ds.jpg',4,1),(9,1,2,9,'O3DSXL','n3dsxl.jpg',4,1),(10,1,2,10,'O2DS','2ds.jpg',4,1),(11,1,2,11,'N3DS','new3ds.jpg',4,1),(12,1,2,12,'N3DSXL','new3dsstockimage.png',4,1),(13,1,2,13,'N2DSXL','new2dsxl.jpg',4,1),(14,1,3,14,'N64CHAR','n64-standar-charcoal.jpg',1,1),(15,1,3,15,'N64JG','n64-jungle-green.webp',1,1),(16,1,3,16,'N64IB','n64-ice-blue.jpg',1,1),(17,1,3,17,'N64GP','n64-grape-purple.jpg',1,1),(18,1,3,18,'N64FO','n64-fire-orange.jpg',1,1),(19,1,3,19,'N64CB','n64-clear-black.jpg',1,1),(20,1,3,20,'N64WR','ng64-watermelon-red.jpg',1,1),(21,1,3,21,'N64WB','n64-clear-white-blue.jpg',1,1),(22,1,3,22,'N64WR','n64-clear-white-red.jpg',1,1),(23,1,3,23,'N64DPIK','n64-pikachu-dark-blue.jpg',1,1),(24,1,3,24,'N64LPIK','n64-pikachu-light-blue.JPG',1,1),(25,1,3,25,'N64OPIK','n64-pikachu-orange.jpg',1,1),(26,1,3,26,'N64BS','n64-battleset.png',1,1),(27,1,3,27,'N64G','n64-gold.jpg',1,1),(28,1,4,28,'GBO','gameboy.jpg',4,1),(29,1,4,29,'GBP','gameboy-pocket.jpg',4,1),(30,1,4,30,'GBL','gameboy-light.jpg',4,1),(31,1,4,31,'GBC','gameboy-color.jpg',4,1),(32,1,4,32,'GBA','gameboy-advance.jpg',4,1),(33,1,4,33,'GBASP','gameboy-advance-sp.jpeg',4,1),(34,1,4,34,'GBMIC','gameboy-micro.jpg',4,1),(35,1,5,35,'NDS','nds.jpg',4,1),(36,1,5,36,'NDSL','ndslite.jpg',4,1),(37,1,5,38,'NDSIXL','ndsixl.webp',4,1),(38,1,6,39,'WU8GB','wiiu-wup-001.jpg',1,1),(39,1,6,40,'WU32GB','wiiu-wup-101.webp',2,1),(40,1,7,41,'WIIWHT','wii-white.jpg',1,1),(41,1,7,42,'WIIBLCK','wii-black.jpg',1,1),(42,1,7,43,'WIIMINI','wii-mini.jpeg',1,1),(43,1,7,44,'WIILB','wii-light-blue.webp',1,1),(44,1,8,57,'SWV1','switchv1.jpg',1,1),(45,1,8,58,'SWV2','switchv2.jpg',1,1),(46,1,8,59,'SWLITE','switchlite.jpeg',1,1),(47,1,8,60,'SWOLED','switcholed.jpeg',1,1),(48,2,9,45,'PS2FAT1','ps2fat500xx.jpg',1,1),(49,2,9,46,'PS2FAT2','ps2fat500xx.jpg',1,1),(50,2,9,47,'PS2FAT3','ps2fat500xx.jpg',1,1),(51,2,9,48,'PS2FAT4','ps2fat500xx.jpg',1,1),(52,2,9,49,'PS2FAT5','ps2fat500xx.jpg',1,1),(53,2,9,50,'PS2FAT6','ps2fat500xx.jpg',1,1),(54,2,10,51,'PS2SLIM','ps2slim900xx.jpg',1,1),(55,2,10,52,'PS2SLIM1','ps2slim900xx.jpg',1,1),(56,2,10,53,'PS2SLIM2','ps2slim900xx.jpg',1,1),(57,2,10,54,'PS2SLIM3','ps2slim900xx.jpg',1,1),(58,2,10,55,'PS2SLIM4','ps2slim900xx.jpg',1,1),(59,1,13,61,'NES','nesstandar.jpg',1,1),(60,1,13,62,'NESM','famicom-nes-classic-mini.jpg',1,1),(61,1,14,63,'SNES','snes.jpeg',1,1),(62,1,14,64,'SNESM','supersnes-famicom-classic.webp',1,1),(63,7,15,65,'DRM','320px-Dreamcast.jpg',1,1),(64,1,6,68,'WU32GB','WiiU32-1757025881959.jpg',1,1),(65,1,1,72,'GCCSG','cleargreenshell-1757030376165.webp',1,0),(66,1,1,71,'CGCSB','clearblueshell-1757030407267.webp',1,0),(67,1,1,70,'CGCSBL','TRNBlack1_retro-scaler-ngc-replacement-case-transpa_variants-1-1757030441371.webp',1,0),(68,1,1,69,'CGCGI','Clearpurple1-1757030467737.webp',1,0),(69,1,1,73,'CGCS','GCYoeiShells-1757031397760.jpg',1,1);
/*!40000 ALTER TABLE `catalogoconsolas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogoestadosconsolas`
--

DROP TABLE IF EXISTS `catalogoestadosconsolas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogoestadosconsolas` (
  `CodigoEstado` int NOT NULL AUTO_INCREMENT,
  `DescripcionEstado` varchar(100) NOT NULL,
  PRIMARY KEY (`CodigoEstado`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogoestadosconsolas`
--

LOCK TABLES `catalogoestadosconsolas` WRITE;
/*!40000 ALTER TABLE `catalogoestadosconsolas` DISABLE KEYS */;
INSERT INTO `catalogoestadosconsolas` VALUES (1,'Nuevo'),(2,'Usado'),(3,'Para piezas'),(4,'Personalizado'),(5,'Reparado'),(6,'A reparar'),(7,'Borrado'),(8,'Vendido'),(9,'En garantia'),(10,'Descargado'),(11,'En proceso de venta');
/*!40000 ALTER TABLE `catalogoestadosconsolas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogoinsumos`
--

DROP TABLE IF EXISTS `catalogoinsumos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogoinsumos` (
  `IdModeloInsumosPK` int NOT NULL AUTO_INCREMENT,
  `FabricanteInsumos` int DEFAULT NULL,
  `CategoriaInsumos` int DEFAULT NULL,
  `SubcategoriaInsumos` int DEFAULT NULL,
  `CodigoModeloInsumos` varchar(25) DEFAULT NULL,
  `LinkImagen` varchar(100) DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IdModeloInsumosPK`),
  KEY `FabricanteInsumos` (`FabricanteInsumos`),
  KEY `CategoriaInsumos` (`CategoriaInsumos`),
  KEY `SubcategoriaInsumos` (`SubcategoriaInsumos`),
  CONSTRAINT `catalogoinsumos_ibfk_1` FOREIGN KEY (`FabricanteInsumos`) REFERENCES `fabricanteinsumos` (`IdFabricanteInsumosPK`),
  CONSTRAINT `catalogoinsumos_ibfk_2` FOREIGN KEY (`CategoriaInsumos`) REFERENCES `categoriasinsumos` (`IdCategoriaInsumosPK`),
  CONSTRAINT `catalogoinsumos_ibfk_3` FOREIGN KEY (`SubcategoriaInsumos`) REFERENCES `subcategoriasinsumos` (`IdSubcategoriaInsumos`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogoinsumos`
--

LOCK TABLES `catalogoinsumos` WRITE;
/*!40000 ALTER TABLE `catalogoinsumos` DISABLE KEYS */;
INSERT INTO `catalogoinsumos` VALUES (1,1,1,1,'JMPA1','joystickpowera.webp',1),(2,1,2,2,'HWFLY2','hwfly.jpg',1),(3,1,3,3,'PICOFLY3','rp2040-tiny-3.jpg',1),(4,2,4,5,'SDK-3DS4','Kingston SD.jpg',1);
/*!40000 ALTER TABLE `catalogoinsumos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogotiposaccesoriosxproducto`
--

DROP TABLE IF EXISTS `catalogotiposaccesoriosxproducto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogotiposaccesoriosxproducto` (
  `IdCatalogoAccesorioXProductoPK` int NOT NULL AUTO_INCREMENT,
  `IdTipoAccesorioFK` int DEFAULT NULL,
  `IdTipoProductoFK` int DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IdCatalogoAccesorioXProductoPK`),
  KEY `IdTipoAccesorioFK` (`IdTipoAccesorioFK`),
  KEY `IdTipoProductoFK` (`IdTipoProductoFK`),
  CONSTRAINT `catalogotiposaccesoriosxproducto_ibfk_1` FOREIGN KEY (`IdTipoAccesorioFK`) REFERENCES `tiposaccesorios` (`IdTipoAccesorioPK`),
  CONSTRAINT `catalogotiposaccesoriosxproducto_ibfk_2` FOREIGN KEY (`IdTipoProductoFK`) REFERENCES `tiposproductos` (`IdTipoProductoPK`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogotiposaccesoriosxproducto`
--

LOCK TABLES `catalogotiposaccesoriosxproducto` WRITE;
/*!40000 ALTER TABLE `catalogotiposaccesoriosxproducto` DISABLE KEYS */;
INSERT INTO `catalogotiposaccesoriosxproducto` VALUES (1,1,1,1),(2,2,1,1),(3,4,1,1),(4,5,1,1),(5,2,2,1),(6,3,2,1),(7,5,2,1),(8,5,3,1),(9,5,4,1);
/*!40000 ALTER TABLE `catalogotiposaccesoriosxproducto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoriasaccesorios`
--

DROP TABLE IF EXISTS `categoriasaccesorios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoriasaccesorios` (
  `IdCategoriaAccesorioPK` int NOT NULL AUTO_INCREMENT,
  `NombreCategoriaAccesorio` varchar(100) DEFAULT NULL,
  `IdFabricanteAccesorioFK` int DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IdCategoriaAccesorioPK`),
  KEY `IdFabricanteAccesorioFK` (`IdFabricanteAccesorioFK`),
  CONSTRAINT `categoriasaccesorios_ibfk_1` FOREIGN KEY (`IdFabricanteAccesorioFK`) REFERENCES `fabricanteaccesorios` (`IdFabricanteAccesorioPK`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoriasaccesorios`
--

LOCK TABLES `categoriasaccesorios` WRITE;
/*!40000 ALTER TABLE `categoriasaccesorios` DISABLE KEYS */;
INSERT INTO `categoriasaccesorios` VALUES (1,'Control de Gamecube',1,1),(2,'Dual Shock 2',2,1),(3,'Gameboy Player GC',1,0),(4,'GameBoy Player',1,1),(5,'Protector',1,1),(6,'Control N64',1,0),(7,'Control de N64',1,1),(8,'Bateria',1,1),(9,'GameBoy Flash Card',1,1),(10,'Control de Dreamcast',3,1),(11,'Memoria VMU',3,1),(12,'Cargador/AC',1,1),(13,'Control mini',1,0),(14,'Control de Super Famicom',1,1),(15,'DualDigital',2,1),(16,'Cable de poder/AC',2,1),(17,'Cable de Video',2,1),(18,'Cargador',4,1);
/*!40000 ALTER TABLE `categoriasaccesorios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoriasinsumos`
--

DROP TABLE IF EXISTS `categoriasinsumos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoriasinsumos` (
  `IdCategoriaInsumosPK` int NOT NULL AUTO_INCREMENT,
  `NombreCategoriaInsumos` varchar(100) DEFAULT NULL,
  `IdFabricanteInsumosFK` int DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IdCategoriaInsumosPK`),
  KEY `IdFabricanteInsumosFK` (`IdFabricanteInsumosFK`),
  CONSTRAINT `categoriasinsumos_ibfk_1` FOREIGN KEY (`IdFabricanteInsumosFK`) REFERENCES `fabricanteinsumos` (`IdFabricanteInsumosPK`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoriasinsumos`
--

LOCK TABLES `categoriasinsumos` WRITE;
/*!40000 ALTER TABLE `categoriasinsumos` DISABLE KEYS */;
INSERT INTO `categoriasinsumos` VALUES (1,'Joystick Magnetico',1,1),(2,'Chip HWFLY',1,1),(3,'RP 2040',1,1),(4,'Micro SD',2,1),(5,'Soldadura\n',1,1);
/*!40000 ALTER TABLE `categoriasinsumos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoriasproductos`
--

DROP TABLE IF EXISTS `categoriasproductos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoriasproductos` (
  `IdCategoriaPK` int NOT NULL AUTO_INCREMENT,
  `NombreCategoria` varchar(100) DEFAULT NULL,
  `IdFabricanteFK` int DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IdCategoriaPK`),
  KEY `IdFabricanteFK` (`IdFabricanteFK`),
  CONSTRAINT `categoriasproductos_ibfk_1` FOREIGN KEY (`IdFabricanteFK`) REFERENCES `fabricantes` (`IdFabricantePK`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoriasproductos`
--

LOCK TABLES `categoriasproductos` WRITE;
/*!40000 ALTER TABLE `categoriasproductos` DISABLE KEYS */;
INSERT INTO `categoriasproductos` VALUES (1,'Gamecube',1,1),(2,'3DS',1,1),(3,'Nintendo 64',1,1),(4,'Gameboy',1,1),(5,'Nintendo DS',1,1),(6,'Wii U',1,1),(7,'Wii',1,1),(8,'Switch',1,1),(9,'Play Station 2 - FAT',2,1),(10,'Play Station 2 - SLIM',2,1),(11,'Xbox 360',3,1),(12,'Xbox 360 S',3,1),(13,'NES',1,1),(14,'SNES',1,1),(15,'Dreamcast',7,1);
/*!40000 ALTER TABLE `categoriasproductos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `IdClientePK` int NOT NULL AUTO_INCREMENT,
  `NombreCliente` varchar(255) NOT NULL,
  `DNI` varchar(255) DEFAULT NULL,
  `RUC` varchar(255) DEFAULT NULL,
  `Telefono` varchar(255) DEFAULT NULL,
  `CorreoElectronico` varchar(255) DEFAULT NULL,
  `Direccion` varchar(255) DEFAULT NULL,
  `FechaRegistro` date DEFAULT NULL,
  `Estado` tinyint(1) NOT NULL DEFAULT '1',
  `Comentarios` varchar(10000) DEFAULT NULL,
  PRIMARY KEY (`IdClientePK`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Cliente final','','','','a@a.com','','2025-07-27',1,NULL),(2,'Francisco','','','+50578216598','a@a.com','','2025-07-27',1,NULL),(3,'Elias Hurtado','','','','a@a.com','','2025-07-27',1,NULL),(4,'Flor Martinez','','','50587872758','','','2025-08-02',1,''),(5,'Marcio Berrios','','','+50586712853','','','2025-09-14',1,''),(6,'Rommel Maltez','','','50581969267','','','2025-09-16',1,''),(7,'Alejandro CE','','','+50581338355','','Bolonia, PriceSmart 50Mts al Lago','2025-09-17',1,'Dueño de PlayNow');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `costosdistribucionpormodelo`
--

DROP TABLE IF EXISTS `costosdistribucionpormodelo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `costosdistribucionpormodelo` (
  `IdCostoDistribucionPK` int NOT NULL AUTO_INCREMENT,
  `IdModeloFK` int NOT NULL,
  `TipoArticuloFK` int NOT NULL,
  `PorcentajeAsignado` decimal(5,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`IdCostoDistribucionPK`),
  UNIQUE KEY `idx_modelo_tipo` (`IdModeloFK`,`TipoArticuloFK`),
  KEY `TipoArticuloFK` (`TipoArticuloFK`),
  CONSTRAINT `costosdistribucionpormodelo_ibfk_1` FOREIGN KEY (`TipoArticuloFK`) REFERENCES `tipoarticulo` (`IdTipoArticuloPK`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `costosdistribucionpormodelo`
--

LOCK TABLES `costosdistribucionpormodelo` WRITE;
/*!40000 ALTER TABLE `costosdistribucionpormodelo` DISABLE KEYS */;
INSERT INTO `costosdistribucionpormodelo` VALUES (1,2,1,100.00),(3,12,1,30.00),(4,9,1,20.00),(5,8,1,50.00),(36,4,3,100.00);
/*!40000 ALTER TABLE `costosdistribucionpormodelo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalleaccesoriopedido`
--

DROP TABLE IF EXISTS `detalleaccesoriopedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalleaccesoriopedido` (
  `IdDetalleAccesorioPedidoPK` int NOT NULL AUTO_INCREMENT,
  `IdAccesorioBaseFK` varchar(25) NOT NULL,
  `IdCodigoPedidoFK` varchar(25) NOT NULL,
  `EnlaceArticulo` varchar(1000) DEFAULT NULL,
  `Comentario` varchar(10000) DEFAULT NULL,
  PRIMARY KEY (`IdDetalleAccesorioPedidoPK`),
  KEY `IdAccesorioBaseFK` (`IdAccesorioBaseFK`),
  KEY `IdCodigoPedidoFK` (`IdCodigoPedidoFK`),
  CONSTRAINT `detalleaccesoriopedido_ibfk_1` FOREIGN KEY (`IdAccesorioBaseFK`) REFERENCES `accesoriosbase` (`CodigoAccesorio`),
  CONSTRAINT `detalleaccesoriopedido_ibfk_2` FOREIGN KEY (`IdCodigoPedidoFK`) REFERENCES `pedidobase` (`CodigoPedido`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalleaccesoriopedido`
--

LOCK TABLES `detalleaccesoriopedido` WRITE;
/*!40000 ALTER TABLE `detalleaccesoriopedido` DISABLE KEYS */;
INSERT INTO `detalleaccesoriopedido` VALUES (1,'GCO-76','P-03032025-4',NULL,'P-03032025-4'),(2,'GCS-77','P-27072025-6',NULL,'');
/*!40000 ALTER TABLE `detalleaccesoriopedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detallecarritoventas`
--

DROP TABLE IF EXISTS `detallecarritoventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detallecarritoventas` (
  `IdDetalleCarritoPK` int NOT NULL AUTO_INCREMENT,
  `IdCarritoFK` int NOT NULL,
  `TipoArticulo` enum('Producto','Accesorio','Insumo','Servicio') NOT NULL,
  `CodigoArticulo` varchar(25) NOT NULL,
  `PrecioVenta` decimal(10,2) NOT NULL,
  `Descuento` decimal(10,2) DEFAULT '0.00',
  `SubtotalSinIVA` decimal(10,2) NOT NULL,
  `Cantidad` int unsigned DEFAULT '1',
  `PrecioBaseOriginal` decimal(10,2) NOT NULL,
  `MargenAplicado` decimal(5,2) NOT NULL,
  PRIMARY KEY (`IdDetalleCarritoPK`),
  KEY `IdCarritoFK` (`IdCarritoFK`),
  CONSTRAINT `detallecarritoventas_ibfk_1` FOREIGN KEY (`IdCarritoFK`) REFERENCES `carritoventas` (`IdCarritoPK`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detallecarritoventas`
--

LOCK TABLES `detallecarritoventas` WRITE;
/*!40000 ALTER TABLE `detallecarritoventas` DISABLE KEYS */;
INSERT INTO `detallecarritoventas` VALUES (14,13,'Producto','N3DSXL-89',200.00,0.00,200.00,1,112.61,-1.00);
/*!40000 ALTER TABLE `detallecarritoventas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalleinsumopedido`
--

DROP TABLE IF EXISTS `detalleinsumopedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalleinsumopedido` (
  `IdDetalleInsumoPedidoPK` int NOT NULL AUTO_INCREMENT,
  `IdInsumoBaseFK` varchar(25) NOT NULL,
  `IdCodigoPedidoFK` varchar(25) NOT NULL,
  `EnlaceArticulo` varchar(1000) DEFAULT NULL,
  `Comentario` varchar(10000) DEFAULT NULL,
  PRIMARY KEY (`IdDetalleInsumoPedidoPK`),
  KEY `IdInsumoBaseFK` (`IdInsumoBaseFK`),
  KEY `IdCodigoPedidoFK` (`IdCodigoPedidoFK`),
  CONSTRAINT `detalleinsumopedido_ibfk_1` FOREIGN KEY (`IdInsumoBaseFK`) REFERENCES `insumosbase` (`CodigoInsumo`),
  CONSTRAINT `detalleinsumopedido_ibfk_2` FOREIGN KEY (`IdCodigoPedidoFK`) REFERENCES `pedidobase` (`CodigoPedido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalleinsumopedido`
--

LOCK TABLES `detalleinsumopedido` WRITE;
/*!40000 ALTER TABLE `detalleinsumopedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalleinsumopedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detallenotacredito`
--

DROP TABLE IF EXISTS `detallenotacredito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detallenotacredito` (
  `IdDetalleNotaPK` int NOT NULL AUTO_INCREMENT,
  `IdNotaCreditoFK` int NOT NULL,
  `TipoArticulo` enum('Producto','Accesorio','Insumo','Servicio') NOT NULL,
  `CodigoArticulo` varchar(25) NOT NULL,
  `Cantidad` int unsigned DEFAULT '1',
  `PrecioUnitario` decimal(10,2) DEFAULT NULL,
  `Subtotal` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`IdDetalleNotaPK`),
  KEY `IdNotaCreditoFK` (`IdNotaCreditoFK`),
  CONSTRAINT `detallenotacredito_ibfk_1` FOREIGN KEY (`IdNotaCreditoFK`) REFERENCES `notascredito` (`IdNotaCreditoPK`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detallenotacredito`
--

LOCK TABLES `detallenotacredito` WRITE;
/*!40000 ALTER TABLE `detallenotacredito` DISABLE KEYS */;
INSERT INTO `detallenotacredito` VALUES (1,1,'Accesorio','GCS-77',1,53.43,53.43),(2,2,'Producto','GCI-22',1,1.35,1.35),(3,3,'Producto','GBASP-54',1,65.00,65.00);
/*!40000 ALTER TABLE `detallenotacredito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalleproductopedido`
--

DROP TABLE IF EXISTS `detalleproductopedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalleproductopedido` (
  `IdDetalleProcutoPedidoPK` int NOT NULL AUTO_INCREMENT,
  `IdProductoBaseFK` varchar(25) NOT NULL,
  `IdCodigoPedidoFK` varchar(25) NOT NULL,
  `EnlaceArticulo` varchar(1000) DEFAULT NULL,
  `Comentario` varchar(10000) DEFAULT NULL,
  PRIMARY KEY (`IdDetalleProcutoPedidoPK`),
  KEY `IdProductoBaseFK` (`IdProductoBaseFK`),
  KEY `IdCodigoPedidoFK` (`IdCodigoPedidoFK`),
  CONSTRAINT `detalleproductopedido_ibfk_1` FOREIGN KEY (`IdProductoBaseFK`) REFERENCES `productosbases` (`CodigoConsola`),
  CONSTRAINT `detalleproductopedido_ibfk_2` FOREIGN KEY (`IdCodigoPedidoFK`) REFERENCES `pedidobase` (`CodigoPedido`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalleproductopedido`
--

LOCK TABLES `detalleproductopedido` WRITE;
/*!40000 ALTER TABLE `detalleproductopedido` DISABLE KEYS */;
INSERT INTO `detalleproductopedido` VALUES (1,'GCPS-32','P-03032025-4',NULL,'P-03032025-4'),(2,'GCI-84','P-14092025-9',NULL,'P-14092025-9'),(3,'GCI-85','P-14092025-9',NULL,'P-14092025-9'),(4,'N3DSXL-86','P-06082025-7',NULL,'Pantalla Superior: Rota, necesita cambio\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\n\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK'),(5,'N3DSXL-87','P-06082025-7',NULL,'Pantalla Superior: Rota, necesita cambio\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\n\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK'),(6,'N3DSXL-88','P-06082025-7',NULL,'Pantalla Superior: Rota, necesita cambio\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\n\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK'),(7,'N3DSXL-89','P-06082025-7',NULL,'Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: Necesita cambio\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK'),(8,'N3DSXL-90','P-06082025-7',NULL,'Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok'),(9,'N3DSXL-91','P-06082025-7',NULL,'Firmware Brickeado\n'),(10,'N3DSXL-92','P-06082025-7',NULL,'Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok'),(11,'N3DSXL-93','P-06082025-7',NULL,'Pantalla Superior: qUEBRADA,\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok'),(12,'N3DSXL-94','P-06082025-7',NULL,'Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok'),(13,'N3DSXL-95','P-06082025-7',NULL,'Muy sucia, necesita limpieza profunda\n'),(14,'N3DSXL-96','P-06082025-7',NULL,'Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok'),(15,'N3DSXL-97','P-06082025-7',NULL,'Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok'),(16,'O3DSXL-98','P-06082025-7',NULL,'Pantalla Superior: OK\nPantalla Inferior: \nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok'),(17,'O3DSXL-99','P-06082025-7',NULL,'Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok'),(18,'O3DSXL-100','P-06082025-7',NULL,'Requiere limpieza profunda, muy sucio. Pantalla superior necesita limpieza por humedad en medio del glass\n'),(19,'O3DSXL-101','P-06082025-7',NULL,'Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok'),(20,'O3DSXL-102','P-06082025-7',NULL,'Carcasa en bastante mal estado. Forrar o cambiar\n'),(21,'O3DSXL-103','P-06082025-7',NULL,'Parece daño por humedad, se apaga al instante. Sin Carcasa Inferior\n\nPENDIENTE TODO EL DIAGNOSTICO'),(22,'O3DSXL-104','P-06082025-7',NULL,'No enciende. Pantalla superior en corto (revisar flex 3D). No Incluye carcasa inferior, no incluye bateria'),(23,'O3DSXL-105','P-06082025-7',NULL,'No Incluye carcasa inferior, no incluye bateria\n'),(24,'O3DSXL-106','P-06082025-7',NULL,'Destruido por humedad (Potencial perdida)'),(25,'O3DS-107','P-06082025-7',NULL,'Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok'),(26,'O3DS-108','P-06082025-7',NULL,'Pantalla Superior: OK,\n\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok'),(27,'O3DS-109','P-06082025-7',NULL,'Pantalla Superior: \nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok'),(28,'O3DS-110','P-06082025-7',NULL,'Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok'),(29,'O3DS-111','P-06082025-7',NULL,'Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok'),(30,'O3DS-112','P-06082025-7',NULL,'Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok'),(31,'O3DS-113','P-06082025-7',NULL,'Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok'),(32,'O3DS-114','P-06082025-7',NULL,'Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok'),(33,'O3DS-115','P-06082025-7',NULL,'Flex 3D dañado, Diagnostico pendiente. Bateria inflamada'),(34,'O3DS-116','P-06082025-7',NULL,'Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok'),(35,'O3DS-117','P-06082025-7',NULL,'Quebrado, para piezas'),(36,'O3DS-118','P-06082025-7',NULL,'Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok');
/*!40000 ALTER TABLE `detalleproductopedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalleventa`
--

DROP TABLE IF EXISTS `detalleventa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalleventa` (
  `IdDetalleVentaPK` int NOT NULL AUTO_INCREMENT,
  `IdVentaFK` int NOT NULL,
  `TipoArticulo` enum('Producto','Accesorio','Insumo','Servicio') NOT NULL,
  `CodigoArticulo` varchar(25) NOT NULL,
  `PrecioVenta` decimal(10,2) NOT NULL,
  `Descuento` decimal(10,2) DEFAULT '0.00',
  `SubtotalSinIVA` decimal(10,2) NOT NULL,
  `Cantidad` int unsigned DEFAULT '1',
  `PrecioBaseOriginal` decimal(10,2) NOT NULL,
  `MargenAplicado` decimal(5,2) NOT NULL,
  `IdMargenFK` int DEFAULT NULL COMMENT 'FK a la tabla MargenesVenta para contexto de negocio',
  PRIMARY KEY (`IdDetalleVentaPK`),
  KEY `IdVentaFK` (`IdVentaFK`),
  KEY `fk_detalleventa_margenes` (`IdMargenFK`),
  CONSTRAINT `detalleventa_ibfk_1` FOREIGN KEY (`IdVentaFK`) REFERENCES `ventasbase` (`IdVentaPK`),
  CONSTRAINT `fk_detalleventa_margenes` FOREIGN KEY (`IdMargenFK`) REFERENCES `margenesventa` (`IdMargenPK`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalleventa`
--

LOCK TABLES `detalleventa` WRITE;
/*!40000 ALTER TABLE `detalleventa` DISABLE KEYS */;
INSERT INTO `detalleventa` VALUES (1,1,'Accesorio','GCS-77',62.86,0.00,62.86,1,62.86,35.00,1),(2,2,'Accesorio','GCS-77',62.86,15.00,53.43,1,46.56,35.00,1),(3,3,'Servicio','2',108.00,25.92,80.01,1,80.00,35.00,1),(4,4,'Producto','GCI-22',1.35,0.00,1.35,1,1.00,35.00,1),(5,5,'Servicio','1',47.25,52.38,45.00,2,35.00,35.00,1),(6,6,'Servicio','8',35.00,14.28,30.00,1,35.00,0.00,5),(7,7,'Servicio','10',10.00,0.00,20.00,2,10.00,0.00,1),(8,7,'Servicio','9',25.00,20.00,20.00,1,25.00,0.00,1),(9,8,'Producto','GBASP-54',65.00,0.00,65.00,1,65.00,0.00,1),(10,9,'Producto','GBASP-50',65.00,0.00,65.00,1,65.00,0.00,1);
/*!40000 ALTER TABLE `detalleventa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadopedido`
--

DROP TABLE IF EXISTS `estadopedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadopedido` (
  `CodigoEstadoPedido` int NOT NULL AUTO_INCREMENT,
  `DescripcionEstadoPedido` varchar(100) NOT NULL,
  PRIMARY KEY (`CodigoEstadoPedido`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadopedido`
--

LOCK TABLES `estadopedido` WRITE;
/*!40000 ALTER TABLE `estadopedido` DISABLE KEYS */;
INSERT INTO `estadopedido` VALUES (1,'En espera'),(2,'En tránsito'),(3,'Recibido en Estados Unidos'),(4,'En aduana/agencia'),(5,'Recibido'),(6,'Cancelado'),(7,'Eliminado');
/*!40000 ALTER TABLE `estadopedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadousuarios`
--

DROP TABLE IF EXISTS `estadousuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadousuarios` (
  `IdEstadoPK` int NOT NULL AUTO_INCREMENT,
  `DescripcionEstado` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`IdEstadoPK`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadousuarios`
--

LOCK TABLES `estadousuarios` WRITE;
/*!40000 ALTER TABLE `estadousuarios` DISABLE KEYS */;
INSERT INTO `estadousuarios` VALUES (1,'Activo'),(2,'Inactivo');
/*!40000 ALTER TABLE `estadousuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadoventa`
--

DROP TABLE IF EXISTS `estadoventa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadoventa` (
  `IdEstadoVentaPK` int NOT NULL AUTO_INCREMENT,
  `DescripcionEstadoVenta` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`IdEstadoVentaPK`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadoventa`
--

LOCK TABLES `estadoventa` WRITE;
/*!40000 ALTER TABLE `estadoventa` DISABLE KEYS */;
INSERT INTO `estadoventa` VALUES (1,'Pendiente'),(2,'Pagado'),(3,'Anulado'),(4,'Borrado');
/*!40000 ALTER TABLE `estadoventa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fabricanteaccesorios`
--

DROP TABLE IF EXISTS `fabricanteaccesorios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fabricanteaccesorios` (
  `IdFabricanteAccesorioPK` int NOT NULL AUTO_INCREMENT,
  `NombreFabricanteAccesorio` varchar(100) DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IdFabricanteAccesorioPK`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fabricanteaccesorios`
--

LOCK TABLES `fabricanteaccesorios` WRITE;
/*!40000 ALTER TABLE `fabricanteaccesorios` DISABLE KEYS */;
INSERT INTO `fabricanteaccesorios` VALUES (1,'Nintendo',1),(2,'Sony',1),(3,'Dreamcast',1),(4,'Generico',1);
/*!40000 ALTER TABLE `fabricanteaccesorios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fabricanteinsumos`
--

DROP TABLE IF EXISTS `fabricanteinsumos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fabricanteinsumos` (
  `IdFabricanteInsumosPK` int NOT NULL AUTO_INCREMENT,
  `NombreFabricanteInsumos` varchar(100) DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IdFabricanteInsumosPK`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fabricanteinsumos`
--

LOCK TABLES `fabricanteinsumos` WRITE;
/*!40000 ALTER TABLE `fabricanteinsumos` DISABLE KEYS */;
INSERT INTO `fabricanteinsumos` VALUES (1,'Genérico',1),(2,'Kingston\n',1),(3,'Samsung',1);
/*!40000 ALTER TABLE `fabricanteinsumos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fabricantes`
--

DROP TABLE IF EXISTS `fabricantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fabricantes` (
  `IdFabricantePK` int NOT NULL AUTO_INCREMENT,
  `NombreFabricante` varchar(100) DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IdFabricantePK`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fabricantes`
--

LOCK TABLES `fabricantes` WRITE;
/*!40000 ALTER TABLE `fabricantes` DISABLE KEYS */;
INSERT INTO `fabricantes` VALUES (1,'Nintendo',1),(2,'Sony',1),(3,'Microsoft',1),(7,'Sega',1);
/*!40000 ALTER TABLE `fabricantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historialestadoaccesorio`
--

DROP TABLE IF EXISTS `historialestadoaccesorio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historialestadoaccesorio` (
  `IdHistorial` int NOT NULL AUTO_INCREMENT,
  `CodigoAccesorio` varchar(25) NOT NULL,
  `EstadoAnterior` int DEFAULT NULL,
  `EstadoNuevo` int NOT NULL,
  `FechaCambio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `IdUsuarioFK` int DEFAULT NULL,
  PRIMARY KEY (`IdHistorial`),
  KEY `CodigoAccesorio` (`CodigoAccesorio`),
  KEY `EstadoAnterior` (`EstadoAnterior`),
  KEY `EstadoNuevo` (`EstadoNuevo`),
  KEY `fk_historialaccesorio_usuario` (`IdUsuarioFK`),
  CONSTRAINT `fk_historialaccesorio_usuario` FOREIGN KEY (`IdUsuarioFK`) REFERENCES `usuarios` (`IdUsuarioPK`),
  CONSTRAINT `historialestadoaccesorio_ibfk_1` FOREIGN KEY (`CodigoAccesorio`) REFERENCES `accesoriosbase` (`CodigoAccesorio`),
  CONSTRAINT `historialestadoaccesorio_ibfk_2` FOREIGN KEY (`EstadoAnterior`) REFERENCES `catalogoestadosconsolas` (`CodigoEstado`),
  CONSTRAINT `historialestadoaccesorio_ibfk_3` FOREIGN KEY (`EstadoNuevo`) REFERENCES `catalogoestadosconsolas` (`CodigoEstado`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historialestadoaccesorio`
--

LOCK TABLES `historialestadoaccesorio` WRITE;
/*!40000 ALTER TABLE `historialestadoaccesorio` DISABLE KEYS */;
INSERT INTO `historialestadoaccesorio` VALUES (1,'GCO-76',NULL,2,'2025-03-03 02:00:23',NULL),(2,'GCO-76',2,7,'2025-03-03 02:04:46',NULL),(3,'GCO-72',2,8,'2025-03-06 04:16:33',NULL),(4,'GCS-77',NULL,2,'2025-07-27 21:34:49',NULL),(5,'GCS-77',2,11,'2025-07-27 21:38:32',NULL),(6,'GCS-77',11,2,'2025-07-27 21:52:20',NULL),(7,'GCS-77',2,11,'2025-07-27 21:52:50',NULL),(8,'GCS-77',11,8,'2025-07-27 21:53:10',NULL),(9,'GCS-77',8,9,'2025-07-27 21:55:16',NULL),(10,'GCS-77',9,2,'2025-07-27 21:55:45',NULL),(11,'GCS-77',2,7,'2025-07-27 21:57:00',NULL),(12,'GCS-77',7,8,'2025-07-27 22:18:12',NULL),(13,'CGWB13-78',NULL,2,'2025-09-04 21:45:48',NULL),(14,'CGWB13-79',NULL,2,'2025-09-04 21:46:55',NULL),(15,'CGWB13-78',2,7,'2025-09-04 21:47:39',NULL),(16,'CGWB13-79',2,7,'2025-09-04 21:47:42',NULL),(17,'CGWB13-80',NULL,2,'2025-09-04 21:49:17',NULL),(18,'CGWB13-80',2,7,'2025-09-04 21:51:01',NULL),(19,'CGWB13-81',NULL,2,'2025-09-04 22:03:34',NULL),(20,'CGWB13-81',2,7,'2025-09-04 22:05:44',NULL),(21,'GPS-82',NULL,2,'2025-09-04 22:23:43',NULL),(22,'GPS-83',NULL,2,'2025-09-04 22:24:27',NULL),(23,'GPS-84',NULL,2,'2025-09-04 22:25:10',NULL),(24,'GPS-85',NULL,2,'2025-09-04 22:25:57',NULL),(25,'GPS-86',NULL,2,'2025-09-04 22:26:52',NULL),(26,'GPB-87',NULL,2,'2025-09-04 22:33:43',NULL),(27,'GPI-88',NULL,2,'2025-09-04 22:35:32',NULL),(28,'GPI-89',NULL,2,'2025-09-04 22:36:36',NULL),(29,'GPI-90',NULL,2,'2025-09-04 22:38:04',NULL),(30,'PGBASP22-91',NULL,1,'2025-09-05 00:37:22',NULL),(31,'N64CH23-92',NULL,2,'2025-09-05 22:51:20',NULL),(32,'N64CH23-93',NULL,2,'2025-09-05 22:51:55',NULL),(33,'N64CH23-94',NULL,2,'2025-09-05 22:52:34',NULL),(34,'N64CH23-95',NULL,2,'2025-09-05 22:53:19',NULL),(35,'N64CH23-92',2,7,'2025-09-05 22:54:38',NULL),(36,'N64CH23-93',2,7,'2025-09-05 22:54:42',NULL),(37,'N64CH23-94',2,7,'2025-09-05 22:54:45',NULL),(38,'N64CH23-95',2,7,'2025-09-05 22:54:49',NULL),(39,'N64CH-96',NULL,2,'2025-09-05 22:58:43',NULL),(40,'N64CH-97',NULL,2,'2025-09-05 22:59:11',NULL),(41,'N64CH-98',NULL,2,'2025-09-05 22:59:35',NULL),(42,'N64CH-99',NULL,2,'2025-09-05 23:00:20',NULL),(43,'DSBT-100',NULL,2,'2025-09-05 23:14:46',NULL),(44,'GBFCGB26-101',NULL,2,'2025-09-05 23:19:39',NULL),(45,'GBFCGB26-102',NULL,2,'2025-09-05 23:20:33',NULL),(46,'GBFCGB26-101',2,7,'2025-09-05 23:20:41',NULL),(47,'GBFCGB26-102',2,7,'2025-09-05 23:20:44',NULL),(48,'GBFCGB-103',NULL,2,'2025-09-05 23:21:50',NULL),(49,'GBFCGB-104',NULL,2,'2025-09-05 23:22:38',NULL),(50,'DCC-105',NULL,2,'2025-09-05 23:28:06',NULL),(51,'DCVMUA-106',NULL,2,'2025-09-05 23:35:09',NULL),(52,'DCVMUA-107',NULL,2,'2025-09-05 23:36:00',NULL),(53,'DCVMUJ29-108',NULL,2,'2025-09-05 23:36:36',NULL),(54,'DCVMUJ29-108',2,7,'2025-09-05 23:36:52',NULL),(55,'DCVMUJ-109',NULL,2,'2025-09-05 23:37:35',NULL),(56,'SFCM-110',NULL,2,'2025-09-05 23:52:20',NULL),(57,'PS2CBL32-111',NULL,2,'2025-09-06 00:03:32',NULL),(58,'PS2CBL32-112',NULL,2,'2025-09-06 00:04:01',NULL),(59,'PS1G34-113',NULL,2,'2025-09-06 00:04:31',NULL),(60,'PS1G34-114',NULL,2,'2025-09-06 00:04:58',NULL),(61,'PS1G34-113',2,7,'2025-09-06 00:06:36',NULL),(62,'PS1G34-114',2,7,'2025-09-06 00:06:39',NULL),(63,'PS2CBL32-111',2,7,'2025-09-06 00:06:42',NULL),(64,'PS2CBL32-112',2,7,'2025-09-06 00:06:45',NULL),(65,'PS2CBL-115',NULL,2,'2025-09-06 00:07:09',NULL),(66,'PS2CBL-116',NULL,2,'2025-09-06 00:07:35',NULL),(67,'PS1G-117',NULL,2,'2025-09-06 00:09:43',NULL),(68,'PS1G-118',NULL,2,'2025-09-06 00:10:31',NULL),(69,'PS2CW-119',NULL,2,'2025-09-06 00:22:33',NULL),(70,'PS2CW-120',NULL,2,'2025-09-06 00:22:58',NULL),(71,'PS2CW-121',NULL,2,'2025-09-06 00:23:26',NULL),(72,'PS2CW-122',NULL,2,'2025-09-06 00:23:57',NULL),(73,'PS2CW-123',NULL,2,'2025-09-06 00:24:24',NULL),(74,'PS2CW-123',2,7,'2025-09-06 00:24:46',NULL),(75,'PS2AC135-124',NULL,2,'2025-09-06 00:37:40',NULL),(76,'PS2AC135-125',NULL,2,'2025-09-06 00:38:11',NULL),(77,'PS2AC135-124',2,7,'2025-09-06 00:40:05',NULL),(78,'PS2AC135-125',2,7,'2025-09-06 00:40:08',NULL),(79,'PS2AC-126',NULL,2,'2025-09-06 00:40:41',NULL),(80,'PS2AC-127',NULL,2,'2025-09-06 00:41:04',NULL),(81,'PS2O-128',NULL,2,'2025-09-06 00:43:40',NULL),(82,'DSBT-100',2,7,'2025-09-06 00:56:10',NULL);
/*!40000 ALTER TABLE `historialestadoaccesorio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historialestadoinsumo`
--

DROP TABLE IF EXISTS `historialestadoinsumo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historialestadoinsumo` (
  `IdHistorial` int NOT NULL AUTO_INCREMENT,
  `CodigoInsumo` varchar(25) NOT NULL,
  `EstadoAnterior` int DEFAULT NULL,
  `EstadoNuevo` int NOT NULL,
  `FechaCambio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `IdUsuarioFK` int DEFAULT NULL,
  PRIMARY KEY (`IdHistorial`),
  KEY `CodigoInsumo` (`CodigoInsumo`),
  KEY `EstadoAnterior` (`EstadoAnterior`),
  KEY `EstadoNuevo` (`EstadoNuevo`),
  KEY `fk_historialinsumo_usuario` (`IdUsuarioFK`),
  CONSTRAINT `fk_historialinsumo_usuario` FOREIGN KEY (`IdUsuarioFK`) REFERENCES `usuarios` (`IdUsuarioPK`),
  CONSTRAINT `historialestadoinsumo_ibfk_1` FOREIGN KEY (`CodigoInsumo`) REFERENCES `insumosbase` (`CodigoInsumo`),
  CONSTRAINT `historialestadoinsumo_ibfk_2` FOREIGN KEY (`EstadoAnterior`) REFERENCES `catalogoestadosconsolas` (`CodigoEstado`),
  CONSTRAINT `historialestadoinsumo_ibfk_3` FOREIGN KEY (`EstadoNuevo`) REFERENCES `catalogoestadosconsolas` (`CodigoEstado`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historialestadoinsumo`
--

LOCK TABLES `historialestadoinsumo` WRITE;
/*!40000 ALTER TABLE `historialestadoinsumo` DISABLE KEYS */;
INSERT INTO `historialestadoinsumo` VALUES (1,'JMPA1-1',NULL,1,'2025-07-27 21:20:25',NULL),(2,'JMPA1-2',NULL,1,'2025-07-27 22:24:18',NULL),(3,'JMPA1-3',NULL,1,'2025-07-27 22:25:16',NULL),(4,'JMPA1-4',NULL,1,'2025-08-31 21:36:37',NULL);
/*!40000 ALTER TABLE `historialestadoinsumo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historialestadopedido`
--

DROP TABLE IF EXISTS `historialestadopedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historialestadopedido` (
  `IdHistorial` int NOT NULL AUTO_INCREMENT,
  `CodigoPedido` varchar(25) NOT NULL,
  `EstadoAnterior` int DEFAULT NULL,
  `EstadoNuevo` int NOT NULL,
  `FechaCambio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `IdUsuarioFK` int DEFAULT NULL,
  PRIMARY KEY (`IdHistorial`),
  KEY `CodigoPedido` (`CodigoPedido`),
  KEY `EstadoAnterior` (`EstadoAnterior`),
  KEY `EstadoNuevo` (`EstadoNuevo`),
  KEY `fk_historialpedido_usuario` (`IdUsuarioFK`),
  CONSTRAINT `fk_historialpedido_usuario` FOREIGN KEY (`IdUsuarioFK`) REFERENCES `usuarios` (`IdUsuarioPK`),
  CONSTRAINT `historialestadopedido_ibfk_1` FOREIGN KEY (`CodigoPedido`) REFERENCES `pedidobase` (`CodigoPedido`),
  CONSTRAINT `historialestadopedido_ibfk_2` FOREIGN KEY (`EstadoAnterior`) REFERENCES `estadopedido` (`CodigoEstadoPedido`),
  CONSTRAINT `historialestadopedido_ibfk_3` FOREIGN KEY (`EstadoNuevo`) REFERENCES `estadopedido` (`CodigoEstadoPedido`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historialestadopedido`
--

LOCK TABLES `historialestadopedido` WRITE;
/*!40000 ALTER TABLE `historialestadopedido` DISABLE KEYS */;
INSERT INTO `historialestadopedido` VALUES (1,'P-03022025-2',1,2,'2025-02-10 01:37:15',NULL),(2,'P-03022025-2',2,3,'2025-02-10 01:37:38',NULL),(3,'P-10022025-3',NULL,1,'2025-02-10 01:41:29',NULL),(4,'P-10022025-3',1,2,'2025-02-10 01:41:35',NULL),(5,'P-10022025-3',2,3,'2025-02-10 01:41:48',NULL),(6,'P-03032025-4',NULL,1,'2025-03-03 01:57:41',NULL),(7,'P-03032025-4',1,2,'2025-03-03 01:57:54',NULL),(8,'P-03032025-4',2,3,'2025-03-03 01:57:57',NULL),(9,'P-03032025-4',3,4,'2025-03-03 01:58:02',NULL),(10,'P-03032025-4',4,5,'2025-03-03 02:00:23',NULL),(11,'P-07042025-5',NULL,1,'2025-04-07 00:39:00',NULL),(12,'P-07042025-5',1,2,'2025-04-07 00:39:55',NULL),(13,'P-07042025-5',2,3,'2025-04-07 00:39:58',NULL),(14,'P-07042025-5',3,4,'2025-04-07 00:40:05',NULL),(15,'P-27072025-6',NULL,1,'2025-07-27 21:30:04',NULL),(16,'P-27072025-6',1,2,'2025-07-27 21:30:39',NULL),(17,'P-27072025-6',2,3,'2025-07-27 21:30:43',NULL),(18,'P-27072025-6',3,4,'2025-07-27 21:30:48',NULL),(19,'P-27072025-6',4,5,'2025-07-27 21:35:01',NULL),(20,'P-07042025-5',4,7,'2025-07-27 21:35:25',NULL),(21,'P-03022025-2',3,6,'2025-07-27 21:35:40',NULL),(22,'P-10022025-3',3,7,'2025-08-02 21:19:12',NULL),(23,'P-06082025-7',NULL,1,'2025-08-19 15:37:06',NULL),(24,'P-06082025-8',NULL,1,'2025-08-19 15:37:25',NULL),(25,'P-06082025-8',1,7,'2025-08-19 15:39:03',NULL),(26,'P-06082025-7',1,2,'2025-08-19 15:45:25',NULL),(27,'P-06082025-7',2,3,'2025-08-19 15:45:31',NULL),(28,'P-06082025-7',3,4,'2025-09-11 21:41:50',NULL),(29,'P-14092025-9',NULL,1,'2025-09-14 18:40:02',NULL),(30,'P-14092025-9',1,2,'2025-09-14 18:40:05',NULL),(31,'P-14092025-9',2,3,'2025-09-14 18:40:08',NULL),(32,'P-14092025-9',3,4,'2025-09-14 18:40:10',NULL),(33,'P-14092025-9',4,5,'2025-09-14 18:41:32',NULL),(34,'P-06082025-7',4,5,'2025-09-17 01:28:56',NULL),(35,'P-17092025-10',NULL,1,'2025-09-17 02:31:33',NULL),(36,'P-17092025-10',1,2,'2025-09-17 02:31:46',NULL),(37,'P-17092025-10',2,3,'2025-09-17 02:31:50',NULL),(38,'P-17092025-10',3,4,'2025-09-17 02:31:54',NULL);
/*!40000 ALTER TABLE `historialestadopedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historialestadoproducto`
--

DROP TABLE IF EXISTS `historialestadoproducto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historialestadoproducto` (
  `IdHistorial` int NOT NULL AUTO_INCREMENT,
  `CodigoConsola` varchar(25) NOT NULL,
  `EstadoAnterior` int DEFAULT NULL,
  `EstadoNuevo` int NOT NULL,
  `FechaCambio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `IdUsuarioFK` int DEFAULT NULL,
  PRIMARY KEY (`IdHistorial`),
  KEY `CodigoConsola` (`CodigoConsola`),
  KEY `EstadoAnterior` (`EstadoAnterior`),
  KEY `EstadoNuevo` (`EstadoNuevo`),
  KEY `fk_historialproducto_usuario` (`IdUsuarioFK`),
  CONSTRAINT `fk_historialproducto_usuario` FOREIGN KEY (`IdUsuarioFK`) REFERENCES `usuarios` (`IdUsuarioPK`),
  CONSTRAINT `historialestadoproducto_ibfk_1` FOREIGN KEY (`CodigoConsola`) REFERENCES `productosbases` (`CodigoConsola`),
  CONSTRAINT `historialestadoproducto_ibfk_2` FOREIGN KEY (`EstadoAnterior`) REFERENCES `catalogoestadosconsolas` (`CodigoEstado`),
  CONSTRAINT `historialestadoproducto_ibfk_3` FOREIGN KEY (`EstadoNuevo`) REFERENCES `catalogoestadosconsolas` (`CodigoEstado`)
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historialestadoproducto`
--

LOCK TABLES `historialestadoproducto` WRITE;
/*!40000 ALTER TABLE `historialestadoproducto` DISABLE KEYS */;
INSERT INTO `historialestadoproducto` VALUES (1,'GCPS-32',NULL,2,'2025-03-03 02:00:23',NULL),(2,'GCPS-32',2,7,'2025-03-03 02:04:50',NULL),(3,'GCSO-25',2,8,'2025-03-06 04:15:51',NULL),(4,'WU32GB-29',2,3,'2025-07-27 21:02:08',NULL),(5,'WU32GB-29',3,2,'2025-07-27 21:02:11',NULL),(6,'GCJB-24',2,11,'2025-07-27 21:57:29',NULL),(7,'GCJB-24',11,2,'2025-07-27 22:01:06',NULL),(8,'GCJB-24',2,11,'2025-07-27 22:01:11',NULL),(9,'GCJB-24',11,2,'2025-07-27 22:01:22',NULL),(10,'GCJB-24',2,11,'2025-07-27 22:01:25',NULL),(11,'GCJB-24',11,2,'2025-07-27 22:05:40',NULL),(12,'GCJB-24',2,11,'2025-07-27 22:05:44',NULL),(13,'GCJB-24',11,2,'2025-07-27 22:12:09',NULL),(14,'GCJB-24',2,11,'2025-07-27 22:12:12',NULL),(15,'GCJB-24',11,2,'2025-07-27 22:40:30',NULL),(16,'GCI-22',2,11,'2025-07-27 22:41:12',NULL),(17,'GCI-22',11,8,'2025-07-27 22:41:32',NULL),(18,'GCI-22',8,9,'2025-07-27 22:42:43',NULL),(19,'GCI-22',9,1,'2025-07-27 22:43:16',NULL),(20,'GCI-22',1,7,'2025-08-02 21:27:48',NULL),(21,'GCJB-24',2,7,'2025-08-02 21:27:52',NULL),(22,'GCSO-25',8,7,'2025-08-02 21:27:55',NULL),(23,'N3DS-20',2,7,'2025-08-02 21:30:11',NULL),(24,'N3DS-21',2,7,'2025-08-02 21:30:14',NULL),(25,'NES-31',2,7,'2025-08-02 21:30:26',NULL),(26,'O3DS-26',2,7,'2025-08-02 21:30:28',NULL),(27,'O3DS-27',2,7,'2025-08-02 21:30:30',NULL),(28,'PS2FAT5-30',2,7,'2025-08-02 21:30:33',NULL),(29,'WU32GB-28',2,7,'2025-08-02 21:30:35',NULL),(30,'WU32GB-29',2,7,'2025-08-02 21:30:36',NULL),(31,'WU32GB64-33',NULL,2,'2025-09-04 22:48:01',NULL),(32,'WU32GB64-33',2,7,'2025-09-04 22:48:56',NULL),(33,'WU32GB-34',NULL,2,'2025-09-04 22:49:34',NULL),(34,'WU32GB-35',NULL,2,'2025-09-04 22:50:58',NULL),(35,'GCJB-36',NULL,2,'2025-09-04 23:00:39',NULL),(36,'GCJB-37',NULL,2,'2025-09-04 23:01:52',NULL),(37,'GCI-38',NULL,2,'2025-09-04 23:03:00',NULL),(38,'GCPS-39',NULL,2,'2025-09-04 23:03:46',NULL),(39,'GCCSG-40',NULL,1,'2025-09-05 00:03:13',NULL),(40,'CGCSB-41',NULL,1,'2025-09-05 00:04:03',NULL),(41,'CGCSBL-42',NULL,1,'2025-09-05 00:04:56',NULL),(42,'CGCGI-43',NULL,1,'2025-09-05 00:05:44',NULL),(43,'CGCGI-43',1,7,'2025-09-05 00:16:06',NULL),(44,'CGCSB-41',1,7,'2025-09-05 00:16:09',NULL),(45,'CGCSBL-42',1,7,'2025-09-05 00:16:11',NULL),(46,'GCCSG-40',1,7,'2025-09-05 00:16:14',NULL),(47,'CGCS69-44',NULL,1,'2025-09-05 00:17:25',NULL),(48,'CGCS69-44',1,7,'2025-09-05 00:17:48',NULL),(49,'CGCS-45',NULL,1,'2025-09-05 00:18:48',NULL),(50,'CGCS-46',NULL,2,'2025-09-05 00:20:22',NULL),(51,'CGCS-47',NULL,1,'2025-09-05 00:22:14',NULL),(52,'CGCS-48',NULL,1,'2025-09-05 00:23:00',NULL),(53,'GBASP-49',NULL,1,'2025-09-05 00:28:50',NULL),(54,'GBASP-50',NULL,1,'2025-09-05 00:31:36',NULL),(55,'GBASP-51',NULL,1,'2025-09-05 00:41:01',NULL),(56,'GBASP-52',NULL,1,'2025-09-05 00:43:03',NULL),(57,'GBASP-53',NULL,1,'2025-09-05 00:44:53',NULL),(58,'GBASP-54',NULL,1,'2025-09-05 00:46:20',NULL),(59,'N64CHAR-55',NULL,2,'2025-09-05 00:50:27',NULL),(60,'N64CHAR-56',NULL,2,'2025-09-05 00:51:21',NULL),(61,'NDSi1-14',2,3,'2025-09-05 00:57:45',NULL),(62,'NDSi1-1',1,2,'2025-09-05 01:00:20',NULL),(63,'NDSi1-57',NULL,2,'2025-09-05 01:03:53',NULL),(64,'NDSi1-58',NULL,2,'2025-09-05 01:06:27',NULL),(65,'NDSi1-59',NULL,2,'2025-09-05 01:07:40',NULL),(66,'NDSi1-60',NULL,2,'2025-09-05 01:09:10',NULL),(67,'PS2FAT5-61',NULL,2,'2025-09-05 21:36:13',NULL),(68,'PS2FAT5-62',NULL,2,'2025-09-05 21:39:27',NULL),(69,'PS2FAT6-63',NULL,2,'2025-09-05 21:49:29',NULL),(70,'PS2FAT6-64',NULL,2,'2025-09-05 21:50:43',NULL),(71,'PS2FAT5-65',NULL,2,'2025-09-05 21:51:43',NULL),(72,'PS2SLIM4-66',NULL,2,'2025-09-05 22:05:08',NULL),(73,'PS2SLIM2-67',NULL,2,'2025-09-05 22:06:39',NULL),(74,'PS2SLIM-68',NULL,2,'2025-09-05 22:07:39',NULL),(75,'GBA-69',NULL,2,'2025-09-05 22:15:03',NULL),(76,'GBA-70',NULL,2,'2025-09-05 22:15:42',NULL),(77,'GBA-71',NULL,2,'2025-09-05 22:16:49',NULL),(78,'GBA-72',NULL,3,'2025-09-05 22:17:55',NULL),(79,'CGCS-46',2,1,'2025-09-05 22:21:08',NULL),(80,'GBC-73',NULL,2,'2025-09-05 22:22:33',NULL),(81,'GBC-74',NULL,2,'2025-09-05 22:23:39',NULL),(82,'GBC-75',NULL,2,'2025-09-05 22:24:39',NULL),(83,'GBC-76',NULL,2,'2025-09-05 22:25:17',NULL),(84,'GBC-76',2,7,'2025-09-05 22:25:37',NULL),(85,'GBP-77',NULL,2,'2025-09-05 22:26:19',NULL),(86,'O3DS-78',NULL,2,'2025-09-05 22:32:52',NULL),(87,'O3DS-79',NULL,2,'2025-09-05 22:33:48',NULL),(88,'O3DSXL-80',NULL,2,'2025-09-05 22:37:27',NULL),(89,'O3DSXL-81',NULL,2,'2025-09-05 22:38:07',NULL),(90,'NDSL-82',NULL,2,'2025-09-05 23:09:35',NULL),(91,'SNESM-83',NULL,2,'2025-09-05 23:54:10',NULL),(92,'GCI-84',NULL,1,'2025-09-14 18:41:32',NULL),(93,'GCI-85',NULL,2,'2025-09-14 18:41:32',NULL),(94,'GCI-84',1,7,'2025-09-14 18:42:53',NULL),(95,'GCI-85',2,7,'2025-09-14 18:42:56',NULL),(96,'N3DSXL-86',NULL,6,'2025-09-16 23:28:01',NULL),(97,'N3DSXL-87',NULL,6,'2025-09-16 23:32:28',NULL),(98,'N3DSXL-86',6,7,'2025-09-17 01:28:01',NULL),(99,'N3DSXL-87',6,7,'2025-09-17 01:28:05',NULL),(100,'N3DSXL-88',NULL,6,'2025-09-17 01:28:56',NULL),(101,'N3DSXL-89',NULL,2,'2025-09-17 01:28:56',NULL),(102,'N3DSXL-90',NULL,2,'2025-09-17 01:28:56',NULL),(103,'N3DSXL-91',NULL,6,'2025-09-17 01:28:56',NULL),(104,'N3DSXL-92',NULL,6,'2025-09-17 01:28:56',NULL),(105,'N3DSXL-93',NULL,6,'2025-09-17 01:28:56',NULL),(106,'N3DSXL-94',NULL,6,'2025-09-17 01:28:56',NULL),(107,'N3DSXL-95',NULL,2,'2025-09-17 01:28:56',NULL),(108,'N3DSXL-96',NULL,6,'2025-09-17 01:28:56',NULL),(109,'N3DSXL-97',NULL,2,'2025-09-17 01:28:56',NULL),(110,'O3DSXL-98',NULL,6,'2025-09-17 01:28:56',NULL),(111,'O3DSXL-99',NULL,2,'2025-09-17 01:28:56',NULL),(112,'O3DSXL-100',NULL,2,'2025-09-17 01:28:56',NULL),(113,'O3DSXL-101',NULL,2,'2025-09-17 01:28:56',NULL),(114,'O3DSXL-102',NULL,2,'2025-09-17 01:28:56',NULL),(115,'O3DSXL-103',NULL,3,'2025-09-17 01:28:56',NULL),(116,'O3DSXL-104',NULL,6,'2025-09-17 01:28:56',NULL),(117,'O3DSXL-105',NULL,2,'2025-09-17 01:28:56',NULL),(118,'O3DSXL-106',NULL,3,'2025-09-17 01:28:56',NULL),(119,'O3DS-107',NULL,2,'2025-09-17 01:28:56',NULL),(120,'O3DS-108',NULL,2,'2025-09-17 01:28:56',NULL),(121,'O3DS-109',NULL,2,'2025-09-17 01:28:56',NULL),(122,'O3DS-110',NULL,3,'2025-09-17 01:28:56',NULL),(123,'O3DS-111',NULL,2,'2025-09-17 01:28:56',NULL),(124,'O3DS-112',NULL,2,'2025-09-17 01:28:56',NULL),(125,'O3DS-113',NULL,2,'2025-09-17 01:28:56',NULL),(126,'O3DS-114',NULL,2,'2025-09-17 01:28:56',NULL),(127,'O3DS-115',NULL,6,'2025-09-17 01:28:56',NULL),(128,'O3DS-116',NULL,2,'2025-09-17 01:28:56',NULL),(129,'O3DS-117',NULL,3,'2025-09-17 01:28:56',NULL),(130,'O3DS-118',NULL,2,'2025-09-17 01:28:56',NULL),(131,'N3DSXL-89',2,11,'2025-09-17 21:29:50',NULL),(132,'GBASP-54',1,11,'2025-09-17 21:38:00',NULL),(133,'GBASP-54',11,1,'2025-09-17 21:38:06',NULL),(134,'GBASP-54',1,11,'2025-09-17 21:38:20',NULL),(135,'GBASP-54',11,8,'2025-09-17 21:38:28',NULL),(136,'GBASP-54',8,9,'2025-09-17 21:40:46',NULL),(137,'GBASP-50',1,11,'2025-09-17 21:42:36',NULL),(138,'GBASP-50',11,8,'2025-09-17 21:43:06',NULL);
/*!40000 ALTER TABLE `historialestadoproducto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historialnotascredito`
--

DROP TABLE IF EXISTS `historialnotascredito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historialnotascredito` (
  `IdHistorialNC_PK` int NOT NULL AUTO_INCREMENT,
  `IdNotaCreditoFK` int NOT NULL,
  `TipoAccion` enum('CREACION','ANULACION') NOT NULL,
  `IdUsuarioFK` int NOT NULL,
  `FechaAccion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Detalles` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`IdHistorialNC_PK`),
  KEY `IdNotaCreditoFK` (`IdNotaCreditoFK`),
  KEY `IdUsuarioFK` (`IdUsuarioFK`),
  CONSTRAINT `historialnotascredito_ibfk_1` FOREIGN KEY (`IdNotaCreditoFK`) REFERENCES `notascredito` (`IdNotaCreditoPK`),
  CONSTRAINT `historialnotascredito_ibfk_2` FOREIGN KEY (`IdUsuarioFK`) REFERENCES `usuarios` (`IdUsuarioPK`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historialnotascredito`
--

LOCK TABLES `historialnotascredito` WRITE;
/*!40000 ALTER TABLE `historialnotascredito` DISABLE KEYS */;
INSERT INTO `historialnotascredito` VALUES (1,1,'CREACION',2,'2025-07-27 21:55:16',''),(2,1,'ANULACION',2,'2025-07-27 22:18:12','borrado por prueba'),(3,2,'CREACION',2,'2025-07-27 22:42:43','Error de usuario, se selecciono el producto equivocado'),(4,3,'CREACION',2,'2025-09-17 21:40:46','El GameBoy no acepta cartucho flashcart y el cliente menciono que no le gusto la calidad de la carcasa. ');
/*!40000 ALTER TABLE `historialnotascredito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insumosbase`
--

DROP TABLE IF EXISTS `insumosbase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insumosbase` (
  `CodigoInsumo` varchar(25) NOT NULL,
  `ModeloInsumo` int NOT NULL,
  `EstadoInsumo` int NOT NULL,
  `FechaIngreso` date DEFAULT NULL,
  `Comentario` varchar(10000) DEFAULT NULL,
  `PrecioBase` decimal(6,2) DEFAULT NULL,
  `NumeroSerie` varchar(100) DEFAULT NULL,
  `ServiciosCompatibles` varchar(500) DEFAULT NULL,
  `Cantidad` int unsigned NOT NULL,
  `IdIngreso` int NOT NULL AUTO_INCREMENT,
  `StockMinimo` int unsigned NOT NULL,
  PRIMARY KEY (`CodigoInsumo`),
  UNIQUE KEY `IdIngreso` (`IdIngreso`),
  KEY `ModeloInsumo` (`ModeloInsumo`),
  KEY `EstadoInsumo` (`EstadoInsumo`),
  CONSTRAINT `insumosbase_ibfk_1` FOREIGN KEY (`ModeloInsumo`) REFERENCES `catalogoinsumos` (`IdModeloInsumosPK`),
  CONSTRAINT `insumosbase_ibfk_2` FOREIGN KEY (`EstadoInsumo`) REFERENCES `catalogoestadosconsolas` (`CodigoEstado`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insumosbase`
--

LOCK TABLES `insumosbase` WRITE;
/*!40000 ALTER TABLE `insumosbase` DISABLE KEYS */;
INSERT INTO `insumosbase` VALUES ('JMPA1-1',1,1,'2025-07-27','',15.00,'N/A',NULL,15,1,5),('JMPA1-2',2,1,'2025-07-27','',12.00,'N/A',NULL,30,2,5),('JMPA1-3',3,1,'2025-07-27','',5.00,'N/A',NULL,4,3,2),('JMPA1-4',4,1,'2025-08-31','Compradas en Sevasa Altamira',4.45,'',NULL,30,4,5);
/*!40000 ALTER TABLE `insumosbase` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_Insert_Historial_Insumo` AFTER INSERT ON `insumosbase` FOR EACH ROW BEGIN
    INSERT INTO HistorialEstadoInsumo (CodigoInsumo, EstadoAnterior, EstadoNuevo, FechaCambio)
    VALUES (NEW.CodigoInsumo, NULL, NEW.EstadoInsumo, NOW());
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_Historial_Estado_Insumo` BEFORE UPDATE ON `insumosbase` FOR EACH ROW BEGIN
    IF OLD.EstadoInsumo <> NEW.EstadoInsumo THEN
        INSERT INTO HistorialEstadoInsumo (CodigoInsumo, EstadoAnterior, EstadoNuevo, FechaCambio)
        VALUES (OLD.CodigoInsumo, OLD.EstadoInsumo, NEW.EstadoInsumo, NOW());
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `insumosxservicio`
--

DROP TABLE IF EXISTS `insumosxservicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insumosxservicio` (
  `IdInsumosXServicio` int NOT NULL AUTO_INCREMENT,
  `IdServicioFK` int NOT NULL,
  `CodigoInsumoFK` varchar(25) NOT NULL,
  `CantidadDescargue` int unsigned DEFAULT NULL,
  `Estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IdInsumosXServicio`),
  KEY `CodigoInsumoFK` (`CodigoInsumoFK`),
  KEY `IdServicioFK` (`IdServicioFK`),
  CONSTRAINT `insumosxservicio_ibfk_1` FOREIGN KEY (`CodigoInsumoFK`) REFERENCES `insumosbase` (`CodigoInsumo`),
  CONSTRAINT `insumosxservicio_ibfk_2` FOREIGN KEY (`IdServicioFK`) REFERENCES `serviciosbase` (`IdServicioPK`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insumosxservicio`
--

LOCK TABLES `insumosxservicio` WRITE;
/*!40000 ALTER TABLE `insumosxservicio` DISABLE KEYS */;
INSERT INTO `insumosxservicio` VALUES (1,1,'JMPA1-1',1,1),(2,2,'JMPA1-2',1,1),(3,3,'JMPA1-3',1,1),(4,4,'JMPA1-2',1,1),(5,5,'JMPA1-3',1,1),(6,6,'JMPA1-2',1,1),(7,7,'JMPA1-3',1,1);
/*!40000 ALTER TABLE `insumosxservicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `margenesventa`
--

DROP TABLE IF EXISTS `margenesventa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `margenesventa` (
  `IdMargenPK` int NOT NULL AUTO_INCREMENT,
  `NombreMargen` varchar(50) NOT NULL COMMENT 'Ej: Estandar, Promocional, Mayorista',
  `Porcentaje` decimal(5,2) NOT NULL COMMENT '30.00 para 30%, 15.50 para 15.5%',
  `Descripcion` varchar(255) DEFAULT NULL,
  `Activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`IdMargenPK`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `margenesventa`
--

LOCK TABLES `margenesventa` WRITE;
/*!40000 ALTER TABLE `margenesventa` DISABLE KEYS */;
INSERT INTO `margenesventa` VALUES (1,'Estandar',35.00,'Margen normal para venta al público',1),(2,'Promocional',20.00,'Para ofertas temporales',1),(3,'Mayorista',15.00,'Clientes con compras al por mayor',1),(4,'VIP',25.00,'Clientes frecuentes',1),(5,'Precio de Costo',0.00,'Precio al costo sin ganancia',1),(6,'Precio Personalizado',-1.00,' Precio personalizado',1);
/*!40000 ALTER TABLE `margenesventa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metodosdepago`
--

DROP TABLE IF EXISTS `metodosdepago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metodosdepago` (
  `IdMetodoPagoPK` int NOT NULL AUTO_INCREMENT,
  `NombreMetodoPago` varchar(50) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `Activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`IdMetodoPagoPK`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metodosdepago`
--

LOCK TABLES `metodosdepago` WRITE;
/*!40000 ALTER TABLE `metodosdepago` DISABLE KEYS */;
INSERT INTO `metodosdepago` VALUES (1,'Efectivo','Pago de contado en efectivo',1),(2,'Transferencia','Pago por transferencia bancaria, anotar numero de referencia',1),(3,'Tarjeta POS Electronico','Clientes con compras al por mayor',1),(4,'Otros','Pagos por medios sin contacto como NFC, Billetera digital, Canje',1);
/*!40000 ALTER TABLE `metodosdepago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `motivosnotacredito`
--

DROP TABLE IF EXISTS `motivosnotacredito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `motivosnotacredito` (
  `IdMotivoPK` int NOT NULL AUTO_INCREMENT,
  `Descripcion` varchar(255) NOT NULL,
  `Activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`IdMotivoPK`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `motivosnotacredito`
--

LOCK TABLES `motivosnotacredito` WRITE;
/*!40000 ALTER TABLE `motivosnotacredito` DISABLE KEYS */;
INSERT INTO `motivosnotacredito` VALUES (1,'Devolución por garantía',1),(2,'Producto dañado o defectuoso',1),(3,'Error en facturación',1),(4,'Cancelación de factura completa',1),(5,'Ajuste de precio post-venta',1),(6,'Producto incorrecto enviado',1);
/*!40000 ALTER TABLE `motivosnotacredito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notascredito`
--

DROP TABLE IF EXISTS `notascredito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notascredito` (
  `IdNotaCreditoPK` int NOT NULL AUTO_INCREMENT,
  `IdVentaFK` int NOT NULL,
  `FechaEmision` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Motivo` text NOT NULL,
  `TotalCredito` decimal(10,2) NOT NULL,
  `UsuarioEmisorFK` int NOT NULL,
  `Estado` tinyint(1) DEFAULT '1',
  `IdMotivoFK` int DEFAULT NULL,
  PRIMARY KEY (`IdNotaCreditoPK`),
  KEY `IdVentaFK` (`IdVentaFK`),
  KEY `UsuarioEmisorFK` (`UsuarioEmisorFK`),
  KEY `IdMotivoFK` (`IdMotivoFK`),
  CONSTRAINT `notascredito_ibfk_1` FOREIGN KEY (`IdVentaFK`) REFERENCES `ventasbase` (`IdVentaPK`),
  CONSTRAINT `notascredito_ibfk_2` FOREIGN KEY (`UsuarioEmisorFK`) REFERENCES `usuarios` (`IdUsuarioPK`),
  CONSTRAINT `notascredito_ibfk_3` FOREIGN KEY (`IdMotivoFK`) REFERENCES `motivosnotacredito` (`IdMotivoPK`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notascredito`
--

LOCK TABLES `notascredito` WRITE;
/*!40000 ALTER TABLE `notascredito` DISABLE KEYS */;
INSERT INTO `notascredito` VALUES (1,2,'2025-07-27 21:55:16','',53.43,2,0,4),(2,4,'2025-07-27 22:42:43','Error de usuario, se selecciono el producto equivocado',1.35,2,1,4),(3,8,'2025-09-17 21:40:46','El GameBoy no acepta cartucho flashcart y el cliente menciono que no le gusto la calidad de la carcasa. ',65.00,2,1,2);
/*!40000 ALTER TABLE `notascredito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidobase`
--

DROP TABLE IF EXISTS `pedidobase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidobase` (
  `CodigoPedido` varchar(25) NOT NULL,
  `FechaCreacionPedido` date DEFAULT NULL,
  `FechaArriboEstadosUnidos` date DEFAULT NULL,
  `FechaIngreso` date DEFAULT NULL,
  `NumeroTracking1` varchar(100) NOT NULL,
  `NumeroTracking2` varchar(100) DEFAULT NULL,
  `SitioWebFK` int NOT NULL,
  `ViaPedidoFK` int NOT NULL,
  `EstadoPedidoFK` int NOT NULL,
  `TotalPedido` decimal(6,2) DEFAULT NULL,
  `Comentarios` varchar(10000) DEFAULT NULL,
  `Peso` decimal(6,2) DEFAULT NULL,
  `SubtotalArticulos` decimal(6,2) DEFAULT NULL,
  `Impuestos` decimal(6,2) DEFAULT NULL,
  `EnvioUSA` decimal(6,2) DEFAULT NULL,
  `EnvioNIC` decimal(6,2) DEFAULT NULL,
  PRIMARY KEY (`CodigoPedido`),
  KEY `SitioWebFK` (`SitioWebFK`),
  KEY `ViaPedidoFK` (`ViaPedidoFK`),
  KEY `EstadoPedidoFK` (`EstadoPedidoFK`),
  CONSTRAINT `pedidobase_ibfk_1` FOREIGN KEY (`SitioWebFK`) REFERENCES `sitioweb` (`CodigoSitioWeb`),
  CONSTRAINT `pedidobase_ibfk_2` FOREIGN KEY (`ViaPedidoFK`) REFERENCES `tipopedido` (`CodigoTipoPedido`),
  CONSTRAINT `pedidobase_ibfk_3` FOREIGN KEY (`EstadoPedidoFK`) REFERENCES `estadopedido` (`CodigoEstadoPedido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidobase`
--

LOCK TABLES `pedidobase` WRITE;
/*!40000 ALTER TABLE `pedidobase` DISABLE KEYS */;
INSERT INTO `pedidobase` VALUES ('P-03022025-1','2025-02-03','2025-02-15','2025-02-22','Pedido prueba 1','tracking 2',1,1,7,159.95,'',9.99,119.95,10.00,15.00,15.00),('P-03022025-2','2025-02-03','2025-02-15','2025-02-22','Pedido prueba 1','tracking 2',1,1,6,235.94,'',9.99,195.94,10.00,15.00,15.00),('P-03032025-4','2025-03-03','2025-03-15','2025-03-29','TRACKEOPRUEBA3','TR',1,1,5,269.94,'',12.00,229.94,10.00,0.00,30.00),('P-06082025-7','2025-08-06','2025-08-11','2025-08-30','3899384812','',1,2,5,2774.19,' Shipping se sumo una alta cantidad de impuestos ya que se importaron de japon. Hay que verificar si valdria la pena traer otro lote',21.00,2353.53,253.66,98.00,69.00),('P-06082025-8','2025-08-06','2025-08-11','2025-08-30','3899384812','',1,2,7,2771.19,' Shipping se sumo una alta cantidad de impuestos ya que se importaron de japon. Hay que verificar si valdria la pena traer otro lote',21.00,2353.53,253.66,98.00,66.00),('P-07042025-5','2025-04-07','2025-04-19','2025-04-21','TRACKEOPRUEBA2','',1,1,7,285.00,'',5.00,240.00,15.00,0.00,30.00),('P-10022025-3','2025-02-10','2025-02-15','2025-02-28','trackeo1','trackeo2',1,1,7,191.49,'',0.11,162.49,12.00,2.00,15.00),('P-14092025-9','2025-09-14','2025-09-20','2025-09-30','pedido de prueba','',1,1,5,285.00,'',NULL,250.00,10.00,0.00,25.00),('P-17092025-10','2025-09-17','2025-09-18','2025-09-27','TRACKEO INSUMO PRUEBA','',1,1,4,225.00,'',NULL,200.00,10.00,0.00,15.00),('P-27072025-6','2025-07-27','2025-08-12','2025-08-19','TRACKEO','',1,1,5,46.56,'',NULL,29.56,10.00,0.00,7.00);
/*!40000 ALTER TABLE `pedidobase` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_Insert_Historial_Pedido` AFTER INSERT ON `pedidobase` FOR EACH ROW BEGIN
    INSERT INTO HistorialEstadoPedido (CodigoPedido, EstadoAnterior, EstadoNuevo, FechaCambio)
    VALUES (NEW.CodigoPedido, NULL, NEW.EstadoPedidoFK, NOW());
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_Historial_Estado` BEFORE UPDATE ON `pedidobase` FOR EACH ROW BEGIN
    -- Solo registrar si el estado realmente cambió
    IF OLD.EstadoPedidoFK <> NEW.EstadoPedidoFK THEN
        INSERT INTO HistorialEstadoPedido (CodigoPedido, EstadoAnterior, EstadoNuevo, FechaCambio)
        VALUES (OLD.CodigoPedido, OLD.EstadoPedidoFK, NEW.EstadoPedidoFK, NOW());
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `pedidodetalles`
--

DROP TABLE IF EXISTS `pedidodetalles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidodetalles` (
  `IdPedidoDetallePK` int NOT NULL AUTO_INCREMENT,
  `IdCodigoPedidoFK` varchar(25) NOT NULL,
  `TipoArticuloFK` int NOT NULL,
  `FabricanteArticulo` int NOT NULL,
  `CategoriaArticulo` int NOT NULL,
  `SubcategoriaArticulo` int NOT NULL,
  `CantidadArticulo` int NOT NULL,
  `EnlaceArticulo` varchar(1000) DEFAULT NULL,
  `PrecioArticulo` decimal(6,2) DEFAULT NULL,
  `IdModeloPK` int NOT NULL,
  `EstadoArticuloPedido` tinyint(1) NOT NULL DEFAULT '1',
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IdPedidoDetallePK`),
  KEY `IdCodigoPedidoFK` (`IdCodigoPedidoFK`),
  KEY `TipoArticuloFK` (`TipoArticuloFK`),
  CONSTRAINT `pedidodetalles_ibfk_1` FOREIGN KEY (`IdCodigoPedidoFK`) REFERENCES `pedidobase` (`CodigoPedido`),
  CONSTRAINT `pedidodetalles_ibfk_2` FOREIGN KEY (`TipoArticuloFK`) REFERENCES `tipoarticulo` (`IdTipoArticuloPK`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidodetalles`
--

LOCK TABLES `pedidodetalles` WRITE;
/*!40000 ALTER TABLE `pedidodetalles` DISABLE KEYS */;
INSERT INTO `pedidodetalles` VALUES (1,'P-03022025-2',1,1,2,8,1,'https://www.ebay.com/itm/265724069655?_skw=nintendo+3ds&epid=691321883&itmmeta=01JK4M79BHD37BCWB684638X9Q&hash=item3dde638717:g:rlgAAOSw0DhhR-QJ&itmprp=enc%3AAQAJAAAA8HoV3kP08IDx%2BKZ9MfhVJKn3LUYYcObWqEg95TYiJTMAXYyJ1kapBX674JV%2Bb2lxFJsAvgeIbs2aRqgp%2B2OfNz7YM0N5sD84x5TurJ4lkOuTDA5Wfzm2M%2F%2BTdc3aerCes5yaCgPaPSiPoaSH%2BRqF7CnO10MhcW%2BMW8WKs%2Bf2NUeoa4PndQDSWLldyF7X%2FfPhUejjXnd1SwieQBOlVXVYMETowUIS%2BzQqHd8pcbUKe1Y5V8gJtephHcoLzlgb7Ie5EpYfiPH4JMqp5TZBTI%2BtrOTUZNxjLSzMMOpiVPPGFILGVQPByIYo4XzvcFAujmM0lg%3D%3D%7Ctkp%3ABFBM-pWdlJll',119.95,8,1,1),(2,'P-03022025-2',2,1,1,1,1,'https://www.ebay.com/itm/286297233870?_skw=gamecube+controller+indigo&itmmeta=01JK4MNZCFARHEZ0FJ733MX8KS&hash=item42a8a519ce:g:2oIAAOSwCUJnn18a&itmprp=enc%3AAQAJAAAA8HoV3kP08IDx%2BKZ9MfhVJKnBmegZ9eQ4JbK6mqz80UfKlyvzXr7OINIg7bDfqBwgnP3B%2BwrNLvNTKqlIoUrv73KNN8eXxlVgxOE642euF4Dda0Umi0x2OFiS794AhJXdY1VXYHmaV%2BP9lHuyvrNymIL1gPFBBUfW8OhifxDjJ6syQ9yIKz3RL8IouR6XoMAjBqcvMbQRt4lVGIj8fsVCEmpanHyjUCZi64bdzhp3T9lJX0%2BSydE%2BStaa8zngWDx25uBaraMtC1N%2FBiGavZ7AftHuGu3prcoMe5A6gkLpY7jhKkO%2FnPonlSxPjrLvXiXBZw%3D%3D%7Ctkp%3ABFBMsPbXlJll',41.99,1,1,1),(3,'P-10022025-3',1,1,8,59,1,'https://www.ebay.com/itm/297000221879?_skw=switch+lite&itmmeta=01JKPR6WZ6G9P4C16VFDFS8JW7&hash=item452697bcb7:g:rJgAAOSwllpnqOoT&itmprp=enc%3AAQAJAAAA4HoV3kP08IDx%2BKZ9MfhVJKm2unNTUbDHh9Gq6BGSpCW25okWBxn61WO%2FiT7a6%2BpDULdBnCYbiQt%2B8os3IdsctAuDLZ3nUDJQ%2FHSuq%2Fo8KJCOIz%2Bn5WaetPP5Rai5MnEM5dVeScIrRKND0knRIrMlOI%2B2XWrsk%2FEZeC%2B6g1SF6%2BFyopC2OQ4jpYZ3asFJYTjIUl32lS3Ha52M9tzSCtmQMNMi5TEIqiDx2mFK4Oiu7FDR5KrTN1Ykcq7EggT8a6z7srdh%2Bwr91l%2Bniu7S2yunfCZ1S1YmDShkWbhitEOJ%2BHLW%7Ctkp%3ABFBMjNCb2J1l',129.99,46,1,1),(4,'P-10022025-3',2,1,1,3,1,'https://www.ebay.com/itm/375715086355?_skw=gamecube+joystick+orange&itmmeta=01JKPR8J3FA0RB4VKK5ZZF0WXM&hash=item577a5d4013:g:Hl0AAOSwxE5lKaxu&itmprp=enc%3AAQAJAAAA0HoV3kP08IDx%2BKZ9MfhVJKlp9TCZClG1FmwVGXMkcF4kwG5UMw6Gu%2B05duafvcsihWIzC64a99Xprx%2FuXA7jlOf2cjo8JJbty8aYXRg45c5K0LwBSBq1CjEXlt9fbvheh7CfhMOQIAzqFzcvy0EbBo0PzKu8RDZYPbSEHnxkZjPCm6GbH2IK%2B7P8r%2FkSaXh4oUh7NaYGuBq%2FPVTQL7GaHZ0SSQvPlrzkiWBFUakmfRc7TP5caa9ytLsvFBj0ZvMqrT4Ez%2Bp%2BszwS5j6ZYDZ%2FNC8%3D%7Ctkp%3ABk9SR-6hotidZQ',32.50,3,1,1),(5,'P-03022025-2',1,1,1,5,1,'2',34.00,5,1,1),(6,'P-03032025-4',1,1,1,4,1,'https://www.ebay.com/itm/155306708906?_skw=gamecube+silver&var=455504920762&itmmeta=01JNCVFB7JGBNYPNGS3ZJ47HF0&hash=item2429004faa:g:6WgAAOSwFVNjl8u5&itmprp=enc%3AAQAKAAAA8FkggFvd1GGDu0w3yXCmi1e0n6fLho%2BR6zDVBaYXbbtQI0BCydf9ZbWd6VQV3cMudfOa3JWy1y0S%2FSMiyAG2QeRaaavVCJQVBbzsIcia%2Fze%2FQebjSoHzuxaYgNTdVtPqZCxsk28E1dxScP2LT%2FBXI7VF%2BKgtXkf%2FUhasb90zAQfSoUSe9ATkEIFjtlao8sgqcgOfvtt1Qc75qjGauZ019%2BMFo6jci6TWWaKhQsaC07jFZNK01Y1DVWC7ifVMFEL37G1O4D8cFEhmse8a7HTLg6vE1XxP6hi8GKznGRwTlKvm8V801TAglvplOcw9wri%2BJQ%3D%3D%7Ctkp%3ABFBM-LO9m6tl',179.99,4,1,1),(7,'P-03032025-4',2,1,1,3,1,'https://www.ebay.com/itm/255574577534?_skw=gamecube+controller+spice+orange&epid=141196572&itmmeta=01JNCVH9766NR9HVY19AWVF2RB&hash=item3b816e917e:g:yYMAAOSw1X1i-PeC&itmprp=enc%3AAQAKAAABAFkggFvd1GGDu0w3yXCmi1e6RN91iQLzxNtCi8KSWQvSlk3mVcJjoTnHk0hDOqnQclssptGtjeS6sWwoE9Hjz7sDWoJHY2MY7uwgpkTRLG5m%2FrJh6T1o9FUqsAWMqDdsWw4QPs%2BtsHnsbLQ6%2BzpmZWF%2Bgcf%2FPMLPM3jMHIgG9drHs9OG8hjYcwzW41QntoQ55fXD1KlTK6Upz2V0DpRqLCt5CF5VgTmV2iLrxwKSXKNK1R8Pm2i%2BYm9ITWxHqFM1q5VVR4sDTVc2NbYzIyoQsXQGpV%2Fr1scTvcYVwF7ByMf1FTocYs4jL0C%2F0%2BaztaZIfCeFZYDzmm6zTVNxzCGPaQo%3D%7Ctkp%3ABFBM3pPFm6tl',49.95,3,1,1),(8,'P-07042025-5',1,1,1,2,2,'asda',120.00,2,1,1),(9,'P-27072025-6',2,1,1,6,1,'https://www.ebay.com/itm/157141985790?_skw=gamecube+controller+silver&itmmeta=01K16WFH3BC49E09QAJ59QRSEZ&hash=item24966469fe:g:QicAAeSw7HpoQZqN&itmprp=enc%3AAQAKAAAA8FkggFvd1GGDu0w3yXCmi1fwkbP5uKhYlnIgQ8Q9BJD1sko%2BDu9RtOpJf%2BZ6CYXkixEnIVp8kfADeJnm2SdLa7QyzYZ4v4VbIRkBp8MT0hrmkfAHYR7u5C7Q%2FucGP3AsrfvwDO09EGQHSV11os1nd7Q9bL5%2BeJP2kUPnq5USl3MUJMpeXsihbTCQ%2FMUKdgZPmWL77bLyLmUyhAReWue2MYHw78xZwGfkoBmJJ9u8MTMpJXsPicshIpRePbflSqmKEH1loAwO77OopL2%2Btnp1q%2B1OLnhWCJeM%2FVuXVWsfgxuwZ7SG9UuZVI%2FXDyAnlTt%2BAg%3D%3D%7Ctkp%3ABFBMgpK-3Ilm',29.56,6,1,1),(10,'P-06082025-7',1,1,2,12,7,'https://www.ebay.com/itm/406079201055',99.99,12,1,1),(11,'P-06082025-7',1,1,2,12,1,'https://www.ebay.com/itm/406083780580',107.50,12,1,1),(12,'P-06082025-7',1,1,2,12,2,'https://www.ebay.com/itm/406083780632',110.50,12,1,1),(13,'P-06082025-7',1,1,2,9,3,'https://www.ebay.com/itm/406079201088',80.83,9,1,1),(14,'P-06082025-7',1,1,2,9,6,'www.ebay.com/itm/406079201079',80.00,9,1,1),(15,'P-06082025-7',1,1,2,8,6,'https://www.ebay.com/itm/406079345350',51.46,8,1,1),(16,'P-06082025-7',1,1,2,8,3,'https://www.ebay.com/itm/406079201061',44.83,8,1,1),(17,'P-06082025-7',1,1,2,8,3,'www.ebay.com/itm/406079352020',53.12,8,1,1),(18,'P-06082025-8',1,1,2,12,7,'https://www.ebay.com/itm/406079201055',99.99,12,1,1),(19,'P-06082025-8',1,1,2,12,1,'https://www.ebay.com/itm/406083780580',107.50,12,1,1),(20,'P-06082025-8',1,1,2,12,2,'https://www.ebay.com/itm/406083780632',110.50,12,1,1),(21,'P-06082025-8',1,1,2,9,3,'https://www.ebay.com/itm/406079201088',80.83,9,1,1),(22,'P-06082025-8',1,1,2,9,6,'www.ebay.com/itm/406079201079',80.00,9,1,1),(23,'P-06082025-8',1,1,2,8,6,'https://www.ebay.com/itm/406079345350',51.46,8,1,1),(24,'P-06082025-8',1,1,2,8,3,'https://www.ebay.com/itm/406079201061',44.83,8,1,1),(25,'P-06082025-8',1,1,2,8,3,'www.ebay.com/itm/406079352020',53.12,8,1,1),(26,'P-14092025-9',1,1,1,2,2,'',125.00,2,1,1),(27,'P-17092025-10',3,2,4,5,20,'',10.00,4,1,1);
/*!40000 ALTER TABLE `pedidodetalles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preingresoaccesorios`
--

DROP TABLE IF EXISTS `preingresoaccesorios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preingresoaccesorios` (
  `IdPreIngresoAccesorioPK` int NOT NULL AUTO_INCREMENT,
  `IdCodigoPedidoFK` varchar(25) NOT NULL,
  `IdUsuarioFK` int NOT NULL,
  `FormIndex` int NOT NULL,
  `ModeloAccesorio` int NOT NULL,
  `ColorAccesorio` varchar(100) NOT NULL,
  `EstadoAccesorio` int NOT NULL,
  `Comentario` varchar(10000) DEFAULT NULL,
  `PrecioBase` decimal(6,2) DEFAULT NULL,
  `CostoDistribuido` decimal(10,2) DEFAULT '0.00',
  `NumeroSerie` varchar(100) DEFAULT NULL,
  `ProductosCompatibles` varchar(500) DEFAULT NULL,
  `FechaCreacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `TareasPendientes` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`IdPreIngresoAccesorioPK`),
  UNIQUE KEY `idx_pedido_usuario_form_acc` (`IdCodigoPedidoFK`,`IdUsuarioFK`,`FormIndex`),
  KEY `IdUsuarioFK` (`IdUsuarioFK`),
  CONSTRAINT `preingresoaccesorios_ibfk_1` FOREIGN KEY (`IdCodigoPedidoFK`) REFERENCES `pedidobase` (`CodigoPedido`),
  CONSTRAINT `preingresoaccesorios_ibfk_2` FOREIGN KEY (`IdUsuarioFK`) REFERENCES `usuarios` (`IdUsuarioPK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preingresoaccesorios`
--

LOCK TABLES `preingresoaccesorios` WRITE;
/*!40000 ALTER TABLE `preingresoaccesorios` DISABLE KEYS */;
/*!40000 ALTER TABLE `preingresoaccesorios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preingresoinsumos`
--

DROP TABLE IF EXISTS `preingresoinsumos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preingresoinsumos` (
  `IdPreIngresoInsumoPK` int NOT NULL AUTO_INCREMENT,
  `IdCodigoPedidoFK` varchar(25) NOT NULL,
  `IdUsuarioFK` int NOT NULL,
  `FormIndex` int NOT NULL,
  `ModeloInsumo` int NOT NULL,
  `EstadoInsumo` int NOT NULL,
  `Comentario` varchar(10000) DEFAULT NULL,
  `PrecioBase` decimal(6,2) DEFAULT NULL,
  `CostoDistribuido` decimal(10,2) DEFAULT '0.00',
  `NumeroSerie` varchar(100) DEFAULT NULL,
  `ServiciosCompatibles` varchar(500) DEFAULT NULL,
  `Cantidad` int unsigned NOT NULL,
  `StockMinimo` int unsigned NOT NULL,
  `FechaCreacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `TareasPendientes` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`IdPreIngresoInsumoPK`),
  UNIQUE KEY `idx_pedido_usuario_form_ins` (`IdCodigoPedidoFK`,`IdUsuarioFK`,`FormIndex`),
  KEY `IdUsuarioFK` (`IdUsuarioFK`),
  CONSTRAINT `preingresoinsumos_ibfk_1` FOREIGN KEY (`IdCodigoPedidoFK`) REFERENCES `pedidobase` (`CodigoPedido`),
  CONSTRAINT `preingresoinsumos_ibfk_2` FOREIGN KEY (`IdUsuarioFK`) REFERENCES `usuarios` (`IdUsuarioPK`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preingresoinsumos`
--

LOCK TABLES `preingresoinsumos` WRITE;
/*!40000 ALTER TABLE `preingresoinsumos` DISABLE KEYS */;
INSERT INTO `preingresoinsumos` VALUES (1,'P-17092025-10',2,0,4,1,'',10.00,25.00,'',NULL,20,5,'2025-09-17 02:32:07',NULL);
/*!40000 ALTER TABLE `preingresoinsumos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preingresoproductos`
--

DROP TABLE IF EXISTS `preingresoproductos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preingresoproductos` (
  `IdPreIngresoProductoPK` int NOT NULL AUTO_INCREMENT,
  `IdCodigoPedidoFK` varchar(25) NOT NULL,
  `IdUsuarioFK` int NOT NULL,
  `FormIndex` int NOT NULL,
  `Modelo` int NOT NULL,
  `Color` varchar(100) NOT NULL,
  `Estado` int NOT NULL,
  `Hackeado` tinyint(1) NOT NULL DEFAULT '0',
  `Comentario` varchar(10000) DEFAULT NULL,
  `PrecioBase` decimal(10,2) DEFAULT NULL,
  `CostoDistribuido` decimal(10,2) DEFAULT '0.00',
  `NumeroSerie` varchar(100) DEFAULT NULL,
  `Accesorios` varchar(500) DEFAULT NULL,
  `FechaCreacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `TareasPendientes` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`IdPreIngresoProductoPK`),
  UNIQUE KEY `idx_pedido_usuario_form` (`IdCodigoPedidoFK`,`IdUsuarioFK`,`FormIndex`),
  KEY `IdUsuarioFK` (`IdUsuarioFK`),
  CONSTRAINT `preingresoproductos_ibfk_1` FOREIGN KEY (`IdCodigoPedidoFK`) REFERENCES `pedidobase` (`CodigoPedido`),
  CONSTRAINT `preingresoproductos_ibfk_2` FOREIGN KEY (`IdUsuarioFK`) REFERENCES `usuarios` (`IdUsuarioPK`)
) ENGINE=InnoDB AUTO_INCREMENT=687 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preingresoproductos`
--

LOCK TABLES `preingresoproductos` WRITE;
/*!40000 ALTER TABLE `preingresoproductos` DISABLE KEYS */;
/*!40000 ALTER TABLE `preingresoproductos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productosbases`
--

DROP TABLE IF EXISTS `productosbases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productosbases` (
  `CodigoConsola` varchar(25) NOT NULL,
  `Modelo` int NOT NULL,
  `Color` varchar(100) NOT NULL,
  `Estado` int NOT NULL,
  `Hackeado` tinyint(1) NOT NULL DEFAULT '0',
  `FechaIngreso` date DEFAULT NULL,
  `Comentario` varchar(10000) DEFAULT NULL,
  `PrecioBase` decimal(6,2) DEFAULT NULL,
  `NumeroSerie` varchar(100) DEFAULT NULL,
  `Accesorios` varchar(500) DEFAULT NULL,
  `IdIngreso` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`CodigoConsola`),
  UNIQUE KEY `IdIngreso` (`IdIngreso`),
  KEY `Modelo` (`Modelo`),
  KEY `Estado` (`Estado`),
  CONSTRAINT `productosbases_ibfk_1` FOREIGN KEY (`Modelo`) REFERENCES `catalogoconsolas` (`IdModeloConsolaPK`),
  CONSTRAINT `productosbases_ibfk_2` FOREIGN KEY (`Estado`) REFERENCES `catalogoestadosconsolas` (`CodigoEstado`)
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productosbases`
--

LOCK TABLES `productosbases` WRITE;
/*!40000 ALTER TABLE `productosbases` DISABLE KEYS */;
INSERT INTO `productosbases` VALUES ('CGCGI-43',68,'Morado',7,1,'2025-09-04','Listo, solo revision de funcion, sin lector de disco.',80.00,'','Mando de juego,Memoria,Cable AC,Cable de Video',44),('CGCS-45',69,'Morado',1,1,'2025-09-04','Listo, solo revision de funcion, sin lector de disco.',80.00,'','Mando de juego,Memoria,Cable AC,Cable de Video',46),('CGCS-46',69,'Negro',1,1,'2025-09-04','Listo, solo revision de funcion, sin lector de disco.',80.00,'','Mando de juego,Memoria,Cable AC,Cable de Video',47),('CGCS-47',69,'Verde',1,1,'2025-09-04','Listo, solo revision de funcion, sin lector de disco.',80.00,'','Mando de juego,Memoria,Cable AC,Cable de Video',48),('CGCS-48',69,'Azul',1,1,'2025-09-04','Listo, solo revision de funcion, sin lector de disco.',80.00,'','Mando de juego,Memoria,Cable AC,Cable de Video',49),('CGCS69-44',69,'Morado',7,1,'2025-09-04','Listo, solo revision de funcion, sin lector de disco.',80.00,'','Mando de juego,Memoria,Cable AC,Cable de Video',45),('CGCSB-41',66,'Azul',7,1,'2025-09-04','Listo, solo revision de funcion, sin lector de disco.',80.00,'','Mando de juego,Memoria,Cable AC,Cable de Video',42),('CGCSBL-42',67,'Negro',7,1,'2025-09-04','Listo, solo revision de funcion, sin lector de disco.',80.00,'','Mando de juego,Memoria,Cable AC,Cable de Video',43),('GBA-69',32,'Transparente',2,0,'2025-09-05','Revisar',50.00,'','Cable AC',70),('GBA-70',32,'Transparente Rojo',2,0,'2025-09-05','Revisar',50.00,'','Cable AC',71),('GBA-71',32,'Dorado',2,0,'2025-09-05','Revisar',50.00,'','Cable AC',72),('GBA-72',32,'Indigo',3,0,'2025-09-05','Revisar',50.00,'','Cable AC',73),('GBASP-49',33,'Naruto Naranja',1,0,'2025-09-04','Listo, solo revision de funcion.',65.00,'','Cable AC',50),('GBASP-50',33,'Gengar Morado',8,0,'2025-09-04','Listo, solo revision de funcion.',65.00,'','Cable AC,Protector Transparente',51),('GBASP-51',33,'Tansparente Negro',1,0,'2025-09-04','Listo',65.00,'','',52),('GBASP-52',33,'Transparente Verde',1,0,'2025-09-04','No enciende, bateria.',65.00,'','',53),('GBASP-53',33,'Transparente Azul',1,0,'2025-09-04','No enciende, Revisar',65.00,'','',54),('GBASP-54',33,'Transparente Rojo',9,0,'2025-09-04','Listo',65.00,'','',55),('GBC-73',31,'Amarillo',2,0,'2025-09-05','Revisar volumen',45.00,'','Cable AC',74),('GBC-74',31,'Transparente morado',2,0,'2025-09-05','Revisar funcion',45.00,'','Cable AC,Game Color GB',75),('GBC-75',31,'Transparente',2,0,'2025-09-05','Revisar funcion',45.00,'','Cable AC',76),('GBC-76',31,'Transparente morado',7,0,'2025-09-05','Revisar funcion',45.00,'','Cable AC',77),('GBP-77',29,'Transparente',2,0,'2025-09-05','Revisar funcion',45.00,'','Cable AC',78),('GCCSG-40',65,'Verde',7,1,'2025-09-04','Listo, solo revision de funcion, sin lector de disco.',80.00,'','Mando de juego,Memoria,Cable AC,Cable de Video',41),('GCI-22',2,'Morado',7,0,'2024-10-09','Recien venido de Japon.',1.00,'DN10029870','Mando de juego,Cable HDMI,Memoria,Cable AC',1),('GCI-38',2,'Indigo',2,1,'2025-09-04','Listo, solo revision de funcion, sin lector de disco.',40.00,'','Mando de juego,Memoria,Cable AC,Cable de Video',39),('GCI-84',2,'',7,0,'2025-09-14','P-14092025-9',142.50,'serie 1','Mando de juego',85),('GCI-85',2,'',7,0,'2025-09-14','P-14092025-9',142.50,'serie 2','Memoria,Cable AC,prueba',86),('GCJB-24',3,'Negro',7,0,'2024-10-09','Recien venido de Japon',1.00,'DNM10348086','Mando de juego,Cable HDMI,Memoria,Cable AC',2),('GCJB-36',3,'Negro',2,1,'2025-09-04','Listo, solo revision de funcion, sin lector de disco.',40.00,'','Mando de juego,Memoria,Cable AC,Cable de Video',37),('GCJB-37',3,'Negro',2,1,'2025-09-04','Listo, solo revision de funcion, sin lector de disco.',40.00,'','Mando de juego,Memoria,Cable AC,Cable de Video',38),('GCPS-32',4,'N/A',7,0,'2025-03-02','P-03032025-4',179.99,'generico','Mando de juego,Cable HDMI,Memoria,Cable AC',33),('GCPS-39',4,'Plateado',2,1,'2025-09-04','Listo, solo revision de funcion, sin lector de disco.',40.00,'','Mando de juego,Memoria,Cable AC,Cable de Video',40),('GCSO-23',5,'Naranja',7,0,'2024-10-09','Recien venido de Japon.',1.00,'DN11272771','Mando de juego,Cable HDMI,Memoria,Cable AC',3),('GCSO-25',5,'Naranja',7,1,'2024-10-09','Recien venido de Japon',1.00,'DN11272771','Mando de juego,Cable HDMI,Memoria,Cable AC',4),('N3DS-19',11,'Blsmco',7,0,'2024-10-09','',1.00,'','Cable AC',5),('N3DS-20',11,'Blanco',7,0,'2024-10-09','Recien venido de japon, blanco con puntos dorados parte frontal y dorado con puntos blancos Back',1.00,'','Cable AC,Stylus,Micro sd 32GB',6),('N3DS-21',11,'Morado',7,0,'2024-10-09','Recien venido de japon, morado con azul con tematica de monster x hunter',1.00,'','Cable AC,Stylus,Micro sd 32GB',7),('N3DSXL-86',12,'Azul',7,0,'2025-09-16','Pantalla Superior: Rota, necesita cambio\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\n\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK',112.61,'NDS0925','Pantalla de reemplazo,Glass superior,Cargador,Lapiz Stylus',87),('N3DSXL-87',12,'Azul',7,0,'2025-09-16','Pantalla Superior: Rota, necesita cambio\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\n\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK',112.61,'NDS0925','Pantalla de reemplazo,Glass superior,Cargador,Lapiz Stylus',89),('N3DSXL-88',12,'Azul',6,0,'2025-09-16','Pantalla Superior: Rota, necesita cambio\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\n\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK',112.61,'NDS0925','Pantalla de reemplazo,Glass superior,Cargador,Lapiz Stylus',91),('N3DSXL-89',12,'Azul',11,0,'2025-09-16','Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: Necesita cambio\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK',112.61,'QJF106363504','Lamina tactil,Cargador,Lapiz Stylus,Micro SD 64GB',92),('N3DSXL-90',12,'Azul',2,0,'2025-09-16','Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok',112.61,'NDS0927','Glass superior,Stylus,MicroSD 64GB,Cargador',93),('N3DSXL-91',12,'Negro',6,0,'2025-09-16','Firmware Brickeado\n',112.61,'QJF107489920','Pantalla Superior,Stylus',94),('N3DSXL-92',12,'Negro',6,0,'2025-09-16','Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok',112.61,'QJF121224484','Stylus,Cargador,MicroSD 64GB',95),('N3DSXL-93',12,'nEGRO',6,0,'2025-09-16','Pantalla Superior: qUEBRADA,\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok',112.61,'QJH10064667','Stylus,Cargador,MicroSD 64GB',96),('N3DSXL-94',12,'Verde',6,0,'2025-09-16','Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok',112.61,'QJF125274027','Stylus,Cargador,MicroSD 64GB',97),('N3DSXL-95',12,'Azul',2,0,'2025-09-16','Muy sucia, necesita limpieza profunda\n',120.12,'QJF1035219315','Stylus,MicroSD 64GB,Cargador,Glass Superior',98),('N3DSXL-96',12,'Azul',6,0,'2025-09-16','Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok',123.12,'QJH100703016','Bateria,Goma de palanca,MicroSD 64GB,Stylus',99),('N3DSXL-97',12,'Azul',2,0,'2025-09-16','Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok',123.12,'QJF130499590','Cargador,Micro SD 64GB,Lapiz stylus',100),('N64CHAR-55',14,'Negro',2,0,'2025-09-04','Revisar funcion y limpieza',80.00,'','Cable AC,Cable de Video,Control',56),('N64CHAR-56',14,'Negro',2,0,'2025-09-04','Revisar funcion y limpieza',80.00,'','Cable AC,Cable de Video,Control',57),('NDSi1-0',1,'Rojo',7,1,'2024-10-06','Consola de prueba',75.00,'TJF117713312','Cable AC,Stylus,Memoria SD',8),('NDSi1-1',1,'Blanco',2,0,'2024-10-06','Recien venido de Japon. Confirmar botones, Pantalla Tactil.Sigue en Inventario.',70.00,'TJM100775129','Cable AC,Stylus,Micro SD 32GB',9),('NDSi1-10',1,'Negro',2,0,'2024-10-06','Consola recien traida de Japon',70.00,'TJF122168701','Cable AC,Stylus,Micro sd 32GB',10),('NDSi1-13',1,'Rojo',2,0,'2024-10-06','Consola recien traida de Japon',70.00,'TJF122369764','Cable AC,Micro sd 32GB,Stylus',11),('NDSi1-14',1,'Rojo',3,0,'2024-10-06','Para repuesto, Sigue en Inventario.',70.00,'TJF117713312','Cable AC,Stylus,Micro sd 32GB',12),('NDSi1-15',1,'Lima',2,0,'2024-10-06','Recien traido de japon, podria requerir cambio de bateria, revisar botones. Sigue en Inventario.',70.00,'TJF121164445','Cable AC,Stylus,Micro SD 32GB',13),('NDSi1-16',1,'Lima',2,0,'2024-10-06','Consola recien traida de Japon. Sigue en Inventario.',70.00,'TJF110939313','Cable AC,Micro sd 32GB,Stylu',14),('NDSi1-17',1,'Rosado',2,0,'2024-10-06','Consola recien traida de Japon. Revisar pantallas. Sigue en Inventario.',70.00,'TJM108990999','Cable AC,Stylu,Micro sd 32GB',15),('NDSi1-2',1,'Blanco',2,0,'2024-10-06','Recien venido de japon. Puede requereir bateria nueva. Sigue en Inventario.',70.00,'TJF4084658','Cable AC,Stylus,Micro SD 32GB',16),('NDSi1-3',1,'Blanco',2,0,'2024-10-06','Consola recien venida de japon',70.00,'TJM103983811','Cable AC,stylus,Micro sd 32GB',17),('NDSi1-4',1,'Blanco',2,1,'2024-10-06','Consola recien traida de Japon',70.00,'TJF128105960','Cable AC,Micro sd 32GB,Stylus',18),('NDSi1-5',1,'Blanco',2,0,'2024-10-06','Consola recien traida de Japon. Sigue en Inventario.',70.00,'TJM101515649','Cable AC,Stylus,Micro sd 32GB',19),('NDSi1-57',1,'Negro',2,1,'2025-09-04','Listo, lipieza pendiente',70.00,'','Cable AC',58),('NDSi1-58',1,'Azul',2,1,'2025-09-04','Revisar hack de juegos.',70.00,'','Cable AC',59),('NDSi1-59',1,'Rojo',2,1,'2025-09-04','Listo.',70.00,'','Cable AC',60),('NDSi1-6',1,'Negro',2,0,'2024-10-06','Recien traido de Japon. La bateria podria requerir cambio. Sigue en Inventario.',70.00,'TJM111784646','Cable AC,Stylus,Micro SD 32GB',20),('NDSi1-60',1,'Negro',2,1,'2025-09-04','Revisar hack',70.00,'','Cable AC',61),('NDSi1-7',1,'Negro',2,0,'2024-10-06','Recien venido de japon. Puede requerir cambio de bateria, Sigue en Inventario.',70.00,'TJF107396662','Cable AC,Stylus,Micro SD 32GB',21),('NDSi1-8',1,'Negro',2,0,'2024-10-06','Recien venido de japon, puede requerir cambio de bateria, Sigue en Inventario.',70.00,'TJF109816687','Cable AC,Stylus,Micro SD 32GB',22),('NDSi1-9',1,'Negro',2,0,'2024-10-06','Consola recien traida de Japon',70.00,'TJF105039172','Cable AC,Stylus,Micro sd 32GB',23),('NDSL-11',36,'Rosado',7,0,'2024-10-06','Recien venido de japon. Puede requerir cambio de bateria\n',70.00,'TJM108990999','Cable AC,Stylus,Micro SD 32GB',24),('NDSL-12',36,'Lima',7,0,'2024-10-06','Recien venida de japon. Puede necesitar bateria nueva\n',70.00,'TJF110939313','Cable AC,Stylus,Micro SD 32GB',25),('NDSL-82',36,'Rosado',2,0,'2025-09-05','Pantalla buena, revisar hack.',10.00,'','Cable AC',83),('NES-31',59,'',7,0,'2024-10-13','Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestia',1.00,'123','Mando de juego,Cable HDMI,Memoria,Cable AC',26),('O3DS-107',8,'Azul',2,0,'2025-09-16','Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok',68.99,'CJF140150610','Micro SD 64GB,Lapiz Stylus,Cargador',110),('O3DS-108',8,'Celeste Mate',2,0,'2025-09-16','Pantalla Superior: OK,\n\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok',68.99,'CJM126278987','Cargador,Stylus,MicroSD 64GB',111),('O3DS-109',8,'Aqua',2,0,'2025-09-16','Pantalla Superior: \nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok',68.99,'CJF131304640','Stylus,Cargador,MicroSD 64GB',112),('O3DS-110',8,'Negro',3,0,'2025-09-16','Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok',68.99,'CJF130682077','Pantalla Superior,Glass superior,Pantalla Inferior,Lapiz Stylus,Micro SD 64GB,Cargador',113),('O3DS-111',8,'Negro',2,0,'2025-09-16','Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok',68.99,'CJF112970659','Bateria,Lapiz Stylus,Micro SD 64GB,Cargador,Glass superior',114),('O3DS-112',8,'Blanca',2,0,'2025-09-16','Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok',68.99,'CJF130863476','Cargador,Stylus,MicroSD 64GB',115),('O3DS-113',8,'Negro',2,0,'2025-09-16','Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok',62.36,'CJF124764123','Cargador,Stylus,MicroSD 64GB,Glass Superior',116),('O3DS-114',8,'Celeste Mate',2,0,'2025-09-16','Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok',62.36,'CJM126806494','Cargador,MicroSD 64GB,Stylus',117),('O3DS-115',8,'Rojo',6,0,'2025-09-16','Flex 3D dañado, Diagnostico pendiente. Bateria inflamada',62.36,'CJH105273262','Flex 3D,Bateria,Micro SD 64GB,Lapiz Stylus,Cargador',118),('O3DS-116',8,'Aqua',2,0,'2025-09-16','Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok',70.65,'CJF130369756','Glass superior,Lapiz Stylus,Micro SD 64GB,Cargador',119),('O3DS-117',8,'Azul',3,0,'2025-09-16','Quebrado, para piezas',70.65,'CJF139180895','Cargador,MicroSD 64GB,Stylus',120),('O3DS-118',8,'Aqua',2,0,'2025-09-16','Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok',70.65,'CJF101558622','Cargador,Stylus,MicroSD 64GB',121),('O3DS-26',8,'Celeste',7,0,'2024-10-09','Recien venido de Japon, sticker pegado',1.00,'','Cable AC,Stylus,Micro sd 32GB',27),('O3DS-27',8,'Celeste',7,0,'2024-10-09','Recien venido de Japon edicion monster X hunter 4',1.00,'CJM124317022','Cable AC,Stylus,Micro sd 32GB',28),('O3DS-78',8,'Rojo',2,0,'2025-09-05','Revision, Hack pendiente',60.00,'','Cable AC',79),('O3DS-79',8,'Celeste',2,0,'2025-09-05','Revisar bateria, Hack pendiente',60.00,'','Cable AC',80),('O3DSXL-100',9,'Blanco',2,0,'2025-09-16','Requiere limpieza profunda, muy sucio. Pantalla superior necesita limpieza por humedad en medio del glass\n',90.18,'SJF104952670','Glass superior,Cargador,Lapiz Stylus,Micro SD 64GB',103),('O3DSXL-101',9,'Rojo',2,0,'2025-09-16','Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok',89.35,'SJF117022452','Micro SD 64GB,Cargador,Lapiz Stylus,Glass superior',104),('O3DSXL-102',9,'Azul',2,0,'2025-09-16','Carcasa en bastante mal estado. Forrar o cambiar\n',89.35,'SJH105345662','Stylus,Cargador,MicroSD 64GB,Glass Superior,Frame pantalla inferior',105),('O3DSXL-103',9,'Azul',3,0,'2025-09-16','Parece daño por humedad, se apaga al instante. Sin Carcasa Inferior\n\nPENDIENTE TODO EL DIAGNOSTICO',89.35,'SJF111784394','Micro SD 64GB,Lapiz Stylus,Cargador,Pantalla Inferior',106),('O3DSXL-104',9,'Blanco',6,0,'2025-09-16','No enciende. Pantalla superior en corto (revisar flex 3D). No Incluye carcasa inferior, no incluye bateria',89.35,'SJF117925791','Pantalla Superior,Carcasa inferior,Bateria,Cargador,Lapiz Stylus,Micro SD 64GB,Frame pantalla inferior',107),('O3DSXL-105',9,'Rosado',2,0,'2025-09-16','No Incluye carcasa inferior, no incluye bateria\n',89.35,'SJF129955458','Cargador,Stylus,MicroSD 64GB',108),('O3DSXL-106',9,'Teal',3,0,'2025-09-16','Destruido por humedad (Potencial perdida)',89.35,'SJF141442394','',109),('O3DSXL-80',9,'Rosado pastel',2,0,'2025-09-05','Revisar pantalla y hack',40.00,'','Cable AC',81),('O3DSXL-81',9,'Negro',2,0,'2025-09-05','Revisar bateria y hack',60.00,'','Cable AC',82),('O3DSXL-98',9,'Negro',6,0,'2025-09-16','Pantalla Superior: OK\nPantalla Inferior: \nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok',90.18,'NDS09160','Pantalla Inferior,Bateria,Cargador,Lapiz Stylus,Micro SD 64GB,Frame de pantalla Inferior',101),('O3DSXL-99',9,'Negro',2,0,'2025-09-16','Pantalla Superior: OK\nPantalla Inferior: OK\nTactil: OK\n3D: Ok\nVolumen: Ok\nBateria: OK\nABXY: OK\nDireccionales: OK\nPalanca: OK\nGoma de palanca: OK\nL y R: OK\nTactil: OK\nPuerto de carga: Pendiente\nLector de cartucho: Pendiente\nWiFi: OK\nCamara: Ok',90.18,'SJF139178601','Bateria,Lapiz Stylus,Cargador,Micro SD 64GB',102),('PS2FAT5-30',52,'Azul',7,0,'2024-10-09','Recien venido de Japon, sin accesorios.',1.00,'00272029045257918','Cable AC',29),('PS2FAT5-61',52,'Azul mate',2,0,'2025-09-05','Hack pendiente',80.00,'','Mando de juego,Cable HDMI,Memoria,Cable AC',62),('PS2FAT5-62',52,'Plateado',2,0,'2025-09-05','Hack pendiente',80.00,'','Mando de juego,Cable HDMI,Memoria,Cable AC',63),('PS2FAT5-65',52,'Azul Metalico',2,0,'2025-09-05','Hack Pendiente',80.00,'','Mando de juego,Cable HDMI,Memoria,Cable AC',66),('PS2FAT6-63',53,'Blanco',2,0,'2025-09-05','Hack pendiente',80.00,'','Mando de juego,Cable HDMI,Memoria,Cable AC',64),('PS2FAT6-64',53,'Blanco',2,0,'2025-09-05','Hack pendiente',80.00,'','Mando de juego,Cable HDMI,Memoria,Cable AC',65),('PS2SLIM-18',54,'negro',7,0,'2024-10-06','prueba post',100.00,'1','Mando de juego,Cable HDMI,Memoria,Cable AC',30),('PS2SLIM-68',54,'Blanco',2,0,'2025-09-05','Hack pendiente',80.00,'','Mando de juego,Cable HDMI,Memoria,Cable AC',69),('PS2SLIM2-67',56,'Blanco',2,0,'2025-09-05','Hack pendiente',80.00,'','Mando de juego,Cable HDMI,Memoria,Cable AC',68),('PS2SLIM4-66',58,'Rojo',2,0,'2025-09-05','Hack pendiente',80.00,'','Mando de juego,Cable HDMI,Memoria,Cable AC',67),('SNESM-83',62,'Original',2,0,'2025-09-05','Revisar funcion',40.00,'','Mando de juego,Cable HDMI,Cable AC',84),('WU32GB-28',39,'Negro',7,0,'2024-10-09','Recien venido de Japon, no hay video en HDMI|AV',1.00,'FJH100608434','Cable HDMI,Mando de Monitor,Cable AC,Cable AC de gamepad,Stylus,Memoria USB 256Gb,Micro sd 32Gb',31),('WU32GB-29',39,'Blanco',7,0,'2024-10-09','Recien venido de Japon, No enciende, el Gamepad de es negro.',1.00,'FJH109860437','Cable HDMI,Mando de Monitor,Cable AC,Cable AC para Gamepad,Micro sd 32Gb,Memoria USB 250Gb,Stylus',32),('WU32GB-34',64,'Blanco',2,1,'2025-09-04','Revisar, USB pendiente',60.00,'','Mando de juego,Cable HDMI,Memoria,Cable AC',35),('WU32GB-35',64,'Blanco',2,1,'2025-09-04','Revisar, USB lista',60.00,'','Mando de juego,Cable HDMI,Memoria,Cable AC',36),('WU32GB64-33',64,'Blanco',7,1,'2025-09-04','Revisar, USB pendiente',60.00,'','Mando de juego,Cable HDMI,Memoria,Cable AC',34);
/*!40000 ALTER TABLE `productosbases` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_Insert_Historial_Producto` AFTER INSERT ON `productosbases` FOR EACH ROW BEGIN
    INSERT INTO HistorialEstadoProducto (CodigoConsola, EstadoAnterior, EstadoNuevo, FechaCambio)
    VALUES (NEW.CodigoConsola, NULL, NEW.Estado, NOW());
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_Historial_Estado_Producto` BEFORE UPDATE ON `productosbases` FOR EACH ROW BEGIN
    -- Solo registrar si el estado realmente cambió
    IF OLD.Estado <> NEW.Estado THEN
        INSERT INTO HistorialEstadoProducto (CodigoConsola, EstadoAnterior, EstadoNuevo, FechaCambio)
        VALUES (OLD.CodigoConsola, OLD.Estado, NEW.Estado, NOW());
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `IdRolPK` int NOT NULL AUTO_INCREMENT,
  `NombreRol` varchar(50) NOT NULL,
  PRIMARY KEY (`IdRolPK`),
  UNIQUE KEY `NombreRol` (`NombreRol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin'),(3,'Logistica'),(2,'Vendedor');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `serviciosbase`
--

DROP TABLE IF EXISTS `serviciosbase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `serviciosbase` (
  `IdServicioPK` int NOT NULL AUTO_INCREMENT,
  `DescripcionServicio` varchar(255) DEFAULT NULL,
  `Estado` tinyint(1) NOT NULL DEFAULT '1',
  `PrecioBase` decimal(6,2) DEFAULT NULL,
  `Comentario` varchar(10000) DEFAULT NULL,
  `FechaIngreso` date DEFAULT NULL,
  PRIMARY KEY (`IdServicioPK`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `serviciosbase`
--

LOCK TABLES `serviciosbase` WRITE;
/*!40000 ALTER TABLE `serviciosbase` DISABLE KEYS */;
INSERT INTO `serviciosbase` VALUES (1,'Cambio de joystick magnetico generico',1,35.00,'Individual','2025-07-27'),(2,'Chipeo Switch V1/V2',1,80.00,'','2025-07-27'),(3,'Chipeo Switch v1/v2 Picofly',1,70.00,'','2025-07-27'),(4,'Chipeo Switch Lite',1,75.00,'','2025-07-27'),(5,'Chipeo Switch Lite Picofly',1,70.00,'','2025-07-27'),(6,'Chipeo Switch Oled',1,120.00,'','2025-07-27'),(7,'Chipeo Switch OLED',1,100.00,'','2025-07-27'),(8,'Matenimiento PS4',1,35.00,'Limpieza profunda y cambio de pasta termica.','2025-08-02'),(9,'Mantenimiento General Switch',1,25.00,'Pasta termica','2025-09-14'),(10,'Cambio de Joystick de Joycon V1, V2 y OLED',1,10.00,'','2025-09-14'),(11,'Cambio de Joystick de Joycon Switch Lite',1,35.00,'','2025-09-14');
/*!40000 ALTER TABLE `serviciosbase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sitioweb`
--

DROP TABLE IF EXISTS `sitioweb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sitioweb` (
  `CodigoSitioWeb` int NOT NULL AUTO_INCREMENT,
  `DescripcionSitioWeb` varchar(100) NOT NULL,
  PRIMARY KEY (`CodigoSitioWeb`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sitioweb`
--

LOCK TABLES `sitioweb` WRITE;
/*!40000 ALTER TABLE `sitioweb` DISABLE KEYS */;
INSERT INTO `sitioweb` VALUES (1,'Ebay'),(2,'AliExpress'),(3,'Amazon'),(4,'Mercado Libre'),(5,'Otros');
/*!40000 ALTER TABLE `sitioweb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategoriasaccesorios`
--

DROP TABLE IF EXISTS `subcategoriasaccesorios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategoriasaccesorios` (
  `IdSubcategoriaAccesorio` int NOT NULL AUTO_INCREMENT,
  `NombreSubcategoriaAccesorio` varchar(100) DEFAULT NULL,
  `IdCategoriaAccesorioFK` int DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IdSubcategoriaAccesorio`),
  KEY `IdCategoriaAccesorioFK` (`IdCategoriaAccesorioFK`),
  CONSTRAINT `subcategoriasaccesorios_ibfk_1` FOREIGN KEY (`IdCategoriaAccesorioFK`) REFERENCES `categoriasaccesorios` (`IdCategoriaAccesorioPK`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategoriasaccesorios`
--

LOCK TABLES `subcategoriasaccesorios` WRITE;
/*!40000 ALTER TABLE `subcategoriasaccesorios` DISABLE KEYS */;
INSERT INTO `subcategoriasaccesorios` VALUES (1,'Indigo',1,1),(2,'Jet Black',1,1),(3,'Naranja',1,1),(4,'Blanco',1,1),(5,'Emerald Green',1,1),(6,'Plateado',1,1),(7,'Dorado',1,1),(8,'Club Nintendo Mario',1,1),(9,'Smash 4 Edition',1,1),(10,'Smash Ultimate Edition',1,1),(11,'Blanco',2,1),(12,'Wavebird',1,0),(13,'Wavebird',1,1),(14,'GameCube',4,0),(15,'Silver',4,1),(16,'Black',4,1),(17,'Indigo',4,1),(18,'Gameboy Advance SP Transparente',5,0),(19,'GameBoy Advance SP',5,1),(20,'Control HORI',6,0),(21,'Control HORI',7,1),(22,'DSi Lite',8,0),(23,'DS',8,0),(24,'Game Color GB',9,1),(25,'Blanco',10,1),(26,'America',11,1),(27,'Japonesa',11,1),(28,'GameBoy Advance SP',12,1),(29,'Famicom',14,0),(30,'Famicom Mini',14,1),(31,'Negro',2,1),(32,'Gris',15,1),(33,'PS2 SCPH-70100',16,1),(34,'PS2',17,0),(35,'PS2 Original',17,1),(36,'PS2 HDMI',17,1),(37,'DS lite',8,1),(38,'3DS',18,1);
/*!40000 ALTER TABLE `subcategoriasaccesorios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategoriasinsumos`
--

DROP TABLE IF EXISTS `subcategoriasinsumos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategoriasinsumos` (
  `IdSubcategoriaInsumos` int NOT NULL AUTO_INCREMENT,
  `NombreSubcategoriaInsumos` varchar(100) DEFAULT NULL,
  `IdCategoriaInsumosFK` int DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IdSubcategoriaInsumos`),
  KEY `IdCategoriaInsumosFK` (`IdCategoriaInsumosFK`),
  CONSTRAINT `subcategoriasinsumos_ibfk_1` FOREIGN KEY (`IdCategoriaInsumosFK`) REFERENCES `categoriasinsumos` (`IdCategoriaInsumosPK`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategoriasinsumos`
--

LOCK TABLES `subcategoriasinsumos` WRITE;
/*!40000 ALTER TABLE `subcategoriasinsumos` DISABLE KEYS */;
INSERT INTO `subcategoriasinsumos` VALUES (1,'Power A',1,1),(2,'3 en 1',2,1),(3,'Tiny',3,1),(4,'32GB',4,1),(5,'64GB',4,1),(6,'Flux',5,1),(7,'Estaño',5,1),(8,'Malla para soldar',5,1);
/*!40000 ALTER TABLE `subcategoriasinsumos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategoriasproductos`
--

DROP TABLE IF EXISTS `subcategoriasproductos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategoriasproductos` (
  `IdSubcategoria` int NOT NULL AUTO_INCREMENT,
  `NombreSubcategoria` varchar(100) DEFAULT NULL,
  `IdCategoriaFK` int DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IdSubcategoria`),
  KEY `IdCategoriaFK` (`IdCategoriaFK`),
  CONSTRAINT `subcategoriasproductos_ibfk_1` FOREIGN KEY (`IdCategoriaFK`) REFERENCES `categoriasproductos` (`IdCategoriaPK`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategoriasproductos`
--

LOCK TABLES `subcategoriasproductos` WRITE;
/*!40000 ALTER TABLE `subcategoriasproductos` DISABLE KEYS */;
INSERT INTO `subcategoriasproductos` VALUES (2,'Indigo',1,1),(3,'Jet Black',1,1),(4,'Platinum Silver',1,1),(5,'Spice Orange',1,1),(6,'Pearl White',1,1),(7,'Metroid Prime Bundle',1,1),(8,'OLD 3DS',2,1),(9,'OLD 3DSXL',2,1),(10,'OLD 2DS',2,1),(11,'NEW 3DS',2,1),(12,'NEW 3DSXL',2,1),(13,'NEW 2DSXL',2,1),(14,'Nintendo 64 Standard Charcoal Console',3,1),(15,'Nintendo 64 Funtastic Jungle Green Console',3,1),(16,'Nintendo 64 Funtastic Ice Blue Console',3,1),(17,'Nintendo 64 Funtastic Grape Purple Console',3,1),(18,'Nintendo 64 Funtastic Fire Orange Console',3,1),(19,'Nintendo 64 Funtastic Smoke / Clear Black Console',3,1),(20,'Nintendo 64 Funtastic Watermelon Red Console',3,1),(21,'Nintendo 64 Clear White / Blue Console',3,1),(22,'Nintendo 64 Clear White / Red Console',3,1),(23,'Nintendo 64 Pikachu Dark Blue Console',3,1),(24,'Nintendo 64 Pikachu Light Blue Console',3,1),(25,'Nintendo 64 Pikachu Orange Console',3,1),(26,'Nintendo 64 Battle Set Console',3,1),(27,'Nintendo 64 Gold Console',3,1),(28,'Gameboy Original',4,1),(29,'Gameboy Pocket',4,1),(30,'Gameboy Light',4,1),(31,'Gameboy Color',4,1),(32,'Gameboy Advance',4,1),(33,'Gameboy Advance SP',4,1),(34,'Gameboy Micro',4,1),(35,'Nintendo DS',5,1),(36,'Nintendo DS Lite',5,1),(37,'Nintendo DSi',5,1),(38,'Nintendo DSi XL',5,1),(39,'Wii U (WUP-001 - 8 GB Model)',6,1),(40,'Wii U (WUP-101 - 32 GB Model)',6,1),(41,'Nintendo Wii White Console',7,1),(42,'Nintendo Wii Black Console',7,1),(43,'Nintendo Wii Mini Console',7,1),(44,'Nintendo Wii Light Blue Console',7,1),(45,'SCPH-10000/15000 (2000)',9,1),(46,'SCPH-18000 (2000)',9,1),(47,'SCPH-300xx (2001-2002)',9,1),(48,'SCPH-370xx (2002)',9,1),(49,'SCPH-390xx (2002-2003)',9,1),(50,'SCPH-500xx (2003-2004)',9,1),(51,'SCPH-700xx (2004-2005)',10,1),(52,'SCPH-750xx (2005-2006)',10,1),(53,'SCPH-770xx (2006-2007)',10,1),(54,'SCPH-790xx (2007)',10,1),(55,'SCPH-900xx (2007-2013)',10,1),(57,'Switch V1 (2017)',8,1),(58,'Switch V2',8,1),(59,'Switch Lite',8,1),(60,'Switch Oled',8,1),(61,'NES / FAMICOM Standard',13,1),(62,'NES / FAMICON Mini',13,1),(63,'SNES / SUPER FAMICOM',14,1),(64,'SNES Mini',14,1),(65,'Standard',15,1),(66,'Blanco',11,1),(67,'Negro',11,0),(68,'Wii U W(WUP-101 - 32 GB Model)',6,1),(69,'Clear Shell Indigo',1,0),(70,'Clear Shell Black',1,0),(71,'Clear Shell Blue',1,0),(72,'Clear Shell Green',1,0),(73,'Clear Shell',1,1);
/*!40000 ALTER TABLE `subcategoriasproductos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tareasdeaccesorios`
--

DROP TABLE IF EXISTS `tareasdeaccesorios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tareasdeaccesorios` (
  `IdTareaAccesorioPK` int NOT NULL AUTO_INCREMENT,
  `DescripcionTarea` varchar(100) DEFAULT NULL,
  `Realizado` tinyint(1) NOT NULL DEFAULT '0',
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  `IdCodigoAccesorioFK` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`IdTareaAccesorioPK`),
  KEY `IdCodigoAccesorioFK` (`IdCodigoAccesorioFK`),
  CONSTRAINT `tareasdeaccesorios_ibfk_1` FOREIGN KEY (`IdCodigoAccesorioFK`) REFERENCES `accesoriosbase` (`CodigoAccesorio`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tareasdeaccesorios`
--

LOCK TABLES `tareasdeaccesorios` WRITE;
/*!40000 ALTER TABLE `tareasdeaccesorios` DISABLE KEYS */;
INSERT INTO `tareasdeaccesorios` VALUES (1,'Limpiar',0,1,'GCW-1'),(2,'Limpiar',1,1,'GCS-8'),(3,'Limpiar',1,1,'GCO-12'),(4,'Revisar L',0,1,'GCCI-38'),(5,'Revisar drift',0,1,'GCCI-38'),(6,'Revisar L',0,1,'GCCI-39'),(7,'Revisar drift',0,1,'GCCI-39'),(8,'Probar',0,1,'GCS-42'),(9,'Probar',0,1,'GCW-43'),(10,'Proba',0,1,'GCW-44'),(11,'Probar',0,1,'GCW-45'),(12,'Testear',0,1,'GCW-46'),(13,'Testear',0,1,'GCW-47'),(14,'Testear',0,1,'GCS-48'),(15,'Testear',0,1,'GCS-49'),(16,'Testear',0,1,'GCS-50'),(17,'Testear',0,1,'GCS-51'),(18,'Limpiar manchas',0,1,'GCSM4-52'),(19,'Testear',0,1,'GCSM4-52'),(20,'Testear',0,1,'GCB-53'),(21,'Limpiar',0,1,'GCB-54'),(22,'Testear',0,1,'GCCI-56'),(23,'Testear',0,1,'GCCI-57'),(24,'Testear',0,1,'GCCI-58'),(25,'Testear',0,1,'GCCI-59'),(26,'Testear',0,1,'GCCI-60'),(27,'Testear',0,1,'GCCI-61'),(28,'Testear',0,1,'GCCI-62'),(29,'Testear',0,1,'GCO-63'),(30,'Testear',0,1,'GCO-64'),(31,'Testear',0,1,'GCO-65'),(32,'Testear',0,1,'GCO-66'),(33,'Testear',0,1,'GCO-67'),(34,'Testear',0,1,'GCO-68'),(35,'Testear',0,1,'GCO-69'),(36,'Testear',0,1,'GCO-70'),(37,'Testear',0,1,'GCO-71'),(38,'Testear',0,1,'GCO-72'),(39,'Testear',0,1,'GCB-73'),(40,'Testear',0,1,'GCS-74'),(41,'Testear',0,1,'GCS-75'),(42,'Limpiar',0,1,'GCO-76'),(43,'Limpiar',0,1,'CGWB13-78'),(44,'Limpiar',0,1,'CGWB13-79'),(45,'Revision',0,1,'CGWB13-79'),(46,'Limpiar',0,1,'CGWB13-80'),(47,'Revision',0,1,'CGWB13-80'),(48,'Limpiar',0,1,'CGWB13-81'),(49,'Limpiar',0,1,'GPS-83'),(50,'Limpiar',0,1,'GPS-84'),(51,'Limpiar',0,1,'GPS-85'),(52,'Limpiar',0,1,'GPS-86'),(53,'Limpiar',0,1,'GPB-87'),(54,'Limpiar',0,1,'GPI-88'),(55,'Limpiar',0,1,'GPI-89'),(56,'Limpiar',0,1,'GPI-90'),(57,'Limpiar',0,1,'PGBASP22-91'),(58,'Limpiar',0,1,'N64CH23-92'),(59,'Limpiar',0,1,'N64CH23-93'),(60,'Limpiar',0,1,'N64CH23-94'),(61,'Limpiar',0,1,'N64CH23-95'),(62,'Limpiar',0,1,'N64CH-96'),(63,'Limpiar',0,1,'N64CH-97'),(64,'Limpiar',0,1,'N64CH-98'),(65,'Limpiar',0,1,'N64CH-99'),(66,'Limpiar',0,1,'DSBT-100'),(67,'Limpiar',0,1,'GBFCGB26-101'),(68,'Revisar',0,1,'GBFCGB26-101'),(69,'Limpiar',0,1,'GBFCGB26-102'),(70,'Revisar',0,1,'GBFCGB26-102'),(71,'Limpiar',0,1,'GBFCGB-103'),(72,'Revisar',0,1,'GBFCGB-103'),(73,'Limpiar',0,1,'GBFCGB-104'),(74,'Revisar',0,1,'GBFCGB-104'),(75,'Limpiar',0,1,'DCC-105'),(76,'Limpiar',0,1,'DCVMUA-106'),(77,'Limpiar',0,1,'DCVMUA-107'),(78,'Limpiar',0,1,'DCVMUJ29-108'),(79,'Limpiar',0,1,'DCVMUJ-109'),(80,'Limpiar',0,1,'SFCM-110'),(81,'Limpiar',0,1,'PS2CBL32-111'),(82,'Revisar',0,1,'PS2CBL32-111'),(83,'Limpiar',0,1,'PS2CBL32-112'),(84,'Revisar',0,1,'PS2CBL32-112'),(85,'Limpiar',0,1,'PS1G34-113'),(86,'Limpiar',0,1,'PS1G34-114'),(87,'Revisar',0,1,'PS1G34-114'),(88,'Limpiar',0,1,'PS2CBL-115'),(89,'Revisar',0,1,'PS2CBL-115'),(90,'Limpiar',0,1,'PS2CBL-116'),(91,'Revisar',0,1,'PS2CBL-116'),(92,'Limpiar',0,1,'PS1G-117'),(93,'Revisar',0,1,'PS1G-117'),(94,'Limpiar',0,1,'PS1G-118'),(95,'Revisar',0,1,'PS1G-118'),(96,'Limpiar',0,1,'PS2CW-119'),(97,'Revisar',0,1,'PS2CW-119'),(98,'Limpiar',0,1,'PS2CW-120'),(99,'Revisar',0,1,'PS2CW-120'),(100,'Limpiar',0,1,'PS2CW-121'),(101,'Revisar',0,1,'PS2CW-121'),(102,'Limpiar',0,1,'PS2CW-122'),(103,'Revisar',0,1,'PS2CW-122'),(104,'Limpiar',0,1,'PS2CW-123'),(105,'Revisar',0,1,'PS2CW-123'),(106,'Limpiar',0,1,'PS2AC135-124'),(107,'Limpiar',0,1,'PS2AC135-125'),(108,'Limpiar',0,1,'PS2AC-126'),(109,'Limpiar',0,1,'PS2AC-127'),(110,'Limpiar',0,1,'PS2O-128');
/*!40000 ALTER TABLE `tareasdeaccesorios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tareasdeinsumos`
--

DROP TABLE IF EXISTS `tareasdeinsumos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tareasdeinsumos` (
  `IdTareaInsumosPK` int NOT NULL AUTO_INCREMENT,
  `DescripcionTarea` varchar(100) DEFAULT NULL,
  `Realizado` tinyint(1) NOT NULL DEFAULT '0',
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  `IdCodigoInsumoFK` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`IdTareaInsumosPK`),
  KEY `IdCodigoInsumoFK` (`IdCodigoInsumoFK`),
  CONSTRAINT `tareasdeinsumos_ibfk_1` FOREIGN KEY (`IdCodigoInsumoFK`) REFERENCES `insumosbase` (`CodigoInsumo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tareasdeinsumos`
--

LOCK TABLES `tareasdeinsumos` WRITE;
/*!40000 ALTER TABLE `tareasdeinsumos` DISABLE KEYS */;
/*!40000 ALTER TABLE `tareasdeinsumos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tareasdeproductos`
--

DROP TABLE IF EXISTS `tareasdeproductos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tareasdeproductos` (
  `IdTareaPK` int NOT NULL AUTO_INCREMENT,
  `DescripcionTarea` varchar(100) DEFAULT NULL,
  `Realizado` tinyint(1) NOT NULL DEFAULT '0',
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  `IdCodigoConsolaFK` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`IdTareaPK`),
  KEY `IdCodigoConsolaFK` (`IdCodigoConsolaFK`),
  CONSTRAINT `tareasdeproductos_ibfk_1` FOREIGN KEY (`IdCodigoConsolaFK`) REFERENCES `productosbases` (`CodigoConsola`)
) ENGINE=InnoDB AUTO_INCREMENT=294 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tareasdeproductos`
--

LOCK TABLES `tareasdeproductos` WRITE;
/*!40000 ALTER TABLE `tareasdeproductos` DISABLE KEYS */;
INSERT INTO `tareasdeproductos` VALUES (1,'Limpiar',0,1,'NDSi1-0'),(2,'Flashear',0,1,'NDSi1-0'),(3,'Flasheo',0,1,'NDSi1-1'),(4,'Limpieaz general',0,1,'NDSi1-1'),(5,'Confirmar Botones',0,1,'NDSi1-1'),(6,'Confirmar camara',0,1,'NDSi1-1'),(7,'confirmar Wifi',0,1,'NDSi1-1'),(8,'Confirmar lector de cartuchos',0,1,'NDSi1-1'),(9,'Flasheo',0,1,'NDSi1-2'),(10,'Limpieza General',0,1,'NDSi1-2'),(11,'Confirmar lector de cartucho',0,1,'NDSi1-2'),(12,'confirmar botones',0,1,'NDSi1-2'),(13,'confirmar Wifi',0,1,'NDSi1-2'),(14,'Confirmar Camara',0,1,'NDSi1-2'),(15,'Confirmar pantalla tactil',0,1,'NDSi1-2'),(16,'Limpiar',0,1,'NDSi1-3'),(17,'Hackear',0,1,'NDSi1-3'),(18,'Revisar lector cartucho',0,1,'NDSi1-3'),(19,'Revisar botones',0,1,'NDSi1-3'),(20,'Revisar pantalla tactil',0,1,'NDSi1-3'),(21,'Revisar camara',0,1,'NDSi1-3'),(22,'Limpiar',0,1,'NDSi1-4'),(23,'Revisar camara',0,1,'NDSi1-4'),(24,'Revisar lector de cartucho',0,1,'NDSi1-4'),(25,'Revisar pantalla tactil',0,1,'NDSi1-4'),(26,'Hackear',0,1,'NDSi1-4'),(27,'Revisar botones',0,1,'NDSi1-4'),(28,'Limpiar',0,1,'NDSi1-5'),(29,'Revisar camara',0,1,'NDSi1-5'),(30,'Revisar botones',0,1,'NDSi1-5'),(31,'Revisar pantalla tactil',0,1,'NDSi1-5'),(32,'Revisar lector de cartucho',0,1,'NDSi1-5'),(33,'Hackear',0,1,'NDSi1-5'),(34,'Limpiar',0,1,'NDSi1-6'),(35,'Flasheo',0,1,'NDSi1-6'),(36,'Confirmar lector de cartucho',0,1,'NDSi1-6'),(37,'Confirmar pantalla tactil',0,1,'NDSi1-6'),(38,'Confirmar Camara',0,1,'NDSi1-6'),(39,'Confirmar Botones',0,1,'NDSi1-6'),(40,'Confirmar Wifi',0,1,'NDSi1-6'),(41,'Limpiar',0,1,'NDSi1-7'),(42,'Falsheo',0,1,'NDSi1-7'),(43,'Confirmar lector de cartucho',0,1,'NDSi1-7'),(44,'Confirmar pantalla tactil',0,1,'NDSi1-7'),(45,'Confirmar botones',0,1,'NDSi1-7'),(46,'Confirmar Camara',0,1,'NDSi1-7'),(47,'Confirmar Wifi',0,1,'NDSi1-7'),(48,'Limpiar',0,1,'NDSi1-8'),(49,'Flasheo',0,1,'NDSi1-8'),(50,'Confirmar lector de Cartucho',0,1,'NDSi1-8'),(51,'Confirmar botones',0,1,'NDSi1-8'),(52,'Confirmar pantalla tactil',0,1,'NDSi1-8'),(53,'Confirmar camara',0,1,'NDSi1-8'),(54,'Confirmar Wifi',0,1,'NDSi1-8'),(55,'Limpiar',0,1,'NDSi1-9'),(56,'Hackear',0,1,'NDSi1-9'),(57,'Revisar lector de cartucho',0,1,'NDSi1-9'),(58,'Revisar camara',0,1,'NDSi1-9'),(59,'Revisar WI-FI',0,1,'NDSi1-9'),(60,'Revisar botones',0,1,'NDSi1-9'),(61,'Revisar patalla tactil',0,1,'NDSi1-9'),(62,'Limpiar',0,1,'NDSi1-10'),(63,'Revisar patalla tactil',0,1,'NDSi1-10'),(64,'Revisar botones',0,1,'NDSi1-10'),(65,'Revisar WI-FI',0,1,'NDSi1-10'),(66,'Hackear',0,1,'NDSi1-10'),(67,'Revisar lector de cartucho',0,1,'NDSi1-10'),(68,'Limpiar',0,1,'NDSL-11'),(69,'Flasheo',0,1,'NDSL-11'),(70,'Revisar lector de cartucho',0,1,'NDSL-11'),(71,'Revisar patalla tactil',0,1,'NDSL-11'),(72,'Revisar botones',0,1,'NDSL-11'),(73,'Revisar Wifi',0,1,'NDSL-11'),(74,'Rrevisar camara',0,1,'NDSL-11'),(75,'Limpiar',0,1,'NDSL-12'),(76,'Flasheo',0,1,'NDSL-12'),(77,'Revisar lector de cartucho',0,1,'NDSL-12'),(78,'Revisar pantalla tactil',0,1,'NDSL-12'),(79,'Revisar camara',0,1,'NDSL-12'),(80,'Revisar Wifi',0,1,'NDSL-12'),(81,'Revisar botones',0,1,'NDSL-12'),(82,'Limpiar',0,1,'NDSi1-13'),(83,'Revisar lector de cartucho',0,1,'NDSi1-13'),(84,'Revisar patalla tactil',0,1,'NDSi1-13'),(85,'Revisar botones',0,1,'NDSi1-13'),(86,'Revisar WI-FI',0,1,'NDSi1-13'),(87,'Hackear',0,1,'NDSi1-13'),(88,'Limpiar',0,1,'NDSi1-14'),(89,'Revisar lector de cartucho',0,1,'NDSi1-14'),(90,'Revisar patalla tactil',0,1,'NDSi1-14'),(91,'Revisar botones',0,1,'NDSi1-14'),(92,'Revisar WI-FI',0,1,'NDSi1-14'),(93,'Hackear',0,1,'NDSi1-14'),(94,'Limpiar',0,1,'NDSi1-15'),(95,'Flasheo',0,1,'NDSi1-15'),(96,'Etiquetar',0,1,'NDSi1-15'),(97,'Comprobar lector de juegos',0,1,'NDSi1-15'),(98,'Comprobar Botones',0,1,'NDSi1-15'),(99,'Comprobar camara',0,1,'NDSi1-15'),(100,'Comprobar pantalla tactil',0,1,'NDSi1-15'),(101,'Comprobar Wifi',0,1,'NDSi1-15'),(102,'Limpiar',0,1,'NDSi1-16'),(103,'Revisar lector de cartucho',0,1,'NDSi1-16'),(104,'Revisar patalla tactil',0,1,'NDSi1-16'),(105,'Revisar botones',0,1,'NDSi1-16'),(106,'Revisar WI-FI',0,1,'NDSi1-16'),(107,'Hackear',0,1,'NDSi1-16'),(108,'Limpiar',0,1,'NDSi1-17'),(109,'Revisar lector de cartucho',0,1,'NDSi1-17'),(110,'Revisar patalla tactil',1,1,'NDSi1-17'),(111,'Revisar botones',0,1,'NDSi1-17'),(112,'Revisar WI-FI',0,1,'NDSi1-17'),(113,'Hackear',0,1,'NDSi1-17'),(114,'Limpiar',0,1,'PS2SLIM-18'),(115,'Limpiar',0,1,'N3DS-19'),(116,'Limpiar',0,1,'N3DS-20'),(117,'Revisar Wi-Fi',0,1,'N3DS-20'),(118,'Revisar pantalla tactil',0,1,'N3DS-20'),(119,'Revisar camara',0,1,'N3DS-20'),(120,'Revisar botones',0,1,'N3DS-20'),(121,'Hackear',0,1,'N3DS-20'),(122,'Limpiar',0,1,'N3DS-21'),(123,'Hackear',0,1,'N3DS-21'),(124,'Revisar camara',0,1,'N3DS-21'),(125,'Revisar pantalla tactil',0,1,'N3DS-21'),(126,'Revisar botones',0,1,'N3DS-21'),(127,'Revisar Wi-Fi',0,1,'N3DS-21'),(128,'Limpiar',0,1,'GCI-22'),(129,'Revisar botones',0,1,'GCI-22'),(130,'Chipear',0,1,'GCI-22'),(131,'Revisar puertos',0,1,'GCI-22'),(132,'Revisar lector de disco',0,1,'GCI-22'),(133,'Limpiar',0,1,'GCSO-23'),(134,'Revisar lector de disco',0,1,'GCSO-23'),(135,'Revisar botones',0,1,'GCSO-23'),(136,'Revisar puertos',0,1,'GCSO-23'),(137,'Limpiar',0,1,'GCJB-24'),(138,'Revisar puertos',0,1,'GCJB-24'),(139,'Revisar lector de disco',0,1,'GCJB-24'),(140,'Revisar botones',0,1,'GCJB-24'),(141,'Chipear',0,1,'GCJB-24'),(142,'Limpiar',1,1,'GCSO-25'),(143,'Chipear',1,1,'GCSO-25'),(144,'Revisar puertos',1,1,'GCSO-25'),(145,'Revisar lector de disco',1,1,'GCSO-25'),(146,'Revisar botones',1,1,'GCSO-25'),(147,'Limpiar',0,1,'O3DS-26'),(148,'Revisar pantalla tactil',0,1,'O3DS-26'),(149,'Revisar botones',0,1,'O3DS-26'),(150,'Revisar Wi-Fi',0,1,'O3DS-26'),(151,'Hackear',0,1,'O3DS-26'),(152,'Limpiar',0,1,'O3DS-27'),(153,'Revisar pantalla tactil',0,1,'O3DS-27'),(154,'Revisar botones',0,1,'O3DS-27'),(155,'Revisar Wi-Fi',0,1,'O3DS-27'),(156,'Hackear',0,1,'O3DS-27'),(157,'Limpiar',0,1,'WU32GB-28'),(158,'Hackear',0,1,'WU32GB-28'),(159,'Revisar puertos',0,1,'WU32GB-28'),(160,'Revisar lector de disco',0,1,'WU32GB-28'),(161,'Revisar Wi-Fi',0,1,'WU32GB-28'),(162,'Revisar botones',0,1,'WU32GB-28'),(163,'Revisar pantalla tactil',0,1,'WU32GB-28'),(164,'Limpiar',0,1,'WU32GB-29'),(165,'Revisar puertos',0,1,'WU32GB-29'),(166,'Hackear',0,1,'WU32GB-29'),(167,'Revisar lector de disco',0,1,'WU32GB-29'),(168,'Revisar Wi-Fi',0,1,'WU32GB-29'),(169,'Revisar botones',0,1,'WU32GB-29'),(170,'Revisar pantalla tactil',0,1,'WU32GB-29'),(171,'Limpiar',0,1,'PS2FAT5-30'),(172,'Hackear',0,1,'PS2FAT5-30'),(173,'Revisar puertos',0,1,'PS2FAT5-30'),(174,'Revisar lector de disco',0,1,'PS2FAT5-30'),(175,'Revisar botones',0,1,'PS2FAT5-30'),(176,'Limpiar',0,1,'NES-31'),(177,'Limpiar',0,1,'GCPS-32'),(178,'Limpiar',0,1,'WU32GB64-33'),(179,'Revisar',0,1,'WU32GB64-33'),(180,'Limpiar',0,1,'WU32GB-34'),(181,'Limpiar',0,1,'WU32GB-35'),(182,'Limpiar',0,1,'GCJB-36'),(183,'Revisar',0,1,'GCJB-36'),(184,'Limpiar',0,1,'GCJB-37'),(185,'Revisar',0,1,'GCJB-37'),(186,'Limpiar',0,1,'GCI-38'),(187,'Revisar',0,1,'GCI-38'),(188,'Limpiar',0,1,'GCPS-39'),(189,'Revisar',0,1,'GCPS-39'),(190,'Limpiar',0,1,'GCCSG-40'),(191,'Revisar',0,1,'GCCSG-40'),(192,'Limpiar',0,1,'CGCSB-41'),(193,'Revision',0,1,'CGCSB-41'),(194,'Limpiar',0,1,'CGCSBL-42'),(195,'Revision',0,1,'CGCSBL-42'),(196,'Limpiar',0,1,'CGCGI-43'),(197,'Revision',0,1,'CGCGI-43'),(198,'Limpiar',0,1,'CGCS69-44'),(199,'Revisar',0,1,'CGCS69-44'),(200,'Limpiar',0,1,'CGCS-45'),(201,'Revisar',0,1,'CGCS-45'),(202,'Limpiar',0,1,'CGCS-46'),(203,'Revisar',0,1,'CGCS-46'),(204,'Limpiar',0,1,'CGCS-47'),(205,'Revisar',0,1,'CGCS-47'),(206,'Limpiar',0,1,'CGCS-48'),(207,'Revisar',0,1,'CGCS-48'),(208,'Limpiar',0,1,'GBASP-49'),(209,'Revisar',0,1,'GBASP-49'),(210,'Limpiar',0,1,'GBASP-50'),(211,'Revisar',0,1,'GBASP-50'),(212,'Limpiar',0,1,'GBASP-51'),(213,'Limpiar',0,1,'GBASP-52'),(214,'Limpiar',0,1,'GBASP-53'),(215,'Revisar',0,1,'GBASP-53'),(216,'Limpiar',0,1,'GBASP-54'),(217,'Limpiar',0,1,'N64CHAR-55'),(218,'Revisar',0,1,'N64CHAR-55'),(219,'Limpiar',0,1,'N64CHAR-56'),(220,'Revisar',0,1,'N64CHAR-56'),(221,'Limpiar',0,1,'NDSi1-57'),(222,'Limpiar',0,1,'NDSi1-58'),(223,'Revisar',0,1,'NDSi1-58'),(224,'Limpiar',0,1,'NDSi1-59'),(225,'Limpiar',0,1,'NDSi1-60'),(226,'Limpiar',0,1,'PS2FAT5-61'),(227,'Revisar',0,1,'PS2FAT5-61'),(228,'Limpiar',0,1,'PS2FAT5-62'),(229,'Resivar',0,1,'PS2FAT5-62'),(230,'Limpiar',0,1,'PS2FAT6-63'),(231,'Revisar',0,1,'PS2FAT6-63'),(232,'Limpiar',0,1,'PS2FAT6-64'),(233,'Revisar',0,1,'PS2FAT6-64'),(234,'Limpiar',0,1,'PS2FAT5-65'),(235,'Revisar',0,1,'PS2FAT5-65'),(236,'Limpiar',0,1,'PS2SLIM4-66'),(237,'Revisar',0,1,'PS2SLIM4-66'),(238,'Limpiar',0,1,'PS2SLIM2-67'),(239,'Revisar',0,1,'PS2SLIM2-67'),(240,'Limpiar',0,1,'PS2SLIM-68'),(241,'Limpiar',0,1,'GBA-69'),(242,'Limpiar',0,1,'GBA-70'),(243,'Limpiar',0,1,'GBA-71'),(244,'Limpiar',0,1,'GBA-72'),(245,'Limpiar',0,1,'GBC-73'),(246,'Revisar',0,1,'GBC-73'),(247,'Limpiar',0,1,'GBC-74'),(248,'Limpiar',0,1,'GBC-75'),(249,'Limpiar',0,1,'GBC-76'),(250,'Limpiar',0,1,'GBP-77'),(251,'Limpiar',0,1,'O3DS-78'),(252,'Limpiar',0,1,'O3DS-79'),(253,'Limpiar',0,1,'O3DSXL-80'),(254,'Limpiar',0,1,'O3DSXL-81'),(255,'Limpiar',0,1,'NDSL-82'),(256,'Revisar',0,1,'NDSL-82'),(257,'Limpiar',0,1,'SNESM-83'),(258,'Revisar',0,1,'SNESM-83'),(259,'Limpiar',0,1,'GCI-84'),(260,'Limpiar',0,1,'GCI-85'),(261,'Limpiar',0,1,'N3DSXL-86'),(262,'Limpiar',0,1,'N3DSXL-87'),(263,'Limpiar',0,1,'N3DSXL-88'),(264,'Limpiar',0,1,'N3DSXL-89'),(265,'Limpiar',0,1,'N3DSXL-90'),(266,'Limpiar',0,1,'N3DSXL-91'),(267,'Limpiar',0,1,'N3DSXL-92'),(268,'Limpiar',0,1,'N3DSXL-93'),(269,'Limpiar',0,1,'N3DSXL-94'),(270,'Limpiar',0,1,'N3DSXL-95'),(271,'Limpiar',0,1,'N3DSXL-96'),(272,'Limpiar',0,1,'N3DSXL-97'),(273,'Limpiar',0,1,'O3DSXL-98'),(274,'Limpiar',0,1,'O3DSXL-99'),(275,'Limpiar',0,1,'O3DSXL-100'),(276,'Limpiar',0,1,'O3DSXL-101'),(277,'Limpiar',0,1,'O3DSXL-102'),(278,'Limpiar',0,1,'O3DSXL-103'),(279,'Limpiar',0,1,'O3DSXL-104'),(280,'Limpiar',0,1,'O3DSXL-105'),(281,'Limpiar',0,1,'O3DSXL-106'),(282,'Limpiar',0,1,'O3DS-107'),(283,'Limpiar',0,1,'O3DS-108'),(284,'Limpiar',0,1,'O3DS-109'),(285,'Limpiar',0,1,'O3DS-110'),(286,'Limpiar',0,1,'O3DS-111'),(287,'Limpiar',0,1,'O3DS-112'),(288,'Limpiar',0,1,'O3DS-113'),(289,'Limpiar',0,1,'O3DS-114'),(290,'Limpiar',0,1,'O3DS-115'),(291,'Limpiar',0,1,'O3DS-116'),(292,'Limpiar',0,1,'O3DS-117'),(293,'Limpiar',0,1,'O3DS-118');
/*!40000 ALTER TABLE `tareasdeproductos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipoarticulo`
--

DROP TABLE IF EXISTS `tipoarticulo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipoarticulo` (
  `IdTipoArticuloPK` int NOT NULL AUTO_INCREMENT,
  `DescripcionTipoArticulo` varchar(100) NOT NULL,
  `Estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IdTipoArticuloPK`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipoarticulo`
--

LOCK TABLES `tipoarticulo` WRITE;
/*!40000 ALTER TABLE `tipoarticulo` DISABLE KEYS */;
INSERT INTO `tipoarticulo` VALUES (1,'Producto',1),(2,'Accesorio',1),(3,'Insumo',1);
/*!40000 ALTER TABLE `tipoarticulo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipodocumento`
--

DROP TABLE IF EXISTS `tipodocumento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipodocumento` (
  `IdTipoDocumentoPK` int NOT NULL AUTO_INCREMENT,
  `DescripcionDocumento` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`IdTipoDocumentoPK`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipodocumento`
--

LOCK TABLES `tipodocumento` WRITE;
/*!40000 ALTER TABLE `tipodocumento` DISABLE KEYS */;
INSERT INTO `tipodocumento` VALUES (1,'En Espera'),(2,'Proforma'),(3,'Factura');
/*!40000 ALTER TABLE `tipodocumento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipopedido`
--

DROP TABLE IF EXISTS `tipopedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipopedido` (
  `CodigoTipoPedido` int NOT NULL AUTO_INCREMENT,
  `DescripcionTipoPedido` varchar(100) NOT NULL,
  PRIMARY KEY (`CodigoTipoPedido`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipopedido`
--

LOCK TABLES `tipopedido` WRITE;
/*!40000 ALTER TABLE `tipopedido` DISABLE KEYS */;
INSERT INTO `tipopedido` VALUES (1,'Aéreo'),(2,'Marítimo');
/*!40000 ALTER TABLE `tipopedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiposaccesorios`
--

DROP TABLE IF EXISTS `tiposaccesorios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiposaccesorios` (
  `IdTipoAccesorioPK` int NOT NULL AUTO_INCREMENT,
  `CodigoAccesorio` varchar(25) DEFAULT NULL,
  `DescripcionAccesorio` varchar(100) DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IdTipoAccesorioPK`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiposaccesorios`
--

LOCK TABLES `tiposaccesorios` WRITE;
/*!40000 ALTER TABLE `tiposaccesorios` DISABLE KEYS */;
INSERT INTO `tiposaccesorios` VALUES (1,'J001','Mando de juego',1),(2,'C001','Cable HDMI',1),(3,'X001','Mando de Monitor',1),(4,'M001','Memoria',1),(5,'M001','Cable AC',1);
/*!40000 ALTER TABLE `tiposaccesorios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiposproductos`
--

DROP TABLE IF EXISTS `tiposproductos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiposproductos` (
  `IdTipoProductoPK` int NOT NULL AUTO_INCREMENT,
  `DescripcionTipoProducto` varchar(100) DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IdTipoProductoPK`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiposproductos`
--

LOCK TABLES `tiposproductos` WRITE;
/*!40000 ALTER TABLE `tiposproductos` DISABLE KEYS */;
INSERT INTO `tiposproductos` VALUES (1,'Consola de juegos',1),(2,'Monitor',1),(3,'Laptop',1),(4,'Consola Portátil',1);
/*!40000 ALTER TABLE `tiposproductos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `IdUsuarioPK` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `Correo` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `FechaIngresoUsuario` date DEFAULT NULL,
  `IdEstadoFK` int NOT NULL,
  `IdRolFK` int NOT NULL,
  PRIMARY KEY (`IdUsuarioPK`),
  UNIQUE KEY `Correo` (`Correo`),
  KEY `IdRolFK` (`IdRolFK`),
  KEY `IdEstadoFK` (`IdEstadoFK`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`IdRolFK`) REFERENCES `roles` (`IdRolPK`),
  CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`IdEstadoFK`) REFERENCES `estadousuarios` (`IdEstadoPK`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Usuario Default Administrador 3','correoejemplo2@ragganel.com','$2b$10$fJqJ2zwn1Bc7kfyTFpG3ZOL9hhiiXz8Q7.NC5GnZhC.XN0hBWGYlK','2025-03-18',1,1),(2,'usuario admin','admin@admin','$2b$10$6DSLUlegG4mgcoj6R3SDDuBfsEanxqRBlW/DFREhe3wxhkSV9sRHG','2025-04-06',1,1),(3,'Ventas','ventas@ragganel','$2b$10$PBa0gJ4I/rpP278kDbF2r.XLbxgt50SIKXZJuzs2XyT/batxtuX3C','2025-04-06',1,2);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventasbase`
--

DROP TABLE IF EXISTS `ventasbase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventasbase` (
  `IdVentaPK` int NOT NULL AUTO_INCREMENT,
  `FechaCreacion` datetime NOT NULL,
  `IdTipoDocumentoFK` int NOT NULL,
  `NumeroDocumento` varchar(255) DEFAULT NULL,
  `SubtotalVenta` decimal(6,2) DEFAULT NULL,
  `IVA` decimal(6,2) DEFAULT NULL,
  `TotalVenta` decimal(6,2) DEFAULT NULL,
  `IdEstadoVentaFK` int NOT NULL,
  `IdMetodoDePagoFK` int NOT NULL,
  `IdUsuarioFK` int NOT NULL,
  `IdClienteFK` int NOT NULL,
  `Observaciones` varchar(10000) DEFAULT NULL,
  PRIMARY KEY (`IdVentaPK`),
  KEY `IdTipoDocumentoFK` (`IdTipoDocumentoFK`),
  KEY `IdEstadoVentaFK` (`IdEstadoVentaFK`),
  KEY `IdMetodoDePagoFK` (`IdMetodoDePagoFK`),
  KEY `IdUsuarioFK` (`IdUsuarioFK`),
  KEY `IdClienteFK` (`IdClienteFK`),
  CONSTRAINT `ventasbase_ibfk_1` FOREIGN KEY (`IdTipoDocumentoFK`) REFERENCES `tipodocumento` (`IdTipoDocumentoPK`),
  CONSTRAINT `ventasbase_ibfk_2` FOREIGN KEY (`IdEstadoVentaFK`) REFERENCES `estadoventa` (`IdEstadoVentaPK`),
  CONSTRAINT `ventasbase_ibfk_3` FOREIGN KEY (`IdMetodoDePagoFK`) REFERENCES `metodosdepago` (`IdMetodoPagoPK`),
  CONSTRAINT `ventasbase_ibfk_4` FOREIGN KEY (`IdUsuarioFK`) REFERENCES `usuarios` (`IdUsuarioPK`),
  CONSTRAINT `ventasbase_ibfk_5` FOREIGN KEY (`IdClienteFK`) REFERENCES `clientes` (`IdClientePK`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventasbase`
--

LOCK TABLES `ventasbase` WRITE;
/*!40000 ALTER TABLE `ventasbase` DISABLE KEYS */;
INSERT INTO `ventasbase` VALUES (1,'2025-07-27 15:39:23',2,'P-000001',62.86,9.43,72.29,4,1,2,1,''),(2,'2025-07-27 15:53:10',3,'F-2025-00002',44.96,6.74,51.71,3,1,2,1,'Ref. Transferencia: N/A. Otros: N/A'),(3,'2025-07-27 16:35:19',3,'F-2025-00003',80.01,0.00,80.01,2,1,2,2,'Ref. Transferencia: N/A. Otros: Garantia de 1 mes.'),(4,'2025-07-27 16:41:32',3,'F-2025-00004',1.35,0.00,1.35,3,1,2,1,'Ref. Transferencia: N/A. Otros: N/A'),(5,'2025-07-27 21:11:45',3,'F-2025-00005',45.00,0.00,45.00,2,1,2,3,'Ref. Transferencia: N/A. Otros: Cambio de Stick en switch lite'),(6,'2025-08-02 16:50:13',3,'F-2025-00006',30.00,0.00,30.00,2,1,2,4,'Ref. Transferencia: N/A. Otros: Cortesia dos mantenimientos de controles'),(7,'2025-09-14 13:06:06',3,'F-2025-00007',40.00,0.00,40.00,2,1,2,5,'Ref. Transferencia: N/A. Otros: N/A'),(8,'2025-09-17 15:38:28',3,'F-2025-00008',80.00,0.00,80.00,3,1,2,7,'Ref. Transferencia: N/A. Otros: N/A'),(9,'2025-09-17 15:43:06',3,'F-2025-00009',100.00,0.00,100.00,2,1,2,7,'Ref. Transferencia: N/A. Otros: Vendido como forma de garantia por GameBoy Advance SP Rojo Transparente que volvio en garantia.');
/*!40000 ALTER TABLE `ventasbase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventasext`
--

DROP TABLE IF EXISTS `ventasext`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventasext` (
  `IdVentaFK` int NOT NULL,
  `NumeroReferenciaTransferencia` varchar(255) DEFAULT NULL,
  KEY `IdVentaFK` (`IdVentaFK`),
  CONSTRAINT `ventasext_ibfk_1` FOREIGN KEY (`IdVentaFK`) REFERENCES `ventasbase` (`IdVentaPK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventasext`
--

LOCK TABLES `ventasext` WRITE;
/*!40000 ALTER TABLE `ventasext` DISABLE KEYS */;
/*!40000 ALTER TABLE `ventasext` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vistaarticulosinventariov3`
--

DROP TABLE IF EXISTS `vistaarticulosinventariov3`;
/*!50001 DROP VIEW IF EXISTS `vistaarticulosinventariov3`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vistaarticulosinventariov3` AS SELECT 
 1 AS `Tipo`,
 1 AS `NombreArticulo`,
 1 AS `PrecioBase`,
 1 AS `LinkImagen`,
 1 AS `Codigo`,
 1 AS `Cantidad`,
 1 AS `Estado`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vistainventarioagrupada`
--

DROP TABLE IF EXISTS `vistainventarioagrupada`;
/*!50001 DROP VIEW IF EXISTS `vistainventarioagrupada`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vistainventarioagrupada` AS SELECT 
 1 AS `TipoArticulo`,
 1 AS `NombreFabricante`,
 1 AS `NombreCategoria`,
 1 AS `NombreSubcategoria`,
 1 AS `Estado`,
 1 AS `Cantidad`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vistainventariogeneral`
--

DROP TABLE IF EXISTS `vistainventariogeneral`;
/*!50001 DROP VIEW IF EXISTS `vistainventariogeneral`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vistainventariogeneral` AS SELECT 
 1 AS `Tipo`,
 1 AS `Codigo`,
 1 AS `NombreArticulo`,
 1 AS `Estado`,
 1 AS `Cantidad`,
 1 AS `PrecioBase`,
 1 AS `FechaIngreso`,
 1 AS `LinkImagen`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vistaarticulosinventariov3`
--

/*!50001 DROP VIEW IF EXISTS `vistaarticulosinventariov3`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vistaarticulosinventariov3` AS select 'Producto' AS `Tipo`,concat(`f`.`NombreFabricante`,' - ',`c`.`NombreCategoria`,' - ',`s`.`NombreSubcategoria`) AS `NombreArticulo`,`p`.`PrecioBase` AS `PrecioBase`,`cat`.`LinkImagen` AS `LinkImagen`,`p`.`CodigoConsola` AS `Codigo`,1 AS `Cantidad`,`p`.`Estado` AS `Estado` from ((((`productosbases` `p` join `catalogoconsolas` `cat` on((`p`.`Modelo` = `cat`.`IdModeloConsolaPK`))) join `fabricantes` `f` on((`cat`.`Fabricante` = `f`.`IdFabricantePK`))) join `categoriasproductos` `c` on((`cat`.`Categoria` = `c`.`IdCategoriaPK`))) join `subcategoriasproductos` `s` on((`cat`.`Subcategoria` = `s`.`IdSubcategoria`))) where (`p`.`Estado` not in (7,8,9,10,11)) union select 'Accesorio' AS `Tipo`,concat(`fa`.`NombreFabricanteAccesorio`,' - ',`ca`.`NombreCategoriaAccesorio`,' - ',`sa`.`NombreSubcategoriaAccesorio`) AS `NombreArticulo`,`a`.`PrecioBase` AS `PrecioBase`,`cat`.`LinkImagen` AS `LinkImagen`,`a`.`CodigoAccesorio` AS `Codigo`,1 AS `Cantidad`,`a`.`EstadoAccesorio` AS `Estado` from ((((`accesoriosbase` `a` join `catalogoaccesorios` `cat` on((`a`.`ModeloAccesorio` = `cat`.`IdModeloAccesorioPK`))) join `fabricanteaccesorios` `fa` on((`cat`.`FabricanteAccesorio` = `fa`.`IdFabricanteAccesorioPK`))) join `categoriasaccesorios` `ca` on((`cat`.`CategoriaAccesorio` = `ca`.`IdCategoriaAccesorioPK`))) join `subcategoriasaccesorios` `sa` on((`cat`.`SubcategoriaAccesorio` = `sa`.`IdSubcategoriaAccesorio`))) where (`a`.`EstadoAccesorio` not in (7,8,9,10,11)) union select 'Insumo' AS `Tipo`,concat(`fi`.`NombreFabricanteInsumos`,' - ',`ci`.`NombreCategoriaInsumos`,' - ',`si`.`NombreSubcategoriaInsumos`) AS `NombreArticulo`,`i`.`PrecioBase` AS `PrecioBase`,`cat`.`LinkImagen` AS `LinkImagen`,`i`.`CodigoInsumo` AS `Codigo`,`i`.`Cantidad` AS `Cantidad`,`i`.`EstadoInsumo` AS `Estado` from ((((`insumosbase` `i` join `catalogoinsumos` `cat` on((`i`.`ModeloInsumo` = `cat`.`IdModeloInsumosPK`))) join `fabricanteinsumos` `fi` on((`cat`.`FabricanteInsumos` = `fi`.`IdFabricanteInsumosPK`))) join `categoriasinsumos` `ci` on((`cat`.`CategoriaInsumos` = `ci`.`IdCategoriaInsumosPK`))) join `subcategoriasinsumos` `si` on((`cat`.`SubcategoriaInsumos` = `si`.`IdSubcategoriaInsumos`))) where (`i`.`EstadoInsumo` not in (7,8,9,10,11)) union select 'Servicio' AS `Tipo`,`sb`.`DescripcionServicio` AS `NombreArticulo`,`sb`.`PrecioBase` AS `PrecioBase`,'default_servicio.png' AS `LinkImagen`,cast(`sb`.`IdServicioPK` as char charset utf8mb4) AS `Codigo`,coalesce(min(floor((coalesce(`ib`.`Cantidad`,0) / nullif(`ixs`.`CantidadDescargue`,0)))),1) AS `Cantidad`,`sb`.`Estado` AS `Estado` from ((`serviciosbase` `sb` left join `insumosxservicio` `ixs` on(((`sb`.`IdServicioPK` = `ixs`.`IdServicioFK`) and (`ixs`.`Estado` = 1)))) left join `insumosbase` `ib` on((`ixs`.`CodigoInsumoFK` = `ib`.`CodigoInsumo`))) where (`sb`.`Estado` = 1) group by `sb`.`IdServicioPK`,`sb`.`DescripcionServicio`,`sb`.`PrecioBase`,`sb`.`Estado` having (coalesce(min(floor((coalesce(`ib`.`Cantidad`,0) / nullif(`ixs`.`CantidadDescargue`,0)))),1) > 0) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vistainventarioagrupada`
--

/*!50001 DROP VIEW IF EXISTS `vistainventarioagrupada`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vistainventarioagrupada` AS select 'Producto' AS `TipoArticulo`,`f`.`NombreFabricante` AS `NombreFabricante`,`cp`.`NombreCategoria` AS `NombreCategoria`,`sp`.`NombreSubcategoria` AS `NombreSubcategoria`,`pb`.`Estado` AS `Estado`,count(0) AS `Cantidad` from ((((`productosbases` `pb` join `catalogoconsolas` `cc` on((`pb`.`Modelo` = `cc`.`IdModeloConsolaPK`))) join `fabricantes` `f` on((`cc`.`Fabricante` = `f`.`IdFabricantePK`))) join `categoriasproductos` `cp` on((`cc`.`Categoria` = `cp`.`IdCategoriaPK`))) join `subcategoriasproductos` `sp` on((`cc`.`Subcategoria` = `sp`.`IdSubcategoria`))) group by `TipoArticulo`,`f`.`NombreFabricante`,`cp`.`NombreCategoria`,`sp`.`NombreSubcategoria`,`pb`.`Estado` union all select 'Accesorio' AS `TipoArticulo`,`fa`.`NombreFabricanteAccesorio` AS `NombreFabricanteAccesorio`,`ca`.`NombreCategoriaAccesorio` AS `NombreCategoriaAccesorio`,`sa`.`NombreSubcategoriaAccesorio` AS `NombreSubcategoriaAccesorio`,`ab`.`EstadoAccesorio` AS `EstadoAccesorio`,count(0) AS `Cantidad` from ((((`accesoriosbase` `ab` join `catalogoaccesorios` `caa` on((`ab`.`ModeloAccesorio` = `caa`.`IdModeloAccesorioPK`))) join `fabricanteaccesorios` `fa` on((`caa`.`FabricanteAccesorio` = `fa`.`IdFabricanteAccesorioPK`))) join `categoriasaccesorios` `ca` on((`caa`.`CategoriaAccesorio` = `ca`.`IdCategoriaAccesorioPK`))) join `subcategoriasaccesorios` `sa` on((`caa`.`SubcategoriaAccesorio` = `sa`.`IdSubcategoriaAccesorio`))) group by `TipoArticulo`,`fa`.`NombreFabricanteAccesorio`,`ca`.`NombreCategoriaAccesorio`,`sa`.`NombreSubcategoriaAccesorio`,`ab`.`EstadoAccesorio` union all select 'Insumo' AS `TipoArticulo`,`fi`.`NombreFabricanteInsumos` AS `NombreFabricanteInsumos`,`ci`.`NombreCategoriaInsumos` AS `NombreCategoriaInsumos`,`si`.`NombreSubcategoriaInsumos` AS `NombreSubcategoriaInsumos`,`ib`.`EstadoInsumo` AS `EstadoInsumo`,sum(`ib`.`Cantidad`) AS `Cantidad` from ((((`insumosbase` `ib` join `catalogoinsumos` `ci2` on((`ib`.`ModeloInsumo` = `ci2`.`IdModeloInsumosPK`))) join `fabricanteinsumos` `fi` on((`ci2`.`FabricanteInsumos` = `fi`.`IdFabricanteInsumosPK`))) join `categoriasinsumos` `ci` on((`ci2`.`CategoriaInsumos` = `ci`.`IdCategoriaInsumosPK`))) join `subcategoriasinsumos` `si` on((`ci2`.`SubcategoriaInsumos` = `si`.`IdSubcategoriaInsumos`))) group by `TipoArticulo`,`fi`.`NombreFabricanteInsumos`,`ci`.`NombreCategoriaInsumos`,`si`.`NombreSubcategoriaInsumos`,`ib`.`EstadoInsumo` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vistainventariogeneral`
--

/*!50001 DROP VIEW IF EXISTS `vistainventariogeneral`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vistainventariogeneral` AS select 'Producto' AS `Tipo`,`p`.`CodigoConsola` AS `Codigo`,concat(`f`.`NombreFabricante`,' - ',`c`.`NombreCategoria`,' - ',`s`.`NombreSubcategoria`) AS `NombreArticulo`,`est`.`DescripcionEstado` AS `Estado`,1 AS `Cantidad`,`p`.`PrecioBase` AS `PrecioBase`,`p`.`FechaIngreso` AS `FechaIngreso`,`cat`.`LinkImagen` AS `LinkImagen` from (((((`productosbases` `p` join `catalogoconsolas` `cat` on((`p`.`Modelo` = `cat`.`IdModeloConsolaPK`))) join `fabricantes` `f` on((`cat`.`Fabricante` = `f`.`IdFabricantePK`))) join `categoriasproductos` `c` on((`cat`.`Categoria` = `c`.`IdCategoriaPK`))) join `subcategoriasproductos` `s` on((`cat`.`Subcategoria` = `s`.`IdSubcategoria`))) join `catalogoestadosconsolas` `est` on((`p`.`Estado` = `est`.`CodigoEstado`))) where (`p`.`Estado` <> 7) union all select 'Accesorio' AS `Tipo`,`a`.`CodigoAccesorio` AS `Codigo`,concat(`fa`.`NombreFabricanteAccesorio`,' - ',`ca`.`NombreCategoriaAccesorio`,' - ',`sa`.`NombreSubcategoriaAccesorio`) AS `NombreArticulo`,`est`.`DescripcionEstado` AS `Estado`,1 AS `Cantidad`,`a`.`PrecioBase` AS `PrecioBase`,`a`.`FechaIngreso` AS `FechaIngreso`,`cat`.`LinkImagen` AS `LinkImagen` from (((((`accesoriosbase` `a` join `catalogoaccesorios` `cat` on((`a`.`ModeloAccesorio` = `cat`.`IdModeloAccesorioPK`))) join `fabricanteaccesorios` `fa` on((`cat`.`FabricanteAccesorio` = `fa`.`IdFabricanteAccesorioPK`))) join `categoriasaccesorios` `ca` on((`cat`.`CategoriaAccesorio` = `ca`.`IdCategoriaAccesorioPK`))) join `subcategoriasaccesorios` `sa` on((`cat`.`SubcategoriaAccesorio` = `sa`.`IdSubcategoriaAccesorio`))) join `catalogoestadosconsolas` `est` on((`a`.`EstadoAccesorio` = `est`.`CodigoEstado`))) where (`a`.`EstadoAccesorio` <> 7) union all select 'Insumo' AS `Tipo`,`i`.`CodigoInsumo` AS `Codigo`,concat(`fi`.`NombreFabricanteInsumos`,' - ',`ci`.`NombreCategoriaInsumos`,' - ',`si`.`NombreSubcategoriaInsumos`) AS `NombreArticulo`,`est`.`DescripcionEstado` AS `Estado`,`i`.`Cantidad` AS `Cantidad`,`i`.`PrecioBase` AS `PrecioBase`,`i`.`FechaIngreso` AS `FechaIngreso`,`cat`.`LinkImagen` AS `LinkImagen` from (((((`insumosbase` `i` join `catalogoinsumos` `cat` on((`i`.`ModeloInsumo` = `cat`.`IdModeloInsumosPK`))) join `fabricanteinsumos` `fi` on((`cat`.`FabricanteInsumos` = `fi`.`IdFabricanteInsumosPK`))) join `categoriasinsumos` `ci` on((`cat`.`CategoriaInsumos` = `ci`.`IdCategoriaInsumosPK`))) join `subcategoriasinsumos` `si` on((`cat`.`SubcategoriaInsumos` = `si`.`IdSubcategoriaInsumos`))) join `catalogoestadosconsolas` `est` on((`i`.`EstadoInsumo` = `est`.`CodigoEstado`))) where (`i`.`EstadoInsumo` <> 7) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-29 18:56:20
