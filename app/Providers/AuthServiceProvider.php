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
    ];    public function boot()
    {
        $this->registerPolicies();
        
        // Register JWT Auth Guard
        $this->app['auth']->viaRequest('jwt', function ($request) {
            $token = null;
            
            // Get token from Authorization header
            $authHeader = $request->header('Authorization');
            if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
                $token = substr($authHeader, 7);
            }
            
            if (!$token) {
                return null;
            }
            
            try {
                return \PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth::setToken($token)->authenticate();
            } catch (\Exception $e) {
                return null;
            }
        });
    }
}