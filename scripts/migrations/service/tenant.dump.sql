-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: services
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `expenseCode` int NOT NULL,
  `expenseName` varchar(100) NOT NULL,
  `type` varchar(100) NOT NULL,
  `price` int NOT NULL,
  `inUsed` tinyint(1) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `createdBy` varchar(50) DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  `unitName` varchar(30) NOT NULL,
  PRIMARY KEY (`expenseCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (1,'Tiền phòng tầng 3','constant',3100000,1,'2026-09-11 22:25:47','2026-09-11 22:25:47',NULL,NULL,'VND'),(2,'Tiền nước','per_person',50000,1,'2026-09-11 22:26:26','2026-09-11 22:26:26',NULL,NULL,'VND'),(3,'Tiền thuê tầng 2 phòng ngoài','constant',3200000,1,'2026-09-12 03:50:15','2026-09-12 03:50:15',NULL,NULL,'VND'),(4,'Tiền net','constant',100000,1,'2026-09-12 03:51:03','2026-09-12 03:51:03',NULL,NULL,'VND'),(5,'Tiền thuê tầng 2 phòng trong','constant',2800000,1,'2026-09-12 04:07:42','2026-09-12 04:07:42',NULL,NULL,'VND'),(6,'Tiền thuê tầng 1 cửa hàng','constant',3500000,1,'2026-09-12 04:08:11','2026-09-12 04:08:11',NULL,NULL,'VND'),(7,'Tiền rác','per_person',10000,1,'2026-09-12 04:08:49','2026-09-13 03:47:40',NULL,NULL,'VND'),(8,'Tiền điện','per_unit',3700,1,'2026-09-12 04:33:05','2026-09-12 04:33:05',NULL,NULL,'kWh'),(9,'Tiền công trình phụ','constant',45000,1,'2026-09-12 05:14:26','2026-09-12 05:14:26',NULL,NULL,'VND'),(10,'Tiền công trình phụ 2','constant',60000,1,'2026-09-12 05:14:57','2026-09-12 05:14:57',NULL,NULL,'VND'),(11,'Tiền thuê tầng 1 phòng trong','constant',2500000,1,'2026-09-12 05:25:04','2026-09-12 05:26:38',NULL,NULL,'VND');
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses_location`
--

DROP TABLE IF EXISTS `expenses_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses_location` (
  `locationCode` int NOT NULL,
  `expenseCode` int NOT NULL,
  `initialUnit` int NOT NULL,
  `currentUnit` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `createdBy` varchar(50) DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  KEY `locationCode` (`locationCode`),
  KEY `expenseCode` (`expenseCode`),
  CONSTRAINT `expenses_location_ibfk_1` FOREIGN KEY (`locationCode`) REFERENCES `locations` (`locationCode`),
  CONSTRAINT `expenses_location_ibfk_2` FOREIGN KEY (`expenseCode`) REFERENCES `expenses` (`expenseCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses_location`
--

LOCK TABLES `expenses_location` WRITE;
/*!40000 ALTER TABLE `expenses_location` DISABLE KEYS */;
INSERT INTO `expenses_location` VALUES (10,11,0,3,'2026-09-13 03:46:12','2026-09-13 03:46:12',NULL,NULL),(10,8,6177,6291,'2026-09-13 03:46:12','2026-09-13 03:46:12',NULL,NULL),(22,5,0,1,'2026-09-13 03:48:07','2026-09-13 03:48:07',NULL,NULL),(22,4,0,1,'2026-09-13 03:48:07','2026-09-13 03:48:07',NULL,NULL),(22,2,0,2,'2026-09-13 03:48:07','2026-09-13 03:48:07',NULL,NULL),(22,9,0,1,'2026-09-13 03:48:07','2026-09-13 03:48:07',NULL,NULL),(22,7,0,2,'2026-09-13 03:48:07','2026-09-13 03:48:07',NULL,NULL),(22,8,22315,22543,'2026-09-13 03:48:07','2026-09-13 03:48:07',NULL,NULL),(30,1,0,1,'2026-09-13 03:48:23','2026-09-13 03:48:23',NULL,NULL),(30,4,0,1,'2026-09-13 03:48:23','2026-09-13 03:48:23',NULL,NULL),(30,2,0,2,'2026-09-13 03:48:23','2026-09-13 03:48:23',NULL,NULL),(30,9,0,1,'2026-09-13 03:48:23','2026-09-13 03:48:23',NULL,NULL),(30,7,0,2,'2026-09-13 03:48:23','2026-09-13 03:48:23',NULL,NULL),(30,8,9575,9751,'2026-09-13 03:48:23','2026-09-13 03:48:23',NULL,NULL),(11,6,0,3,'2026-09-13 03:48:39','2026-09-13 03:48:39',NULL,NULL),(11,4,0,3,'2026-09-13 03:48:39','2026-09-13 03:48:39',NULL,NULL),(11,10,0,1,'2026-09-13 03:48:39','2026-09-13 03:48:39',NULL,NULL),(11,2,0,3,'2026-09-13 03:48:39','2026-09-13 03:48:39',NULL,NULL),(11,7,0,3,'2026-09-13 03:48:39','2026-09-13 03:48:39',NULL,NULL),(11,8,21437,21801,'2026-09-13 03:48:39','2026-09-13 03:48:39',NULL,NULL),(21,3,0,1,'2026-09-13 15:18:20','2026-09-13 15:18:20',NULL,NULL),(21,4,0,1,'2026-09-13 15:18:20','2026-09-13 15:18:20',NULL,NULL),(21,2,0,2,'2026-09-13 15:18:20','2026-09-13 15:18:20',NULL,NULL),(21,9,0,1,'2026-09-13 15:18:20','2026-09-13 15:18:20',NULL,NULL),(21,7,0,2,'2026-09-13 15:18:20','2026-09-13 15:18:20',NULL,NULL),(21,8,14621,14799,'2026-09-13 15:18:20','2026-09-13 15:18:20',NULL,NULL);
/*!40000 ALTER TABLE `expenses_location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `locationCode` int NOT NULL,
  `locationName` varchar(100) NOT NULL,
  `locationAddress` varchar(200) NOT NULL,
  `roomSize` int NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `owner` int DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `createdBy` varchar(50) DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`locationCode`),
  KEY `owner` (`owner`),
  CONSTRAINT `locations_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `rent_providers` (`providerCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (10,'Tầng 1 Phòng Trong (Phòng kho)','Số 41, Ngõ 87, Đường Nguyễn Phong Sắc',0,'Phòng kho của anh Quyết nên ko tính phí phụ',1,'https://cdn.filepost.dev/file/filepost/uploads/b9/b91575ea0b984e7aa567bc9343413a42','2026-09-12 05:25:50',NULL,NULL,NULL),(11,'Tầng 1 Cửa hàng','Số 41, Ngõ 87, Đường Nguyễn Phong Sắc',1,NULL,1,'https://cdn.filepost.dev/file/filepost/uploads/0f/0fc1ad47243e4f5d8049a215336a1971','2026-09-12 04:05:07',NULL,NULL,NULL),(21,'Tầng 2 Phòng Ngoài','Số 41, Ngõ 87, Đường Nguyễn Phong Sắc',2,'Hạn 26 hàng tháng',1,'https://cdn.filepost.dev/file/filepost/uploads/f9/f98ecc53c29943a0be7d38ab16b5f834','2026-09-12 03:47:58',NULL,NULL,NULL),(22,'Tầng 2 Phòng Trong','Số 41, Ngõ 87, Đường Nguyễn Phong Sắc',2,NULL,1,'https://cdn.filepost.dev/file/filepost/uploads/ed/edef3118ebfd4af7a8b7609af389a684','2026-09-12 04:04:18',NULL,NULL,NULL),(30,'Tầng 3','Số 41, Ngõ 87, Đường Nguyễn Phong Sắc',2,'adad',1,'https://cdn.filepost.dev/file/filepost/uploads/f5/f564318fb7944a65be9808b62c940e30','2026-09-11 22:18:09','2026-09-11 22:26:50',NULL,NULL);
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rent_providers`
--

DROP TABLE IF EXISTS `rent_providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rent_providers` (
  `providerCode` int NOT NULL,
  `providerName` varchar(100) NOT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `dateOfBirth` datetime DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `contactAddress` varchar(200) DEFAULT NULL,
  `gender` int NOT NULL,
  `description` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `createdBy` varchar(50) DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`providerCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rent_providers`
--

LOCK TABLES `rent_providers` WRITE;
/*!40000 ALTER TABLE `rent_providers` DISABLE KEYS */;
INSERT INTO `rent_providers` VALUES (1,'Nguyễn Hữu Lộc',NULL,NULL,'lolkun2000@gmail.com','2000-12-03 22:20:14','0384696172',NULL,0,NULL,'2026-09-11 22:20:47','2026-09-11 22:20:47',NULL,NULL);
/*!40000 ALTER TABLE `rent_providers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tenant_locations`
--

DROP TABLE IF EXISTS `tenant_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tenant_locations` (
  `tenantCode` int NOT NULL,
  `locationCode` int NOT NULL,
  PRIMARY KEY (`tenantCode`,`locationCode`),
  KEY `locationCode` (`locationCode`),
  CONSTRAINT `tenant_locations_ibfk_1` FOREIGN KEY (`tenantCode`) REFERENCES `tenants` (`tenantCode`),
  CONSTRAINT `tenant_locations_ibfk_2` FOREIGN KEY (`locationCode`) REFERENCES `locations` (`locationCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tenant_locations`
--

LOCK TABLES `tenant_locations` WRITE;
/*!40000 ALTER TABLE `tenant_locations` DISABLE KEYS */;
INSERT INTO `tenant_locations` VALUES (3,10),(3,11),(1,21),(2,21),(4,22),(5,22);
/*!40000 ALTER TABLE `tenant_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tenants`
--

DROP TABLE IF EXISTS `tenants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tenants` (
  `tenantCode` int NOT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `tenantName` varchar(100) NOT NULL,
  `dateOfBirth` datetime DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `contactAddress` varchar(200) DEFAULT NULL,
  `gender` int NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  `createdBy` varchar(50) DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  `contractUrl` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`tenantCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tenants`
--

LOCK TABLES `tenants` WRITE;
/*!40000 ALTER TABLE `tenants` DISABLE KEYS */;
INSERT INTO `tenants` VALUES (1,NULL,NULL,'duonglttd@mail.com','Đỗ Thùy Dương',NULL,'0943569596','Số 41 Ngõ 87 Nguyễn Phong Sắc',1,'Người ở cùng - Trần Khánh Linh\r\nHạn đóng tiền: 26 hàng tháng','2026-09-13 14:15:08','2026-09-13 14:34:24',NULL,NULL,NULL),(2,NULL,NULL,'linhtk_placeholder@mail.com','Trần Khánh Linh','2005-11-14 17:00:00',NULL,'Số 41 Ngõ 87 Nguyễn Phong Sắc',1,'cùng phòng với Đỗ Thùy Dương','2026-09-13 14:28:12','2026-09-13 14:31:51',NULL,NULL,NULL),(3,NULL,NULL,'placeholder@mail.com','Nguyễn Văn Quyết',NULL,'0967788783','Số 41 Ngõ 87 Nguyễn Phong Sắc',0,'dùng 2 phòng tầng 1','2026-09-13 14:29:41','2026-09-13 14:29:41',NULL,NULL,NULL),(4,NULL,NULL,'placeholder@mail.com','Ngân','2026-09-14 14:33:04','0964067396','Số 41 Ngõ 87 Nguyễn Phong Sắc',1,'Ở cùng phòng a Dương\r\nHạn đóng tiền: 15 hàng tháng','2026-09-13 14:33:56','2026-09-13 14:33:56',NULL,NULL,NULL),(5,NULL,NULL,'placeholder@mail.com','Dương','2026-09-07 14:36:42','0352144618','Placeholder Address',0,'Cùng phòng chị Ngân','2026-09-13 14:37:00','2026-09-13 14:37:00',NULL,NULL,NULL);
/*!40000 ALTER TABLE `tenants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'services'
--
/*!50003 DROP PROCEDURE IF EXISTS `prcd_FindLocationExpenseById` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `prcd_FindLocationExpenseById`(LocationId int)
BEGIN 

	SELECT

	    l.`locationCode`,

	    l.`locationName`,

	    l.`locationAddress`,

	    l.image,

	    l.`description`,

	    l.owner,

	    l.`roomSize`,

	    l.`createdAt`,

	    l.`createdBy`,

	    l.`updatedAt`,

	    l.`updatedBy`,

	    e.`expenseCode`,

	    e.`expenseName`,

        el.`initialUnit` as 'initialUnit',

        el.`currentUnit` as 'currentUnit',

        e.`unitName` as 'unitName',

	    e.price,

	    e.`inUsed`,

	    e.`type`

	FROM

	    locations l

	    LEFT JOIN expenses_location el ON l.`locationCode` = el.`locationCode`

	    LEFT JOIN expenses e ON e.`expenseCode` = el.`expenseCode`

	WHERE

	    l.`locationCode` = LocationId

	ORDER BY e.`expenseName`;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-13 22:29:39
