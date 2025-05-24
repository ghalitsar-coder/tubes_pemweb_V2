<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with(['project', 'assignee']);

        // Apply filters if provided
        if ($request->has('status') && $request->status !== 'all') {
            if ($request->status === 'templates') {
                $query->whereHas('project', function ($q) {
                    $q->where('is_template', true);
                });
            } else {
                $query->where('status', $request->status);
            }
        }

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Paginate the results
        $tasks = $query->paginate(12)->through(function ($task) {
            return [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'priority' => $task->priority ?? 'medium',
                'progress' => $this->calculateTaskProgress($task),
                'start_date' => $task->created_at->format('Y-m-d'),
                'due_date' => $task->due_date,
                'is_template' => $task->project->is_template ?? false,
                'assignees' => $task->assignee ? [
                    [
                        'id' => $task->assignee->id,
                        'name' => $task->assignee->name,
                        'email' => $task->assignee->email,
                        'avatar' => $task->assignee->avatar ?? null,
                    ]
                ] : [],
                'tags' => [], // Will implement tag relationship later if needed
                'project' => [
                    'id' => $task->project->id,
                    'name' => $task->project->name,
                ],
            ];
        });

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'filters' => [
                'status' => $request->status,
                'search' => $request->search,
            ],
        ]);
    }

    private function calculateTaskProgress($task)
    {
        // Simple progress calculation based on status
        switch ($task->status) {
            case 'completed':
                return 100;
            case 'in-progress':
            case 'in_progress':
                return 50;
            case 'on-hold':
            case 'on_hold':
                return 25;
            case 'todo':
            default:
                return 0;
        }
    }

    public function create(Request $request)
    {
        $projectId = $request->query('project_id');
        $project = null;

        if ($projectId) {
            $project = Project::findOrFail($projectId);
        }

        return Inertia::render('Tasks/Create', [
            'users' => User::select('id', 'name')->get(),
            'projects' => Project::select('id', 'name')->get(),
            'selectedProject' => $project ? [
                'id' => $project->id,
                'name' => $project->name,
            ] : null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'status' => 'required|in:todo,in_progress,completed',
            'due_date' => 'required|date',
        ]);

        $task = Task::create($validated);

        return redirect()->route('tasks.show', $task)
            ->with('success', 'Task created successfully.');
    }

    public function show(Task $task)
    {
        $task->load(['project', 'assignee', 'comments.user', 'attachments.comments.user']);
        return Inertia::render('Tasks/Show', [
            'task' => $task,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function edit(Task $task)
    {
        $task->load(['project', 'assignee', 'comments.user', 'attachments.comments.user']);
        return Inertia::render('Tasks/Edit', [
            'task' => $task,
            'projects' => Project::all(),
            'users' => User::all(),
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'required|exists:users,id',
            'status' => 'required|in:todo,in_progress,completed',
            'due_date' => 'required|date',
        ]);

        $task->update($validated);

        return redirect()->route('tasks.index')
            ->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return redirect()->route('tasks.index')
            ->with('success', 'Task deleted successfully.');
    }
} 