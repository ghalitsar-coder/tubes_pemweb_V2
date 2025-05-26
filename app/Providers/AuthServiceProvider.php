<?php

namespace App\Providers;

use App\Models\Project;
use App\Models\Task;
use App\Models\CalendarEvent;
use App\Policies\ProjectPolicy;
use App\Policies\TaskPolicy;
use App\Policies\CalendarEventPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Project::class => ProjectPolicy::class,
        Task::class => TaskPolicy::class,
        CalendarEvent::class => CalendarEventPolicy::class,
    ];

    public function boot()
    {
        $this->registerPolicies();
    }
}