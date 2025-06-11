<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ProjectsCalendarController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month', now()->month);
        $view = $request->get('view', 'month');        // Get all projects for the user
        $projects = Project::where('user_id', auth()->id())
            ->with(['tasks'])
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'status' => $project->status,
                    'priority' => 'medium', // Set default priority since it's not in the database
                    'progress' => $project->progress ?? 0,
                    'start_date' => $project->start_date ? $project->start_date->format('Y-m-d') : null,
                    'end_date' => $project->end_date ? $project->end_date->format('Y-m-d') : null,
                    'created_at' => $project->created_at->format('Y-m-d'),
                    'budget' => $project->budget,
                    'team_count' => $project->members_count ?? 1, // Use the accessor or default to 1
                ];
            });

        // Generate project events (created dates, deadlines, etc.)
        $projectEvents = collect();

        foreach ($projects as $project) {
            // Project created event
            $projectEvents->push([
                'id' => $project['id'],
                'project_id' => $project['id'],
                'project_name' => $project['name'],
                'event_type' => 'created',
                'event_date' => $project['created_at'],
                'status' => $project['status'],
                'priority' => $project['priority'],
                'progress' => $project['progress'],
                'budget' => $project['budget'],
                'team_count' => $project['team_count'],
                'description' => 'Project was created',
                'color_class' => 'bg-green-100 text-green-800',
                'icon_class' => 'fas fa-folder',
            ]);

            // Project deadline event (if end_date exists)
            if ($project['end_date']) {
                $isOverdue = Carbon::parse($project['end_date'])->isPast();
                $projectEvents->push([
                    'id' => $project['id'],
                    'project_id' => $project['id'],
                    'project_name' => $project['name'],
                    'event_type' => 'deadline',
                    'event_date' => $project['end_date'],
                    'status' => $project['status'],
                    'priority' => $project['priority'],
                    'progress' => $project['progress'],
                    'budget' => $project['budget'],
                    'team_count' => $project['team_count'],
                    'description' => $isOverdue ? 'Project deadline (overdue)' : 'Project deadline',
                    'color_class' => $isOverdue ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800',
                    'icon_class' => 'fas fa-clock',
                ]);
            }

            // Add milestone events for high progress projects
            if ($project['progress'] >= 50 && $project['progress'] < 100) {
                $projectEvents->push([
                    'id' => $project['id'],
                    'project_id' => $project['id'],
                    'project_name' => $project['name'],
                    'event_type' => 'updated',
                    'event_date' => now()->format('Y-m-d'), // Use today's date as example
                    'status' => $project['status'],
                    'priority' => $project['priority'],
                    'progress' => $project['progress'],
                    'budget' => $project['budget'],
                    'team_count' => $project['team_count'],
                    'description' => "Project progress: {$project['progress']}%",
                    'color_class' => 'bg-blue-100 text-blue-800',
                    'icon_class' => 'fas fa-flag',
                ]);
            }
        }

        // Filter events for the current month/year if needed
        if ($view === 'month') {
            $projectEvents = $projectEvents->filter(function ($event) use ($year, $month) {
                $eventDate = Carbon::parse($event['event_date']);
                return $eventDate->year == $year && $eventDate->month == $month;
            });
        }

        // Get month name
        $monthName = Carbon::create($year, $month, 1)->format('F Y');

        return Inertia::render('Projects/Calendar', [
            'projects' => $projects->values()->all(),
            'projectEvents' => $projectEvents->values()->all(),
            'currentMonth' => (int) $month,
            'currentYear' => (int) $year,
            'view' => $view,
            'monthName' => $monthName,
        ]);
    }

    public function show(Project $project)
    {
        // This can redirect to the project detail page
        return redirect()->route('projects.show', $project);
    }
}
