-- MySQL dump 10.13  Distrib 5.6.21, for linux-glibc2.5 (x86_64)
--
-- Host: localhost    Database: platform_kenrobot_dev
-- ------------------------------------------------------
-- Server version	5.6.21-log

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
-- Table structure for table `boards`
--

DROP TABLE IF EXISTS `boards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `boards` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主板id',
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '主板名字',
  `label` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '主板名字(用于显示)',
  `board_type` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '主板类型',
  `in_use` tinyint(1) NOT NULL COMMENT '是否正在使用',
  `width` int(11) NOT NULL COMMENT '宽度',
  `height` int(11) NOT NULL COMMENT '高度',
  `category` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '类别',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boards`
--

LOCK TABLES `boards` WRITE;
/*!40000 ALTER TABLE `boards` DISABLE KEYS */;
INSERT INTO `boards` VALUES (1,'ArduinoUNO','Arduino UNO R3','uno',1,355,265,'ArduinoUNO'),(2,'ArduinoYún','Arduino Yún','yun',1,355,265,'ArduinoUNO'),(3,'ArduinoMegaADK','Arduino Mega ADK','megaADK',1,355,265,'ArduinoUNO'),(4,'ArduinoMicro','Arduino Micro','micro',1,355,265,'ArduinoUNO'),(5,'ArduinoEsplora','Arduino Esplora','esplora',1,355,265,'ArduinoUNO'),(6,'ArduinoEthernet','Arduino Ethernet','ethernet',1,355,265,'ArduinoUNO'),(7,'ArduinoFio','Arduino Fio','fio',1,355,265,'ArduinoUNO'),(8,'ArduinoLilyPadUSB','Arduino LilyPadUSB','LilyPadUSB',1,355,265,'ArduinoUNO'),(9,'ArduinoRobotControl','Arduino Robot Control','robotControl',1,355,265,'ArduinoUNO'),(10,'ArduinoRobotMotor','Arduino Robot Motor','robotMotor',1,355,265,'ArduinoUNO');
/*!40000 ALTER TABLE `boards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `value` text COLLATE utf8_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL,
  UNIQUE KEY `cache_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `components`
--

DROP TABLE IF EXISTS `components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `components` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '器件id',
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '器件名字',
  `label` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '器件名字(用于显示)',
  `in_use` tinyint(1) NOT NULL COMMENT '是否正在使用',
  `width` int(11) NOT NULL COMMENT '宽度',
  `height` int(11) NOT NULL COMMENT '高度',
  `varName` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '默认变量名',
  `varCode` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '变量声明代码',
  `headCode` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '引用头文件代码',
  `setupCode` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '初始化代码',
  `category` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '类别',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `components`
--

LOCK TABLES `components` WRITE;
/*!40000 ALTER TABLE `components` DISABLE KEYS */;
INSERT INTO `components` VALUES (1,'buzzer','Buzzer',1,85,80,'buzzer_','int $NAME = $P0;\n','','','one-port-bottom'),(2,'continuousServo','Continuous servo',1,125,106,'servo_cont_','Servo $NAME;\n','#include <Servo.h>\n','$NAME.attach($P0);\n','one-port-bottom'),(3,'lcd','LCD',1,170,92,'lcd_','LiquidCrystal $NAME($P0);\n','#include <Wire.h>\n#include <bqLiquidCrystal.h>\n#include <Servo.h>\n#include <SoftwareSerial.h>\n','$NAME.begin(16, 2);\n$NAME.clear();\n','two-port-top'),(4,'led','LED',1,55,83,'led_','int $NAME = $P0;\n','','pinMode($NAME, OUTPUT);\n','one-port-bottom'),(5,'ultrasoundSensor','Ultrasound sensor',1,120,79,'ultrasound_sensor_','US $NAME($P0, $P1);\n','#include <US.h>\n#include <Servo.h>\n#include <SoftwareSerial.h>\n#include <Wire.h>\n','','two-port-bottom'),(6,'button','Button',1,90,73,'button_','int $NAME = $P0;\n','','pinMode($NAME, INPUT);\n','one-port-bottom'),(7,'buttonPanel','Button panel',1,165,120,'button_panel_','ButtonPad $NAME($P0);\n','#include <ButtonPad.h>\n#include <Servo.h>\n#include <SoftwareSerial.h>\n#include <Wire.h>\n','','one-port-top'),(8,'infraredSensor','Infrared sensor',1,90,78,'infrared_sensor_','int $NAME = $P0;\n','','pinMode($NAME, INPUT);\n','one-port-bottom'),(9,'lineFollower','Line follower',1,95,87,'line_follower_','LineFollower $NAME($P0, $P1);\n','#include <LineFollower.h>\n#include <Servo.h>\n#include <SoftwareSerial.h>\n#include <Wire.h>\n','','two-port-bottom'),(10,'joystick','Joystick',1,100,101,'joystick_','Joystick $NAME($P1, $P2, $P0);\n','#include <Joystick.h>\n#include <Wire.h>\n#include <Servo.h>\n#include <SoftwareSerial.h>\n','','joystick'),(11,'lightSensor','Light sensor',1,90,64,'light_sensor_','int $NAME = $P0;\n','','pinMode($NAME, INPUT);\n','one-port-top'),(12,'potentiometer','Potentiometer',1,65,103,'potentiometer_','int $NAME = $P0;\n','','pinMode($NAME, INPUT);\n','one-port-top'),(13,'bluetooth','Bluetooth',1,115,88,'bluetooth_','bqSoftwareSerial $NAME($P0, $P1, 9600);\n','#include <SoftwareSerial.h>\n#include <bqSoftwareSerial.h>\n#include <Servo.h>\n#include <Wire.h>\n','','two-port-bottom'),(14,'serialPort','Serial port',1,115,71,'serial_port_','bqSoftwareSerial $NAME(0, 1, 9600);\n','#include <SoftwareSerial.h>\n#include <bqSoftwareSerial.h>\n#include <Servo.h>\n#include <Wire.h>\n','','one-port-right'),(15,'servo','Servo',1,125,106,'servo_','Servo $NAME;\n','#include <Servo.h>\n','$NAME.attach($P0);\n','one-port-bottom');
/*!40000 ALTER TABLE `components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `libraries`
--

DROP TABLE IF EXISTS `libraries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `libraries` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'library id',
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'library名字',
  `code` blob NOT NULL COMMENT '引用代码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `libraries`
--

LOCK TABLES `libraries` WRITE;
/*!40000 ALTER TABLE `libraries` DISABLE KEYS */;
INSERT INTO `libraries` VALUES (1,'Bridge','#include <Bridge.h>\n#include <Console.h>\n#include <FileIO.h>\n#include <HttpClient.h>\n#include <Mailbox.h>\n#include <Process.h>\n#include <YunClient.h>\n#include <YunServer.h>\n'),(2,'EEPROM','#include <EEPROM.h>\n'),(3,'Esplora','#include <Esplora.h>\n'),(4,'Ethernet','#include <Dhcp.h>\n#include <Dns.h>\n#include <Ethernet.h>\n#include <EthernetClient.h>\n#include <EthernetServer.h>\n#include <EthernetUdp.h>\n'),(5,'Firmata','#include <Boards.h>\n#include <Firmata.h>\n'),(6,'GSM','#include <GSM.h>\n#include <GSM3CircularBuffer.h>\n#include <GSM3IO.h>\n#include <GSM3MobileAccessProvider.h>\n#include <GSM3MobileCellManagement.h>\n#include <GSM3MobileClientProvider.h>\n#include <GSM3MobileClientService.h>\n#include <GSM3MobileDataNetworkProvider.h>\n#include <GSM3MobileMockupProvider.h>\n#include <GSM3MobileNetworkProvider.h>\n#include <GSM3MobileNetworkRegistry.h>\n#include <GSM3MobileServerProvider.h>\n#include <GSM3MobileServerService.h>\n#include <GSM3MobileSMSProvider.h>\n#include <GSM3MobileVoiceProvider.h>\n#include <GSM3ShieldV1.h>\n#include <GSM3ShieldV1AccessProvider.h>\n#include <GSM3ShieldV1BandManagement.h>\n#include <GSM3ShieldV1BaseProvider.h>\n#include <GSM3ShieldV1CellManagement.h>\n#include <GSM3ShieldV1ClientProvider.h>\n#include <GSM3ShieldV1DataNetworkProvider.h>\n#include <GSM3ShieldV1DirectModemProvider.h>\n#include <GSM3ShieldV1ModemCore.h>\n#include <GSM3ShieldV1ModemVerification.h>\n#include <GSM3ShieldV1MultiClientProvider.h>\n#include <GSM3ShieldV1MultiServerProvider.h>\n#include <GSM3ShieldV1PinManagement.h>\n#include <GSM3ShieldV1ScanNetworks.h>\n#include <GSM3ShieldV1ServerProvider.h>\n#include <GSM3ShieldV1SMSProvider.h>\n#include <GSM3ShieldV1VoiceProvider.h>\n#include <GSM3SMSService.h>\n#include <GSM3SoftSerial.h>\n#include <GSM3VoiceCallService.h>\n'),(7,'LiquidCrystal','#include <LiquidCrystal.h>\n'),(8,'Robot Control','#include <ArduinoRobot.h>\n#include <Arduino_LCD.h>\n#include <Compass.h>\n#include <EasyTransfer2.h>\n#include <EEPROM_I2C.h>\n#include <Fat16.h>\n#include <Fat16Config.h>\n#include <Fat16mainpage.h>\n#include <Fat16util.h>\n#include <FatStructs.h>\n#include <Multiplexer.h>\n#include <SdCard.h>\n#include <SdInfo.h>\n#include <Squawk.h>\n#include <SquawkSD.h>\n'),(9,'Robot IR Remote','#include <IRremote.h>\n#include <IRremoteInt.h>\n#include <IRremoteTools.h>\n'),(10,'Robot Motor','#include <ArduinoRobotMotorBoard.h>\n#include <EasyTransfer2.h>\n#include <LineFollow.h>\n#include <Multiplexer.h>\n'),(11,'SD','#include <SD.h>\n'),(12,'SPI','#include <SPI.h>\n'),(13,'Servo','#include <Servo.h>\n'),(14,'SoftwareSerial','#include <SoftwareSerial.h>\n'),(15,'SpacebrewYun','#include <SpacebrewYun.h>\n'),(16,'Stepper','#include <Stepper.h>\n'),(17,'TFT','#include <TFT.h>\n'),(18,'Temboo','#include <Temboo.h>\n'),(19,'WiFi','#include <WiFi.h>\n#include <WiFiClient.h>\n#include <WiFiServer.h>\n#include <WiFiUdp.h>\n'),(20,'Wire','#include <Wire.h>\n');
/*!40000 ALTER TABLE `libraries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `migration` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES ('2014_10_12_000000_create_users_table',1),('2014_10_12_100000_create_password_resets_table',1),('2015_11_06_085131_create_cache_table',1),('2015_11_06_090356_create_sessions_table',1),('2015_11_09_052513_add_openid_to_user',1),('2015_11_12_095541_add_avatar_to_user',2),('2015_12_04_083726_create_feedback_table',3),('2015_12_22_023642_delete_old_and_seed_new',4),('2015_12_21_042346_re_design_config',5);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  KEY `password_resets_email_index` (`email`),
  KEY `password_resets_token_index` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ports`
--

DROP TABLE IF EXISTS `ports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ports` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '端口id',
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '' COMMENT '端口名字',
  `label` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '端口标签',
  `type` int(11) NOT NULL COMMENT '端口类型，0=>digital、1=>data、2=>digital/data、3=>serialPort',
  `owner_id` int(11) NOT NULL COMMENT '拥有者id',
  `owner_type` int(11) NOT NULL COMMENT '拥有者类型，0=>component、1=>board',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ports`
--

LOCK TABLES `ports` WRITE;
/*!40000 ALTER TABLE `ports` DISABLE KEYS */;
INSERT INTO `ports` VALUES (1,'0','0',0,1,1),(2,'1','1',0,1,1),(3,'2','2',0,1,1),(4,'3','3',0,1,1),(5,'4','4',0,1,1),(6,'5','5',0,1,1),(7,'6','6',0,1,1),(8,'7','7',0,1,1),(9,'8','8',0,1,1),(10,'9','9',0,1,1),(11,'10','10',0,1,1),(12,'11','11',0,1,1),(13,'12','12',0,1,1),(14,'13','13',0,1,1),(15,'A0','A0',1,1,1),(16,'A1','A1',1,1,1),(17,'A2','A2',1,1,1),(18,'A3','A3',1,1,1),(19,'A4','A4',1,1,1),(20,'A5','A5',1,1,1),(21,'SerialPort','SerialPort',3,1,1),(22,'P0','P0',0,1,0),(23,'P0','P0',0,2,0),(24,'P0','SDA',1,3,0),(25,'P1','SCL',1,3,0),(26,'P0','P0',0,4,0),(27,'P0','TRI',0,5,0),(28,'P1','ECH',0,5,0),(29,'P0','P0',0,6,0),(30,'P0','P0',1,7,0),(31,'P0','P0',0,8,0),(32,'P0','P0',0,9,0),(33,'P1','P1',0,9,0),(34,'P0','KVG',0,10,0),(35,'P1','XVG',1,10,0),(36,'P2','YVG',1,10,0),(37,'P0','P0',1,11,0),(38,'P0','P0',1,12,0),(39,'P0','RXD',1,13,0),(40,'P1','TXD',1,13,0),(41,'P0','P0',3,14,0),(42,'P0','P0',0,15,0);
/*!40000 ALTER TABLE `ports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '项目id',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `create_at` int(11) NOT NULL COMMENT '创建时间',
  `update_at` int(11) NOT NULL COMMENT '最后修改时间',
  `data` blob NOT NULL COMMENT '项目数据',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `payload` text COLLATE utf8_unicode_ci NOT NULL,
  `last_activity` int(11) NOT NULL,
  UNIQUE KEY `sessions_id_unique` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('3de87e6661b96bce7a421134d2be3f6b6935a40c','YTo1OntzOjY6Il90b2tlbiI7czo0MDoiSVdnb2ZRTjFWNmNhZWloRlhlcUpXNDRCTVdmWWFIM3BIUjJlMXpQWCI7czozOiJrZXkiO3M6MTM6InFyc2NlbmVfNzkwMDciO3M6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjI3OiJodHRwOi8vbWVyY3VyeS5rZW5yb2JvdC5jb20iO31zOjU6ImZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6OToiX3NmMl9tZXRhIjthOjM6e3M6MToidSI7aToxNDU2MTk2MTcwO3M6MToiYyI7aToxNDU2MTk1NTk4O3M6MToibCI7czoxOiIwIjt9fQ==',1456196170),('d76d30c0f0f2ce0c9a8a78db902a44803b97a7c0','YTozOntzOjY6Il90b2tlbiI7czo0MDoibTVwSXptMUN5N2hKbWpMdnJVMUdEeG5ieWIzdGRYcnlYMDhZU2o2VyI7czo5OiJfc2YyX21ldGEiO2E6Mzp7czoxOiJ1IjtpOjE0NTYxOTU4MDE7czoxOiJjIjtpOjE0NTYxOTU4MDE7czoxOiJsIjtzOjE6IjAiO31zOjU6ImZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1456195801),('e14fd712b51f4e59a2ab41f167d0eddef9a70ec9','YTozOntzOjY6Il90b2tlbiI7czo0MDoiNHFub1I0VU5LOEY4cVhSdm9LSDVVWU9OWEpNWHVyck9oODhlTEszayI7czo5OiJfc2YyX21ldGEiO2E6Mzp7czoxOiJ1IjtpOjE0NTYxOTU3OTc7czoxOiJjIjtpOjE0NTYxOTU3OTc7czoxOiJsIjtzOjE6IjAiO31zOjU6ImZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1456195797),('e192de378b0a04532ddca0315b2353613d09e83d','YTo1OntzOjY6Il90b2tlbiI7czo0MDoiOHFpUkhzV1dNYnBhTU1od2RnVEN0YjROYzlKaW1pU1FLQ0QxRXZNRiI7czozOiJrZXkiO3M6MTM6InFyc2NlbmVfNzM3ODIiO3M6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjI3OiJodHRwOi8vbWVyY3VyeS5rZW5yb2JvdC5jb20iO31zOjU6ImZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6OToiX3NmMl9tZXRhIjthOjM6e3M6MToidSI7aToxNDU2MTk2MDg2O3M6MToiYyI7aToxNDU2MTk2MDgxO3M6MToibCI7czoxOiIwIjt9fQ==',1456196086);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `openid` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `uid` int(11) NOT NULL,
  `source` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `avatar_url` varchar(2000) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'5zJcLy6uNEXm9La3','5zJcLy6uNEXm9La3@qq.com','$2y$10$KQF2ssMJ8MdMd.hbRQheJeT7Ujj6lGQ49LZhElNsbkNkYDHGkRz6e','iD92qocouWtOhz95YAIYRmjg2DMOGU4qXth4AHjZVriMElLz2d7VqDd6C6rg','2015-11-12 00:27:00','2015-11-12 00:27:00','',91062,'sns',''),(2,'iK67tnFGP89ahDk4','iK67tnFGP89ahDk4@qq.com','$2y$10$3r2SE/r6xKMReZmtcjwiFu56/FDncXto1c9sh/GrJHbTZLWjXmMUa','Vb0bE2Dg3J4gw4xxGbaRS5vPCBSkFe1oa1aphsp5xl1mgGdrGVBMwMcuMmat','2015-11-12 00:30:09','2015-11-12 00:30:09','',79964,'sns',''),(3,'APUpHHkp08FL7VNh','APUpHHkp08FL7VNh@qq.com','$2y$10$eJjZACDDPidfp6auFXN5ged3iKVoRgXsNq/xLLSMtDC/BbHpiaLPK','mt1wd2ijoiBmfgFxyqKGvd7GVzBEfXx2Om1O1M202SG820hsYgpqGdse3pfj','2015-11-12 00:38:57','2015-11-13 00:40:17','',66929,'sns',''),(4,'87NCPGxxLjuHr4XY','87NCPGxxLjuHr4XY@qq.com','$2y$10$qApaH.3bViyVW2i1AoHiLen54KLBlaofo6gj6pbkqLcsThr/6sabO','Hy1znvUS6okNuxfvcL1ToNfOqSbwN8DTfscuJIucA3E76u8Bb3FGoeRqxlGS','2015-11-12 00:42:43','2015-11-12 00:42:43','',32275,'sns',''),(5,'UWfDFHUkdgQeGiqZ','UWfDFHUkdgQeGiqZ@qq.com','$2y$10$w8VfG0B18SE/AS.vYFgPyOuQ1XHJLewj.i8KTxEO5YAJWXJaw.DB6','RmOWPjvWJScDxTDjGZDV5Wkig0mCPIvLNoNAkrZ5exr8etWeDhUS3umxx2qZ','2015-11-12 00:42:59','2015-11-12 00:42:59','',46381,'sns',''),(6,'ihnbtNdh5gtdTUJp','ihnbtNdh5gtdTUJp@qq.com','$2y$10$btYLgTSNfC2owsXLwTwIdOXjECmRxkcR6m9p8PbREYagSL8KNtINm','nBiTW1xTbtSVta2IO6LkqkEIpH9krKOrbqGqEKEE8LzvEk9KWMHzznaqRC35','2015-11-12 00:48:08','2015-11-12 00:48:08','',23170,'sns',''),(7,'6SMcy1qcjh0WaoXD','6SMcy1qcjh0WaoXD@qq.com','$2y$10$kHHTcWKsTW0vrvcpSh2T6OgjCjkjgYEBMe2sqwrFwF9SFmCogI44G','lWGbIoijbggOZdpmaPWWAZTNQhhrbWeDRkcyobmt15R6nXhuovJikmWyxImy','2015-11-12 00:51:45','2015-11-12 00:51:45','',83298,'sns',''),(8,'xhWV7D7M0hoAVWtp','xhWV7D7M0hoAVWtp@qq.com','$2y$10$g8EXt5xmDjkgPrSAXqbFn.ZNWdEdl/hSGBYpsAyiY.7BjcRKn4PgK','yp8kNf9oQESwWIOP2BgchXB6AVxjcNSZH0DWuK3gJynii3l6y6I7etudXhSD','2015-11-12 00:51:48','2015-11-12 00:51:48','',72246,'sns',''),(9,'S8DY0H6OMQNOea3z','S8DY0H6OMQNOea3z@qq.com','$2y$10$OtTvFUa3arkRC6tBg60IJOYxps2fJsmR5QVZxbnBsp1/JiqokQ/D2','eGZZT2oaqn3e4szQRortLFbDDUIY0jNSdHon6INJc9gz5Rqmq13VGulpwSjz','2015-11-12 00:51:51','2015-11-12 00:51:51','',37565,'sns',''),(10,'udbKzdaHUGZqh0D1','udbKzdaHUGZqh0D1@qq.com','$2y$10$eLRAUPyqzFNYHhvZv89c9OahnPaiNWOE/xFG8FS3VSTrrGr0pJeCW','k5S8AUgLwUV3oyHrZasKLIpLdte8cyiZHYLHJ7XOG9ce9keJsFuuq3w4bXXf','2015-11-12 00:53:56','2015-11-12 00:53:56','',18993,'sns',''),(11,'y1pndcNu62rNw0S0','y1pndcNu62rNw0S0@qq.com','$2y$10$z1nLMapwyUqgk4uBUSkQXO9PPbP8Fz.kFFSEuHgONyjU5sASFfukG','DbZcccoPHjIJRSeIz9Ba00GMdlx36AFl7E7ZQ7JRojqcNtMGlwS5JvT9DMnK','2015-11-12 01:26:32','2015-11-12 01:26:32','',99516,'sns',''),(12,'nijDnIVD0XIz5saY','nijDnIVD0XIz5saY@qq.com','$2y$10$JWYVUYZTqsfF/e5LslJf8.BbNCDWDPrv./4M0eV43KJyg3VYjmEju','0BLkucunNHFuKpELjrMztSNi7ANAwEQxHAwlDnUDRbfFj7Lm5MrqezfteOjn','2015-11-12 01:26:34','2015-11-12 01:26:34','',7114,'sns',''),(13,'AWZaZBp4l6sn1OGL','AWZaZBp4l6sn1OGL@qq.com','$2y$10$aCb92iYh8Jy212MTOSbmyOPQeimGO6VnnQGkel7FkNOoWHDdlBjNC','DqTOsWC5co65Z8BawWb2KJobKjSRkpYfp9WSaDIz1tUOPJq7wu5JfeRpcPDN','2015-11-12 01:35:03','2015-11-12 01:35:03','',32447,'sns',''),(14,'OFekMcFYAq4XLcLd','OFekMcFYAq4XLcLd@qq.com','$2y$10$d9OkAAD6CrjjnR6eGaR4U.jA4KJ50wgCZCH4DfyqOQn5fxezGMfIC','ZeuFRc8XntURJis2EJS2Nk6ZurOLf2YqM97w8K2aqbIaQnXz6NqbQBFIxkI7','2015-11-12 01:35:04','2015-11-12 01:35:04','',52458,'sns',''),(15,'3hpOdyJOVYN7H12U','3hpOdyJOVYN7H12U@qq.com','$2y$10$l3J8VkXbE0IGVKluQASUXOikm2JljuJ3HnVSuvLI2LI2177Q7BxRS','wpSNbWtAcemLd0eKMMYkksvOEWF0QuSGu80KBkDnjmOecf3pJUZrtBWC4f5b','2015-11-12 01:35:05','2015-11-12 01:35:05','',12861,'sns',''),(16,'cFIDv58UbvOBzZDa','cFIDv58UbvOBzZDa@qq.com','$2y$10$rJAWt/OCe0k9J0m6Wx3Ea.577iDGYRKb/taxZNoj9OHk4bYj9/qyG','ohsmOarvtAE7vsTqd4GqO5oaVQFR1416Qeoep1wARhttp5q9xlYbb1KfRvUa','2015-11-12 01:35:05','2015-11-12 01:35:05','',93804,'sns',''),(17,'HmTwy8RaPURGmjLr','HmTwy8RaPURGmjLr@qq.com','$2y$10$0wFf6jw32.QsxmTuvrlcZ.IpreBgda3gEhe8qg6MNP8gcXwgLHfJq','LPZloH6G7LjjeadOhUkttBmgbRRgUlyQckGO4ydy7K6xbmyJVhWsoWrA2qRt','2015-11-12 01:35:06','2015-11-12 01:35:06','',79132,'sns',''),(18,'iruvmOI5LMZ4NIDw','iruvmOI5LMZ4NIDw@qq.com','$2y$10$IHjF6XFIe8w624ipSpvoJuj/fZKodhQHcn/cljgAy5sxy3Lhu8c/O','1ehW8OvztLimD38R42YcYyvHBsDc37xBAWimhFVN4I0jVgMYZP7ZznF4N5DL','2015-11-12 01:35:07','2015-11-12 01:35:07','',79756,'sns',''),(19,'JHbmhJGgTqvGAhkE','JHbmhJGgTqvGAhkE@qq.com','$2y$10$RQAag/UdreaOx8qaGkSjpuB45VwRaUJPzzMSP/PtQXAHCIrCzSo/O','I5IVrpLWi5bDDQmLcaiOUdLfc3HUhyMsfX1feXWfAnw415y0BIRQ3ROJLtSt','2015-11-12 01:35:07','2015-11-12 01:35:07','',66473,'sns',''),(20,'My8UQAJiujPoCYjk','My8UQAJiujPoCYjk@qq.com','$2y$10$obqh2HDkrduLtNeSKrdAD.3wL7PHeb0s61SS58glMabZGCmu3ejBC','boqjY5ngw86zPiaiKU4frjDMjIm9UnKM9bJtUmGI3fJFm60ovCknLYwe8V6A','2015-11-12 01:35:08','2015-11-12 01:35:08','',69136,'sns',''),(21,'NbLahojfIR9gGSUo','NbLahojfIR9gGSUo@qq.com','$2y$10$Trz0GR8BDqMIk2R5SCvJoOMJL7Mlpj4R09ZvD3GAJEzWIF4L0TjE2','ui2gwet4grkndSmLZyyfEKKQ2blXodGilKllGOUMZHS5NH1R3cnZVI3rX7FZ','2015-11-12 01:35:08','2015-11-12 01:50:45','',84046,'sns',''),(22,'风筝17号','odp4Is8l6e-OM5dAsdzaaCiHiTqs@kenrobot.com','$2y$10$eiMgSlk9giL8FAiuF8sbJu/duUiX6BY/Te9wLIeMk962s5GpK8T5y','gvBsGo8Q5wTh5A2hZXxqMdZdxTve3JE1vv4rgw3lCQyovfGQ4kbcsnkm5FIz','2015-11-15 16:34:26','2015-11-22 18:09:23','odp4Is8l6e-OM5dAsdzaaCiHiTqs',0,'weixin','http://wx.qlogo.cn/mmopen/wflY3UlOeibcVPBaS52n6iaOCYLRP6NBFwxDSSyTictvMxBiaZv0vicSlernPSyVWugZplUxiaY0TtyuzXokqA2xLia4tXVyh8KOgL9/0'),(23,'String','odp4Is0bN9rxqd3qzfU4YJb8mupw@kenrobot.com','$2y$10$BXbYDw9r.VFe0E/GflIOY.sRxJPrT5/U86kWoa6t61chuXP8/WUDS','Kv9l3397d6TytVEEJHsF8ZrabIWToAtzUVIdO8oArfx4j0g4fZo4SAo5mOPS','2015-11-15 23:54:29','2015-11-19 19:06:25','odp4Is0bN9rxqd3qzfU4YJb8mupw',0,'weixin','http://wx.qlogo.cn/mmopen/0iatuiaApQEr1lDWibibtv9acaJe4I8fcZcfxwFjasoWuT8Ulho87VneiatgMSYO1Y3AnWNiaHg3YfaBzAzuXBicM88icC9bALFVOqJq/0'),(24,'李志华','odp4Is1dn7CsgWbKlBChlUa5_MBg@kenrobot.com','$2y$10$qiG0igwkrjNnhleIa73VfOsD7N1JVb/RAHRWJjCMnvDZhWgV9XuM2','Qg5sYL9OJDI1qOYVSgycnlHOMpXlQcH3FbHziL3TfTnxrU6HeAivE5FTbO2u','2015-11-16 22:11:34','2015-11-16 22:11:42','odp4Is1dn7CsgWbKlBChlUa5_MBg',0,'weixin','http://wx.qlogo.cn/mmopen/bFKCOwjRWnUL7BmO4eYFia2eqgG6sPz0snbQwpqbr4rlISjq3fIJms1hWZeM5ia76q6RDYDQeIibKJ1ia1W11dwAfg/0'),(25,'kentest','kentest@kentest.com','$2y$10$RTbx9QaRt8aYl3XrhpM0S.8C6wRhltS2ijOUF2P1PyqFBJXCjA9Q.','yba4omhj1F5oty61M4rUabZcKT4ZQBCJYLTfoGS6YiAO5BqbZY7kVKQVynlb','2015-11-17 02:47:57','2015-11-17 02:49:45','',1038,'sns',''),(26,'李时念@kenrobot','odp4Is-oH-19xiSsPzAQfmVZ6Bks@kenrobot.com','$2y$10$kE4uIXEGiy1cLjQ7rc0LRO4TRcECt3n8wX.FsnFd1xeI0UxntFR4m','L8CDc7lng3ANUNt1YPsgf9bYxRi2yIZu1N9lEKCIEfiTnJ0iXB1tenp52a6u','2015-11-17 06:30:44','2015-11-19 04:07:12','odp4Is-oH-19xiSsPzAQfmVZ6Bks',0,'weixin','http://wx.qlogo.cn/mmopen/wflY3UlOeibcVPBaS52n6iaBt8jT6jtPp5p1PHat3nzTFZzdVMVo65uJLXkXsZkKgFOBPibsubnnnSgf25UBLeKckUehkHeYTqg/0');
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

-- Dump completed on 2016-02-23 11:11:34
