CREATE TABLE IF NOT EXISTS `machines` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` enum('CNC','Additive Manufacturing','Casting') DEFAULT NULL,
  `isdeleted` boolean DEFAULT FALSE ,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp ,
  `updated_at` timestamp ,

  PRIMARY KEY (`id`)
)