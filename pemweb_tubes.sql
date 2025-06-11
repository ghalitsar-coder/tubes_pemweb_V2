-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for tubes_pembweb
CREATE DATABASE IF NOT EXISTS `tubes_pembweb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `tubes_pembweb`;

-- Dumping structure for table tubes_pembweb.cache
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.cache: ~3 rows (approximately)
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
	('laravel_cache_4WiMLP2SqF1wTGZu', 's:7:"forever";', 2064194120),
	('laravel_cache_rb372AUai3BnbhjU', 's:7:"forever";', 2064214303),
	('laravel_cache_spatie.permission.cache', 'a:3:{s:5:"alias";a:4:{s:1:"a";s:2:"id";s:1:"b";s:4:"name";s:1:"c";s:10:"guard_name";s:1:"r";s:5:"roles";}s:11:"permissions";a:10:{i:0;a:4:{s:1:"a";i:1;s:1:"b";s:12:"manage users";s:1:"c";s:3:"web";s:1:"r";a:1:{i:0;i:1;}}i:1;a:4:{s:1:"a";i:2;s:1:"b";s:14:"create project";s:1:"c";s:3:"web";s:1:"r";a:2:{i:0;i:1;i:1;i:2;}}i:2;a:4:{s:1:"a";i:3;s:1:"b";s:14:"update project";s:1:"c";s:3:"web";s:1:"r";a:2:{i:0;i:1;i:1;i:2;}}i:3;a:4:{s:1:"a";i:4;s:1:"b";s:14:"delete project";s:1:"c";s:3:"web";s:1:"r";a:1:{i:0;i:1;}}i:4;a:4:{s:1:"a";i:5;s:1:"b";s:10:"view tasks";s:1:"c";s:3:"web";s:1:"r";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:5;a:4:{s:1:"a";i:6;s:1:"b";s:12:"assign tasks";s:1:"c";s:3:"web";s:1:"r";a:2:{i:0;i:1;i:1;i:2;}}i:6;a:4:{s:1:"a";i:7;s:1:"b";s:12:"update tasks";s:1:"c";s:3:"web";s:1:"r";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:7;a:4:{s:1:"a";i:8;s:1:"b";s:13:"comment tasks";s:1:"c";s:3:"web";s:1:"r";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:8;a:4:{s:1:"a";i:9;s:1:"b";s:14:"view dashboard";s:1:"c";s:3:"web";s:1:"r";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:9;a:4:{s:1:"a";i:10;s:1:"b";s:16:"comment projects";s:1:"c";s:3:"web";s:1:"r";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}}s:5:"roles";a:3:{i:0;a:3:{s:1:"a";i:1;s:1:"b";s:5:"Admin";s:1:"c";s:3:"web";}i:1;a:3:{s:1:"a";i:2;s:1:"b";s:15:"Project Manager";s:1:"c";s:3:"web";}i:2;a:3:{s:1:"a";i:3;s:1:"b";s:11:"Team Member";s:1:"c";s:3:"web";}}}', 1749618795);

-- Dumping structure for table tubes_pembweb.cache_locks
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.cache_locks: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.calendar_events
CREATE TABLE IF NOT EXISTS `calendar_events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `event_date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `event_type` enum('meeting','task_deadline','review','important_deadline','personal','reminder','milestone') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'meeting',
  `status` enum('scheduled','completed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'scheduled',
  `color_theme` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'blue',
  `is_all_day` tinyint(1) NOT NULL DEFAULT '0',
  `attendees` json DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `priority` enum('low','medium','high') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `is_recurring` tinyint(1) NOT NULL DEFAULT '0',
  `recurrence_settings` json DEFAULT NULL,
  `reminder_at` timestamp NULL DEFAULT NULL,
  `reminder_sent` tinyint(1) NOT NULL DEFAULT '0',
  `user_id` bigint unsigned NOT NULL,
  `project_id` bigint unsigned DEFAULT NULL,
  `task_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `calendar_events_user_id_foreign` (`user_id`),
  KEY `calendar_events_task_id_foreign` (`task_id`),
  KEY `calendar_events_event_date_user_id_index` (`event_date`,`user_id`),
  KEY `calendar_events_event_type_status_index` (`event_type`,`status`),
  KEY `calendar_events_project_id_event_date_index` (`project_id`,`event_date`),
  CONSTRAINT `calendar_events_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `calendar_events_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `calendar_events_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.calendar_events: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.comments
CREATE TABLE IF NOT EXISTS `comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `task_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `project_id` bigint unsigned DEFAULT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commentable_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commentable_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comments_task_id_foreign` (`task_id`),
  KEY `comments_user_id_foreign` (`user_id`),
  KEY `comments_project_id_foreign` (`project_id`),
  KEY `comments_commentable_type_commentable_id_index` (`commentable_type`,`commentable_id`),
  KEY `comments_parent_id_index` (`parent_id`),
  CONSTRAINT `comments_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.comments: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.failed_jobs
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.failed_jobs: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.jobs
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.jobs: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.job_batches
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.job_batches: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.migrations: ~20 rows (approximately)
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '0001_01_01_000000_create_users_table', 1),
	(2, '0001_01_01_000001_create_cache_table', 1),
	(3, '0001_01_01_000002_create_jobs_table', 1),
	(4, '2024_03_19_create_projects_table', 1),
	(5, '2024_03_23_000002_create_tasks_table', 1),
	(6, '2024_03_23_000003_create_comments_table', 1),
	(7, '2024_03_24_000001_add_columns_to_projects_table', 1),
	(8, '2024_03_24_000001_create_task_attachments_table', 1),
	(9, '2024_03_24_000002_create_task_attachment_comments_table', 1),
	(10, '2025_01_25_000001_create_calendar_events_table', 1),
	(11, '2025_05_23_012602_create_permission_tables', 1),
	(12, '2025_05_23_022546_add_role_to_users_table', 1),
	(13, '2025_05_24_070442_add_priority_to_tasks_table', 1),
	(14, '2025_05_24_144514_add_new_fields_to_tasks_table', 1),
	(15, '2025_05_25_044746_add_public_id_to_task_attachments_table', 1),
	(16, '2025_05_25_093853_add_on_hold_status_to_tasks_table', 1),
	(17, '2025_05_26_033227_add_task_type_to_tasks_table', 1),
	(18, '2024_12_18_000001_create_project_comments_table', 2),
	(19, '2025_06_02_052737_add_image_and_reply_to_comments_table', 2),
	(20, '2025_06_02_071951_create_task_comments_table', 3);

-- Dumping structure for table tubes_pembweb.model_has_permissions
CREATE TABLE IF NOT EXISTS `model_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.model_has_permissions: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.model_has_roles
CREATE TABLE IF NOT EXISTS `model_has_roles` (
  `role_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.model_has_roles: ~5 rows (approximately)
INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
	(1, 'App\\Models\\User', 1),
	(2, 'App\\Models\\User', 2),
	(3, 'App\\Models\\User', 3),
	(3, 'App\\Models\\User', 4),
	(3, 'App\\Models\\User', 5);

-- Dumping structure for table tubes_pembweb.password_reset_tokens
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.password_reset_tokens: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.permissions
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.permissions: ~10 rows (approximately)
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
	(1, 'manage users', 'web', '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(2, 'create project', 'web', '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(3, 'update project', 'web', '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(4, 'delete project', 'web', '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(5, 'view tasks', 'web', '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(6, 'assign tasks', 'web', '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(7, 'update tasks', 'web', '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(8, 'comment tasks', 'web', '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(9, 'view dashboard', 'web', '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(10, 'comment projects', 'web', '2025-06-01 22:41:58', '2025-06-01 22:41:58');

-- Dumping structure for table tubes_pembweb.projects
CREATE TABLE IF NOT EXISTS `projects` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `progress` int NOT NULL DEFAULT '0',
  `status` enum('not_started','in_progress','on_hold','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'not_started',
  `budget` decimal(15,2) DEFAULT NULL,
  `spent_budget` decimal(15,2) NOT NULL DEFAULT '0.00',
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `is_template` tinyint(1) NOT NULL DEFAULT '0',
  `attachments` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `projects_user_id_foreign` (`user_id`),
  CONSTRAINT `projects_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.projects: ~11 rows (approximately)
INSERT INTO `projects` (`id`, `name`, `description`, `user_id`, `start_date`, `end_date`, `progress`, `status`, `budget`, `spent_budget`, `category`, `tags`, `is_template`, `attachments`, `created_at`, `updated_at`) VALUES
	(1, 'E-Commerce Platform Development', 'Build a comprehensive e-commerce platform with modern features including user authentication, product catalog, shopping cart, payment integration, and admin dashboard.', 1, '2025-04-11', '2025-08-24', 45, 'in_progress', 150000.00, 67500.00, 'Web Development', '"[\\"e-commerce\\",\\"laravel\\",\\"react\\",\\"payment-gateway\\"]"', 0, NULL, '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(2, 'Mobile App for Task Management', 'Develop a cross-platform mobile application for task and project management with real-time collaboration features.', 1, '2025-04-26', '2025-09-23', 25, 'in_progress', 85000.00, 21250.00, 'Mobile Development', '"[\\"mobile\\",\\"react-native\\",\\"collaboration\\",\\"real-time\\"]"', 0, NULL, '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(3, 'Company Website Redesign', 'Complete redesign and development of the corporate website with modern UI/UX, responsive design, and CMS integration.', 1, '2025-05-06', '2025-07-25', 70, 'in_progress', 45000.00, 31500.00, 'Web Design', '"[\\"website\\",\\"redesign\\",\\"cms\\",\\"responsive\\"]"', 0, NULL, '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(4, 'Data Analytics Dashboard', 'Create an advanced analytics dashboard for business intelligence with real-time data visualization and reporting capabilities.', 1, '2025-05-16', '2025-08-09', 15, 'in_progress', 95000.00, 14250.00, 'Data Analytics', '"[\\"analytics\\",\\"dashboard\\",\\"business-intelligence\\",\\"data-visualization\\"]"', 0, NULL, '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(5, 'API Integration Platform', 'Develop a robust API integration platform to connect various third-party services and internal systems.', 1, '2025-05-31', '2025-09-08', 0, 'not_started', 120000.00, 0.00, 'API Development', '"[\\"api\\",\\"integration\\",\\"microservices\\",\\"third-party\\"]"', 0, NULL, '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(6, 'DevOps Infrastructure Setup', 'Implement comprehensive DevOps infrastructure including CI/CD pipelines, containerization, and monitoring systems.', 1, '2025-06-10', '2025-08-14', 0, 'not_started', 75000.00, 0.00, 'DevOps', '"[\\"devops\\",\\"ci-cd\\",\\"docker\\",\\"monitoring\\"]"', 0, NULL, '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(7, 'Security Audit and Compliance', 'Comprehensive security audit of existing systems and implementation of compliance measures for data protection.', 1, '2025-03-27', '2025-05-21', 100, 'completed', 65000.00, 63000.00, 'Security', '"[\\"security\\",\\"audit\\",\\"compliance\\",\\"data-protection\\"]"', 0, NULL, '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(8, 'Project Management System Template', 'Create a reusable project management system template that can be customized for different client needs.', 1, '2025-06-25', '2025-10-23', 0, 'not_started', 55000.00, 0.00, 'Template Development', '"[\\"template\\",\\"project-management\\",\\"reusable\\",\\"customizable\\"]"', 1, NULL, '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(9, 'SAIBA SEKURITI', 'At distinctio Unde', 1, '2025-06-12', '2025-07-06', 0, 'in_progress', 3712333.00, 0.00, 'Qui reprehenderit do', '["Enim beatae consecte", "SOMETHING", "LIKE", "I", "DONE", "UNDERSTAND"]', 0, NULL, '2025-06-01 21:11:35', '2025-06-01 21:11:35'),
	(10, 'Unity KirklandXXXXX', 'Repudiandae et ad vo', 2, '2025-06-26', '2025-07-20', 0, 'in_progress', 9231223.00, 0.00, 'Non cum soluta labor', '["Rem officia qui volu"]', 0, NULL, '2025-06-01 21:17:25', '2025-06-01 21:17:25'),
	(11, 'Upton Barton', 'Adipisicing voluptat', 2, '2025-06-20', '2025-07-13', 0, 'not_started', 53.00, 0.00, 'Consequatur sunt ac', '["Documentation"]', 0, NULL, '2025-06-01 21:43:37', '2025-06-01 21:43:37');

-- Dumping structure for table tubes_pembweb.project_comments
CREATE TABLE IF NOT EXISTS `project_comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_comments_user_id_foreign` (`user_id`),
  KEY `project_comments_project_id_created_at_index` (`project_id`,`created_at`),
  KEY `project_comments_parent_id_index` (`parent_id`),
  CONSTRAINT `project_comments_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `project_comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_comments_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.project_comments: ~17 rows (approximately)
INSERT INTO `project_comments` (`id`, `content`, `project_id`, `user_id`, `parent_id`, `image_path`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'coba comments', 11, 1, NULL, NULL, '2025-06-02 00:35:28', '2025-06-02 00:35:28', NULL),
	(2, 'bisa comment nya broo', 11, 1, 1, NULL, '2025-06-02 00:35:48', '2025-06-02 00:35:48', NULL),
	(3, 'yang bener', 11, 1, 1, NULL, '2025-06-02 00:36:01', '2025-06-02 00:36:01', NULL),
	(4, 'ini comment ke 2', 11, 1, NULL, NULL, '2025-06-02 00:41:58', '2025-06-02 00:41:58', NULL),
	(5, 'hello', 9, 1, NULL, NULL, '2025-06-02 00:53:01', '2025-06-02 00:53:01', NULL),
	(6, 'hello world', 9, 1, 5, NULL, '2025-06-02 00:53:30', '2025-06-02 00:53:30', NULL),
	(7, 'project comment', 9, 1, 5, NULL, '2025-06-02 00:53:59', '2025-06-02 00:53:59', NULL),
	(8, 'magic', 9, 1, NULL, NULL, '2025-06-02 00:54:06', '2025-06-02 00:54:06', NULL),
	(9, 'apakah benar itu magic', 9, 1, 8, NULL, '2025-06-02 00:58:04', '2025-06-02 00:58:04', NULL),
	(10, 'apakah itu', 9, 1, 8, NULL, '2025-06-02 00:58:19', '2025-06-02 00:58:19', NULL),
	(11, 'aaaaaa', 9, 1, NULL, 'https://res.cloudinary.com/dtpflpunp/image/upload/v1748852320/project_comments/ozwnvhy8cpxadhc2lzca.jpg', '2025-06-02 01:18:41', '2025-06-02 01:18:41', NULL),
	(12, 'nnn', 9, 1, 11, NULL, '2025-06-02 01:19:25', '2025-06-02 01:19:25', NULL),
	(13, 'ca', 9, 1, 11, 'https://res.cloudinary.com/dtpflpunp/image/upload/v1748852383/project_comments/amdgbdg0txuaxpqr3ha5.jpg', '2025-06-02 01:19:44', '2025-06-02 01:19:44', NULL),
	(14, 'koin bro', 9, 1, NULL, 'https://res.cloudinary.com/dtpflpunp/image/upload/v1748852401/project_comments/w2fprecvbijaimczbzos.jpg', '2025-06-02 01:20:02', '2025-06-02 01:20:02', NULL),
	(15, 'coba next comment', 9, 1, NULL, NULL, '2025-06-02 01:20:20', '2025-06-02 01:20:20', NULL),
	(16, 'macan tutul', 9, 1, NULL, NULL, '2025-06-02 01:34:47', '2025-06-02 01:34:47', NULL),
	(17, 'serius macan tutul', 9, 1, 16, NULL, '2025-06-02 01:35:02', '2025-06-02 01:35:02', NULL);

-- Dumping structure for table tubes_pembweb.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.roles: ~3 rows (approximately)
INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
	(1, 'Admin', 'web', '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(2, 'Project Manager', 'web', '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(3, 'Team Member', 'web', '2025-05-25 22:23:24', '2025-05-25 22:23:24');

-- Dumping structure for table tubes_pembweb.role_has_permissions
CREATE TABLE IF NOT EXISTS `role_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.role_has_permissions: ~23 rows (approximately)
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
	(1, 1),
	(2, 1),
	(3, 1),
	(4, 1),
	(5, 1),
	(6, 1),
	(7, 1),
	(8, 1),
	(9, 1),
	(10, 1),
	(2, 2),
	(3, 2),
	(5, 2),
	(6, 2),
	(7, 2),
	(8, 2),
	(9, 2),
	(10, 2),
	(5, 3),
	(7, 3),
	(8, 3),
	(9, 3),
	(10, 3);

-- Dumping structure for table tubes_pembweb.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.sessions: ~1 rows (approximately)
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
	('p6M6q3HhhLpxKTVf5jEQrW6pAc6u2bdka6HXCJAO', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiMHFSM1k0TmlZTjB0T01nM1FXdGoyYmVIY2pJWThwbzFxWUFwUjVzRiI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czozMDoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL3Byb2plY3RzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1749532646);

-- Dumping structure for table tubes_pembweb.tasks
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `task_type` enum('feature','bug','improvement') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `project_id` bigint unsigned NOT NULL,
  `assigned_to` bigint unsigned DEFAULT NULL,
  `status` enum('todo','in_progress','on_hold','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `due_date` date NOT NULL,
  `tags` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `time_estimate` decimal(8,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `priority` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  PRIMARY KEY (`id`),
  KEY `tasks_project_id_foreign` (`project_id`),
  KEY `tasks_assigned_to_foreign` (`assigned_to`),
  CONSTRAINT `tasks_assigned_to_foreign` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tasks_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.tasks: ~36 rows (approximately)
INSERT INTO `tasks` (`id`, `title`, `description`, `task_type`, `project_id`, `assigned_to`, `status`, `due_date`, `tags`, `time_estimate`, `start_date`, `created_at`, `updated_at`, `priority`) VALUES
	(1, 'Setup Development Environment', 'Configure development environment, version control, and project structure for the e-commerce platform.', 'feature', 1, 1, 'completed', '2025-04-16', 'setup,environment,laravel,react', 16.00, '2025-04-11', '2025-05-25 22:23:24', '2025-06-02 00:42:59', 'high'),
	(2, 'Design Database Schema', 'Create comprehensive database schema for products, users, orders, and related entities.', 'feature', 1, 2, 'completed', '2025-04-21', 'database,schema,mysql', 24.00, '2025-04-16', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(3, 'Implement User Authentication', 'Develop user registration, login, password reset, and profile management features.', 'feature', 1, 1, 'in_progress', '2025-05-31', 'authentication,security,backend', 32.00, '2025-05-16', '2025-05-25 22:23:24', '2025-06-02 00:42:54', 'high'),
	(4, 'Build Product Catalog', 'Create product listing, categories, search, and filtering functionality.', 'feature', 1, 1, 'todo', '2025-06-15', 'products,catalog,search', 40.00, '2025-05-31', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'medium'),
	(5, 'Fix Shopping Cart Bug', 'Fix issue where items are not properly removed from cart when quantity is set to zero.', 'bug', 1, 2, 'todo', '2025-06-02', 'cart,bug,frontend', 8.00, '2025-05-28', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(6, 'Payment Gateway Integration', 'Integrate secure payment processing with multiple payment methods.', 'feature', 1, 2, 'todo', '2025-07-15', 'payment,stripe,security', 36.00, '2025-07-05', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(7, 'UI/UX Design and Prototyping', 'Create wireframes, mockups, and interactive prototypes for the mobile app.', 'feature', 2, 1, 'completed', '2025-05-01', 'design,ui,ux,prototyping', 32.00, '2025-04-26', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(8, 'Setup React Native Project', 'Initialize React Native project with necessary dependencies and configuration.', 'feature', 2, 2, 'completed', '2025-05-06', 'setup,react-native,mobile', 12.00, '2025-05-01', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(9, 'Implement Core Navigation', 'Develop main navigation structure and screen transitions.', 'feature', 2, 1, 'in_progress', '2025-06-05', 'navigation,mobile,react-native', 20.00, '2025-05-21', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'medium'),
	(10, 'Fix Navigation Performance Issue', 'Optimize navigation performance and fix lag when switching between screens.', 'bug', 2, 2, 'todo', '2025-05-31', 'performance,navigation,bug', 6.00, '2025-05-27', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'medium'),
	(11, 'Improve Task Creation UX', 'Enhance user experience for creating tasks with better form validation and feedback.', 'improvement', 2, 1, 'todo', '2025-06-25', 'ux,improvement,forms', 16.00, '2025-06-15', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'low'),
	(12, 'Content Audit and Analysis', 'Review existing website content and analyze user requirements.', 'feature', 3, 1, 'completed', '2025-05-11', 'content,analysis,research', 16.00, '2025-05-06', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'medium'),
	(13, 'New Design System Creation', 'Develop modern design system with components, colors, and typography.', 'feature', 3, 2, 'in_progress', '2025-06-10', 'design-system,components,branding', 28.00, '2025-05-16', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(14, 'Fix Responsive Layout Issues', 'Fix mobile responsive layout issues on the homepage and contact page.', 'bug', 3, 1, 'todo', '2025-05-29', 'responsive,mobile,css', 4.00, '2025-05-27', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(15, 'Optimize Page Load Speed', 'Improve website performance by optimizing images, CSS, and JavaScript loading.', 'improvement', 3, 2, 'todo', '2025-06-20', 'performance,optimization,speed', 12.00, '2025-06-10', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'medium'),
	(16, 'Requirements Gathering', 'Meet with stakeholders to define analytics requirements and KPIs.', 'feature', 4, 2, 'completed', '2025-05-21', 'requirements,stakeholders,planning', 20.00, '2025-05-16', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(17, 'Data Source Integration', 'Connect to various data sources and establish data pipelines.', 'feature', 4, 1, 'on_hold', '2025-06-15', 'data,integration,pipelines', 40.00, '2025-05-23', '2025-05-25 22:23:24', '2025-06-09 22:14:30', 'high'),
	(18, 'Fix Data Sync Issue', 'Resolve issue where data is not syncing properly from external APIs.', 'bug', 4, 2, 'todo', '2025-05-28', 'data,sync,api,bug', 8.00, '2025-05-26', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(19, 'Enhance Chart Interactivity', 'Add more interactive features to charts like zoom, filter, and drill-down capabilities.', 'improvement', 4, 1, 'todo', '2025-06-30', 'charts,interactivity,enhancement', 24.00, '2025-06-20', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'medium'),
	(20, 'Project Planning and Setup', 'Initial project planning, requirement analysis, and setup.', 'feature', 5, 2, 'completed', '2025-05-16', 'planning,setup,requirements', 16.00, '2025-05-11', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(21, 'Development Phase 1', 'First phase of development work.', 'feature', 5, 1, 'in_progress', '2025-06-15', 'development,phase1', 40.00, '2025-05-21', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(22, 'Fix Critical Bug', 'Resolve critical bug affecting core functionality.', 'bug', 5, 2, 'todo', '2025-05-29', 'bug,critical,hotfix', 8.00, '2025-05-27', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(23, 'Performance Optimization', 'Improve system performance and user experience.', 'improvement', 5, 1, 'todo', '2025-06-25', 'performance,optimization', 16.00, '2025-06-15', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'medium'),
	(24, 'Project Planning and Setup', 'Initial project planning, requirement analysis, and setup.', 'feature', 6, 2, 'completed', '2025-05-16', 'planning,setup,requirements', 16.00, '2025-05-11', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(25, 'Development Phase 1', 'First phase of development work.', 'feature', 6, 1, 'in_progress', '2025-06-15', 'development,phase1', 40.00, '2025-05-21', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(26, 'Fix Critical Bug', 'Resolve critical bug affecting core functionality.', 'bug', 6, 2, 'todo', '2025-05-29', 'bug,critical,hotfix', 8.00, '2025-05-27', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(27, 'Performance Optimization', 'Improve system performance and user experience.', 'improvement', 6, 1, 'todo', '2025-06-25', 'performance,optimization', 16.00, '2025-06-15', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'medium'),
	(28, 'Project Planning and Setup', 'Initial project planning, requirement analysis, and setup.', 'feature', 7, 2, 'completed', '2025-05-16', 'planning,setup,requirements', 16.00, '2025-05-11', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(29, 'Development Phase 1', 'First phase of development work.', 'feature', 7, 1, 'in_progress', '2025-06-15', 'development,phase1', 40.00, '2025-05-21', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(30, 'Fix Critical Bug', 'Resolve critical bug affecting core functionality.', 'bug', 7, 2, 'todo', '2025-05-29', 'bug,critical,hotfix', 8.00, '2025-05-27', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(31, 'Performance Optimization', 'Improve system performance and user experience.', 'improvement', 7, 1, 'todo', '2025-06-25', 'performance,optimization', 16.00, '2025-06-15', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'medium'),
	(32, 'Project Planning and Setup', 'Initial project planning, requirement analysis, and setup.', 'feature', 8, 2, 'completed', '2025-05-16', 'planning,setup,requirements', 16.00, '2025-05-11', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(33, 'Development Phase 1', 'First phase of development work.', 'feature', 8, 1, 'in_progress', '2025-06-15', 'development,phase1', 40.00, '2025-05-21', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(34, 'Fix Critical Bug', 'Resolve critical bug affecting core functionality.', 'bug', 8, 2, 'todo', '2025-05-29', 'bug,critical,hotfix', 8.00, '2025-05-27', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'high'),
	(35, 'Performance Optimization', 'Improve system performance and user experience.', 'improvement', 8, 1, 'todo', '2025-06-25', 'performance,optimization', 16.00, '2025-06-15', '2025-05-25 22:23:24', '2025-05-25 22:23:24', 'medium'),
	(36, 'Fugiat sed proident', 'Et animi tempore e', 'feature', 9, 5, 'in_progress', '2025-07-20', 'Backend', 41.00, '2025-06-28', '2025-06-02 01:35:51', '2025-06-02 01:35:51', 'medium');

-- Dumping structure for table tubes_pembweb.task_attachments
CREATE TABLE IF NOT EXISTS `task_attachments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `task_id` bigint unsigned NOT NULL,
  `filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `public_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `task_attachments_task_id_foreign` (`task_id`),
  CONSTRAINT `task_attachments_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.task_attachments: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.task_attachment_comments
CREATE TABLE IF NOT EXISTS `task_attachment_comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `task_attachment_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `task_attachment_comments_task_attachment_id_foreign` (`task_attachment_id`),
  KEY `task_attachment_comments_user_id_foreign` (`user_id`),
  CONSTRAINT `task_attachment_comments_task_attachment_id_foreign` FOREIGN KEY (`task_attachment_id`) REFERENCES `task_attachments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_attachment_comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.task_attachment_comments: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.task_comments
CREATE TABLE IF NOT EXISTS `task_comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `task_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `task_comments_task_id_foreign` (`task_id`),
  KEY `task_comments_user_id_foreign` (`user_id`),
  KEY `task_comments_parent_id_foreign` (`parent_id`),
  CONSTRAINT `task_comments_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `task_comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_comments_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.task_comments: ~6 rows (approximately)
INSERT INTO `task_comments` (`id`, `content`, `task_id`, `user_id`, `parent_id`, `image_path`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'hello', 36, 1, NULL, NULL, '2025-06-02 01:39:45', '2025-06-02 01:39:45', NULL),
	(2, 'yakiin', 36, 1, 1, NULL, '2025-06-02 01:39:53', '2025-06-02 01:51:43', '2025-06-02 01:51:43'),
	(3, 'haluuu', 36, 1, 1, NULL, '2025-06-02 01:51:55', '2025-06-02 01:51:55', NULL),
	(4, 'helo juga', 36, 1, NULL, NULL, '2025-06-02 01:56:56', '2025-06-02 01:56:56', NULL),
	(5, 'capruk', 36, 1, 4, 'https://res.cloudinary.com/dtpflpunp/image/upload/v1748854629/task_comments/si5skjg7tnabugmehhms.jpg', '2025-06-02 01:57:11', '2025-06-02 01:57:11', NULL),
	(6, 'moneeey', 36, 1, NULL, 'https://res.cloudinary.com/dtpflpunp/image/upload/v1748854851/task_comments/uxr9pvhh2fihfiyhiuts.jpg', '2025-06-02 02:00:52', '2025-06-02 02:00:52', NULL);

-- Dumping structure for table tubes_pembweb.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'team_member',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.users: ~5 rows (approximately)
INSERT INTO `users` (`id`, `name`, `email`, `role`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
	(1, 'Admin User', 'admin@example.com', 'Admin', NULL, '$2y$12$E6oQTeEEQBWQ0TcE8rUHUegYgEcWMp4MJiY1vttbw4uq2x4rj0XH2', 'mdCpwntXLz9eomiQCIG12vZ4YoqvMoPx0uChoDUF7I7Vv5cDigEVJ6IwaU42', '2025-05-25 22:23:23', '2025-05-25 22:23:23'),
	(2, 'Project Manager', 'pm@example.com', 'Project Manager', NULL, '$2y$12$pBIbzxSySQFeGkbzS3kdSufktNANV22w7/i2tZS5qg7Ynlb9BjwBa', NULL, '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(3, 'Team Member', 'member@example.com', 'Team Member', NULL, '$2y$12$Lenq4xVZarOy7UJBo2jYA.zSpZfKnz0pv95DgQCzK0MHn5x4h4CJq', NULL, '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(4, 'Another Team Member', 'member2@example.com', 'Team Member', NULL, '$2y$12$lqu2UiXZFIA5f22IGApYS.rRmpVe6SPaASMirwMO34JZ8h55O/fjW', NULL, '2025-05-25 22:23:24', '2025-05-25 22:23:24'),
	(5, 'Test User', 'test@example.com', 'Team Member', NULL, '$2y$12$O1.wh1vNer2oUi9gqLuMcuECipWmImujY.opLNdkoP5U2uAxfvXQu', NULL, '2025-05-25 22:23:24', '2025-05-25 22:23:24');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
