<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    use HasFactory;    protected $fillable = [
        'title',
        'description',
        'project_id',
        'task_type',
        'priority',
        'assigned_to',
        'status',
        'due_date',
        'start_date',
        'time_estimate',
        'tags',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(TaskAttachment::class);
    }

    public function addAttachment($filename, $path, $type)
    {
        return $this->attachments()->create([
            'filename' => $filename,
            'path' => $path,
            'type' => $type,
            'uploaded_at' => now(),
        ]);
    }
} 