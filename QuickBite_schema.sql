-- MySQL dump 10.13  Distrib 9.4.0, for macos15 (arm64)
--
-- Host: localhost    Database: Food_Delivery
-- ------------------------------------------------------
-- Server version	9.4.0

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
-- Table structure for table `Coupon`
--

DROP TABLE IF EXISTS `Coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Coupon` (
  `Coupon_ID` int NOT NULL,
  `Discount` decimal(5,2) DEFAULT NULL,
  `Expiry` date DEFAULT NULL,
  `Restaurant_ID` int DEFAULT NULL,
  PRIMARY KEY (`Coupon_ID`),
  KEY `Restaurant_ID` (`Restaurant_ID`),
  CONSTRAINT `coupon_ibfk_1` FOREIGN KEY (`Restaurant_ID`) REFERENCES `Restaurant` (`Restaurant_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Cuisine`
--

DROP TABLE IF EXISTS `Cuisine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Cuisine` (
  `Restaurant_ID` int NOT NULL,
  `Cusine` varchar(100) NOT NULL,
  PRIMARY KEY (`Restaurant_ID`,`Cusine`),
  CONSTRAINT `cuisine_ibfk_1` FOREIGN KEY (`Restaurant_ID`) REFERENCES `Restaurant` (`Restaurant_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Customer`
--

DROP TABLE IF EXISTS `Customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Customer` (
  `Customer_ID` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(100) DEFAULT NULL,
  `Phone_Num` varchar(20) DEFAULT NULL,
  `First_Name` varchar(50) DEFAULT NULL,
  `Middle_Name` varchar(50) DEFAULT NULL,
  `Last_Name` varchar(50) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`Customer_ID`),
  KEY `fk_customer_user` (`userId`),
  CONSTRAINT `fk_customer_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Customer_Address`
--

DROP TABLE IF EXISTS `Customer_Address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Customer_Address` (
  `Customer_ID` int NOT NULL,
  `Address_ID` int NOT NULL,
  PRIMARY KEY (`Customer_ID`,`Address_ID`),
  KEY `Address_ID` (`Address_ID`),
  CONSTRAINT `customer_address_ibfk_1` FOREIGN KEY (`Customer_ID`) REFERENCES `Customer` (`Customer_ID`),
  CONSTRAINT `customer_address_ibfk_2` FOREIGN KEY (`Address_ID`) REFERENCES `Delivery_Address` (`Address_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Customer_Order`
--

DROP TABLE IF EXISTS `Customer_Order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Customer_Order` (
  `Order_ID` int NOT NULL,
  `Status` varchar(50) DEFAULT NULL,
  `Customer_ID` int DEFAULT NULL,
  `Address_ID` int DEFAULT NULL,
  `Restaurant_ID` int DEFAULT NULL,
  `Payment_ID` int DEFAULT NULL,
  `Driver_ID` int DEFAULT NULL,
  PRIMARY KEY (`Order_ID`),
  KEY `fk_co_address` (`Address_ID`),
  KEY `fk_co_restaurant` (`Restaurant_ID`),
  KEY `fk_co_payment` (`Payment_ID`),
  KEY `fk_co_driver` (`Driver_ID`),
  KEY `fk_co_customer` (`Customer_ID`),
  CONSTRAINT `fk_co_address` FOREIGN KEY (`Address_ID`) REFERENCES `Delivery_Address` (`Address_ID`),
  CONSTRAINT `fk_co_customer` FOREIGN KEY (`Customer_ID`) REFERENCES `Customer` (`Customer_ID`),
  CONSTRAINT `fk_co_driver` FOREIGN KEY (`Driver_ID`) REFERENCES `Driver` (`Driver_ID`),
  CONSTRAINT `fk_co_payment` FOREIGN KEY (`Payment_ID`) REFERENCES `Payment` (`Payment_ID`),
  CONSTRAINT `fk_co_restaurant` FOREIGN KEY (`Restaurant_ID`) REFERENCES `Restaurant` (`Restaurant_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Delivery_Address`
--

DROP TABLE IF EXISTS `Delivery_Address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Delivery_Address` (
  `Address_ID` int NOT NULL,
  `Address_First_Line` varchar(255) DEFAULT NULL,
  `Address_Second_Line` varchar(255) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `Pincode` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`Address_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Driver`
--

DROP TABLE IF EXISTS `Driver`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Driver` (
  `Driver_ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) DEFAULT NULL,
  `Vehicle_Name` varchar(100) DEFAULT NULL,
  `Vehicle_Number` varchar(50) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`Driver_ID`),
  KEY `fk_driver_user` (`userId`),
  CONSTRAINT `fk_driver_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Menu`
--

DROP TABLE IF EXISTS `Menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Menu` (
  `Menu_ID` int NOT NULL AUTO_INCREMENT,
  `Item_Name` varchar(100) DEFAULT NULL,
  `Item_Description` varchar(255) DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `Restaurant_ID` int DEFAULT NULL,
  PRIMARY KEY (`Menu_ID`),
  KEY `fk_menu_restaurant` (`Restaurant_ID`),
  CONSTRAINT `fk_menu_restaurant` FOREIGN KEY (`Restaurant_ID`) REFERENCES `Restaurant` (`Restaurant_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Order_Contains`
--

DROP TABLE IF EXISTS `Order_Contains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Order_Contains` (
  `Order_ID` int NOT NULL,
  `Menu_ID` int NOT NULL,
  PRIMARY KEY (`Order_ID`,`Menu_ID`),
  KEY `Menu_ID` (`Menu_ID`),
  CONSTRAINT `order_contains_ibfk_1` FOREIGN KEY (`Order_ID`) REFERENCES `Customer_Order` (`Order_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Payment`
--

DROP TABLE IF EXISTS `Payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Payment` (
  `Payment_ID` int NOT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `Payment_Method` varchar(50) DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Payment_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Rating`
--

DROP TABLE IF EXISTS `Rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Rating` (
  `Review_ID` int NOT NULL,
  `Rating` int DEFAULT NULL,
  `Restaurant_ID` int DEFAULT NULL,
  PRIMARY KEY (`Review_ID`),
  KEY `Restaurant_ID` (`Restaurant_ID`),
  CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`Restaurant_ID`) REFERENCES `Restaurant` (`Restaurant_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Restaurant`
--

DROP TABLE IF EXISTS `Restaurant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Restaurant` (
  `Restaurant_ID` int NOT NULL AUTO_INCREMENT,
  `Restaurant_Name` varchar(100) DEFAULT NULL,
  `Address_First_line` varchar(255) DEFAULT NULL,
  `Address_Second_line` varchar(255) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `Pincode` varchar(20) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`Restaurant_ID`),
  KEY `fk_restaurant_user` (`userId`),
  CONSTRAINT `fk_restaurant_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','restaurant','driver') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-13  0:17:28
