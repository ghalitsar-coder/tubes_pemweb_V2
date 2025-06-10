# Entity Relationship Diagram (ERD)

## Project Management System Database Schema

### Entities and Attributes

#### 1. **Users**

-   **Primary Key:** `id` (BIGINT UNSIGNED, AUTO_INCREMENT)
-   **Attributes:**
    -   `name` (VARCHAR 255, NOT NULL)
    -   `email` (VARCHAR 255, NOT NULL, UNIQUE)
    -   `role` (VARCHAR 255, DEFAULT 'team_member')
    -   `email_verified_at` (TIMESTAMP, NULLABLE)
    -   `password` (VARCHAR 255, NOT NULL)
    -   `remember_token` (VARCHAR 100, NULLABLE)
    -   `created_at` (TIMESTAMP, NULLABLE)
    -   `updated_at` (TIMESTAMP, NULLABLE)

#### 2. **Projects**

-   **Primary Key:** `id` (BIGINT UNSIGNED, AUTO_INCREMENT)
-   **Attributes:**
    -   `name` (VARCHAR 255, NOT NULL)
    -   `description` (TEXT, NOT NULL)
    -   `user_id` (BIGINT UNSIGNED, NOT NULL) [FK to Users]
    -   `start_date` (DATE, NOT NULL)
    -   `end_date` (DATE, NOT NULL)
    -   `progress` (INT, DEFAULT 0)
    -   `status` (ENUM: 'not_started', 'in_progress', 'on_hold', 'completed')
    -   `budget` (DECIMAL 15,2, NULLABLE)
    -   `spent_budget` (DECIMAL 15,2, DEFAULT 0.00)
    -   `category` (VARCHAR 255, NULLABLE)
    -   `tags` (JSON, NULLABLE)
    -   `is_template` (TINYINT(1), DEFAULT 0)
    -   `attachments` (JSON, NULLABLE)
    -   `created_at` (TIMESTAMP, NULLABLE)
    -   `updated_at` (TIMESTAMP, NULLABLE)

#### 3. **Tasks**

-   **Primary Key:** `id` (BIGINT UNSIGNED, AUTO_INCREMENT)
-   **Attributes:**
    -   `title` (VARCHAR 255, NOT NULL)
    -   `description` (TEXT, NOT NULL)
    -   `task_type` (ENUM: 'feature', 'bug', 'improvement')
    -   `project_id` (BIGINT UNSIGNED, NOT NULL) [FK to Projects]
    -   `assigned_to` (BIGINT UNSIGNED, NULLABLE) [FK to Users]
    -   `status` (ENUM: 'todo', 'in_progress', 'on_hold', 'completed')
    -   `due_date` (DATE, NOT NULL)
    -   `tags` (TEXT, NULLABLE)
    -   `time_estimate` (DECIMAL 8,2, NULLABLE)
    -   `start_date` (DATE, NULLABLE)
    -   `priority` (VARCHAR 255, DEFAULT 'medium')
    -   `created_at` (TIMESTAMP, NULLABLE)
    -   `updated_at` (TIMESTAMP, NULLABLE)

#### 4. **Comments** (General Comments Table)

-   **Primary Key:** `id` (BIGINT UNSIGNED, AUTO_INCREMENT)
-   **Attributes:**
    -   `content` (TEXT, NOT NULL)
    -   `task_id` (BIGINT UNSIGNED, NOT NULL) [FK to Tasks]
    -   `user_id` (BIGINT UNSIGNED, NOT NULL) [FK to Users]
    -   `project_id` (BIGINT UNSIGNED, NULLABLE) [FK to Projects]
    -   `parent_id` (BIGINT UNSIGNED, NULLABLE) [FK to Comments - Self-referencing]
    -   `image_path` (VARCHAR 255, NULLABLE)
    -   `commentable_type` (VARCHAR 255, NULLABLE)
    -   `commentable_id` (BIGINT UNSIGNED, NULLABLE)
    -   `created_at` (TIMESTAMP, NULLABLE)
    -   `updated_at` (TIMESTAMP, NULLABLE)
    -   `deleted_at` (TIMESTAMP, NULLABLE)

#### 5. **Project Comments**

-   **Primary Key:** `id` (BIGINT UNSIGNED, AUTO_INCREMENT)
-   **Attributes:**
    -   `content` (TEXT, NOT NULL)
    -   `project_id` (BIGINT UNSIGNED, NOT NULL) [FK to Projects]
    -   `user_id` (BIGINT UNSIGNED, NOT NULL) [FK to Users]
    -   `parent_id` (BIGINT UNSIGNED, NULLABLE) [FK to Project Comments - Self-referencing]
    -   `image_path` (VARCHAR 255, NULLABLE)
    -   `created_at` (TIMESTAMP, NULLABLE)
    -   `updated_at` (TIMESTAMP, NULLABLE)
    -   `deleted_at` (TIMESTAMP, NULLABLE)

#### 6. **Task Comments**

-   **Primary Key:** `id` (BIGINT UNSIGNED, AUTO_INCREMENT)
-   **Attributes:**
    -   `content` (TEXT, NOT NULL)
    -   `task_id` (BIGINT UNSIGNED, NOT NULL) [FK to Tasks]
    -   `user_id` (BIGINT UNSIGNED, NOT NULL) [FK to Users]
    -   `parent_id` (BIGINT UNSIGNED, NULLABLE) [FK to Task Comments - Self-referencing]
    -   `image_path` (VARCHAR 255, NULLABLE)
    -   `created_at` (TIMESTAMP, NULLABLE)
    -   `updated_at` (TIMESTAMP, NULLABLE)
    -   `deleted_at` (TIMESTAMP, NULLABLE)

#### 7. **Task Attachments**

-   **Primary Key:** `id` (BIGINT UNSIGNED, AUTO_INCREMENT)
-   **Attributes:**
    -   `task_id` (BIGINT UNSIGNED, NOT NULL) [FK to Tasks]
    -   `filename` (VARCHAR 255, NOT NULL)
    -   `path` (VARCHAR 255, NOT NULL)
    -   `public_id` (VARCHAR 255, NULLABLE)
    -   `type` (VARCHAR 255, NOT NULL)
    -   `created_at` (TIMESTAMP, NULLABLE)
    -   `updated_at` (TIMESTAMP, NULLABLE)

#### 8. **Task Attachment Comments**

-   **Primary Key:** `id` (BIGINT UNSIGNED, AUTO_INCREMENT)
-   **Attributes:**
    -   `task_attachment_id` (BIGINT UNSIGNED, NOT NULL) [FK to Task Attachments]
    -   `user_id` (BIGINT UNSIGNED, NOT NULL) [FK to Users]
    -   `content` (TEXT, NOT NULL)
    -   `created_at` (TIMESTAMP, NULLABLE)
    -   `updated_at` (TIMESTAMP, NULLABLE)

#### 9. **Calendar Events**

-   **Primary Key:** `id` (BIGINT UNSIGNED, AUTO_INCREMENT)
-   **Attributes:**
    -   `title` (VARCHAR 255, NOT NULL)
    -   `description` (TEXT, NULLABLE)
    -   `event_date` (DATE, NOT NULL)
    -   `start_time` (TIME, NULLABLE)
    -   `end_time` (TIME, NULLABLE)
    -   `event_type` (ENUM: 'meeting', 'task_deadline', 'review', 'important_deadline', 'personal', 'reminder', 'milestone')
    -   `status` (ENUM: 'scheduled', 'completed', 'cancelled')
    -   `color_theme` (VARCHAR 255, DEFAULT 'blue')
    -   `is_all_day` (TINYINT(1), DEFAULT 0)
    -   `attendees` (JSON, NULLABLE)
    -   `location` (VARCHAR 255, NULLABLE)
    -   `notes` (TEXT, NULLABLE)
    -   `priority` (ENUM: 'low', 'medium', 'high')
    -   `is_recurring` (TINYINT(1), DEFAULT 0)
    -   `recurrence_settings` (JSON, NULLABLE)
    -   `reminder_at` (TIMESTAMP, NULLABLE)
    -   `reminder_sent` (TINYINT(1), DEFAULT 0)
    -   `user_id` (BIGINT UNSIGNED, NOT NULL) [FK to Users]
    -   `project_id` (BIGINT UNSIGNED, NULLABLE) [FK to Projects]
    -   `task_id` (BIGINT UNSIGNED, NULLABLE) [FK to Tasks]
    -   `created_at` (TIMESTAMP, NULLABLE)
    -   `updated_at` (TIMESTAMP, NULLABLE)
    -   `deleted_at` (TIMESTAMP, NULLABLE)

#### 10. **Roles** (Spatie Permission System)

-   **Primary Key:** `id` (BIGINT UNSIGNED, AUTO_INCREMENT)
-   **Attributes:**
    -   `name` (VARCHAR 255, NOT NULL)
    -   `guard_name` (VARCHAR 255, NOT NULL)
    -   `created_at` (TIMESTAMP, NULLABLE)
    -   `updated_at` (TIMESTAMP, NULLABLE)
-   **Unique Key:** (`name`, `guard_name`)

#### 11. **Permissions** (Spatie Permission System)

-   **Primary Key:** `id` (BIGINT UNSIGNED, AUTO_INCREMENT)
-   **Attributes:**
    -   `name` (VARCHAR 255, NOT NULL)
    -   `guard_name` (VARCHAR 255, NOT NULL)
    -   `created_at` (TIMESTAMP, NULLABLE)
    -   `updated_at` (TIMESTAMP, NULLABLE)
-   **Unique Key:** (`name`, `guard_name`)

#### 12. **Model Has Roles** (Spatie Permission System)

-   **Composite Primary Key:** (`role_id`, `model_id`, `model_type`)
-   **Attributes:**
    -   `role_id` (BIGINT UNSIGNED, NOT NULL) [FK to Roles]
    -   `model_type` (VARCHAR 255, NOT NULL)
    -   `model_id` (BIGINT UNSIGNED, NOT NULL)

#### 13. **Model Has Permissions** (Spatie Permission System)

-   **Composite Primary Key:** (`permission_id`, `model_id`, `model_type`)
-   **Attributes:**
    -   `permission_id` (BIGINT UNSIGNED, NOT NULL) [FK to Permissions]
    -   `model_type` (VARCHAR 255, NOT NULL)
    -   `model_id` (BIGINT UNSIGNED, NOT NULL)

#### 14. **Role Has Permissions** (Spatie Permission System)

-   **Composite Primary Key:** (`permission_id`, `role_id`)
-   **Attributes:**
    -   `permission_id` (BIGINT UNSIGNED, NOT NULL) [FK to Permissions]
    -   `role_id` (BIGINT UNSIGNED, NOT NULL) [FK to Roles]

#### 15. **Pembagian Tugas** (Assignment Distribution)

-   **Primary Key:** `id` (BIGINT UNSIGNED, AUTO_INCREMENT)
-   **Attributes:**
    -   `nama` (VARCHAR 255, NOT NULL)
    -   `nim` (VARCHAR 255, NOT NULL)
    -   `tugas` (TEXT, NOT NULL)
    -   `created_at` (TIMESTAMP, NULLABLE)
    -   `updated_at` (TIMESTAMP, NULLABLE)

### System Tables (Laravel Framework)

#### 16. **Cache**

-   **Primary Key:** `key` (VARCHAR 255)
-   **Attributes:**
    -   `value` (MEDIUMTEXT, NOT NULL)
    -   `expiration` (INT, NOT NULL)

#### 17. **Cache Locks**

-   **Primary Key:** `key` (VARCHAR 255)
-   **Attributes:**
    -   `owner` (VARCHAR 255, NOT NULL)
    -   `expiration` (INT, NOT NULL)

#### 18. **Sessions**

-   **Primary Key:** `id` (VARCHAR 255)
-   **Attributes:**
    -   `user_id` (BIGINT UNSIGNED, NULLABLE)
    -   `ip_address` (VARCHAR 45, NULLABLE)
    -   `user_agent` (TEXT, NULLABLE)
    -   `payload` (LONGTEXT, NOT NULL)
    -   `last_activity` (INT, NOT NULL)

#### 19. **Password Reset Tokens**

-   **Primary Key:** `email` (VARCHAR 255)
-   **Attributes:**
    -   `token` (VARCHAR 255, NOT NULL)
    -   `created_at` (TIMESTAMP, NULLABLE)

#### 20. **Failed Jobs**

-   **Primary Key:** `id` (BIGINT UNSIGNED, AUTO_INCREMENT)
-   **Attributes:**
    -   `uuid` (VARCHAR 255, NOT NULL, UNIQUE)
    -   `connection` (TEXT, NOT NULL)
    -   `queue` (TEXT, NOT NULL)
    -   `payload` (LONGTEXT, NOT NULL)
    -   `exception` (LONGTEXT, NOT NULL)
    -   `failed_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

#### 21. **Jobs**

-   **Primary Key:** `id` (BIGINT UNSIGNED, AUTO_INCREMENT)
-   **Attributes:**
    -   `queue` (VARCHAR 255, NOT NULL)
    -   `payload` (LONGTEXT, NOT NULL)
    -   `attempts` (TINYINT UNSIGNED, NOT NULL)
    -   `reserved_at` (INT UNSIGNED, NULLABLE)
    -   `available_at` (INT UNSIGNED, NOT NULL)
    -   `created_at` (INT UNSIGNED, NOT NULL)

#### 22. **Job Batches**

-   **Primary Key:** `id` (VARCHAR 255)
-   **Attributes:**
    -   `name` (VARCHAR 255, NOT NULL)
    -   `total_jobs` (INT, NOT NULL)
    -   `pending_jobs` (INT, NOT NULL)
    -   `failed_jobs` (INT, NOT NULL)
    -   `failed_job_ids` (LONGTEXT, NOT NULL)
    -   `options` (MEDIUMTEXT, NULLABLE)
    -   `cancelled_at` (INT, NULLABLE)
    -   `created_at` (INT, NOT NULL)
    -   `finished_at` (INT, NULLABLE)

#### 23. **Migrations**

-   **Primary Key:** `id` (INT UNSIGNED, AUTO_INCREMENT)
-   **Attributes:**
    -   `migration` (VARCHAR 255, NOT NULL)
    -   `batch` (INT, NOT NULL)

---

## Business Logic Entities

### Core Business Entities:

1. **Users** - System users with different roles
2. **Projects** - Main project entities with budget tracking
3. **Tasks** - Work items within projects
4. **Comments** - Multi-level commenting system
5. **Calendar Events** - Time-based scheduling
6. **Attachments** - File management for tasks
7. **Pembagian Tugas** - Team assignment distribution

### Permission System:

-   **Roles** - User role definitions (Admin, Project Manager, Team Member)
-   **Permissions** - Granular permission system
-   **Role-Permission Mapping** - Many-to-many relationships

### Supporting Systems:

-   **Cache System** - Performance optimization
-   **Session Management** - User authentication
-   **Job Queue System** - Background processing
-   **Migration Tracking** - Database version control

---

_Generated on: June 10, 2025_
_Database: tubes_pembweb_
_Laravel Framework Version: 11.x_
