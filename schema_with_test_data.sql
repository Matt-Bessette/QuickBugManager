CREATE DATABASE  IF NOT EXISTS `BUGS` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `BUGS`;
-- MySQL dump 10.13  Distrib 5.5.43, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: BUGS
-- ------------------------------------------------------
-- Server version	5.5.43-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bugs`
--

DROP TABLE IF EXISTS `bugs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bugs` (
  `bugID` int(11) NOT NULL AUTO_INCREMENT,
  `projID` int(11) NOT NULL,
  `moduleID` int(11) DEFAULT NULL,
  `maker` int(11) DEFAULT NULL,
  `dev` int(11) DEFAULT NULL,
  `description` varchar(2048) DEFAULT NULL,
  `browser` varchar(256) DEFAULT NULL,
  `type` varchar(256) DEFAULT NULL,
  `submitted` varchar(128) DEFAULT NULL,
  `status` int(11) DEFAULT '1',
  PRIMARY KEY (`bugID`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bugs`
--

LOCK TABLES `bugs` WRITE;
/*!40000 ALTER TABLE `bugs` DISABLE KEYS */;
INSERT INTO `bugs` VALUES (1,1,0,1,2,'test','chrome','cosmetic',NULL,1),(2,1,0,1,2,'test2','chrome','functional',NULL,2),(3,1,0,1,2,'test3','chrome','interface',NULL,3),(4,1,0,1,2,'test4','chrome','cosmetic',NULL,4),(5,1,0,1,2,'test5','chrome','functional',NULL,5),(6,1,0,2,1,'test6','firefox','functional',NULL,1),(7,1,0,3,1,'test7','firefox','cosmetic',NULL,2),(8,1,0,1,3,'test8','firefox','interface',NULL,3),(9,1,0,2,4,'test9','firefox','functional',NULL,4),(10,1,0,3,3,'test10','firefox','cosmetic',NULL,5),(11,1,0,2,4,'test11','opera','cosmetic',NULL,1),(12,1,0,2,2,'test12','opera','functional',NULL,2),(13,1,0,2,3,'test13','opera','interface',NULL,3),(14,1,0,1,1,'test14','opera','cosmetic',NULL,4),(15,1,0,1,4,'test15','opera','functional',NULL,5),(16,1,0,1,0,'','any','cosmetic','2015-07-04 21:52:58',2),(17,1,0,1,0,'','any','cosmetic','2015-07-04 21:53:42',2),(18,1,0,1,0,'','any','cosmetic','2015-07-04 21:53:50',2),(19,1,0,1,0,'','any','cosmetic','2015-07-04 21:54:46',2),(20,1,0,1,0,'','any','cosmetic','2015-07-04 21:55:50',2),(21,1,0,1,0,'','any','cosmetic','2015-07-04 21:57:42',2);
/*!40000 ALTER TABLE `bugs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `commentID` int(11) NOT NULL AUTO_INCREMENT,
  `bugID` int(11) NOT NULL,
  `userID` int(11) DEFAULT NULL,
  `comment` varchar(2048) DEFAULT NULL,
  `submitted` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`commentID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,1,1,'tester',NULL),(2,1,1,'adasdasfasdgdfgdfsgsdfgdfgdfgdfg sfsdfsdaf sdfsdfsd sdf sdfsdfsdfwwef w','2015-07-04 23:30:55'),(3,1,1,'d85as4d5sa as5d6 41asd56as1 56d1 as56 sa','2015-07-04 23:30:55'),(4,1,1,'adasd asdas dasd asfasfas as','2015-07-04 23:30:55'),(5,1,1,'sfdg dfgdf h rtfgh g gdf gdfgdfgdf','2015-07-04 23:30:55'),(6,1,1,'fgrtger r reg efgh reg erg','2015-07-04 23:30:55');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `modules` (
  `moduleID` int(11) NOT NULL AUTO_INCREMENT,
  `projID` int(11) NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`moduleID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modules`
--

LOCK TABLES `modules` WRITE;
/*!40000 ALTER TABLE `modules` DISABLE KEYS */;
INSERT INTO `modules` VALUES (0,0,'none'),(1,1,'testtesttest');
/*!40000 ALTER TABLE `modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `projID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `version` varchar(128) DEFAULT NULL,
  `submitted` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`projID`),
  UNIQUE KEY `projID_UNIQUE` (`projID`),
  KEY `owner_idx` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,1,'tset','1',NULL),(2,2,'asdasd','2',NULL);
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tags` (
  `bugID` int(11) NOT NULL,
  `tag` varchar(256) DEFAULT NULL,
  `tagID` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`tagID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'testtset',1);
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(128) DEFAULT NULL,
  `hash` varchar(256) DEFAULT NULL,
  `salt` varchar(256) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `userID_UNIQUE` (`userID`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (0,'none',NULL,NULL,'none'),(1,'zack',NULL,NULL,'zack'),(2,'matt',NULL,NULL,'matt'),(3,'marco',NULL,NULL,'marco'),(4,'moshi',NULL,NULL,'moshi');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-07-05 11:25:53
