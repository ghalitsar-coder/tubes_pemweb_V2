<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ProfileController extends Controller
{
    /**
     * Display the user's profile dashboard with CRUD operations
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        // Get user statistics
        $userStats = [
            'totalProjects' => Project::where('user_id', $user->id)->count(),
            'activeProjects' => Project::where('user_id', $user->id)
                ->where('status', 'in_progress')->count(),
            'completedProjects' => Project::where('user_id', $user->id)
                ->where('status', 'completed')->count(),
            'assignedTasks' => Task::where('assigned_to', $user->id)->count(),
            'completedTasks' => Task::where('assigned_to', $user->id)
                ->where('status', 'completed')->count(),
            'pendingTasks' => Task::where('assigned_to', $user->id)
                ->whereIn('status', ['todo', 'in_progress'])->count(),
        ];

        // Get user's recent projects
        $recentProjects = Project::where('user_id', $user->id)
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get();

        // Get user's recent tasks
        $recentTasks = Task::where('assigned_to', $user->id)
            ->with('project')
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'status' => $task->status,
                    'priority' => $task->priority,
                    'due_date' => $task->due_date,
                    'project_name' => $task->project->name,
                ];
            });

        return Inertia::render('Profile/Index', [
            'user' => $user,
            'userStats' => $userStats,
            'recentProjects' => $recentProjects,
            'recentTasks' => $recentTasks,
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
        ]);
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit')->with('status', 'Profile updated successfully!');
    }

    /**
     * Update user's avatar
     */
    public function updateAvatar(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        $user = $request->user();

        try {
            // Upload to Cloudinary using uploadApi() method like in ProjectCommentController
            $uploadedFileUrl = Cloudinary::uploadApi()->upload($request->file('avatar')->getRealPath(), [
                'folder' => 'user_avatars',
                'public_id' => 'user_' . $user->id . '_' . time(),
                'overwrite' => true,
                'resource_type' => 'image',
                'transformation' => [
                    'quality' => 'auto',
                    'fetch_format' => 'auto',
                    'width' => 400,
                    'height' => 400,
                    'crop' => 'fill'
                ]
            ]);
            
            $imagePath = $uploadedFileUrl['secure_url'];

            // Delete old avatar if exists and it's from cloudinary
            if ($user->avatar && str_contains($user->avatar, 'cloudinary')) {
                // Extract public_id and delete from cloudinary
                $parts = explode('/', $user->avatar);
                $filename = end($parts);
                $publicId = 'user_avatars/' . pathinfo($filename, PATHINFO_FILENAME);
                try {
                    Cloudinary::uploadApi()->destroy($publicId);
                } catch (\Exception $e) {
                    // Log error but don't fail the upload
                    \Log::warning('Failed to delete old avatar: ' . $e->getMessage());
                }
            }

            // Update user avatar
            $user->update(['avatar' => $imagePath]);

            return Redirect::back()->with('status', 'Avatar updated successfully!');
        } catch (\Exception $e) {
            return Redirect::back()->withErrors(['avatar' => 'Failed to upload avatar: ' . $e->getMessage()]);
        }
    }

    /**
     * Update user password
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return Redirect::back()->with('status', 'Password updated successfully!');
    }

    /**
     * Update user preferences/settings
     */
    public function updateSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email_notifications' => ['boolean'],
            'task_notifications' => ['boolean'],
            'project_notifications' => ['boolean'],
            'timezone' => ['string', 'max:255'],
            'language' => ['string', 'max:10'],
            'theme' => ['string', 'in:light,dark,system'],
        ]);

        $user = $request->user();
        
        // Store settings in user meta or create settings table
        // For now, we'll add these fields to users table or use JSON field
        $settings = $user->settings ?? [];
        $settings = array_merge($settings, $validated);
        
        $user->update(['settings' => $settings]);

        return Redirect::back()->with('status', 'Settings updated successfully!');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
