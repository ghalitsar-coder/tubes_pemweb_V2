<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\User;
use Carbon\Carbon;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing users for assignment
        $adminUser = User::where('email', 'admin@example.com')->first();
        $managerUser = User::where('email', 'manager@example.com')->first();
        $employeeUser = User::where('email', 'employee@example.com')->first();

        // Fallback to first available users if specific ones don't exist
        $users = User::all();
        if ($users->count() === 0) {
            $this->command->warn('No users found. Please run UserSeeder first.');
            return;
        }

        $defaultUser = $adminUser ?? $users->first();
        $projectManager = $managerUser ?? $users->skip(1)->first() ?? $defaultUser;

        $projects = [
            [
                'name' => 'E-Commerce Platform Development',
                'description' => 'Build a comprehensive e-commerce platform with modern features including user authentication, product catalog, shopping cart, payment integration, and admin dashboard.',
                'user_id' => $defaultUser->id,
                'start_date' => Carbon::now()->subDays(45),
                'end_date' => Carbon::now()->addDays(90),
                'progress' => 45,
                'status' => 'in_progress',
                'budget' => 150000.00,
                'spent_budget' => 67500.00,
                'category' => 'Web Development',
                'tags' => json_encode(['e-commerce', 'laravel', 'react', 'payment-gateway']),
                'is_template' => false,
            ],
            [
                'name' => 'Mobile App for Task Management',
                'description' => 'Develop a cross-platform mobile application for task and project management with real-time collaboration features.',
                'user_id' => $defaultUser->id,
                'start_date' => Carbon::now()->subDays(30),
                'end_date' => Carbon::now()->addDays(120),
                'progress' => 25,
                'status' => 'in_progress',
                'budget' => 85000.00,
                'spent_budget' => 21250.00,
                'category' => 'Mobile Development',
                'tags' => json_encode(['mobile', 'react-native', 'collaboration', 'real-time']),
                'is_template' => false,
            ],
            [
                'name' => 'Company Website Redesign',
                'description' => 'Complete redesign and development of the corporate website with modern UI/UX, responsive design, and CMS integration.',
                'user_id' => $defaultUser->id,
                'start_date' => Carbon::now()->subDays(20),
                'end_date' => Carbon::now()->addDays(60),
                'progress' => 70,
                'status' => 'in_progress',
                'budget' => 45000.00,
                'spent_budget' => 31500.00,
                'category' => 'Web Design',
                'tags' => json_encode(['website', 'redesign', 'cms', 'responsive']),
                'is_template' => false,
            ],
            [
                'name' => 'Data Analytics Dashboard',
                'description' => 'Create an advanced analytics dashboard for business intelligence with real-time data visualization and reporting capabilities.',
                'user_id' => $defaultUser->id,
                'start_date' => Carbon::now()->subDays(10),
                'end_date' => Carbon::now()->addDays(75),
                'progress' => 15,
                'status' => 'in_progress',
                'budget' => 95000.00,
                'spent_budget' => 14250.00,
                'category' => 'Data Analytics',
                'tags' => json_encode(['analytics', 'dashboard', 'business-intelligence', 'data-visualization']),
                'is_template' => false,
            ],
            [
                'name' => 'API Integration Platform',
                'description' => 'Develop a robust API integration platform to connect various third-party services and internal systems.',
                'user_id' => $defaultUser->id,
                'start_date' => Carbon::now()->addDays(5),
                'end_date' => Carbon::now()->addDays(105),
                'progress' => 0,
                'status' => 'not_started',
                'budget' => 120000.00,
                'spent_budget' => 0.00,
                'category' => 'API Development',
                'tags' => json_encode(['api', 'integration', 'microservices', 'third-party']),
                'is_template' => false,
            ],
            [
                'name' => 'DevOps Infrastructure Setup',
                'description' => 'Implement comprehensive DevOps infrastructure including CI/CD pipelines, containerization, and monitoring systems.',
                'user_id' => $defaultUser->id,
                'start_date' => Carbon::now()->addDays(15),
                'end_date' => Carbon::now()->addDays(80),
                'progress' => 0,
                'status' => 'not_started',
                'budget' => 75000.00,
                'spent_budget' => 0.00,
                'category' => 'DevOps',
                'tags' => json_encode(['devops', 'ci-cd', 'docker', 'monitoring']),
                'is_template' => false,
            ],
            [
                'name' => 'Security Audit and Compliance',
                'description' => 'Comprehensive security audit of existing systems and implementation of compliance measures for data protection.',
                'user_id' => $defaultUser->id,
                'start_date' => Carbon::now()->subDays(60),
                'end_date' => Carbon::now()->subDays(5),
                'progress' => 100,
                'status' => 'completed',
                'budget' => 65000.00,
                'spent_budget' => 63000.00,
                'category' => 'Security',
                'tags' => json_encode(['security', 'audit', 'compliance', 'data-protection']),
                'is_template' => false,
            ],
            [
                'name' => 'Project Management System Template',
                'description' => 'Create a reusable project management system template that can be customized for different client needs.',
                'user_id' => $defaultUser->id,
                'start_date' => Carbon::now()->addDays(30),
                'end_date' => Carbon::now()->addDays(150),
                'progress' => 0,
                'status' => 'not_started',
                'budget' => 55000.00,
                'spent_budget' => 0.00,
                'category' => 'Template Development',
                'tags' => json_encode(['template', 'project-management', 'reusable', 'customizable']),
                'is_template' => true,
            ],
        ];

        foreach ($projects as $projectData) {
            Project::create($projectData);
        }

        $this->command->info('Successfully created ' . count($projects) . ' sample projects.');
    }
}
