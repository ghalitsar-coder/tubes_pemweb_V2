# Table Relationship Diagram (TRD)
## Project Management System Database Relationships

### Primary Relationships

#### 1. **User-Centric Relationships**
```
Users (1) ──────── (∞) Projects
    │                   │
    │                   └── user_id [FK]
    │
    ├── (∞) Tasks (assigned_to)
    │       │
    │       └── assigned_to [FK]
    │
    ├── (∞) Comments
    │       │
    │       └── user_id [FK]
    │
    ├── (∞) Project Comments
    │       │
    │       └── user_id [FK]
    │
    ├── (∞) Task Comments
    │       │
    │       └── user_id [FK]
    │
    ├── (∞) Task Attachment Comments
    │       │
    │       └── user_id [FK]
    │
    └── (∞) Calendar Events
            │
            └── user_id [FK]
```

#### 2. **Project-Centric Relationships**
```
Projects (1) ──────── (∞) Tasks
    │                     │
    │                     └── project_id [FK]
    │
    ├── (∞) Comments
    │       │
    │       └── project_id [FK]
    │
    ├── (∞) Project Comments
    │       │
    │       └── project_id [FK]
    │
    └── (∞) Calendar Events
            │
            └── project_id [FK]
```

#### 3. **Task-Centric Relationships**
```
Tasks (1) ──────── (∞) Comments
   │                   │
   │                   └── task_id [FK]
   │
   ├── (∞) Task Comments
   │       │
   │       └── task_id [FK]
   │
   ├── (∞) Task Attachments
   │       │
   │       └── task_id [FK]
   │
   └── (∞) Calendar Events
           │
           └── task_id [FK]
```

#### 4. **Comment Hierarchical Relationships**
```
Comments (1) ──────── (∞) Comments (Self-Referencing)
    │                     │
    │                     └── parent_id [FK]

Project Comments (1) ──── (∞) Project Comments (Self-Referencing)
    │                         │
    │                         └── parent_id [FK]

Task Comments (1) ──────── (∞) Task Comments (Self-Referencing)
    │                         │
    │                         └── parent_id [FK]
```

#### 5. **Attachment Relationships**
```
Task Attachments (1) ──── (∞) Task Attachment Comments
    │                         │
    │                         └── task_attachment_id [FK]
```

### Permission System Relationships (Spatie Laravel Permission)

#### 6. **Role-Permission System**
```
Roles (∞) ──────── (∞) Permissions
    │                   │
    │                   └── role_has_permissions [Pivot Table]
    │                       ├── role_id [FK]
    │                       └── permission_id [FK]
    │
Users (∞) ──────── (∞) Roles
    │                   │
    │                   └── model_has_roles [Pivot Table]
    │                       ├── model_id [FK] (user_id)
    │                       ├── model_type (App\Models\User)
    │                       └── role_id [FK]
    │
Users (∞) ──────── (∞) Permissions (Direct Assignment)
    │                   │
    │                   └── model_has_permissions [Pivot Table]
                            ├── model_id [FK] (user_id)
                            ├── model_type (App\Models\User)
                            └── permission_id [FK]
```

### Detailed Relationship Mappings

#### **One-to-Many Relationships**

| Parent Table | Child Table | Foreign Key | Relationship Type | Cascade Rule |
|--------------|-------------|-------------|-------------------|--------------|
| Users | Projects | user_id | 1:∞ | CASCADE |
| Users | Tasks | assigned_to | 1:∞ | SET NULL |
| Users | Comments | user_id | 1:∞ | CASCADE |
| Users | Project Comments | user_id | 1:∞ | CASCADE |
| Users | Task Comments | user_id | 1:∞ | CASCADE |
| Users | Task Attachment Comments | user_id | 1:∞ | CASCADE |
| Users | Calendar Events | user_id | 1:∞ | CASCADE |
| Projects | Tasks | project_id | 1:∞ | CASCADE |
| Projects | Comments | project_id | 1:∞ | CASCADE |
| Projects | Project Comments | project_id | 1:∞ | CASCADE |
| Projects | Calendar Events | project_id | 1:∞ | CASCADE |
| Tasks | Comments | task_id | 1:∞ | CASCADE |
| Tasks | Task Comments | task_id | 1:∞ | CASCADE |
| Tasks | Task Attachments | task_id | 1:∞ | CASCADE |
| Tasks | Calendar Events | task_id | 1:∞ | CASCADE |
| Task Attachments | Task Attachment Comments | task_attachment_id | 1:∞ | CASCADE |

#### **Self-Referencing Relationships**

| Table | Parent Key | Child Key | Purpose |
|-------|------------|-----------|---------|
| Comments | id | parent_id | Nested comment threads |
| Project Comments | id | parent_id | Nested project comment threads |
| Task Comments | id | parent_id | Nested task comment threads |

#### **Many-to-Many Relationships**

| Table 1 | Table 2 | Pivot Table | Key 1 | Key 2 | Purpose |
|---------|---------|-------------|-------|-------|---------|
| Users | Roles | model_has_roles | model_id | role_id | User role assignment |
| Users | Permissions | model_has_permissions | model_id | permission_id | Direct user permissions |
| Roles | Permissions | role_has_permissions | role_id | permission_id | Role-based permissions |

### Polymorphic Relationships

#### **Comments Table Polymorphic Structure**
```
Comments Table:
├── commentable_type (VARCHAR) - Model class name
├── commentable_id (BIGINT) - Model instance ID
└── Purpose: Allow comments on multiple entity types
```

### Indexes and Performance Optimization

#### **Primary Indexes**
- All tables have AUTO_INCREMENT primary keys
- Unique constraints on email (Users table)
- Composite unique constraints on permission system tables

#### **Foreign Key Indexes**
- All foreign key columns are automatically indexed
- Composite indexes on frequently queried combinations:
  - `calendar_events_event_date_user_id_index`
  - `calendar_events_event_type_status_index`
  - `calendar_events_project_id_event_date_index`
  - `project_comments_project_id_created_at_index`

### Business Rules and Constraints

#### **Cascade Rules**
1. **CASCADE DELETE**: When parent is deleted, children are automatically deleted
   - User deletion → All associated projects, comments, events
   - Project deletion → All associated tasks, comments, events
   - Task deletion → All associated comments, attachments, events

2. **SET NULL**: When parent is deleted, foreign key is set to NULL
   - User deletion from task assignment (assigned_to field)

3. **RESTRICT/NO ACTION**: Prevents deletion if children exist
   - Not implemented in current schema

#### **Data Integrity Rules**
1. **Email Uniqueness**: Users must have unique email addresses
2. **Role-Permission Uniqueness**: Prevents duplicate role-permission assignments
3. **Temporal Constraints**: Project end_date should be after start_date (application level)
4. **Status Consistency**: Task status should align with project status (application level)

### Entity Dependencies

#### **Core Entity Hierarchy**
```
Users (Root Entity)
└── Projects
    ├── Tasks
    │   ├── Task Comments
    │   ├── Task Attachments
    │   │   └── Task Attachment Comments
    │   └── Calendar Events
    ├── Project Comments
    └── Calendar Events
```

#### **Support Entity Network**
```
Permission System:
├── Roles
├── Permissions
└── Pivot Tables (role_has_permissions, model_has_roles, model_has_permissions)

System Tables:
├── Cache (Performance)
├── Sessions (Authentication)
├── Jobs (Background Processing)
└── Migrations (Version Control)

Custom Tables:
└── Pembagian Tugas (Team Assignment)
```

---

## Database Schema Statistics

| Category | Count | Details |
|----------|-------|---------|
| **Core Business Tables** | 9 | Users, Projects, Tasks, Comments (3 types), Attachments (2 types), Calendar Events |
| **Permission System Tables** | 5 | Roles, Permissions, 3 Pivot Tables |
| **Laravel System Tables** | 8 | Cache, Sessions, Jobs, Migrations, etc. |
| **Custom Tables** | 1 | Pembagian Tugas |
| **Total Tables** | 23 | Complete database schema |
| **Foreign Key Relationships** | 24 | Including self-referencing |
| **Many-to-Many Relationships** | 3 | All in permission system |
| **Self-Referencing Tables** | 3 | All comment tables |

---

*Generated on: June 10, 2025*
*Database: tubes_pembweb*
*Schema Analysis: Complete relationship mapping*
