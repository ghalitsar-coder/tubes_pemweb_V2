<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class TasksCalendarController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month', now()->month);

        // Get tasks with project relationship
        $tasks = Task::with(['project', 'assignee'])
            ->whereYear('due_date', $year)
            ->whereMonth('due_date', $month)
            ->orWhere(function ($query) use ($year, $month) {
                $query->whereYear('start_date', $year)
                      ->whereMonth('start_date', $month);
            })
            ->orWhere(function ($query) use ($year, $month) {
                $query->whereYear('created_at', $year)
                      ->whereMonth('created_at', $month);
            })
            ->get();

        // Generate calendar events from tasks
        $events = [];

        foreach ($tasks as $task) {
            // Task created event
            if ($task->created_at) {
                $events[] = [
                    'id' => 'task_created_' . $task->id,
                    'title' => 'Task Created: ' . $task->title,
                    'date' => $task->created_at->format('Y-m-d'),
                    'type' => 'task_created',
                    'color' => '#10b981', // green
                    'description' => 'Task "' . $task->title . '" was created',
                    'task' => [
                        'id' => $task->id,
                        'title' => $task->title,
                        'status' => $task->status,
                        'priority' => $task->priority ?? 'medium',
                        'project' => $task->project ? $task->project->name : null,
                        'assignee' => $task->assignee ? $task->assignee->name : null,
                    ]
                ];
            }

            // Task due date event
            if ($task->due_date) {
                $isDue = Carbon::parse($task->due_date)->isPast() && $task->status !== 'completed';
                $isToday = Carbon::parse($task->due_date)->isToday();
                
                $color = '#6366f1'; // default blue
                if ($isDue) {
                    $color = '#ef4444'; // red for overdue
                } elseif ($isToday) {
                    $color = '#f59e0b'; // orange for today
                } elseif ($task->status === 'completed') {
                    $color = '#10b981'; // green for completed
                }

                $events[] = [
                    'id' => 'task_due_' . $task->id,
                    'title' => 'Due: ' . $task->title,
                    'date' => Carbon::parse($task->due_date)->format('Y-m-d'),
                    'type' => 'task_due',
                    'color' => $color,
                    'description' => 'Task "' . $task->title . '" is due',
                    'is_overdue' => $isDue,
                    'is_today' => $isToday,
                    'task' => [
                        'id' => $task->id,
                        'title' => $task->title,
                        'status' => $task->status,
                        'priority' => $task->priority ?? 'medium',
                        'project' => $task->project ? $task->project->name : null,
                        'assignee' => $task->assignee ? $task->assignee->name : null,
                    ]
                ];
            }

            // Task start date event
            if ($task->start_date) {
                $events[] = [
                    'id' => 'task_start_' . $task->id,
                    'title' => 'Start: ' . $task->title,
                    'date' => Carbon::parse($task->start_date)->format('Y-m-d'),
                    'type' => 'task_start',
                    'color' => '#8b5cf6', // purple
                    'description' => 'Task "' . $task->title . '" starts',
                    'task' => [
                        'id' => $task->id,
                        'title' => $task->title,
                        'status' => $task->status,
                        'priority' => $task->priority ?? 'medium',
                        'project' => $task->project ? $task->project->name : null,
                        'assignee' => $task->assignee ? $task->assignee->name : null,
                    ]
                ];
            }

            // Task status change events (if updated recently)
            if ($task->updated_at && $task->updated_at->diffInDays(now()) <= 30) {
                $events[] = [
                    'id' => 'task_updated_' . $task->id,
                    'title' => 'Updated: ' . $task->title,
                    'date' => $task->updated_at->format('Y-m-d'),
                    'type' => 'task_updated',
                    'color' => '#06b6d4', // cyan
                    'description' => 'Task "' . $task->title . '" was updated',
                    'task' => [
                        'id' => $task->id,
                        'title' => $task->title,
                        'status' => $task->status,
                        'priority' => $task->priority ?? 'medium',
                        'project' => $task->project ? $task->project->name : null,
                        'assignee' => $task->assignee ? $task->assignee->name : null,
                    ]
                ];
            }
        }

        // Sort events by date
        usort($events, function ($a, $b) {
            return strcmp($a['date'], $b['date']);
        });

        return Inertia::render('Tasks/Calendar', [
            'events' => $events,
            'currentMonth' => $month,
            'currentYear' => $year,
            'monthName' => Carbon::create($year, $month)->format('F Y'),
            'totalTasks' => $tasks->count(),
            'completedTasks' => $tasks->where('status', 'completed')->count(),
            'overdueTasks' => $tasks->filter(function ($task) {
                return $task->due_date && Carbon::parse($task->due_date)->isPast() && $task->status !== 'completed';
            })->count(),
        ]);
    }
}
