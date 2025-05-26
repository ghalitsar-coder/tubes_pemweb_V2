<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DashboardController extends Controller
{
    use AuthorizesRequests;
    
    public function index()
    {
        // Check if user has permission to view dashboard
        $this->authorize('viewAny', Project::class); // Using project permission as dashboard access control
        $stats = [
            'activeProjects' => Project::where('status', 'active')->count(),
            'tasksDueSoon' => Task::where('due_date', '>=', now())
                ->where('due_date', '<=', now()->addDays(7))
                ->where('status', '!=', 'completed')
                ->count(),
            'completedTasks' => Task::where('status', 'completed')->count(),
            'teamMembers' => User::count(),
        ];

        $projectProgress = Project::where('status', 'active')
            ->get()
            ->map(function ($project) {
                $totalTasks = $project->tasks()->count();
                $completedTasks = $project->tasks()->where('status', 'completed')->count();
                $progress = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

                return [
                    'name' => $project->name,
                    'progress' => $progress,
                ];
            });

        $recentTasks = Task::with('project')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'project' => $task->project->name,
                    'dueDate' => $task->due_date->format('M d, Y'),
                    'status' => $task->status,
                ];
            });

        // Get upcoming deadlines (tasks due in the next 7 days)
        $upcomingDeadlines = Task::with('project')
            ->where('due_date', '>=', now())
            ->where('due_date', '<=', now()->addDays(7))
            ->where('status', '!=', 'completed')
            ->orderBy('due_date')
            ->take(5)
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'project' => $task->project->name,
                    'dueDate' => $task->due_date->format('M d, Y'),
                    'priority' => $task->priority ?? 'medium',
                ];
            });

        // If no upcoming deadlines, add some dummy data
        if ($upcomingDeadlines->isEmpty()) {
            $upcomingDeadlines = collect([
                [
                    'id' => 1,
                    'title' => 'Complete Project Documentation',
                    'project' => 'Website Redesign',
                    'dueDate' => now()->addDays(2)->format('M d, Y'),
                    'priority' => 'high',
                ],
                [
                    'id' => 2,
                    'title' => 'Review User Interface',
                    'project' => 'Mobile App Development',
                    'dueDate' => now()->addDays(3)->format('M d, Y'),
                    'priority' => 'medium',
                ],
                [
                    'id' => 3,
                    'title' => 'Client Meeting',
                    'project' => 'E-commerce Platform',
                    'dueDate' => now()->addDays(5)->format('M d, Y'),
                    'priority' => 'low',
                ],
            ]);
        }

        // Get team members using the role column from users table
        $teamMembers = User::get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => ucfirst(str_replace('_', ' ', $user->role)), // Convert team_member to Team Member
                    'avatar' => "https://ui-avatars.com/api/?name=" . urlencode($user->name),
                    'status' => 'offline', // Static status for now
                ];
            });

        // If no team members, add some dummy data
        if ($teamMembers->isEmpty()) {
            $teamMembers = collect([
                [
                    'id' => 1,
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                    'role' => 'Project Manager',
                    'avatar' => 'https://ui-avatars.com/api/?name=John+Doe',
                    'status' => 'online',
                ],
                [
                    'id' => 2,
                    'name' => 'Jane Smith',
                    'email' => 'jane@example.com',
                    'role' => 'Developer',
                    'avatar' => 'https://ui-avatars.com/api/?name=Jane+Smith',
                    'status' => 'away',
                ],
                [
                    'id' => 3,
                    'name' => 'Mike Johnson',
                    'email' => 'mike@example.com',
                    'role' => 'Designer',
                    'avatar' => 'https://ui-avatars.com/api/?name=Mike+Johnson',
                    'status' => 'offline',
                ],
            ]);
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'projectProgress' => $projectProgress,
            'recentTasks' => $recentTasks,
            'upcomingDeadlines' => $upcomingDeadlines,
            'teamMembers' => $teamMembers,
        ]);
    }
} 