<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Storage;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'user_id',
        'start_date',
        'end_date',
        'progress',
        'status',
        'budget',
        'spent_budget',
        'category',
        'tags',
        'is_template',
        'attachments',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'progress' => 'integer',
        'budget' => 'decimal:2',
        'spent_budget' => 'decimal:2',
        'tags' => 'array',
        'attachments' => 'array',
        'is_template' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(ProjectComment::class);
    }

    // Project Members Relationships
    public function members()
    {
        return $this->belongsToMany(User::class, 'project_members')
                    ->withPivot(['role', 'joined_at'])
                    ->withTimestamps()
                    ->orderBy('project_members.created_at');
    }

    public function projectMembers(): HasMany
    {
        return $this->hasMany(ProjectMember::class);
    }

    // Helper methods for member management
    public function addMember(User $user, string $role = 'member'): void
    {
        if (!$this->hasMember($user)) {
            $this->members()->attach($user->id, [
                'role' => $role,
                'joined_at' => now(),
            ]);
        }
    }

    public function removeMember(User $user): void
    {
        $this->members()->detach($user->id);
    }

    public function hasMember(User $user): bool
    {
        return $this->members()->where('user_id', $user->id)->exists();
    }

    public function getMemberRole(User $user): ?string
    {
        $member = $this->members()->where('user_id', $user->id)->first();
        return $member ? $member->pivot->role : null;
    }

    public function getAvailableUsersForTasks()
    {
        // Return only project members for task assignment
        return $this->members()->select('users.id', 'users.name', 'users.email')->get();
    }

    public function getTasksCountAttribute(): int
    {
        return $this->tasks()->count();
    }

    public function getCompletedTasksCountAttribute(): int
    {
        return $this->tasks()->where('status', 'completed')->count();
    }

    public function getMembersCountAttribute(): int
    {
        return $this->members()->count();
    }

    public function calculateProgress(): void
    {
        $totalTasks = $this->tasks()->count();
        if ($totalTasks === 0) {
            $this->progress = 0;
            return;
        }

        $completedTasks = $this->tasks()->where('status', 'completed')->count();
        $this->progress = (int) (($completedTasks / $totalTasks) * 100);
        $this->save();
    }

    public function updateSpentBudget(float $amount): void
    {
        $this->spent_budget += $amount;
        $this->save();
    }

    public function getBudgetStatus(): string
    {
        if (!$this->budget) {
            return 'No budget set';
        }

        $percentage = ($this->spent_budget / $this->budget) * 100;
        
        if ($percentage >= 100) {
            return 'Over budget';
        } elseif ($percentage >= 80) {
            return 'Near budget limit';
        } else {
            return 'Within budget';
        }
    }

    public function addAttachment(string $filename, string $path, string $type): void
    {
        $attachments = $this->attachments ?? [];
        
        $attachments[] = [
            'filename' => $filename,
            'path' => $path,
            'type' => $type,
            'uploaded_at' => now()->toIso8601String(),
        ];
        $this->attachments = $attachments;
        $this->save();
    }

    public function removeAttachment(int $index): void
    {
        $attachments = $this->attachments ?? [];
        if (isset($attachments[$index])) {
            // Delete from Cloudinary
            Storage::disk('cloudinary')->delete($attachments[$index]['path']);
            
            unset($attachments[$index]);
            $this->attachments = array_values($attachments);
            $this->save();
        }
    }

    public function addTag(string $tag): void
    {
        $tags = $this->tags ?? [];
        if (!in_array($tag, $tags)) {
            $tags[] = $tag;
            $this->tags = $tags;
            $this->save();
        }
    }

    public function removeTag(string $tag): void
    {
        $tags = $this->tags ?? [];
        $this->tags = array_values(array_diff($tags, [$tag]));
        $this->save();
    }

    public function duplicateAsTemplate(): Project
    {
        $template = $this->replicate();
        $template->name = $template->name . ' (Template)';
        $template->is_template = true;
        $template->progress = 0;
        $template->status = 'not_started';
        $template->spent_budget = 0;
        $template->attachments = null;
        $template->save();

        // Duplicate tasks
        foreach ($this->tasks as $task) {
            $newTask = $task->replicate();
            $newTask->project_id = $template->id;
            $newTask->status = 'todo';
            $newTask->save();
        }

        return $template;
    }
}