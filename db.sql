DROP SCHEMA IF EXISTS `sitio_institucional_eestn1`;

CREATE SCHEMA `sitio_institucional_eestn1` ;

DROP TABLE IF EXISTS `admin`;

CREATE TABLE `admin` (
  `id_admin` int unsigned NOT NULL AUTO_INCREMENT,
  `usuario` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contraseña` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigo_verif` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disabled` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_admin`),
  UNIQUE KEY `uk_admin_usuario` (`usuario`),
  KEY `idx_admin_codigo` (`codigo_verif`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `admin` WRITE;

INSERT INTO `admin` VALUES (1,'admin@tucolegio.com','$2b$10$Kk2vILftbYXUcbEe2Z/iLehQvr6chf4yHfjmapzOnOcw7qJ9yN.cu','Admin',NULL,0,'2025-09-15 19:03:52');
UNLOCK TABLES;

DROP TABLE IF EXISTS `alumnos`;

CREATE TABLE `alumnos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `url_pdf1` varchar(255) DEFAULT NULL,
  `url_pdf2` varchar(255) DEFAULT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `mail` varchar(150) DEFAULT NULL,
  `respuestas_formulario` json DEFAULT NULL,
  `modalidad_elegida` varchar(50) DEFAULT NULL,
  `formulario_modalidad_enviado` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `anio` tinyint(1) DEFAULT '1',
  `ip_envio` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dni` (`dni`),
  CONSTRAINT `alumnos_chk_1` CHECK ((`modalidad_elegida` in (_utf8mb4'Programación',_utf8mb4'Electromecánica')))
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `alumnos` WRITE;
INSERT INTO `alumnos` VALUES (1,'Alexia','Corro','47564071','2007-06-15','https://drive.google.com/open?id=1-jKTGjleQtTj2kcQZ_U51dUWRRHBiqmFfWPoyqV1Xjc','https://drive.google.com/open?id=1H1Sc9nqlas95fshLton_ObEX8PPCLVy75hQGjj_IsTI','2025-10-02 12:39:02',NULL,NULL,NULL,0,'2025-10-02 12:39:02','2025-10-02 12:39:02',3,NULL),(25,'Juana','Degreef','47564072','2008-01-29','https://drive.google.com/open?id=1NJF70z4TQUMlshpa3HlkrwW4GeSMA5LIuihVhOX952Y','https://drive.google.com/open?id=15SVJDAUBLyhjFxLyxz7lHsZqvXa7-8zy1-rEERN--lk','2025-10-09 12:22:08','ludmilameira026@gmail.com',NULL,NULL,0,'2025-10-09 12:22:08','2025-10-09 12:22:08',1,'34.116.21.4');
UNLOCK TABLES;

DROP TABLE IF EXISTS `noticias`;

CREATE TABLE `noticias` (
  `id_noticias` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(45) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `imagen1` varchar(255) DEFAULT NULL,
  `imagen2` varchar(255) DEFAULT NULL,
  `imagen3` varchar(255) DEFAULT NULL,
`imagen4` varchar(255) DEFAULT NULL,
  `subtitulo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_noticias`,`titulo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


LOCK TABLES `noticias` WRITE;
INSERT INTO `noticias` VALUES (1,'PRUEBA','ESTA ES UNA PRUEBA','2021-01-07','1','1','1',NULL),(2,'Feria de Ciencias','Se abre la inscripción a las muestras.','2025-09-18',NULL,NULL,NULL,NULL),(3,'Acto 9 de Julio','Nos sentamos en el patio de ka escueal','2009-12-12','/uploads/1758221020453-descarga_(3).jpg','/uploads/1758221020457-⋆_˚｡⋆୨୧˚_Aqui_les_dejó_para_que_pinten_y_pegen_en_su_cuarto_y_su_propia_creatividad_˚୨୧⋆｡_˚⋆.jpg','/uploads/1758221020460-descarga_(1).jpg',NULL);

UNLOCK TABLES;

DROP TABLE IF EXISTS `pre_inscripcion`;

CREATE TABLE `pre_inscripcion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `url_pdf1` varchar(255) DEFAULT NULL,
  `url_pdf2` varchar(255) DEFAULT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `mail` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_envio` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dni` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


LOCK TABLES `pre_inscripcion` WRITE;

INSERT INTO `pre_inscripcion` VALUES (26,'Juan','P�rez','12345678','2000-01-01',NULL,NULL,'2025-10-09 14:25:37','juan@test.com','2025-10-09 14:25:37','::1'),(28,'Juana','Degreef','47564071','2007-10-03','https://drive.google.com/open?id=1SAfMMxolez6mdQOsMxOlLsnfnohhFVtjcPcVoW46_Zo','https://drive.google.com/open?id=1WDViqJGLf6ypU__JyQDYBQD871r-uGkX','2025-10-09 14:28:24','ludmilameira026@gmail.com','2025-10-09 14:28:24','34.98.140.66'),(30,'TATIANA','RIVA','44649577','2006-09-12','https://drive.google.com/open?id=1L6eYhHEa8NmFO292I-qXXg3H1N90UYAQJJcKdTiBeBs','https://drive.google.com/open?id=1sVE7WTRBlCWxcXKfbdWfyvgi5NP4Ht8uxHegQAtmhKI','2025-10-09 18:35:04','ludmilameira026@gmail.com','2025-10-09 18:35:04','35.243.21.43');

UNLOCK TABLES;
