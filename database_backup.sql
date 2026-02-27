-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: musicgrid
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

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
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chord_rows`
--

DROP TABLE IF EXISTS `chord_rows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chord_rows` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `song_id` bigint unsigned NOT NULL,
  `row_index` int NOT NULL,
  `chords` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chord_rows_song_id_foreign` (`song_id`),
  CONSTRAINT `chord_rows_song_id_foreign` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chord_rows`
--

LOCK TABLES `chord_rows` WRITE;
/*!40000 ALTER TABLE `chord_rows` DISABLE KEYS */;
INSERT INTO `chord_rows` VALUES (8,2,0,'[\"C\", \"Am\", \"F\", \"G\"]','2026-02-26 21:11:46','2026-02-26 21:11:46'),(9,2,1,'[\"C\", \"Am\", \"F\", \"G\"]','2026-02-26 21:11:46','2026-02-26 21:11:46'),(10,3,0,'[\"C\", \"Cmaj7\", \"F\"]','2026-02-26 21:11:46','2026-02-26 21:11:46'),(11,3,1,'[\"C\", \"Cmaj7\", \"F\"]','2026-02-26 21:11:46','2026-02-26 21:11:46'),(12,4,0,'[\"Em7\", \"Asuspension\", \"Cadd9\"]','2026-02-26 21:11:46','2026-02-26 21:11:46'),(51,9,0,'[{\"id\": \"cell-0\", \"beats\": 4, \"chord\": \"C\", \"isNote\": false}, {\"id\": \"cell-1\", \"beats\": 4, \"chord\": \"Dmin\", \"isNote\": false}, {\"id\": \"cell-2\", \"beats\": 4, \"chord\": \"F\", \"isNote\": false}, {\"id\": \"cell-3\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}]','2026-02-26 23:14:14','2026-02-26 23:14:14'),(52,9,1,'[{\"id\": \"cell-0\", \"beats\": 4, \"chord\": \"F\", \"isNote\": false}, {\"id\": \"cell-1\", \"beats\": 4, \"chord\": \"F\", \"isNote\": false}, {\"id\": \"cell-2\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}, {\"id\": \"cell-3\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}]','2026-02-26 23:14:14','2026-02-26 23:14:14'),(53,9,2,'[{\"id\": \"cell-0\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"cell-1\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"cell-2\", \"beats\": 4, \"chord\": \"Emin\", \"isNote\": false}, {\"id\": \"cell-3\", \"beats\": 4, \"chord\": \"Emin\", \"isNote\": false}]','2026-02-26 23:14:14','2026-02-26 23:14:14'),(54,9,3,'[{\"id\": \"15l5doc\", \"beats\": 4, \"chord\": null, \"isNote\": false}, {\"id\": \"in1qy4s\", \"beats\": 4, \"chord\": null, \"isNote\": false}, {\"id\": \"gjl2s1d\", \"beats\": 4, \"chord\": null, \"isNote\": false}, {\"id\": \"8j6jkrn\", \"beats\": 4, \"chord\": null, \"isNote\": false}]','2026-02-26 23:14:14','2026-02-26 23:14:14'),(55,17,0,'[{\"id\": \"vlyen96\", \"beats\": 4, \"chord\": \"F\", \"isNote\": false}, {\"id\": \"c1s1h1i\", \"beats\": 4, \"chord\": \"F\", \"isNote\": false}, {\"id\": \"zr2k096\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}, {\"id\": \"na7n8zq\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}]','2026-02-26 23:19:36','2026-02-26 23:19:36'),(56,17,1,'[{\"id\": \"okfv218\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"djy187d\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"irzwdsk\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"z05xn3a\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}]','2026-02-26 23:19:36','2026-02-26 23:19:36'),(57,17,2,'[{\"id\": \"pqotpmt\", \"beats\": 4, \"chord\": \"Emin\", \"isNote\": false}, {\"id\": \"wuyb23j\", \"beats\": 4, \"chord\": \"Emin\", \"isNote\": false}, {\"id\": \"aibvmq8\", \"beats\": 4, \"chord\": \"Emin\", \"isNote\": false}, {\"id\": \"ypxa47y\", \"beats\": 4, \"chord\": null, \"isNote\": false}]','2026-02-26 23:19:36','2026-02-26 23:19:36'),(66,1,0,'[{\"id\": \"cell-0\", \"beats\": 4, \"chord\": \"C\", \"isNote\": false}, {\"id\": \"cell-1\", \"beats\": 4, \"chord\": \"C\", \"isNote\": false}, {\"id\": \"cell-2\", \"beats\": 4, \"chord\": \"A#\", \"isNote\": false}, {\"id\": \"cell-3\", \"beats\": 4, \"chord\": \"A#\", \"isNote\": false}]','2026-02-26 23:39:02','2026-02-26 23:39:02'),(67,1,1,'[{\"id\": \"cell-0\", \"beats\": 4, \"chord\": \"C\", \"isNote\": false}, {\"id\": \"cell-1\", \"beats\": 4, \"chord\": \"C\", \"isNote\": false}, {\"id\": \"cell-2\", \"beats\": 2, \"chord\": \"A#\", \"isNote\": false}, {\"id\": \"cell-3\", \"beats\": 2, \"chord\": \"G#\", \"isNote\": false}, {\"id\": \"cell-4\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}]','2026-02-26 23:39:02','2026-02-26 23:39:02'),(68,1,2,'[{\"id\": \"cell-0\", \"beats\": 4, \"chord\": \"C\", \"isNote\": false}, {\"id\": \"cell-1\", \"beats\": 4, \"chord\": \"C\", \"isNote\": false}, {\"id\": \"cell-2\", \"beats\": 4, \"chord\": \"C\", \"isNote\": false}, {\"id\": \"cell-3\", \"beats\": 2, \"chord\": \"C\", \"isNote\": false}, {\"id\": \"cell-4\", \"beats\": 1, \"chord\": \"A#\", \"isNote\": false}, {\"id\": \"cell-5\", \"beats\": 1, \"chord\": \"G#\", \"isNote\": false}]','2026-02-26 23:39:02','2026-02-26 23:39:02'),(69,1,3,'[{\"id\": \"cell-0\", \"beats\": 4, \"chord\": \"C\", \"isNote\": false}, {\"id\": \"cell-1\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"cell-2\", \"beats\": 4, \"chord\": \"Bm7b5\", \"isNote\": false}, {\"id\": \"cell-3\", \"beats\": 4, \"chord\": \"E/G#\", \"isNote\": false}]','2026-02-26 23:39:02','2026-02-26 23:39:02'),(70,1,4,'[{\"id\": \"cell-0\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"cell-1\", \"beats\": 4, \"chord\": \"Amin/G#\", \"isNote\": false}, {\"id\": \"cell-2\", \"beats\": 4, \"chord\": \"Amin/G\", \"isNote\": false}, {\"id\": \"cell-3\", \"beats\": 4, \"chord\": \"D/F#\", \"isNote\": false}]','2026-02-26 23:39:02','2026-02-26 23:39:02'),(71,1,5,'[{\"id\": \"cell-0\", \"beats\": 4, \"chord\": \"F\", \"isNote\": false}, {\"id\": \"cell-1\", \"beats\": 4, \"chord\": \"Dmin\", \"isNote\": false}, {\"id\": \"cell-2\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}, {\"id\": \"cell-3\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}]','2026-02-26 23:39:02','2026-02-26 23:39:02'),(72,1,6,'[{\"id\": \"cell-0\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"cell-1\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"cell-2\", \"beats\": 4, \"chord\": \"Emin\", \"isNote\": false}, {\"id\": \"cell-3\", \"beats\": 4, \"chord\": \"Emin\", \"isNote\": false}]','2026-02-26 23:39:02','2026-02-26 23:39:02'),(73,1,7,'[{\"id\": \"cell-0\", \"beats\": 4, \"chord\": null, \"isNote\": false}, {\"id\": \"cell-1\", \"beats\": 4, \"chord\": null, \"isNote\": false}, {\"id\": \"cell-2\", \"beats\": 4, \"chord\": null, \"isNote\": false}, {\"id\": \"cell-3\", \"beats\": 4, \"chord\": null, \"isNote\": false}]','2026-02-26 23:39:02','2026-02-26 23:39:02'),(74,18,0,'[{\"id\": \"pj1ddoj\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"xnw00bx\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}, {\"id\": \"llv1ry1\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"te2ljml\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}]','2026-02-27 02:00:47','2026-02-27 02:00:47'),(75,18,1,'[{\"id\": \"hxu68mr\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"cs3m163\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}, {\"id\": \"9rjhbz5\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"c8ealjc\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}]','2026-02-27 02:00:47','2026-02-27 02:00:47'),(76,18,2,'[{\"id\": \"9rf72qg\", \"beats\": 4, \"chord\": \"F\", \"isNote\": false}, {\"id\": \"qw1va0c\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}, {\"id\": \"q1ynhym\", \"beats\": 4, \"chord\": \"Emin\", \"isNote\": false}, {\"id\": \"fwfd0xa\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}]','2026-02-27 02:00:47','2026-02-27 02:00:47'),(77,18,3,'[{\"id\": \"nlo6jbt\", \"beats\": 4, \"chord\": \"F\", \"isNote\": false}, {\"id\": \"j05tmmw\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}, {\"id\": \"urbosxb\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"87bvz1v\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}]','2026-02-27 02:00:47','2026-02-27 02:00:47'),(78,18,4,'[{\"id\": \"hvyskkg\", \"beats\": 4, \"chord\": null, \"isNote\": false}, {\"id\": \"93osupd\", \"beats\": 4, \"chord\": null, \"isNote\": false}, {\"id\": \"5vlxj67\", \"beats\": 4, \"chord\": null, \"isNote\": false}, {\"id\": \"lsoxsp1\", \"beats\": 4, \"chord\": null, \"isNote\": false}]','2026-02-27 02:00:47','2026-02-27 02:00:47'),(79,19,0,'[{\"id\": \"pj1ddoj\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"xnw00bx\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}, {\"id\": \"llv1ry1\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"te2ljml\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}]','2026-02-27 03:25:27','2026-02-27 03:25:27'),(80,19,1,'[{\"id\": \"hxu68mr\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"cs3m163\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}, {\"id\": \"9rjhbz5\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"c8ealjc\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}]','2026-02-27 03:25:27','2026-02-27 03:25:27'),(81,19,2,'[{\"id\": \"9rf72qg\", \"beats\": 4, \"chord\": \"F\", \"isNote\": false}, {\"id\": \"qw1va0c\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}, {\"id\": \"q1ynhym\", \"beats\": 4, \"chord\": \"Emin\", \"isNote\": false}, {\"id\": \"fwfd0xa\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}]','2026-02-27 03:25:27','2026-02-27 03:25:27'),(82,19,3,'[{\"id\": \"nlo6jbt\", \"beats\": 4, \"chord\": \"F\", \"isNote\": false}, {\"id\": \"j05tmmw\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}, {\"id\": \"urbosxb\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"87bvz1v\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}]','2026-02-27 03:25:27','2026-02-27 03:25:27'),(83,19,4,'[{\"id\": \"hvyskkg\", \"beats\": 4, \"chord\": null, \"isNote\": false}, {\"id\": \"93osupd\", \"beats\": 4, \"chord\": null, \"isNote\": false}, {\"id\": \"5vlxj67\", \"beats\": 4, \"chord\": null, \"isNote\": false}, {\"id\": \"lsoxsp1\", \"beats\": 4, \"chord\": null, \"isNote\": false}]','2026-02-27 03:25:27','2026-02-27 03:25:27'),(84,20,0,'[{\"id\": \"cell-0\", \"beats\": 4, \"chord\": \"C\", \"isNote\": false}, {\"id\": \"cell-1\", \"beats\": 4, \"chord\": \"Am\", \"isNote\": false}, {\"id\": \"cell-2\", \"beats\": 4, \"chord\": \"F\", \"isNote\": false}, {\"id\": \"cell-3\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}]','2026-02-27 04:08:37','2026-02-27 04:08:37'),(85,20,1,'[{\"id\": \"cell-0\", \"beats\": 4, \"chord\": \"F\", \"isNote\": false}, {\"id\": \"cell-1\", \"beats\": 4, \"chord\": \"Am\", \"isNote\": false}, {\"id\": \"cell-2\", \"beats\": 4, \"chord\": \"F\", \"isNote\": false}, {\"id\": \"cell-3\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}]','2026-02-27 04:08:37','2026-02-27 04:08:37');
/*!40000 ALTER TABLE `chord_rows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chords`
--

DROP TABLE IF EXISTS `chords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chords` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `song_id` bigint unsigned NOT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `chord_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chords_song_id_foreign` (`song_id`),
  CONSTRAINT `chords_song_id_foreign` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chords`
--

LOCK TABLES `chords` WRITE;
/*!40000 ALTER TABLE `chords` DISABLE KEYS */;
INSERT INTO `chords` VALUES (1,2,'C','C Major','2026-02-26 21:11:46','2026-02-26 21:11:46'),(2,2,'Am','A Minor','2026-02-26 21:11:46','2026-02-26 21:11:46'),(3,2,'F','F Major','2026-02-26 21:11:46','2026-02-26 21:11:46'),(4,2,'G','G Major','2026-02-26 21:11:46','2026-02-26 21:11:46'),(5,3,'C','C Major','2026-02-26 21:11:46','2026-02-26 21:11:46'),(6,3,'Cmaj7','C Major 7','2026-02-26 21:11:46','2026-02-26 21:11:46'),(7,3,'F','F Major','2026-02-26 21:11:46','2026-02-26 21:11:46'),(8,4,'Em7','E Minor 7','2026-02-26 21:11:46','2026-02-26 21:11:46'),(9,4,'Asuspension','A Suspension','2026-02-26 21:11:46','2026-02-26 21:11:46'),(10,4,'Cadd9','C Add 9','2026-02-26 21:11:46','2026-02-26 21:11:46');
/*!40000 ALTER TABLE `chords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_02_10_105813_create_songs_table',1),(5,'2026_02_10_105814_create_chord_rows_table',1),(6,'2026_02_10_105815_create_chords_table',1),(7,'2026_02_11_075137_add_date_of_birth_to_users_table',1),(8,'2026_02_11_080012_create_personal_access_tokens_table',1),(9,'2026_02_16_104346_create_shared_songs_table',1),(10,'2026_02_19_000000_add_owner_and_visibility_to_songs',1),(11,'2026_02_19_000001_create_song_user_bookmarks_table',1),(12,'2026_02_25_000000_add_metadata_to_songs',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (4,'App\\Models\\User',5,'auth-token','eb93f64329bd474be52404d4c532fa9d55851fe98ece41de55ce8e7adf63f466','[\"*\"]','2026-02-27 04:08:36',NULL,'2026-02-27 01:59:50','2026-02-27 04:08:36'),(5,'App\\Models\\User',2,'auth-token','24d2b3b1ff35a08f961a6c99d4dcf639cb5550463fc8f88ac428633ba8316ec8','[\"*\"]','2026-02-27 03:45:41',NULL,'2026-02-27 03:24:34','2026-02-27 03:45:41');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shared_songs`
--

DROP TABLE IF EXISTS `shared_songs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shared_songs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `share_id` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rows` json NOT NULL,
  `owner_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shared_songs_share_id_unique` (`share_id`),
  KEY `shared_songs_user_id_foreign` (`user_id`),
  CONSTRAINT `shared_songs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shared_songs`
--

LOCK TABLES `shared_songs` WRITE;
/*!40000 ALTER TABLE `shared_songs` DISABLE KEYS */;
INSERT INTO `shared_songs` VALUES (1,'rhwscLs5','Step In','[{\"id\": \"kl00y3j\", \"cells\": [{\"id\": \"pj1ddoj\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"xnw00bx\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}, {\"id\": \"llv1ry1\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"te2ljml\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}]}, {\"id\": \"bfvgo1y\", \"cells\": [{\"id\": \"hxu68mr\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"cs3m163\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}, {\"id\": \"9rjhbz5\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"c8ealjc\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}]}, {\"id\": \"rmux5ah\", \"cells\": [{\"id\": \"9rf72qg\", \"beats\": 4, \"chord\": \"F\", \"isNote\": false}, {\"id\": \"qw1va0c\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}, {\"id\": \"q1ynhym\", \"beats\": 4, \"chord\": \"Emin\", \"isNote\": false}, {\"id\": \"fwfd0xa\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}]}, {\"id\": \"z1k6mf4\", \"cells\": [{\"id\": \"nlo6jbt\", \"beats\": 4, \"chord\": \"F\", \"isNote\": false}, {\"id\": \"j05tmmw\", \"beats\": 4, \"chord\": \"G\", \"isNote\": false}, {\"id\": \"urbosxb\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}, {\"id\": \"87bvz1v\", \"beats\": 4, \"chord\": \"Amin\", \"isNote\": false}]}, {\"id\": \"g1s4p3q\", \"cells\": [{\"id\": \"hvyskkg\", \"beats\": 4, \"chord\": null, \"isNote\": false}, {\"id\": \"93osupd\", \"beats\": 4, \"chord\": null, \"isNote\": false}, {\"id\": \"5vlxj67\", \"beats\": 4, \"chord\": null, \"isNote\": false}, {\"id\": \"lsoxsp1\", \"beats\": 4, \"chord\": null, \"isNote\": false}]}]','Andi Google',NULL,'2026-02-27 03:24:03','2026-02-27 03:24:03');
/*!40000 ALTER TABLE `shared_songs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `song_user`
--

DROP TABLE IF EXISTS `song_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `song_user` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `song_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `song_user_song_id_user_id_unique` (`song_id`,`user_id`),
  KEY `song_user_user_id_foreign` (`user_id`),
  CONSTRAINT `song_user_song_id_foreign` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `song_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `song_user`
--

LOCK TABLES `song_user` WRITE;
/*!40000 ALTER TABLE `song_user` DISABLE KEYS */;
INSERT INTO `song_user` VALUES (1,2,4,'2026-02-26 21:11:46','2026-02-26 21:11:46'),(2,4,4,'2026-02-26 21:11:46','2026-02-26 21:11:46');
/*!40000 ALTER TABLE `song_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `songs`
--

DROP TABLE IF EXISTS `songs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `songs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `artist` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `tempo` int DEFAULT NULL,
  `time_signature` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `base_chord` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `visibility` enum('public','unlisted','private') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'public',
  `original_song_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `songs_user_id_foreign` (`user_id`),
  KEY `songs_original_song_id_foreign` (`original_song_id`),
  CONSTRAINT `songs_original_song_id_foreign` FOREIGN KEY (`original_song_id`) REFERENCES `songs` (`id`) ON DELETE SET NULL,
  CONSTRAINT `songs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `songs`
--

LOCK TABLES `songs` WRITE;
/*!40000 ALTER TABLE `songs` DISABLE KEYS */;
INSERT INTO `songs` VALUES (1,'Masuk HadiratNya Dengan Hati Bersyukur',NULL,NULL,NULL,130,'4/4','C - D','2026-02-26 03:18:22','2026-02-26 03:18:22',2,'private',NULL),(2,'Let It Be','The Beatles','C','Classic Beatles song',72,'4/4','C','2026-02-26 21:11:46','2026-02-26 21:11:46',4,'public',NULL),(3,'Imagine','John Lennon','C','Peaceful and inspiring',75,'4/4','C','2026-02-26 21:11:46','2026-02-26 21:11:46',4,'public',NULL),(4,'Wonderwall','Oasis','Em7',NULL,87,'4/4','Em7','2026-02-26 21:11:46','2026-02-26 21:11:46',4,'public',NULL),(9,'Let It Be',NULL,NULL,NULL,72,'4/4','C','2026-02-26 21:40:26','2026-02-26 21:40:26',2,'public',NULL),(17,'Imagine',NULL,NULL,NULL,75,'4/4','C','2026-02-26 23:19:36','2026-02-26 23:19:36',2,'public',NULL),(18,'Step In',NULL,NULL,NULL,120,'4/4','C','2026-02-27 02:00:47','2026-02-27 02:00:47',5,'private',NULL),(19,'Step In',NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-27 03:25:27','2026-02-27 03:25:27',2,'private',NULL),(20,'Let It Be',NULL,NULL,NULL,72,'4/4','C','2026-02-27 04:08:37','2026-02-27 04:08:37',5,'public',NULL);
/*!40000 ALTER TABLE `songs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_google_id_unique` (`google_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin@test.com',NULL,NULL,NULL,'$2y$12$0rC4aE7DAGCnzJ62GxVYq.l2lQontLzK4WBkHPtkMIZENo30f.9jy',NULL,'2026-02-26 02:35:07','2026-02-26 02:35:07'),(2,'Andi','andi_0831@yahoo.com',NULL,NULL,NULL,'$2y$12$vOSCGOLm/RDg/m/.snCJ7uRUFCG/9g3yf9h6eGYYFkUMDmyyJuOIO',NULL,'2026-02-26 02:42:07','2026-02-26 02:42:07'),(3,'Test User','test@example.com',NULL,NULL,NULL,'$2y$12$0HMGz0mwhXJBI8pm8nzhAuxMZIZ.dU3UV7CkqnnzeqSlYDD2CSupW',NULL,'2026-02-26 21:11:46','2026-02-26 21:11:46'),(4,'Seed User','seed@local.test',NULL,NULL,NULL,'$2y$12$cIJQgSiXjdTqaOFkImCQ/.6yYBFAg684YtNkVqy/rSSe9PG1r611S',NULL,'2026-02-26 21:11:46','2026-02-26 21:11:46'),(5,'Andi Google','andialvieny@gmail.com',NULL,NULL,NULL,'$2y$12$g5Y5hiM29RJfo2VkjfVlqur1D2BOXMb.o1iOSz375z4Za2hxdV4pq',NULL,'2026-02-27 01:59:50','2026-02-27 01:59:50');
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

-- Dump completed on 2026-02-27 18:30:44
