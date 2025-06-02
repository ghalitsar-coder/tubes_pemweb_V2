<?php

namespace App\Console\Commands;

use App\Models\Comment;
use App\Models\TaskComment;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrateTaskComments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:task-comments';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate task comments from comments table to task_comments table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting migration of task comments...');

        // Get all comments that belong to tasks
        $taskComments = Comment::whereNotNull('task_id')->get();

        if ($taskComments->isEmpty()) {
            $this->info('No task comments found to migrate.');
            return 0;
        }

        $this->info("Found {$taskComments->count()} task comments to migrate.");

        $migrated = 0;
        $errors = 0;

        foreach ($taskComments as $comment) {
            try {
                // Check if already migrated
                $exists = TaskComment::where('id', $comment->id)->exists();
                if ($exists) {
                    $this->line("Comment ID {$comment->id} already exists in task_comments table, skipping...");
                    continue;
                }

                // Create new TaskComment record
                TaskComment::create([
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'task_id' => $comment->task_id,
                    'user_id' => $comment->user_id,
                    'parent_id' => $comment->parent_id,
                    'image_path' => $comment->image_path,
                    'created_at' => $comment->created_at,
                    'updated_at' => $comment->updated_at,
                    'deleted_at' => $comment->deleted_at,
                ]);

                $migrated++;
                $this->line("Migrated comment ID {$comment->id}");

            } catch (\Exception $e) {
                $errors++;
                $this->error("Failed to migrate comment ID {$comment->id}: " . $e->getMessage());
            }
        }

        $this->info("Migration completed!");
        $this->info("Successfully migrated: {$migrated} comments");
        if ($errors > 0) {
            $this->error("Failed to migrate: {$errors} comments");
        }

        if ($migrated > 0) {
            $this->info("\nNext steps:");
            $this->line("1. Test that task comments work correctly with the new table");
            $this->line("2. If everything works, you can remove task-related comments from the generic comments table");
            $this->line("3. Run: php artisan migrate:cleanup-task-comments");
        }

        return 0;
    }
}
