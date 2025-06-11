<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UpdateUserAvatarsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::whereNull('avatar')->get();
        
        foreach ($users as $user) {
            $user->update([
                'avatar' => "https://ui-avatars.com/api/?name=" . urlencode($user->name) . "&background=random&color=fff",
                'settings' => [
                    'email_notifications' => true,
                    'task_notifications' => true,
                    'project_notifications' => true,
                    'timezone' => 'UTC',
                    'language' => 'en',
                    'theme' => 'system',
                ]
            ]);
        }
        
        $this->command->info('Updated ' . $users->count() . ' users with default avatars and settings.');
    }
}
