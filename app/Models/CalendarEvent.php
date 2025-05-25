<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class CalendarEvent extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'event_date',
        'start_time',
        'end_time',
        'event_type',
        'status',
        'color_theme',
        'is_all_day',
        'attendees',
        'location',
        'notes',
        'priority',
        'is_recurring',
        'recurrence_settings',
        'reminder_at',
        'reminder_sent',
        'user_id',
        'project_id',
        'task_id',
    ];    protected $casts = [
        'event_date' => 'date',
        'attendees' => 'array',
        'recurrence_settings' => 'array',
        'is_all_day' => 'boolean',
        'is_recurring' => 'boolean',
        'reminder_sent' => 'boolean',
        'reminder_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    // Scopes
    public function scopeUpcoming($query, $days = 7)
    {
        return $query->where('event_date', '>=', now()->toDateString())
                    ->where('event_date', '<=', now()->addDays($days)->toDateString())
                    ->where('status', 'scheduled')
                    ->orderBy('event_date')
                    ->orderBy('start_time');
    }

    public function scopeForMonth($query, $year, $month)
    {
        return $query->whereYear('event_date', $year)
                    ->whereMonth('event_date', $month);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId)
                    ->orWhereJsonContains('attendees', $userId);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('event_type', $type);
    }

    // Accessors & Mutators
    public function getFormattedDateAttribute(): string
    {
        return $this->event_date->format('M j, Y');
    }

    public function getFormattedTimeAttribute(): string
    {
        if ($this->is_all_day) {
            return 'All day';
        }

        $start = $this->start_time ? Carbon::parse($this->start_time)->format('g:i A') : '';
        $end = $this->end_time ? Carbon::parse($this->end_time)->format('g:i A') : '';

        if ($start && $end) {
            return "{$start} - {$end}";
        }

        return $start ?: $end ?: '';
    }

    public function getColorClassAttribute(): string
    {
        $colorMap = [
            'blue' => 'bg-blue-100 text-blue-800',
            'purple' => 'bg-purple-100 text-purple-800',
            'green' => 'bg-green-100 text-green-800',
            'red' => 'bg-red-100 text-red-800',
            'yellow' => 'bg-yellow-100 text-yellow-800',
            'indigo' => 'bg-indigo-100 text-indigo-800',
            'gray' => 'bg-gray-100 text-gray-800',
        ];

        return $colorMap[$this->color_theme] ?? $colorMap['blue'];
    }

    public function getIconClassAttribute(): string
    {
        $iconMap = [
            'meeting' => 'fas fa-users',
            'task_deadline' => 'fas fa-tasks',
            'review' => 'fas fa-check',
            'important_deadline' => 'fas fa-exclamation',
            'personal' => 'fas fa-birthday-cake',
            'reminder' => 'fas fa-bell',
            'milestone' => 'fas fa-flag',
        ];

        return $iconMap[$this->event_type] ?? $iconMap['meeting'];
    }

    public function getDaysUntilAttribute(): int
    {
        return $this->event_date->diffInDays(now(), false);
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->event_date->isPast() && $this->status === 'scheduled';
    }

    public function getIsTodayAttribute(): bool
    {
        return $this->event_date->isToday();
    }

    // Helper methods
    public function markAsCompleted(): void
    {
        $this->update(['status' => 'completed']);
    }

    public function markAsCancelled(): void
    {
        $this->update(['status' => 'cancelled']);
    }

    public function addAttendee($userId): void
    {
        $attendees = $this->attendees ?? [];
        if (!in_array($userId, $attendees)) {
            $attendees[] = $userId;
            $this->update(['attendees' => $attendees]);
        }
    }

    public function removeAttendee($userId): void
    {
        $attendees = $this->attendees ?? [];
        $attendees = array_values(array_diff($attendees, [$userId]));
        $this->update(['attendees' => $attendees]);
    }

    public function setReminder($minutes = 30): void
    {
        if ($this->start_time) {
            $reminderTime = Carbon::parse($this->event_date->format('Y-m-d') . ' ' . $this->start_time)
                                ->subMinutes($minutes);
        } else {
            $reminderTime = $this->event_date->startOfDay()->subMinutes($minutes);
        }

        $this->update(['reminder_at' => $reminderTime]);
    }

    public static function createFromTask(Task $task): self
    {
        return self::create([
            'title' => 'Task Deadline: ' . $task->title,
            'description' => $task->description,
            'event_date' => $task->due_date,
            'event_type' => 'task_deadline',
            'color_theme' => 'purple',
            'user_id' => $task->assigned_to ?? $task->project->user_id,
            'project_id' => $task->project_id,
            'task_id' => $task->id,
            'priority' => $task->priority ?? 'medium',
        ]);
    }
}
