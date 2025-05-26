<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class TestPermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:permissions {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test user permissions for debugging';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            $this->error("User with email {$email} not found!");
            return 1;
        }

        $this->info("Testing permissions for: {$user->name} ({$user->email})");
        $this->line("---");
        
        // Test roles
        $roles = $user->getRoleNames();
        $this->info("Roles: " . $roles->join(', '));
        
        // Test permissions
        $permissions = $user->getAllPermissions()->pluck('name');
        $this->info("Permissions: " . $permissions->join(', '));
        
        // Test specific permissions
        $this->line("---");
        $this->info("Permission Tests:");
        $this->line("Can create project: " . ($user->can('create project') ? 'YES' : 'NO'));
        $this->line("Can assign tasks: " . ($user->can('assign tasks') ? 'YES' : 'NO'));
        $this->line("Can view dashboard: " . ($user->can('view dashboard') ? 'YES' : 'NO'));
        $this->line("Can manage users: " . ($user->can('manage users') ? 'YES' : 'NO'));
        
        // Test middleware simulation
        $this->line("---");
        $this->info("Middleware Tests:");
        Auth::login($user);
        $this->line("Auth check: " . (Auth::check() ? 'YES' : 'NO'));
        $this->line("Auth user can create project: " . (Auth::user()->can('create project') ? 'YES' : 'NO'));
        $this->line("Auth user can assign tasks: " . (Auth::user()->can('assign tasks') ? 'YES' : 'NO'));
        
        // Test data structure for frontend
        $this->line("---");
        $this->info("Frontend Data Structure:");
        $frontendData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'can' => [
                'manage_users' => $user->can('manage users'),
                'create_project' => $user->can('create project'),
                'update_project' => $user->can('update project'),
                'delete_project' => $user->can('delete project'),
                'assign_tasks' => $user->can('assign tasks'),
                'update_tasks' => $user->can('update tasks'),
                'comment_tasks' => $user->can('comment tasks'),
                'view_dashboard' => $user->can('view dashboard'),
            ]
        ];
        
        $this->line(json_encode($frontendData, JSON_PRETTY_PRINT));
        
        return 0;
    }
}
