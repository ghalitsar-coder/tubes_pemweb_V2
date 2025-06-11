<?php

namespace App\Console\Commands;

use App\Models\Comment;
use Illuminate\Console\Command;

class CleanupTaskComments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:cleanup-task-comments {--force : Force deletion without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove task comments from the generic comments table after migration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Cleaning up task comments from generic comments table...');

        // Get all comments that belong to tasks
        $taskComments = Comment::whereNotNull('task_id')->get();

        if ($taskComments->isEmpty()) {
            $this->info('No task comments found in the generic comments table.');
            return 0;
        }

        $this->info("Found {$taskComments->count()} task comments to remove from generic table.");

        if (!$this->option('force')) {
            if (!$this->confirm('Are you sure you want to delete these comments from the generic comments table? This action cannot be undone.')) {
                $this->info('Operation cancelled.');
                return 0;
            }
        }

        $deleted = 0;
        $errors = 0;

        foreach ($taskComments as $comment) {
            try {
                $comment->forceDelete(); // Permanently delete
                $deleted++;
                $this->line("Deleted comment ID {$comment->id}");
            } catch (\Exception $e) {
                $errors++;
                $this->error("Failed to delete comment ID {$comment->id}: " . $e->getMessage());
            }
        }

        $this->info("Cleanup completed!");
        $this->info("Successfully deleted: {$deleted} comments");
        if ($errors > 0) {
            $this->error("Failed to delete: {$errors} comments");
        }

        return 0;
    }
}
