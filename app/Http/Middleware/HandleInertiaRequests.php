<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
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
                        'view_tasks' => $user->can('view tasks'),
                        'assign_tasks' => $user->can('assign tasks'),
                        'update_tasks' => $user->can('update tasks'),
                        'comment_tasks' => $user->can('comment tasks'),
                        'view_dashboard' => $user->can('view dashboard'),
                    ]
                ] : null,
            ],
            'jwt' => [
                'token' => $request->get('jwt_token'), // Token dari middleware
                'refreshed' => $request->get('token_refreshed', false),
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
            'errors' => fn () => $request->session()->get('errors')
                ? $request->session()->get('errors')->getBag('default')->getMessages()
                : (object) [],
        ];
    }
}
