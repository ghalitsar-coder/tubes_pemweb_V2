<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use Carbon\Carbon;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get projects and users for task assignment
        $projects = Project::all();
        $users = User::all();

        if ($projects->count() === 0) {
            $this->command->warn('No projects found. Please run ProjectSeeder first.');
            return;
        }

        if ($users->count() === 0) {
            $this->command->warn('No users found. Please run UserSeeder first.');
            return;
        }

        // Get specific users
        $adminUser = User::where('email', 'admin@example.com')->first();
        $managerUser = User::where('email', 'manager@example.com')->first();
        $employeeUser = User::where('email', 'employee@example.com')->first();

        $defaultAssignee = $employeeUser ?? $users->first();
        $managerAssignee = $managerUser ?? $users->skip(1)->first() ?? $defaultAssignee;

        $taskTemplates = [
            // E-Commerce Platform Development Tasks
            'E-Commerce Platform Development' => [
                [
                    'title' => 'Setup Development Environment',
                    'description' => 'Configure development environment, version control, and project structure for the e-commerce platform.',
                    'task_type' => 'feature',
                    'priority' => 'high',
                    'status' => 'completed',
                    'due_date' => Carbon::now()->subDays(40),
                    'start_date' => Carbon::now()->subDays(45),
                    'time_estimate' => 16.0,
                    'tags' => 'setup,environment,laravel,react',
                    'assigned_to' => $defaultAssignee->id,
                ],
                [
                    'title' => 'Design Database Schema',
                    'description' => 'Create comprehensive database schema for products, users, orders, and related entities.',
                    'task_type' => 'feature',
                    'priority' => 'high',
                    'status' => 'completed',
                    'due_date' => Carbon::now()->subDays(35),
                    'start_date' => Carbon::now()->subDays(40),
                    'time_estimate' => 24.0,
                    'tags' => 'database,schema,mysql',
                    'assigned_to' => $managerAssignee->id,
                ],
                [
                    'title' => 'Implement User Authentication',
                    'description' => 'Develop user registration, login, password reset, and profile management features.',
                    'task_type' => 'feature',
                    'priority' => 'high',
                    'status' => 'in_progress',
                    'due_date' => Carbon::now()->addDays(5),
                    'start_date' => Carbon::now()->subDays(10),
                    'time_estimate' => 32.0,
                    'tags' => 'authentication,security,backend',
                    'assigned_to' => $defaultAssignee->id,
                ],
                [
                    'title' => 'Build Product Catalog',
                    'description' => 'Create product listing, categories, search, and filtering functionality.',
                    'task_type' => 'feature',
                    'priority' => 'medium',
                    'status' => 'todo',
                    'due_date' => Carbon::now()->addDays(20),
                    'start_date' => Carbon::now()->addDays(5),
                    'time_estimate' => 40.0,
                    'tags' => 'products,catalog,search',
                    'assigned_to' => $defaultAssignee->id,
                ],
                [
                    'title' => 'Fix Shopping Cart Bug',
                    'description' => 'Fix issue where items are not properly removed from cart when quantity is set to zero.',
                    'task_type' => 'bug',
                    'priority' => 'high',
                    'status' => 'todo',
                    'due_date' => Carbon::now()->addDays(7),
                    'start_date' => Carbon::now()->addDays(2),
                    'time_estimate' => 8.0,
                    'tags' => 'cart,bug,frontend',
                    'assigned_to' => $managerAssignee->id,
                ],
                [
                    'title' => 'Payment Gateway Integration',
                    'description' => 'Integrate secure payment processing with multiple payment methods.',
                    'task_type' => 'feature',
                    'priority' => 'high',
                    'status' => 'todo',
                    'due_date' => Carbon::now()->addDays(50),
                    'start_date' => Carbon::now()->addDays(40),
                    'time_estimate' => 36.0,
                    'tags' => 'payment,stripe,security',
                    'assigned_to' => $managerAssignee->id,
                ],
            ],

            // Mobile App for Task Management Tasks
            'Mobile App for Task Management' => [
                [
                    'title' => 'UI/UX Design and Prototyping',
                    'description' => 'Create wireframes, mockups, and interactive prototypes for the mobile app.',
                    'task_type' => 'feature',
                    'priority' => 'high',
                    'status' => 'completed',
                    'due_date' => Carbon::now()->subDays(25),
                    'start_date' => Carbon::now()->subDays(30),
                    'time_estimate' => 32.0,
                    'tags' => 'design,ui,ux,prototyping',
                    'assigned_to' => $defaultAssignee->id,
                ],
                [
                    'title' => 'Setup React Native Project',
                    'description' => 'Initialize React Native project with necessary dependencies and configuration.',
                    'task_type' => 'feature',
                    'priority' => 'high',
                    'status' => 'completed',
                    'due_date' => Carbon::now()->subDays(20),
                    'start_date' => Carbon::now()->subDays(25),
                    'time_estimate' => 12.0,
                    'tags' => 'setup,react-native,mobile',
                    'assigned_to' => $managerAssignee->id,
                ],
                [
                    'title' => 'Implement Core Navigation',
                    'description' => 'Develop main navigation structure and screen transitions.',
                    'task_type' => 'feature',
                    'priority' => 'medium',
                    'status' => 'in_progress',
                    'due_date' => Carbon::now()->addDays(10),
                    'start_date' => Carbon::now()->subDays(5),
                    'time_estimate' => 20.0,
                    'tags' => 'navigation,mobile,react-native',
                    'assigned_to' => $defaultAssignee->id,
                ],
                [
                    'title' => 'Fix Navigation Performance Issue',
                    'description' => 'Optimize navigation performance and fix lag when switching between screens.',
                    'task_type' => 'bug',
                    'priority' => 'medium',
                    'status' => 'todo',
                    'due_date' => Carbon::now()->addDays(5),
                    'start_date' => Carbon::now()->addDays(1),
                    'time_estimate' => 6.0,
                    'tags' => 'performance,navigation,bug',
                    'assigned_to' => $managerAssignee->id,
                ],
                [
                    'title' => 'Improve Task Creation UX',
                    'description' => 'Enhance user experience for creating tasks with better form validation and feedback.',
                    'task_type' => 'improvement',
                    'priority' => 'low',
                    'status' => 'todo',
                    'due_date' => Carbon::now()->addDays(30),
                    'start_date' => Carbon::now()->addDays(20),
                    'time_estimate' => 16.0,
                    'tags' => 'ux,improvement,forms',
                    'assigned_to' => $defaultAssignee->id,
                ],
            ],

            // Company Website Redesign Tasks
            'Company Website Redesign' => [
                [
                    'title' => 'Content Audit and Analysis',
                    'description' => 'Review existing website content and analyze user requirements.',
                    'task_type' => 'feature',
                    'priority' => 'medium',
                    'status' => 'completed',
                    'due_date' => Carbon::now()->subDays(15),
                    'start_date' => Carbon::now()->subDays(20),
                    'time_estimate' => 16.0,
                    'tags' => 'content,analysis,research',
                    'assigned_to' => $defaultAssignee->id,
                ],
                [
                    'title' => 'New Design System Creation',
                    'description' => 'Develop modern design system with components, colors, and typography.',
                    'task_type' => 'feature',
                    'priority' => 'high',
                    'status' => 'in_progress',
                    'due_date' => Carbon::now()->addDays(15),
                    'start_date' => Carbon::now()->subDays(10),
                    'time_estimate' => 28.0,
                    'tags' => 'design-system,components,branding',
                    'assigned_to' => $managerAssignee->id,
                ],
                [
                    'title' => 'Fix Responsive Layout Issues',
                    'description' => 'Fix mobile responsive layout issues on the homepage and contact page.',
                    'task_type' => 'bug',
                    'priority' => 'high',
                    'status' => 'todo',
                    'due_date' => Carbon::now()->addDays(3),
                    'start_date' => Carbon::now()->addDays(1),
                    'time_estimate' => 4.0,
                    'tags' => 'responsive,mobile,css',
                    'assigned_to' => $defaultAssignee->id,
                ],
                [
                    'title' => 'Optimize Page Load Speed',
                    'description' => 'Improve website performance by optimizing images, CSS, and JavaScript loading.',
                    'task_type' => 'improvement',
                    'priority' => 'medium',
                    'status' => 'todo',
                    'due_date' => Carbon::now()->addDays(25),
                    'start_date' => Carbon::now()->addDays(15),
                    'time_estimate' => 12.0,
                    'tags' => 'performance,optimization,speed',
                    'assigned_to' => $managerAssignee->id,
                ],
            ],

            // Data Analytics Dashboard Tasks
            'Data Analytics Dashboard' => [
                [
                    'title' => 'Requirements Gathering',
                    'description' => 'Meet with stakeholders to define analytics requirements and KPIs.',
                    'task_type' => 'feature',
                    'priority' => 'high',
                    'status' => 'completed',
                    'due_date' => Carbon::now()->subDays(5),
                    'start_date' => Carbon::now()->subDays(10),
                    'time_estimate' => 20.0,
                    'tags' => 'requirements,stakeholders,planning',
                    'assigned_to' => $managerAssignee->id,
                ],
                [
                    'title' => 'Data Source Integration',
                    'description' => 'Connect to various data sources and establish data pipelines.',
                    'task_type' => 'feature',
                    'priority' => 'high',
                    'status' => 'in_progress',
                    'due_date' => Carbon::now()->addDays(20),
                    'start_date' => Carbon::now()->subDays(3),
                    'time_estimate' => 40.0,
                    'tags' => 'data,integration,pipelines',
                    'assigned_to' => $defaultAssignee->id,
                ],
                [
                    'title' => 'Fix Data Sync Issue',
                    'description' => 'Resolve issue where data is not syncing properly from external APIs.',
                    'task_type' => 'bug',
                    'priority' => 'high',
                    'status' => 'todo',
                    'due_date' => Carbon::now()->addDays(2),
                    'start_date' => Carbon::now(),
                    'time_estimate' => 8.0,
                    'tags' => 'data,sync,api,bug',
                    'assigned_to' => $managerAssignee->id,
                ],
                [
                    'title' => 'Enhance Chart Interactivity',
                    'description' => 'Add more interactive features to charts like zoom, filter, and drill-down capabilities.',
                    'task_type' => 'improvement',
                    'priority' => 'medium',
                    'status' => 'todo',
                    'due_date' => Carbon::now()->addDays(35),
                    'start_date' => Carbon::now()->addDays(25),
                    'time_estimate' => 24.0,
                    'tags' => 'charts,interactivity,enhancement',
                    'assigned_to' => $defaultAssignee->id,
                ],
            ],
        ];

        $taskCount = 0;

        foreach ($projects as $project) {
            if (isset($taskTemplates[$project->name])) {
                $tasks = $taskTemplates[$project->name];
                
                foreach ($tasks as $taskData) {
                    Task::create([
                        'title' => $taskData['title'],
                        'description' => $taskData['description'],
                        'project_id' => $project->id,
                        'task_type' => $taskData['task_type'],
                        'priority' => $taskData['priority'],
                        'assigned_to' => $taskData['assigned_to'],
                        'status' => $taskData['status'],
                        'due_date' => $taskData['due_date'],
                        'start_date' => $taskData['start_date'],
                        'time_estimate' => $taskData['time_estimate'],
                        'tags' => $taskData['tags'],
                    ]);
                    $taskCount++;
                }
            } else {
                // Create generic tasks for projects without specific templates
                $genericTasks = [
                    [
                        'title' => 'Project Planning and Setup',
                        'description' => 'Initial project planning, requirement analysis, and setup.',
                        'task_type' => 'feature',
                        'priority' => 'high',
                        'status' => 'completed',
                        'due_date' => Carbon::now()->subDays(10),
                        'start_date' => Carbon::now()->subDays(15),
                        'time_estimate' => 16.0,
                        'tags' => 'planning,setup,requirements',
                        'assigned_to' => $managerAssignee->id,
                    ],
                    [
                        'title' => 'Development Phase 1',
                        'description' => 'First phase of development work.',
                        'task_type' => 'feature',
                        'priority' => 'high',
                        'status' => 'in_progress',
                        'due_date' => Carbon::now()->addDays(20),
                        'start_date' => Carbon::now()->subDays(5),
                        'time_estimate' => 40.0,
                        'tags' => 'development,phase1',
                        'assigned_to' => $defaultAssignee->id,
                    ],
                    [
                        'title' => 'Fix Critical Bug',
                        'description' => 'Resolve critical bug affecting core functionality.',
                        'task_type' => 'bug',
                        'priority' => 'high',
                        'status' => 'todo',
                        'due_date' => Carbon::now()->addDays(3),
                        'start_date' => Carbon::now()->addDays(1),
                        'time_estimate' => 8.0,
                        'tags' => 'bug,critical,hotfix',
                        'assigned_to' => $managerAssignee->id,
                    ],
                    [
                        'title' => 'Performance Optimization',
                        'description' => 'Improve system performance and user experience.',
                        'task_type' => 'improvement',
                        'priority' => 'medium',
                        'status' => 'todo',
                        'due_date' => Carbon::now()->addDays(30),
                        'start_date' => Carbon::now()->addDays(20),
                        'time_estimate' => 16.0,
                        'tags' => 'performance,optimization',
                        'assigned_to' => $defaultAssignee->id,
                    ],
                ];

                foreach ($genericTasks as $taskData) {
                    Task::create([
                        'title' => $taskData['title'],
                        'description' => $taskData['description'],
                        'project_id' => $project->id,
                        'task_type' => $taskData['task_type'],
                        'priority' => $taskData['priority'],
                        'assigned_to' => $taskData['assigned_to'],
                        'status' => $taskData['status'],
                        'due_date' => $taskData['due_date'],
                        'start_date' => $taskData['start_date'],
                        'time_estimate' => $taskData['time_estimate'],
                        'tags' => $taskData['tags'],
                    ]);
                    $taskCount++;
                }
            }
        }

        $this->command->info("Successfully created {$taskCount} sample tasks across {$projects->count()} projects.");
    }
}