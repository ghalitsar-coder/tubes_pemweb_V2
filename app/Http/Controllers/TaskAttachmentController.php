<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskAttachment;
use App\Models\TaskAttachmentComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class TaskAttachmentController extends Controller
{    public function store(Request $request, Task $task)
    {
        try {
            $request->validate([
                'file' => 'required|file|max:10240', // 10MB max
            ]);

            $file = $request->file('file');
            
            // Upload to Cloudinary directly using API
            $uploadedFile = Cloudinary::uploadApi()->upload($file->getRealPath(), [
                'folder' => 'task_attachments',
                'resource_type' => 'auto',
            ]);

            $attachment = $task->attachments()->create([
                'task_id' => $task->id,
                'filename' => $file->getClientOriginalName(),
                'path' => $uploadedFile['secure_url'],
                'type' => $uploadedFile['resource_type'],
                'public_id' => $uploadedFile['public_id'],
                'uploaded_at' => now(),
            ]);

            // Load the task with its attachments and comments
            $task->load(['attachments.comments.user']);

            return back()->with([
                'task' => $task,
                'success' => 'File attached successfully.'
            ]);
        } catch (\Exception $e) {
            \Log::error('File upload failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Failed to upload file: ' . $e->getMessage());
        }
    }

    public function destroy(Task $task, TaskAttachment $attachment)
    {
        if ($attachment->task_id !== $task->id) {
            abort(404);
        }

        $attachment->delete();

        return back();
    }

    public function storeComment(Request $request, Task $task, TaskAttachment $attachment)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        if ($attachment->task_id !== $task->id) {
            abort(404);
        }

        $comment = $attachment->comments()->create([
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        return response()->json($comment->load('user'));
    }
} 