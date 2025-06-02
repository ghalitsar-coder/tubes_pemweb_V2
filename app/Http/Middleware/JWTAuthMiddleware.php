<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException;

class JWTAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if request has JWT token in header or cookie
        $token = $this->getTokenFromRequest($request);
        
        if ($token) {
            try {
                // Try to authenticate with JWT
                $user = JWTAuth::setToken($token)->authenticate();
                
                if ($user) {
                    // Set the authenticated user for the session guard as well
                    Auth::guard('web')->login($user, true);
                    $request->merge(['jwt_token' => $token]);
                }
            } catch (TokenExpiredException $e) {
                // Token has expired, try to refresh if possible
                try {
                    $newToken = JWTAuth::refresh($token);
                    $user = JWTAuth::setToken($newToken)->authenticate();
                    
                    if ($user) {
                        Auth::guard('web')->login($user, true);
                        $request->merge(['jwt_token' => $newToken, 'token_refreshed' => true]);
                    }
                } catch (JWTException $e) {
                    // Cannot refresh token, remove it
                    $this->removeTokenCookie($request);
                }
            } catch (TokenInvalidException $e) {
                // Token is invalid, remove it
                $this->removeTokenCookie($request);
            } catch (JWTException $e) {
                // General JWT exception, remove token
                $this->removeTokenCookie($request);
            }
        }

        $response = $next($request);

        // If token was refreshed, set new token in cookie
        if ($request->has('token_refreshed') && $request->get('jwt_token')) {
            $response->cookie('jwt_token', $request->get('jwt_token'), 
                config('jwt.ttl'), '/', null, true, true, false, 'Strict');
        }

        return $response;
    }

    /**
     * Get JWT token from request headers or cookies
     */
    private function getTokenFromRequest(Request $request): ?string
    {
        // First check Authorization header
        $authHeader = $request->header('Authorization');
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            return substr($authHeader, 7);
        }

        // Then check X-Auth-Token header (for Inertia requests)
        $tokenHeader = $request->header('X-Auth-Token');
        if ($tokenHeader) {
            return $tokenHeader;
        }

        // Finally check cookie
        return $request->cookie('jwt_token');
    }

    /**
     * Remove JWT token cookie
     */
    private function removeTokenCookie(Request $request): void
    {
        $request->cookies->remove('jwt_token');
    }
}
