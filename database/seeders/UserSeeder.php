<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'Admin',
        ]);

        // Create Project Manager
        User::create([
            'name' => 'Project Manager',
            'email' => 'pm@example.com',
            'password' => Hash::make('password'),
            'role' => 'Project Manager',
        ]);

        // Create Team Member
        User::create([
            'name' => 'Team Member',
            'email' => 'member@example.com',
            'password' => Hash::make('password'),
            'role' => 'Team Member',
        ]);

        // Create another Team Member
        User::create([
            'name' => 'Another Team Member',
            'email' => 'member2@example.com',
            'password' => Hash::make('password'),
            'role' => 'Team Member',
        ]);

        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'role' => 'Team Member',

        ]);
    }
} 