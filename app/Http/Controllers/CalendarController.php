<?php

namespace App\Http\Controllers;

use App\Models\CalendarEvent;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class CalendarController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month', now()->month);
        $view = $request->get('view', 'month');

        // Get events for the current month
        $events = CalendarEvent::forMonth($year, $month)
            ->forUser(auth()->id())
            ->with(['project', 'task', 'user'])
            ->get()
            ->map(function ($event) {                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'description' => $event->description,
                    'date' => $event->event_date->format('Y-m-d'),
                    'start_time' => $event->start_time,
                    'end_time' => $event->end_time,
                    'formatted_time' => $event->formatted_time,
                    'type' => $event->event_type,
                    'status' => $event->status,
                    'color_class' => $event->color_class,
                    'icon_class' => $event->icon_class,
                    'is_all_day' => $event->is_all_day,
                    'location' => $event->location,
                    'priority' => $event->priority,
                    'project' => $event->project ? [
                        'id' => $event->project->id,
                        'name' => $event->project->name,
                    ] : null,
                    'task' => $event->task ? [
                        'id' => $event->task->id,
                        'title' => $event->task->title,
                    ] : null,
                ];
            });

        // Get upcoming events (next 7 days)
        $upcomingEvents = CalendarEvent::upcoming(7)
            ->forUser(auth()->id())
            ->with(['project', 'task'])
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'description' => $event->description,
                    'formatted_date' => $event->formatted_date,
                    'formatted_time' => $event->formatted_time,
                    'type' => $event->event_type,
                    'color_class' => $event->color_class,
                    'icon_class' => $event->icon_class,
                    'days_until' => $event->days_until,
                    'is_today' => $event->is_today,
                    'location' => $event->location,
                ];
            });

        // Get user's projects for event creation
        $projects = Project::where('user_id', auth()->id())
            ->select('id', 'name')
            ->get();

        return Inertia::render('Calendar/Index', [
            'events' => $events,
            'upcomingEvents' => $upcomingEvents,
            'projects' => $projects,
            'currentMonth' => $month,
            'currentYear' => $year,
            'view' => $view,
            'monthName' => Carbon::create($year, $month)->format('F Y'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'event_type' => 'required|in:meeting,task_deadline,review,important_deadline,personal,reminder,milestone',
            'color_theme' => 'nullable|in:blue,purple,green,red,yellow,indigo,gray',
            'is_all_day' => 'boolean',
            'location' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'priority' => 'nullable|in:low,medium,high',
            'project_id' => 'nullable|exists:projects,id',
            'attendees' => 'nullable|array',
            'reminder_minutes' => 'nullable|integer|min:0',
        ]);

        // Set default color based on event type
        if (!$validated['color_theme']) {
            $validated['color_theme'] = $this->getDefaultColorForType($validated['event_type']);
        }

        $event = CalendarEvent::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        // Set reminder if specified
        if ($request->reminder_minutes) {
            $event->setReminder($request->reminder_minutes);
        }

        return redirect()->back()->with('success', 'Event created successfully!');
    }

    public function show(CalendarEvent $event)
    {
        $this->authorize('view', $event);

        return Inertia::render('Calendar/Show', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'formatted_date' => $event->formatted_date,
                'formatted_time' => $event->formatted_time,
                'event_date' => $event->event_date->format('Y-m-d'),
                'start_time' => $event->start_time?->format('H:i'),
                'end_time' => $event->end_time?->format('H:i'),
                'type' => $event->event_type,
                'status' => $event->status,
                'color_class' => $event->color_class,
                'icon_class' => $event->icon_class,
                'is_all_day' => $event->is_all_day,
                'location' => $event->location,
                'notes' => $event->notes,
                'priority' => $event->priority,
                'attendees' => $event->attendees,
                'project' => $event->project,
                'task' => $event->task,
                'user' => $event->user,
            ],
        ]);
    }

    public function update(Request $request, CalendarEvent $event)
    {
        $this->authorize('update', $event);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'event_type' => 'required|in:meeting,task_deadline,review,important_deadline,personal,reminder,milestone',
            'color_theme' => 'nullable|in:blue,purple,green,red,yellow,indigo,gray',
            'is_all_day' => 'boolean',
            'location' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'priority' => 'nullable|in:low,medium,high',
            'status' => 'nullable|in:scheduled,completed,cancelled',
            'attendees' => 'nullable|array',
        ]);

        $event->update($validated);

        return redirect()->back()->with('success', 'Event updated successfully!');
    }

    public function destroy(CalendarEvent $event)
    {
        $this->authorize('delete', $event);

        $event->delete();

        return redirect()->route('calendar.index')->with('success', 'Event deleted successfully!');
    }

    public function markCompleted(CalendarEvent $event)
    {
        $this->authorize('update', $event);

        $event->markAsCompleted();

        return redirect()->back()->with('success', 'Event marked as completed!');
    }

    public function markCancelled(CalendarEvent $event)
    {
        $this->authorize('update', $event);

        $event->markAsCancelled();

        return redirect()->back()->with('success', 'Event cancelled!');
    }

    private function getDefaultColorForType(string $type): string
    {
        return match ($type) {
            'meeting' => 'blue',
            'task_deadline' => 'purple',
            'review' => 'green',
            'important_deadline' => 'red',
            'personal' => 'yellow',
            'reminder' => 'indigo',
            'milestone' => 'green',
            default => 'blue',
        };
    }
}
