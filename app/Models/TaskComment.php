<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskComment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'content',
        'task_id',
        'user_id',
        'parent_id',
        'image_path',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $with = ['user', 'replies'];

    // Relationship to Task
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    // Relationship to User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Parent comment relationship (for replies)
    public function parent(): BelongsTo
    {
        return $this->belongsTo(TaskComment::class, 'parent_id');
    }

    // Child comments (replies)
    public function replies(): HasMany
    {
        return $this->hasMany(TaskComment::class, 'parent_id')->with(['user', 'replies']);
    }

    // Scope for getting only top-level comments (not replies)
    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }

    // Helper method to check if comment has image
    public function hasImage(): bool
    {
        return !empty($this->image_path);
    }

    // Helper method to get full image URL
    public function getImageUrl(): ?string
    {
        if (!$this->hasImage()) {
            return null;
        }

        // If it's a Cloudinary URL
        if (str_starts_with($this->image_path, 'http')) {
            return $this->image_path;
        }

        // Build Cloudinary URL
        $cloudName = config('cloudinary.cloud_name', 'dtpflpunp');
        return "https://res.cloudinary.com/{$cloudName}/image/upload/{$this->image_path}";
    }

    // Helper method to format time ago
    public function getTimeAgoAttribute(): string
    {
        return $this->created_at->diffForHumans();
    }

    // Helper method to get full formatted date
    public function getFormattedDateAttribute(): string
    {
        return $this->created_at->format('M j, Y \a\t g:i A');
    }
}
