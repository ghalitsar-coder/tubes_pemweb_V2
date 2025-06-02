<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();        // Create permissions
        $permissions = [
            'manage users',
            'create project',
            'update project',
            'delete project',
            'view tasks',
            'assign tasks',
            'update tasks',
            'comment tasks',
            'comment projects',
            'view dashboard'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $admin->givePermissionTo(Permission::all());        $projectManager = Role::firstOrCreate(['name' => 'Project Manager']);
        $projectManager->givePermissionTo([
            'create project',
            'update project',
            'view tasks',
            'assign tasks',
            'update tasks',
            'comment tasks',
            'comment projects',
            'view dashboard'
        ]);        $teamMember = Role::firstOrCreate(['name' => 'Team Member']);
        $teamMember->givePermissionTo([
            'view tasks',
            'update tasks',
            'comment tasks',
            'comment projects',
            'view dashboard'
        ]);

        // Assign roles to existing users
        $this->assignRolesToUsers();
    }

    private function assignRolesToUsers()
    {
        // Admin User
        $adminUser = User::where('email', 'admin@example.com')->first();
        if ($adminUser && !$adminUser->hasAnyRole()) {
            $adminUser->assignRole('Admin');
        }

        // Project Manager
        $pmUser = User::where('email', 'pm@example.com')->first();
        if ($pmUser && !$pmUser->hasAnyRole()) {
            $pmUser->assignRole('Project Manager');
        }

        // Team Members
        $memberUser = User::where('email', 'member@example.com')->first();
        if ($memberUser && !$memberUser->hasAnyRole()) {
            $memberUser->assignRole('Team Member');
        }

        $member2User = User::where('email', 'member2@example.com')->first();
        if ($member2User && !$member2User->hasAnyRole()) {
            $member2User->assignRole('Team Member');
        }

        // Test User - assign as Team Member by default
        $testUser = User::where('email', 'test@example.com')->first();
        if ($testUser && !$testUser->hasAnyRole()) {
            $testUser->assignRole('Team Member');
        }

        // For any new registered users without roles, assign Team Member role
        $usersWithoutRoles = User::whereDoesntHave('roles')->get();
        foreach ($usersWithoutRoles as $user) {
            $user->assignRole('Team Member');
        }
    }
}