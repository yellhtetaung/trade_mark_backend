-- MySQL dump 10.13  Distrib 8.2.0, for macos14.0 (arm64)
--
-- Host: localhost    Database: trade_mark
-- ------------------------------------------------------
-- Server version	8.2.0

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
-- Table structure for table `TradeMarkInfo`
--

DROP TABLE IF EXISTS `TradeMarkInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TradeMarkInfo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trademark` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trademark_sample` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applicant` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `classes` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `goods_services` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_ent_reg_cer` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nonlatin_char_trans` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trans_mean` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color_claim` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `re_filling_date` datetime(3) NOT NULL,
  `re_filling_WIPO_no` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `app_no` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `off_fill_date` datetime(3) NOT NULL,
  `payment_WIPO_no` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `other_procedure` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `granting_date` datetime(3) NOT NULL,
  `reg_no` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `time_renewal` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `renewal_date` datetime(3) NOT NULL,
  `renewal_no` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `val_period` datetime(3) NOT NULL,
  `date_of_public` datetime(3) NOT NULL,
  `exp_date` datetime(3) NOT NULL,
  `reason_exp` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tm2` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` date NOT NULL,
  `submittion_type` json NOT NULL,
  `attachment` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TradeMarkInfo`
--

LOCK TABLES `TradeMarkInfo` WRITE;
/*!40000 ALTER TABLE `TradeMarkInfo` DISABLE KEYS */;
/*!40000 ALTER TABLE `TradeMarkInfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_no` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nrc` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `role` enum('Admin','User') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'User',
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-17 23:47:40
