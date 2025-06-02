<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectComment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'content',
        'project_id',
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

    // Relationship to Project
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    // Relationship to User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Parent comment relationship (for replies)
    public function parent(): BelongsTo
    {
        return $this->belongsTo(ProjectComment::class, 'parent_id');
    }

    // Child comments (replies)
    public function replies(): HasMany
    {
        return $this->hasMany(ProjectComment::class, 'parent_id')
               ->with(['user', 'replies'])
               ->orderBy('created_at', 'asc');
    }

    // Scope for getting only top-level comments (not replies)
    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id')
                    ->orderBy('created_at', 'desc');
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

        // If it's already a full URL (Cloudinary)
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

    // Helper method to check if comment is a reply
    public function isReply(): bool
    {
        return !is_null($this->parent_id);
    }

    // Helper method to get reply count
    public function getReplyCountAttribute(): int
    {
        return $this->replies()->count();
    }

    // Helper method to check if user can edit this comment
    public function canEdit(User $user): bool
    {
        return $this->user_id === $user->id;
    }

    // Helper method to check if user can delete this comment
    public function canDelete(User $user): bool
    {
        return $this->user_id === $user->id || $user->hasRole('admin');
    }
}
