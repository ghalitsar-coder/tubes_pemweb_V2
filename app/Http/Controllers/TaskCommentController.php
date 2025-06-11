<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskComment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Inertia\Inertia;

class TaskCommentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Get comments for a task
     */
    public function index(Task $task): JsonResponse
    {
        $this->authorize('view', $task);
        
        $comments = $task->comments()
            ->topLevel()
            ->with(['user', 'replies.user', 'replies.replies.user'])
            ->latest()
            ->get();

        return response()->json($comments);
    }

    /**
     * Store a new task comment
     */
    public function store(Request $request, Task $task)
    {
        $this->authorize('comment', $task);
        
        // Debug log
        \Log::info('TaskComment store request:', [
            'task_id' => $task->id,
            'content' => $request->content,
            'parent_id' => $request->parent_id,
            'has_image' => $request->hasFile('image')
        ]);
        
        $request->validate([
            'content' => 'required|string|max:2000',
            'parent_id' => [
                'nullable',
                'integer',
                function ($attribute, $value, $fail) use ($task) {
                    if ($value && !TaskComment::where('id', $value)->where('task_id', $task->id)->exists()) {
                        $fail('The selected parent comment is invalid.');
                    }
                },
            ],
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB limit
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            try {
                $uploadedFileUrl = Cloudinary::uploadApi()->upload($request->file('image')->getRealPath(), [
                    'folder' => 'task_comments',
                    'transformation' => [
                        'quality' => 'auto',
                        'fetch_format' => 'auto'
                    ]
                ]);
                
                $imagePath = $uploadedFileUrl['secure_url'];
            } catch (\Exception $e) {
                return back()->withErrors(['image' => 'Failed to upload image: ' . $e->getMessage()]);
            }
        }

        // Create the comment
        $comment = $task->comments()->create([
            'content' => $request->content,
            'user_id' => Auth::id(),
            'parent_id' => $request->parent_id,
            'image_path' => $imagePath,
        ]);

        // Load the comment with relationships and format data
        $comment->load(['user', 'replies.user']);
        $comment->time_ago = $comment->created_at->diffForHumans();
        $comment->formatted_date = $comment->created_at->format('M d, Y \a\t g:i A');

        // Return redirect back to refresh the page with updated comments
        return redirect()->back()->with('message', 'Comment added successfully');
    }

    /**
     * Update a task comment
     */
    public function update(Request $request, Task $task, TaskComment $comment)
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

        return redirect()->back()->with('message', 'Comment updated successfully');
    }

    /**
     * Delete a task comment
     */
    public function destroy(Task $task, TaskComment $comment)
    {
        // Check if user can delete this comment
        if (!$comment->canDelete(Auth::user())) {
            return back()->withErrors(['message' => 'Unauthorized']);
        }

        $comment->delete();

        return redirect()->back()->with('message', 'Comment deleted successfully');
    }
}
