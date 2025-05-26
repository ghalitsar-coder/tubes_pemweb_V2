<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests; // Tambahkan ini
use Illuminate\Support\Facades\Storage;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ProjectController extends Controller
{
    use AuthorizesRequests;
    public function __construct()
    {
        // Middleware is now handled in routes/web.php
    }    
    public function index()
    {
        $this->authorize('viewAny', Project::class);
        
        $projects = Project::with(['tasks.assignee'])
            ->get()
            ->map(function ($project) {
                // Calculate members count (unique assignees)
                $membersCount = $project->tasks
                    ->pluck('assignee.id')
                    ->filter()
                    ->unique()
                    ->count();

                // Calculate completed tasks count
                $completedTasksCount = $project->tasks
                    ->where('status', 'completed')
                    ->count();

                // Get recent tasks for preview (max 3)
                $recentTasks = $project->tasks
                    ->sortByDesc('created_at')
                    ->take(3)
                    ->map(function ($task) {
                        return [
                            'id' => $task->id,
                            'title' => $task->title,
                            'description' => $task->description,
                            'status' => $task->status,
                            'priority' => $task->priority ?? 'medium',
                            'due_date' => $task->due_date,
                            'assignee' => $task->assignee ? [
                                'id' => $task->assignee->id,
                                'name' => $task->assignee->name,
                                'email' => $task->assignee->email,
                                'avatar' => $task->assignee->avatar ?? null,
                            ] : null,
                        ];
                    })
                    ->values();

                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'description' => $project->description,
                    'start_date' => $project->start_date,
                    'end_date' => $project->end_date,
                    'progress' => $project->progress,
                    'status' => $project->status,
                    'budget' => $project->budget,
                    'spent_budget' => $project->spent_budget,
                    'category' => $project->category,
                    'tags' => $project->tags,
                    'members_count' => $membersCount,
                    'completed_tasks_count' => $completedTasksCount,
                    'total_tasks_count' => $project->tasks->count(),
                    'tasks' => $recentTasks,
                ];            });        
            return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }    public function create()
    {
        $this->authorize('create', Project::class);
        
        return Inertia::render('Projects/Create', [
            'users' => User::select('id', 'name','email')->get(),
        ]);
    }
      public function store(Request $request)
    {
        $this->authorize('create', Project::class);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'budget' => 'nullable|numeric|min:0',
            'spent_budget' => 'nullable|numeric|min:0',
            'progress' => 'nullable|integer|min:0|max:100',
            'status' => 'nullable|in:not_started,in_progress,on_hold,completed',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:255',
            'is_template' => 'boolean',
            'user_id' => 'required|exists:users,id',
        ]);

        // Set default values for create
        $validated['status'] = $validated['status'] ?? 'not_started';
        $validated['progress'] = $validated['progress'] ?? 0;
        $validated['spent_budget'] = $validated['spent_budget'] ?? 0;

        $project = Project::create($validated);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('project-attachments');
                $project->addAttachment(
                    $file->getClientOriginalName(),
                    $path,
                    $file->getMimeType()
                );
            }
        }

        return redirect()->route('projects.index')
            ->with('success', 'Project created successfully.');
    }    public function show(Project $project)
    {
        $this->authorize('view', $project);
        
        $project->load('tasks');
        return Inertia::render('Projects/Show', [
            'project' => $project,
        ]);
    }

    public function edit(Project $project)
    {        $this->authorize('update', $project);
        
        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'users' => User::select('id', 'name', 'email')->get(),
        ]);
    }    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:not_started,in_progress,on_hold,completed',
            'budget' => 'nullable|numeric|min:0',
            'spent_budget' => 'nullable|numeric|min:0',
            'progress' => 'nullable|integer|min:0|max:100',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:255',
            'is_template' => 'boolean',
            'user_id' => 'required|exists:users,id',
        ]);

        // Update project with validated data
        $project->update($validated);

        // Handle attachments if any
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('project-attachments');
                $project->addAttachment(
                    $file->getClientOriginalName(),
                    $path,
                    $file->getMimeType()
                );
            }
        }

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project updated successfully.');
    }    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);
        
        // Delete all attachments
        if ($project->attachments) {
            foreach ($project->attachments as $attachment) {
                Storage::delete($attachment['path']);
            }
        }

        $project->delete();
        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }

    public function addAttachment(Request $request, Project $project)
    {
        try {
            // Validate Cloudinary credentials
            if (!config('cloudinary.cloud') || !config('cloudinary.key') || !config('cloudinary.secret')) {
                throw new \Exception('Cloudinary credentials are not properly configured.');
            }

            $request->validate([
                'file' => 'required|file|max:10240', // 10MB max
            ]);

            $file = $request->file('file');
            \Log::info('File upload attempt', [
                'filename' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime' => $file->getMimeType()
            ]);
            
            // Upload to Cloudinary using storage driver
            $path = Storage::disk('cloudinary')->putFile('project-attachments', $file);
            \Log::info('File uploaded to Cloudinary', ['path' => $path]);
            
            $project->addAttachment(
                $file->getClientOriginalName(),
                $path,
                $file->getMimeType()
            );
            \Log::info('Attachment added to project', [
                'project_id' => $project->id,
                'attachments' => $project->attachments
            ]);

            // Load the project with its attachments
            $project->load('attachments');
            \Log::info('Project loaded with attachments', [
                'project_id' => $project->id,
                'attachments_count' => count($project->attachments)
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'project' => $project,
                    'message' => 'File attached successfully.'
                ]);
            }

            return back()->with([
                'project' => $project,
                'success' => 'File attached successfully.'
            ]);
        } catch (\Exception $e) {
            \Log::error('File upload failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'error' => 'Failed to upload file: ' . $e->getMessage()
                ], 500);
            }

            return back()->with('error', 'Failed to upload file: ' . $e->getMessage());
        }
    }

    public function removeAttachment(Project $project, int $index)
    {
        try {
            $attachments = $project->attachments;
            if (isset($attachments[$index])) {
                // Delete from Cloudinary
                Storage::disk('cloudinary')->delete($attachments[$index]['path']);
                
                $project->removeAttachment($index);
                return back()->with('success', 'File removed successfully.');
            }

            return back()->with('error', 'File not found.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete file: ' . $e->getMessage());
        }
    }

    public function addTag(Request $request, Project $project)
    {
        $request->validate([
            'tag' => 'required|string|max:255',
        ]);

        $project->addTag($request->tag);
        return back()->with('success', 'Tag added successfully.');
    }

    public function removeTag(Project $project, string $tag)
    {
        $project->removeTag($tag);
        return back()->with('success', 'Tag removed successfully.');
    }

    public function duplicateAsTemplate(Project $project)
    {
        $template = $project->duplicateAsTemplate();
        return redirect()->route('projects.show', $template)
            ->with('success', 'Project duplicated as template successfully.');
    }

    public function updateBudget(Request $request, Project $project)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        $project->updateSpentBudget($request->amount);
        return back()->with('success', 'Budget updated successfully.');
    }    public function calculateProgress(Project $project)
    {
        $project->calculateProgress();
        return back()->with('success', 'Project progress updated successfully.');
    }
}