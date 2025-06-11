# Project Management System

> **📚 For comprehensive documentation, please refer to the `docs/` folder in this repository.**

## Overview

A comprehensive web-based project management system built with Laravel and React that enables teams to collaborate effectively on projects, manage tasks, track progress, and maintain clear communication throughout the project lifecycle.

## ✨ Key Features

### 🔐 Role-Based Access Control

-   **Admin**: Full system access, user management, and system configuration
-   **Project Manager**: Create and manage projects, assign tasks, team management
-   **Team Member**: View assigned tasks, update task status, comment on projects

### 📊 Project Management

-   Create and manage projects with detailed information
-   Set budgets, timelines, and track progress
-   Project templates for quick setup
-   Member management with role-based permissions
-   Real-time progress tracking and analytics

### ✅ Task Management

-   Create, assign, and track tasks
-   Priority levels (Low, Medium, High, Urgent)
-   Task status tracking (To Do, In Progress, On Hold, Completed)
-   Task dependencies and time estimation
-   File attachments and comments
-   Task types (Feature, Bug, Improvement)

### 📅 Calendar Integration

-   Project and task calendar views
-   Deadline tracking and notifications
-   Timeline visualization

### 💬 Collaboration Features

-   Project and task commenting system
-   File attachments with comment threads
-   Real-time notifications
-   Team communication tools

### 📈 Analytics & Reporting

-   Project progress dashboards
-   Task completion statistics
-   Budget tracking and analytics
-   Visual charts and reporting

## 🛠 Tech Stack

### Backend

-   **Laravel 11** - PHP Framework
-   **MySQL** - Database
-   **Spatie Laravel Permission** - Role & Permission Management
-   **Cloudinary** - File Storage and Management
-   **JWT Authentication** - API Security

### Frontend

-   **React 18** - UI Library
-   **TypeScript** - Type Safety
-   **Inertia.js** - Full-stack Framework
-   **Tailwind CSS** - Styling
-   **Shadcn/ui** - Component Library
-   **Lucide React** - Icons

### Development Tools

-   **Vite** - Build Tool
-   **Laravel Sanctum** - API Authentication
-   **Composer** - PHP Dependency Management
-   **NPM** - Node Package Management

## 🚀 Getting Started

### Prerequisites

-   PHP 8.2 or higher
-   Composer
-   Node.js 18+ and NPM
-   MySQL 8.0+
-   Git

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd tubes_pemweb_V2
    ```

2. **Install PHP dependencies**

    ```bash
    composer install
    ```

3. **Install Node.js dependencies**

    ```bash
    npm install
    ```

4. **Environment setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. **Configure your environment**
   Edit `.env` file with your database and Cloudinary credentials:

    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=your_database_name
    DB_USERNAME=your_username
    DB_PASSWORD=your_password

    CLOUDINARY_URL=your_cloudinary_url
    CLOUDINARY_UPLOAD_PRESET=your_upload_preset
    ```

6. **Database setup**

    ```bash
    php artisan migrate
    php artisan db:seed
    ```

7. **Build assets**

    ```bash
    npm run build
    ```

8. **Start development servers**

    ```bash
    # Terminal 1 - Laravel
    php artisan serve

    # Terminal 2 - Vite (for development)
    npm run dev
    ```

### Default Users

After seeding, you can login with these default accounts:

-   **Admin**: admin@example.com / password
-   **Project Manager**: pm@example.com / password
-   **Team Member**: employee@example.com / password

## 📖 Documentation

Detailed documentation is available in the `docs/` folder:

-   **[ERD & Database Schema](docs/ERD_Database_Schema.md)** - Complete database structure
-   **[System Flowcharts](docs/System_Flowcharts.md)** - System architecture and user flows
-   **[Business Process Flowcharts](docs/Business_Process_Flowcharts.md)** - Business logic flows
-   **[Table Relationships](docs/TRD_Table_Relationships.md)** - Database relationships
-   **[JWT Integration](docs/JWT_INTEGRATION.md)** - Authentication system

## 🔒 Security Features

-   Role-based access control (RBAC)
-   JWT token authentication
-   CSRF protection
-   SQL injection prevention
-   XSS protection
-   Secure file upload handling

## 🎯 Project Structure

```
├── app/                    # Laravel application code
│   ├── Http/Controllers/   # API and web controllers
│   ├── Models/            # Eloquent models
│   ├── Policies/          # Authorization policies
│   └── ...
├── resources/js/          # React frontend code
│   ├── Components/        # Reusable UI components
│   ├── Pages/            # Page components
│   ├── utils/            # Utility functions
│   └── ...
├── docs/                  # Comprehensive documentation
├── database/              # Database migrations and seeders
└── routes/               # Application routes
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For detailed documentation and technical specifications, please refer to the `docs/` folder.

For issues and questions:

-   Check the documentation in `docs/`
-   Open an issue on GitHub
-   Contact the development team

---

**Built with ❤️ for efficient project management**
