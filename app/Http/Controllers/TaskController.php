<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TaskController extends Controller
{
    use AuthorizesRequests;
    
    public function index(Request $request)
    {
        $this->authorize('viewAny', Task::class);
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
        $tasks = $query->paginate(50)->through(function ($task) {
            return [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'priority' => $task->priority ?? 'medium',
                'progress' => $this->calculateTaskProgress($task),
                'start_date' => $task->start_date,
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
            case 'in_progress':
                return 50;
            case 'on_hold':
                return 25;
            case 'todo':
            default:
                return 0;
        }
    }

    public function create(Request $request)
    {
        $this->authorize('create', Task::class);
        
        $projectId = $request->query('project_id');
        $project = null;

        if ($projectId) {
            $project = Project::findOrFail($projectId);
        }

        // Get recent tasks for the current user
        $recentTasks = Task::with(['project', 'assignee'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'description' => $task->description,
                    'status' => $task->status,
                    'priority' => $task->priority ?? 'medium',
                    'progress' => $this->calculateTaskProgress($task),
                    'start_date' => $task->created_at->format('Y-m-d'),
                    'due_date' => $task->due_date,
                    'time_estimate' => 0, // Add default for now
                    'assignees' => $task->assignee ? [
                        [
                            'id' => $task->assignee->id,
                            'name' => $task->assignee->name,
                            'email' => $task->assignee->email,
                        ]
                    ] : [],
                    'tags' => [], // Add empty array for now
                    'project' => [
                        'id' => $task->project->id,
                        'name' => $task->project->name,
                    ],
                    'created_at' => $task->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Tasks/Create', [
            'users' => User::select('id', 'name', 'email')->get(),
            'projects' => Project::select('id', 'name')->get(),
            'recentTasks' => $recentTasks,
            'selectedProject' => $project ? [
                'id' => $project->id,
                'name' => $project->name,
            ] : null,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Task::class);
        
        // Debug: Log incoming request data
        \Log::info('Task store request data:', $request->all());
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'project_id' => 'required|exists:projects,id',
            'task_type' => 'nullable|string|in:feature,bug,improvement',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'required|date',
            'start_date' => 'nullable|date',
            'time_estimate' => 'nullable|numeric|min:0',
            'tags' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,on_hold,completed',
            'dependencies' => 'nullable|array',
            'dependencies.*' => 'integer|exists:tasks,id',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:10240', // 10MB max per file
        ]);

        // Remove attachments from main data since we'll handle them separately
        $attachments = $validated['attachments'] ?? [];
        unset($validated['attachments'], $validated['dependencies']);

        // Debug: Log validated data before creating task
        \Log::info('Validated task data before create:', $validated);

        $task = Task::create($validated);

        // Handle file attachments if any
        if (!empty($attachments)) {
            foreach ($attachments as $file) {
                $filename = $file->getClientOriginalName();
                $path = $file->store('task-attachments', 'public');
                $task->addAttachment($filename, $path, $file->getClientMimeType());
            }
        }

        return redirect()->route('tasks.show', $task)
            ->with('success', 'Task created successfully.');
    }

    public function show(Task $task)
    {
        // Check if user can view this task
        if (!auth()->user()->can('view', $task)) {
            return redirect()->route('tasks.index')
                ->with('error', 'You do not have permission to view this task.');
        }
        
        $task->load(['project', 'assignee', 'comments.user', 'attachments.comments.user']);
        
        // Check if user can update this specific task
        $canUpdate = auth()->user()->can('update', $task);
        $canComment = auth()->user()->can('comment', $task);
        
        return Inertia::render('Tasks/ShowNew', [
            'task' => $task,
            'permissions' => [
                'canUpdate' => $canUpdate,
                'canComment' => $canComment,
                'canDelete' => auth()->user()->can('delete', $task),
            ]
        ]);
    }

    public function edit(Task $task)
    {
        // Check if user can update this task
        if (!auth()->user()->can('update', $task)) {
            return redirect()->route('tasks.index')
                ->with('error', 'You can only edit tasks that are assigned to you.');
        }
        
        $task->load(['project', 'assignee', 'comments.user', 'attachments.comments.user']);
        return Inertia::render('Tasks/Edit', [
            'task' => $task,
            'projects' => Project::all(),
            'users' => User::all(),
        ]);
    }

  public function update(Request $request, Task $task)
    {
        // Check if user can update this task
        if (!auth()->user()->can('update', $task)) {
            return back()->with('error', 'You can only update tasks that are assigned to you.');
        }
        
        // Debug: Log incoming request data
        \Log::info('Task update request data:', $request->all());
        \Log::info('Task being updated:', ['id' => $task->id, 'title' => $task->title]);


        // Validasi data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'task_type' => 'required|in:feature,bug,task',
            'priority' => 'required|in:low,medium,high',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
            'start_date' => 'nullable|date',
            'time_estimate' => 'nullable|integer',
            'tags' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,on_hold,completed',
            'dependencies' => 'nullable|array',
            'dependencies.*' => 'exists:tasks,id',
            'existing_attachments' => 'nullable|array',
            'existing_attachments.*' => 'exists:task_attachments,id',
            'attachments.*' => 'nullable|file|mimes:jpg,png,pdf|max:2048',
        ]);

        // Update task
        $task->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'project_id' => $validated['project_id'],
            'task_type' => $validated['task_type'],
            'priority' => $validated['priority'],
            'assigned_to' => $validated['assigned_to'],
            'due_date' => $validated['due_date'],
            'start_date' => $validated['start_date'],
        ]);

        \Log::info('Validated task data before update:', $validated);

        $task->update($validated);

        // Menangani attachment baru
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                try {
                    $uploadedFile = Cloudinary::upload($file->getRealPath(), [
                        'folder' => 'task_attachments',
                        'resource_type' => 'auto',
                    ]);

                    $task->attachments()->create([
                        'task_id' => $task->id,
                        'filename' => $file->getClientOriginalName(),
                        'path' => $uploadedFile->getSecurePath(),
                        'type' => $uploadedFile->getResourceType(),
                        'public_id' => $uploadedFile->getPublicId(), // Simpan public_id
                        'uploaded_at' => now(),
                    ]);
                } catch (\Exception $e) {
                    \Log::error('Cloudinary upload failed: ' . $e->getMessage());
                    return back()->withErrors(['attachments' => 'Failed to upload file to Cloudinary']);
                }
            }
        }

        // Menangani existing_attachments
        if ($request->has('existing_attachments')) {
            $existingIds = $request->input('existing_attachments', []);
            $task->attachments()->whereNotIn('id', $existingIds)->delete();
        }

        return redirect()->route('tasks.show', $task->id)->with('success', 'Task updated successfully');
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        
        $task->delete();

        return redirect()->route('tasks.index')
            ->with('success', 'Task deleted successfully.');
    }

    public function updateStatus(Request $request, Task $task)
    {
        // Check if user can update this task instead of throwing 403
        if (!auth()->user()->can('update', $task)) {
            return back()->with('error', 'You can only update status for tasks that are assigned to you.');
        }
        
        $validated = $request->validate([
            'status' => 'required|in:todo,in_progress,on_hold,completed',
        ]);

        $task->update(['status' => $validated['status']]);

        return back()->with('success', 'Task status updated successfully');
    }
}