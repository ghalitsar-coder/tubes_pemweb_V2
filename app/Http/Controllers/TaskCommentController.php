<?php

namespace App\Http\Controllers;

use App\Models\TaskComment;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaskCommentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Task $task)
    {
        $comments = $task->comments()
            ->topLevel()
            ->with(['user', 'replies.user'])
            ->latest()
            ->get();

        return response()->json($comments);
    }

    public function store(Request $request, Task $task)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'parent_id' => 'nullable|exists:task_comments,id',
            'image_path' => 'nullable|string',
        ]);

        $comment = $task->comments()->create([
            'content' => $validated['content'],
            'user_id' => Auth::id(),
            'parent_id' => $validated['parent_id'] ?? null,
            'image_path' => $validated['image_path'] ?? null,
        ]);

        $comment->load(['user', 'replies.user']);

        return back()->with('success', 'Comment added successfully');
    }

    public function update(Request $request, Task $task, TaskComment $comment)
    {
        if ($comment->user_id !== Auth::id()) {
            abort(403, 'Unauthorized to edit this comment');
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update($validated);

        return back()->with('success', 'Comment updated successfully');
    }

    public function destroy(Task $task, TaskComment $comment)
    {
        if ($comment->user_id !== Auth::id()) {
            abort(403, 'Unauthorized to delete this comment');
        }

        $comment->delete();

        return back()->with('success', 'Comment deleted successfully');
    }
}
