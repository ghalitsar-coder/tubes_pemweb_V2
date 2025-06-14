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
    }      public function store(Request $request)
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
            'members' => 'nullable|array',
            'members.*' => 'exists:users,id',
            'member_roles' => 'nullable|array',
            'member_roles.*' => 'in:member,lead,contributor',
        ]);

        // Set default values for create
        $validated['status'] = $validated['status'] ?? 'not_started';
        $validated['progress'] = $validated['progress'] ?? 0;
        $validated['spent_budget'] = $validated['spent_budget'] ?? 0;

        $project = Project::create($validated);

        // Add project creator as a member with 'lead' role
        $project->addMember(User::find($validated['user_id']), 'lead');        // Add other members if provided
        if (!empty($validated['members'])) {
            foreach ($validated['members'] as $index => $userId) {
                $role = $validated['member_roles'][$index] ?? 'member';
                $user = User::find($userId);
                if ($user && $user->id !== $validated['user_id']) { // Don't add creator twice
                    $project->addMember($user, $role);
                }
            }
        }

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                // Upload to Cloudinary using storage driver (same as addAttachment method)
                $path = Storage::disk('cloudinary')->putFile('project-attachments', $file);
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
          $project->load([
            'tasks', 
            'comments.user', 
            'comments.replies.user',
            'members' => function($query) {
                $query->select('users.id', 'users.name', 'users.email')
                      ->withPivot('role');
            }
        ]);
          // Format comments for the frontend (only top-level comments, replies are loaded with them)
        $formattedComments = $project->comments
            ->whereNull('parent_id') // Only get top-level comments
            ->map(function ($comment) {
            return [
                'id' => $comment->id,
                'content' => $comment->content,
                'image_path' => $comment->image_path,
                'created_at' => $comment->created_at->toISOString(),
                'updated_at' => $comment->updated_at->toISOString(),
                'parent_id' => $comment->parent_id,
                'user' => [
                    'id' => $comment->user->id,
                    'name' => $comment->user->name,
                    'email' => $comment->user->email,
                    'avatar' => $comment->user->avatar ?? null,
                ],
                'replies' => $comment->replies->map(function ($reply) {
                    return [
                        'id' => $reply->id,
                        'content' => $reply->content,
                        'image_path' => $reply->image_path,
                        'created_at' => $reply->created_at->toISOString(),
                        'updated_at' => $reply->updated_at->toISOString(),
                        'parent_id' => $reply->parent_id,
                        'user' => [
                            'id' => $reply->user->id,
                            'name' => $reply->user->name,
                            'email' => $reply->user->email,
                            'avatar' => $reply->user->avatar ?? null,
                        ],
                        'time_ago' => $reply->created_at->diffForHumans(),
                        'formatted_date' => $reply->created_at->format('M d, Y \a\t g:i A'),
                    ];
                }),
                'time_ago' => $comment->created_at->diffForHumans(),
                'formatted_date' => $comment->created_at->format('M d, Y \a\t g:i A'),
            ];
        });
        
        return Inertia::render('Projects/Show', [
            'project' => array_merge($project->toArray(), [
                'comments' => $formattedComments,
            ]),
        ]);
    }    public function edit(Project $project)
    {        $this->authorize('update', $project);
        
        // Load members with their roles
        $project->load(['members' => function($query) {
            $query->select('users.id', 'users.name', 'users.email')
                  ->withPivot('role');
        }]);
        
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
            'members' => 'nullable|array',
            'members.*' => 'exists:users,id',
            'member_roles' => 'nullable|array',
            'member_roles.*' => 'in:member,lead,contributor',
        ]);

        // Update project with validated data
        $project->update($validated);

        // Update project members if provided
        if (isset($validated['members'])) {
            // Remove all existing members except the project creator
            $project->members()->wherePivot('user_id', '!=', $project->user_id)->detach();
            
            // Add new members
            foreach ($validated['members'] as $index => $userId) {
                $role = $validated['member_roles'][$index] ?? 'member';
                $user = User::find($userId);
                if ($user && $user->id !== $project->user_id) { // Don't add creator again
                    $project->addMember($user, $role);
                }
            }
        }        // Handle attachments if any
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                // Upload to Cloudinary using storage driver (same as addAttachment method)
                $path = Storage::disk('cloudinary')->putFile('project-attachments', $file);
                $project->addAttachment(
                    $file->getClientOriginalName(),
                    $path,
                    $file->getMimeType()
                );
            }
        }

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project updated successfully.');
    }public function destroy(Project $project)
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
            );            \Log::info('Attachment added to project', [
                'project_id' => $project->id,
                'attachments' => $project->attachments
            ]);

            // Refresh the project instance to get updated data
            $project->refresh();
            \Log::info('Project refreshed with attachments', [
                'project_id' => $project->id,
                'attachments_count' => count($project->attachments ?? [])
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

    // Project Members Management Methods
    public function addMember(Request $request, Project $project)
    {
        $this->authorize('update', $project);
        
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:member,lead,contributor',
        ]);

        $user = User::find($request->user_id);
        
        if ($project->hasMember($user)) {
            return back()->with('error', 'User is already a member of this project.');
        }

        $project->addMember($user, $request->role);
        
        return back()->with('success', 'Member added successfully.');
    }

    public function removeMember(Request $request, Project $project)
    {
        $this->authorize('update', $project);
        
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::find($request->user_id);
        
        // Prevent removing the project creator
        if ($user->id === $project->user_id) {
            return back()->with('error', 'Cannot remove the project creator.');
        }

        $project->removeMember($user);
        
        return back()->with('success', 'Member removed successfully.');
    }

    public function updateMemberRole(Request $request, Project $project)
    {
        $this->authorize('update', $project);
        
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:member,lead,contributor',
        ]);

        $user = User::find($request->user_id);
        
        if (!$project->hasMember($user)) {
            return back()->with('error', 'User is not a member of this project.');
        }

        // Update member role
        $project->members()->updateExistingPivot($user->id, ['role' => $request->role]);
        
        return back()->with('success', 'Member role updated successfully.');
    }

    public function getAvailableUsers(Project $project)
    {
        $this->authorize('view', $project);
        
        // Get users that are not already members of this project
        $existingMemberIds = $project->members()->pluck('user_id')->toArray();
        $availableUsers = User::whereNotIn('id', $existingMemberIds)
                             ->select('id', 'name', 'email')
                             ->get();
        
        return response()->json($availableUsers);
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