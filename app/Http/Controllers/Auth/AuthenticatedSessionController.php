<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Generate JWT token for authenticated user
        $user = Auth::user();
        $token = JWTAuth::fromUser($user);

        // Set JWT token in httpOnly cookie for security
        $response = redirect()->intended(route('dashboard', absolute: false));
        $response->cookie('jwt_token', $token, config('jwt.ttl'), '/', null, true, true, false, 'Strict');

        return $response;
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        // Logout from JWT as well if token exists
        try {
            if ($request->cookie('jwt_token')) {
                JWTAuth::setToken($request->cookie('jwt_token'))->invalidate();
            }
        } catch (\Exception $e) {
            // Token might be already invalid, continue with logout
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Remove JWT token cookie
        $response = redirect('/');
        $response->cookie('jwt_token', '', -1);

        return $response;
    }
}
