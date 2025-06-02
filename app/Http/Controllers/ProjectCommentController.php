<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectComment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Inertia\Inertia;

class ProjectCommentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Get comments for a project
     */
    public function index(Project $project): JsonResponse
    {
        $this->authorize('view', $project);
        
        $comments = $project->comments()
            ->topLevel()
            ->with(['user', 'replies.user', 'replies.replies.user'])
            ->latest()
            ->get();

        return response()->json($comments);
    }    /**
     * Store a new project comment
     */    public function store(Request $request, Project $project)
    {
        $this->authorize('comment', $project);
        
        // Debug log
        \Log::info('ProjectComment store request:', [
            'project_id' => $project->id,
            'content' => $request->content,
            'parent_id' => $request->parent_id,
            'has_image' => $request->hasFile('image')
        ]);
        
        $request->validate([
            'content' => 'required|string|max:2000',
            'parent_id' => [
                'nullable',
                'exists:project_comments,id',
                function ($attribute, $value, $fail) use ($project) {
                    if ($value) {
                        $parentComment = \App\Models\ProjectComment::find($value);
                        if (!$parentComment || $parentComment->project_id !== $project->id) {
                            $fail('The selected parent comment does not belong to this project.');
                        }
                    }
                }
            ],
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // Max 5MB
        ]);

        $imagePath = null;

        // Handle image upload to Cloudinary
        if ($request->hasFile('image')) {
            try {
                $uploadedFileUrl = Cloudinary::upload($request->file('image')->getRealPath(), [
                    'folder' => 'project_comments',
                    'transformation' => [
                        'quality' => 'auto',
                        'fetch_format' => 'auto'
                    ]
                ])->getSecurePath();
                
                $imagePath = $uploadedFileUrl;
            } catch (\Exception $e) {
                return back()->withErrors(['image' => 'Failed to upload image: ' . $e->getMessage()]);
            }
        }

        // Create the comment
        $comment = $project->comments()->create([
            'content' => $request->content,
            'user_id' => Auth::id(),
            'parent_id' => $request->parent_id,
            'image_path' => $imagePath,
        ]);

        // Load the comment with relationships
        $comment->load(['user', 'replies.user']);

        // Return back with success message and the new comment
        return back()->with([
            'message' => 'Comment added successfully',
            'comment' => $comment
        ]);
    }    /**
     * Update a project comment
     */
    public function update(Request $request, Project $project, ProjectComment $comment)
    {
        // Check if user can edit this comment
        if (!$comment->canEdit(Auth::user())) {
            return back()->withErrors(['message' => 'Unauthorized']);
        }

        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $comment->update([
            'content' => $request->content,
        ]);

        return back()->with([
            'message' => 'Comment updated successfully',
            'comment' => $comment->load(['user', 'replies.user'])
        ]);
    }

    /**
     * Delete a project comment
     */
    public function destroy(Project $project, ProjectComment $comment)
    {
        // Check if user can delete this comment
        if (!$comment->canDelete(Auth::user())) {
            return back()->withErrors(['message' => 'Unauthorized']);
        }

        $comment->delete();

        return back()->with([
            'message' => 'Comment deleted successfully'
        ]);
    }

    /**
     * Reply to a comment
     */
    public function reply(Request $request, Project $project, ProjectComment $comment): JsonResponse
    {
        $this->authorize('comment', $project);
        
        $request->validate([
            'content' => 'required|string|max:2000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $imagePath = null;

        // Handle image upload for reply
        if ($request->hasFile('image')) {
            try {
                $uploadedFileUrl = Cloudinary::upload($request->file('image')->getRealPath(), [
                    'folder' => 'project_comments',
                    'transformation' => [
                        'quality' => 'auto',
                        'fetch_format' => 'auto'
                    ]
                ])->getSecurePath();
                
                $imagePath = $uploadedFileUrl;
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Failed to upload image: ' . $e->getMessage()
                ], 500);
            }
        }

        // Create reply
        $reply = ProjectComment::create([
            'content' => $request->content,
            'project_id' => $project->id,
            'user_id' => Auth::id(),
            'parent_id' => $comment->id,
            'image_path' => $imagePath,
        ]);

        $reply->load(['user']);

        return response()->json([
            'message' => 'Reply added successfully',
            'reply' => $reply
        ], 201);
    }
}
