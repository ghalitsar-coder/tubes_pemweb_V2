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
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.cache: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.cache_locks
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.cache_locks: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.comments
CREATE TABLE IF NOT EXISTS `comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `task_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comments_task_id_foreign` (`task_id`),
  KEY `comments_user_id_foreign` (`user_id`),
  CONSTRAINT `comments_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.comments: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.failed_jobs
CREATE TABLE IF NOT EXISTS `failed_jobs` (
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

-- Dumping data for table tubes_pembweb.failed_jobs: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.jobs
CREATE TABLE IF NOT EXISTS `jobs` (
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

-- Dumping data for table tubes_pembweb.jobs: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.job_batches
CREATE TABLE IF NOT EXISTS `job_batches` (
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

-- Dumping data for table tubes_pembweb.job_batches: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.migrations: ~0 rows (approximately)
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '0001_01_01_000000_create_users_table', 1),
	(2, '0001_01_01_000001_create_cache_table', 1),
	(3, '0001_01_01_000002_create_jobs_table', 1),
	(4, '2024_03_19_create_projects_table', 1),
	(5, '2024_03_23_000002_create_tasks_table', 1),
	(6, '2024_03_23_000003_create_comments_table', 1),
	(7, '2025_05_23_012602_create_permission_tables', 1),
	(8, '2025_05_23_022546_add_role_to_users_table', 1),
	(9, '2024_03_24_000001_add_columns_to_projects_table', 2),
	(10, '2024_03_24_000001_create_task_attachments_table', 3),
	(11, '2024_03_24_000002_create_task_attachment_comments_table', 3),
	(12, '2024_03_24_000001_create_project_attachments_table', 4);

-- Dumping structure for table tubes_pembweb.model_has_permissions
CREATE TABLE IF NOT EXISTS `model_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.model_has_permissions: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.model_has_roles
CREATE TABLE IF NOT EXISTS `model_has_roles` (
  `role_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.model_has_roles: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.password_reset_tokens
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.password_reset_tokens: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.permissions
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.permissions: ~8 rows (approximately)
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
	(1, 'manage users', 'web', '2025-05-23 06:06:20', '2025-05-23 06:06:20'),
	(2, 'create project', 'web', '2025-05-23 06:06:20', '2025-05-23 06:06:20'),
	(3, 'update project', 'web', '2025-05-23 06:06:20', '2025-05-23 06:06:20'),
	(4, 'delete project', 'web', '2025-05-23 06:06:20', '2025-05-23 06:06:20'),
	(5, 'assign tasks', 'web', '2025-05-23 06:06:20', '2025-05-23 06:06:20'),
	(6, 'update tasks', 'web', '2025-05-23 06:06:20', '2025-05-23 06:06:20'),
	(7, 'comment tasks', 'web', '2025-05-23 06:06:20', '2025-05-23 06:06:20'),
	(8, 'view dashboard', 'web', '2025-05-23 06:06:20', '2025-05-23 06:06:20');

-- Dumping structure for table tubes_pembweb.projects
CREATE TABLE IF NOT EXISTS `projects` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `progress` int NOT NULL DEFAULT '0',
  `status` enum('not_started','in_progress','on_hold','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'not_started',
  `budget` decimal(15,2) DEFAULT NULL,
  `spent_budget` decimal(15,2) NOT NULL DEFAULT '0.00',
  `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `is_template` tinyint(1) NOT NULL DEFAULT '0',
  `attachments` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `projects_user_id_foreign` (`user_id`),
  CONSTRAINT `projects_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.projects: ~0 rows (approximately)
INSERT INTO `projects` (`id`, `name`, `description`, `user_id`, `start_date`, `end_date`, `progress`, `status`, `budget`, `spent_budget`, `category`, `tags`, `is_template`, `attachments`, `created_at`, `updated_at`) VALUES
	(1, 'Basia Wade', 'Laudantium repudian', 2, '2025-08-21', '2026-04-07', 0, 'not_started', NULL, 0.00, NULL, NULL, 0, NULL, '2025-05-23 06:14:14', '2025-05-23 06:14:14'),
	(2, 'Kyla Mitchell', 'Nulla repellendus I', 3, '2025-08-22', '2026-01-15', 0, 'not_started', NULL, 0.00, NULL, NULL, 0, NULL, '2025-05-23 06:20:52', '2025-05-23 06:20:52'),
	(3, 'Bethany Fletcher', 'Consectetur eaque a', 2, '2025-05-30', '2025-06-28', 0, 'not_started', NULL, 0.00, NULL, NULL, 0, NULL, '2025-05-23 07:50:08', '2025-05-23 07:50:08'),
	(4, 'Merrill Petty', 'Voluptatum sint ea o', 2, '2025-05-07', '2025-06-08', 0, 'not_started', 22222222444.00, 5000000.00, 'Neque rerum et repel', '[]', 1, '[{"path": "project-attachments/gfVW7pIhEuuQvNmtbdvCcV7vGwJE8SU8ODaacCD2.jpg", "type": "image/jpeg", "filename": "ft6.jpg", "uploaded_at": "2025-05-24T04:03:01+00:00"}]', '2025-05-23 18:48:39', '2025-05-23 21:03:01'),
	(5, 'Alfonso Whitley', 'Voluptas similique n', 2, '2025-05-01', '2025-06-10', 0, 'not_started', 274424.00, 0.00, 'Dolor est unde excep', '["Tempor excepturi atq", "summertime", "sum"]', 1, '[{"path": "project-attachments/djWrZLDFZskQF7SOZc7rTcoWKt4s9zZMXsRSi93c.jpg", "type": "image/jpeg", "filename": "foto.jpg", "uploaded_at": "2025-05-24T04:45:53+00:00"}]', '2025-05-23 18:59:05', '2025-05-23 21:45:53'),
	(6, 'Kaye Rodriguez', 'Est sint omnis sint', 2, '2025-05-23', '2025-06-24', 0, 'not_started', 11242.00, 0.00, 'Velit ut obcaecati', '["Et voluptates recusa", "black", "white", "yellow", "dummy"]', 1, '[{"path": "project-attachments/jyXfPwiBxt6qxIeoW7GB8xgOjtLHgi2aoPf8Angp.jpg", "type": "image/jpeg", "filename": "ft6.jpg", "uploaded_at": "2025-05-24T02:40:26+00:00"}, {"path": "project-attachments/pRrodQECGbNy5N9OLfc3BY84uq63g2wNZxUFXcRP.jpg", "type": "image/jpeg", "filename": "foto.jpg", "uploaded_at": "2025-05-24T02:43:52+00:00"}, {"path": "project-attachments/OGSdKKf3ErkliKYzGr0089esRbMIZk4sek0hqKzS.pdf", "type": "application/pdf", "filename": "GaCitraGaCinta_152023007_152023062_152023072_152023149_152023158_TugasAkhir_PPT.pdf", "uploaded_at": "2025-05-24T02:51:15+00:00"}, {"path": "project-attachments/b6D5TQPQ4DHKZ5Cs1AVKwTUGieuZFLjDOAzbMIJC.jpg", "type": "image/jpeg", "filename": "koins.jpg", "uploaded_at": "2025-05-24T03:37:28+00:00"}, {"path": "project-attachments/VzvME0RipzxDmzFQ4M4dUFAld5xvRmEfFBs0iRr7.png", "type": "image/png", "filename": "Editor _ Mermaid Chart-2025-05-21-142937.png", "uploaded_at": "2025-05-24T03:49:51+00:00"}]', '2025-05-23 19:00:06', '2025-05-23 20:49:51'),
	(7, 'Alfonso Whitley (Template)', 'Voluptas similique n', 2, '2025-05-01', '2025-06-10', 0, 'not_started', 274424.00, 0.00, 'Dolor est unde excep', '["Tempor excepturi atq", "summertime", "sum"]', 1, '[{"path": "project-attachments/8Yyt1bR07mSOX8tix1XNcAbGRMTTDyXYSVmXiDrM.jpg", "type": "image/jpeg", "filename": "a1.jpg", "uploaded_at": "2025-05-24T04:53:05+00:00"}]', '2025-05-23 21:46:35', '2025-05-23 21:53:05');

-- Dumping structure for table tubes_pembweb.project_attachments
CREATE TABLE IF NOT EXISTS `project_attachments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint unsigned NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` int NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_attachments_project_id_foreign` (`project_id`),
  CONSTRAINT `project_attachments_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.project_attachments: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.roles: ~3 rows (approximately)
INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
	(1, 'Admin', 'web', '2025-05-23 06:06:20', '2025-05-23 06:06:20'),
	(2, 'Project Manager', 'web', '2025-05-23 06:06:20', '2025-05-23 06:06:20'),
	(3, 'Team Member', 'web', '2025-05-23 06:06:20', '2025-05-23 06:06:20');

-- Dumping structure for table tubes_pembweb.role_has_permissions
CREATE TABLE IF NOT EXISTS `role_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.role_has_permissions: ~17 rows (approximately)
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
	(1, 1),
	(2, 1),
	(3, 1),
	(4, 1),
	(5, 1),
	(6, 1),
	(7, 1),
	(8, 1),
	(2, 2),
	(3, 2),
	(5, 2),
	(6, 2),
	(7, 2),
	(8, 2),
	(6, 3),
	(7, 3),
	(8, 3);

-- Dumping structure for table tubes_pembweb.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
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

-- Dumping data for table tubes_pembweb.sessions: ~0 rows (approximately)
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
	('3cW4cVEnDxpauxgrLtg66fOy4JBwpwIOlo0us2ji', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiTVc0SWV1YlhtRVlCbXRlcGlHdTNUZ0VhaWlRNmFUeXpGYWwycnp6bCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9wcm9qZWN0cyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7fQ==', 1748066350);

-- Dumping structure for table tubes_pembweb.tasks
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` bigint unsigned NOT NULL,
  `assigned_to` bigint unsigned DEFAULT NULL,
  `status` enum('todo','in_progress','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'todo',
  `due_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_project_id_foreign` (`project_id`),
  KEY `tasks_assigned_to_foreign` (`assigned_to`),
  CONSTRAINT `tasks_assigned_to_foreign` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tasks_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.tasks: ~0 rows (approximately)
INSERT INTO `tasks` (`id`, `title`, `description`, `project_id`, `assigned_to`, `status`, `due_date`, `created_at`, `updated_at`) VALUES
	(1, 'Dolore qui sed volup', 'Aliquid in odit est', 1, 5, 'in_progress', '2025-05-08', '2025-05-23 06:39:05', '2025-05-23 06:39:05'),
	(2, 'Nihil omnis obcaecat', 'Pariatur Pariatur', 2, 4, 'completed', '2025-10-01', '2025-05-23 06:41:41', '2025-05-23 06:41:41'),
	(3, 'Sed ex iusto qui in', 'Saepe porro sequi re', 2, 4, 'todo', '2025-06-18', '2025-05-23 06:43:20', '2025-05-23 06:43:20'),
	(4, 'In qui quasi aute de', 'Praesentium totam du', 2, 4, 'in_progress', '2025-12-10', '2025-05-23 07:25:44', '2025-05-23 07:25:44'),
	(5, 'Aut voluptate doloru', 'Voluptate quia earum', 3, 5, 'in_progress', '2025-05-22', '2025-05-23 07:54:29', '2025-05-23 07:54:29'),
	(6, 'Sint sed nisi vel e', 'Natus doloribus non', 4, 5, 'in_progress', '2025-05-29', '2025-05-23 18:53:32', '2025-05-23 18:53:32'),
	(7, 'Quidem laborum tempo', 'Deserunt tempora qui', 2, 3, 'in_progress', '2025-05-26', '2025-05-23 19:00:36', '2025-05-23 19:00:36'),
	(8, 'Nulla qui ipsum a in', 'Debitis commodo nesc', 6, 3, 'in_progress', '2025-05-30', '2025-05-23 19:01:21', '2025-05-23 19:01:21'),
	(9, 'Velit et adipisci ex', 'Nihil quibusdam blan', 4, 5, 'completed', '2025-05-29', '2025-05-23 20:55:54', '2025-05-23 20:55:54'),
	(10, 'POCOLOCO', 'Animi nulla a quo o', 6, 5, 'completed', '2025-05-25', '2025-05-23 21:10:50', '2025-05-23 21:10:50'),
	(11, 'ZZZZZZZZZZ', 'In illum debitis pl', 6, 5, 'in_progress', '2025-05-27', '2025-05-23 21:28:39', '2025-05-23 21:28:39'),
	(12, 'DDDDDDDDD', 'Voluptas veniam vol', 7, 5, 'completed', '2025-04-30', '2025-05-23 21:47:26', '2025-05-23 21:47:26'),
	(13, 'SSSSSSSSSS', 'Consectetur similiqu', 7, 5, 'todo', '2025-04-28', '2025-05-23 21:50:14', '2025-05-23 21:50:14');

-- Dumping structure for table tubes_pembweb.task_attachments
CREATE TABLE IF NOT EXISTS `task_attachments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `task_id` bigint unsigned NOT NULL,
  `filename` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `task_attachments_task_id_foreign` (`task_id`),
  CONSTRAINT `task_attachments_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.task_attachments: ~9 rows (approximately)
INSERT INTO `task_attachments` (`id`, `task_id`, `filename`, `path`, `type`, `created_at`, `updated_at`) VALUES
	(1, 8, 'ft6.jpg', 'task-attachments/Q7Ive99Lkrd90f3ROnhbFl2XuxmmDQfNH3M4PIn9.jpg', 'image/jpeg', '2025-05-23 20:36:23', '2025-05-23 20:36:23'),
	(2, 9, 'foto.jpg', 'task-attachments/JNbiHzgm4prYr5mT1mywrGWY0LYjcj5mjcD3TJlk.jpg', 'image/jpeg', '2025-05-23 20:56:13', '2025-05-23 20:56:13'),
	(3, 9, 'koins.jpg', 'task-attachments/qx2d6y3PKODfsEUaZqWHt1n7yrGS9eVXNRRwXnK5.jpg', 'image/jpeg', '2025-05-23 21:02:30', '2025-05-23 21:02:30'),
	(4, 8, 'a1.jpg', 'task-attachments/lttEQW0zT1gTJ1bHrPPz5ssRqUqTAzRTKFXeMVR4.jpg', 'image/jpeg', '2025-05-23 21:04:27', '2025-05-23 21:04:27'),
	(5, 8, 'TUBES_PCD_V2.drawio.png', 'task-attachments/ZMGlEfRwwCYXoi134LXr73aVsp48wqKK8XeaTa8E.png', 'image/png', '2025-05-23 21:07:29', '2025-05-23 21:07:29'),
	(6, 8, 'koins.jpg', 'task-attachments/R9hWM8iZdbmdy200byQ3tczmKtfnSsKeRft3TSB4.jpg', 'image/jpeg', '2025-05-23 21:10:04', '2025-05-23 21:10:04'),
	(7, 12, 'foto.jpg', 'task-attachments/lyQcRI8kCrtRLKCWZCq0AES5NY20IIRMbrqB2Kxj.jpg', 'image/jpeg', '2025-05-23 21:47:36', '2025-05-23 21:47:36'),
	(8, 13, 'koins.jpg', 'task-attachments/LowrQI5PGku4Wj0w6nn9AuHPbMelKEMYyuoAFOfE.jpg', 'image/jpeg', '2025-05-23 21:53:16', '2025-05-23 21:53:16'),
	(9, 12, 'a1.jpg', 'task-attachments/VhMcmDQHCFRLtF7MTBfVQu1rGKe8JtsjROi7Mf8q.jpg', 'image/jpeg', '2025-05-23 21:54:00', '2025-05-23 21:54:00');

-- Dumping structure for table tubes_pembweb.task_attachment_comments
CREATE TABLE IF NOT EXISTS `task_attachment_comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `task_attachment_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `task_attachment_comments_task_attachment_id_foreign` (`task_attachment_id`),
  KEY `task_attachment_comments_user_id_foreign` (`user_id`),
  CONSTRAINT `task_attachment_comments_task_attachment_id_foreign` FOREIGN KEY (`task_attachment_id`) REFERENCES `task_attachments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_attachment_comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.task_attachment_comments: ~0 rows (approximately)

-- Dumping structure for table tubes_pembweb.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'team_member',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table tubes_pembweb.users: ~0 rows (approximately)
INSERT INTO `users` (`id`, `name`, `email`, `role`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
	(1, 'Admin User', 'admin@example.com', 'admin', NULL, '$2y$12$V2rreGxPPISXLMnaYETh4.SHRPGjWC9VcK1cvo85uyK9MVtHxoSxa', NULL, '2025-05-23 06:06:19', '2025-05-23 06:06:19'),
	(2, 'Project Manager', 'pm@example.com', 'project_manager', NULL, '$2y$12$aZUAGoZokM50eLMXv9m8BOT2wi.fk05u5KNYr.IerjSjX4XWyluD6', NULL, '2025-05-23 06:06:19', '2025-05-23 06:06:19'),
	(3, 'Team Member', 'member@example.com', 'team_member', NULL, '$2y$12$MhacCGWZiBA6NvqT8BWhVudmf4j./1gERTQk75WeBJ8tE3bhQKmeO', NULL, '2025-05-23 06:06:20', '2025-05-23 06:06:20'),
	(4, 'Another Team Member', 'member2@example.com', 'team_member', NULL, '$2y$12$eZn7Ug4dmrz8Et67.OMnsud.oVRRj48wjC3fYfi//hGF82YGlTpQi', NULL, '2025-05-23 06:06:20', '2025-05-23 06:06:20'),
	(5, 'Test User', 'test@example.com', 'team_member', NULL, '$2y$12$i7Llub4PRs0Ie73VeBV56.jYZZXnERUoN0KLN.D6cj/U3xJIdqV5G', NULL, '2025-05-23 06:06:20', '2025-05-23 06:06:20');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
