# JWT Authentication Integration with Laravel Breeze & Inertia.js

This document outlines the complete implementation of JWT authentication integrated with Laravel Breeze and Inertia.js.

## Overview

The implementation provides dual authentication support:

-   **Session-based authentication** for web interface (traditional Breeze)
-   **JWT authentication** for API endpoints and enhanced security

## Features Implemented

✅ JWT API endpoints for authentication
✅ Automatic JWT token generation on login/register
✅ JWT token storage in HTTP-only cookies
✅ Automatic token refresh mechanism
✅ Frontend JWT management utilities
✅ React hooks for JWT operations
✅ API interceptors for automatic token handling
✅ Middleware for JWT validation
✅ CORS configuration for API access

## Architecture

### Backend Components

1. **JWT API Controller** (`app/Http/Controllers/Api/AuthController.php`)

    - Login, Register, Logout, Refresh, User Profile endpoints
    - JWT token generation and validation

2. **JWT Middleware** (`app/Http/Middleware/JWTAuthMiddleware.php`)

    - Automatic token validation
    - Token refresh for expiring tokens
    - Cookie management

3. **Modified Breeze Controllers**

    - `AuthenticatedSessionController.php` - JWT token generation on login
    - `RegisteredUserController.php` - JWT token generation on register

4. **API Routes** (`routes/api.php`)
    - Protected and public API endpoints
    - JWT guard authentication

### Frontend Components

1. **JWT Manager** (`resources/js/utils/jwt.ts`)

    - Singleton pattern for token management
    - Automatic token refresh
    - Axios interceptors

2. **React Hook** (`resources/js/hooks/useJWT.ts`)

    - JWT state management
    - Authentication status
    - Logout functionality

3. **Test Component** (`resources/js/components/JWTTestComponent.tsx`)
    - Development testing interface
    - API call testing

## Configuration

### Environment Variables

```
JWT_SECRET=your-secret-key
JWT_ALGO=HS256
```

### JWT Configuration (`config/jwt.php`)

-   Token TTL: 60 minutes
-   Refresh TTL: 20160 minutes (2 weeks)
-   Algorithm: HS256

### Auth Guards (`config/auth.php`)

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
    'api' => [
        'driver' => 'jwt',
        'provider' => 'users',
    ],
],
```

## API Endpoints

### Public Endpoints

-   `POST /api/login` - JWT login
-   `POST /api/register` - User registration with JWT

### Protected Endpoints (require JWT token)

-   `POST /api/logout` - Invalidate JWT token
-   `POST /api/refresh` - Refresh JWT token
-   `GET /api/me` - Get authenticated user profile
-   `GET /api/projects` - Project management
-   `GET /api/tasks` - Task management

## How JWT Works in This Implementation

### 1. User Authentication Flow

**Web Login (Traditional Breeze):**

1. User submits login form
2. Session authentication (traditional)
3. JWT token generated automatically
4. Token stored in HTTP-only cookie
5. User redirected to dashboard

**API Login:**

1. POST request to `/api/login`
2. JWT token returned in response
3. Frontend stores token automatically

### 2. Token Management

**Automatic Refresh:**

-   Tokens refresh automatically when < 15 minutes remaining
-   Frontend JWT manager handles refresh transparently
-   New tokens update HTTP-only cookies

**Token Storage:**

-   HTTP-only cookies for web requests (secure)
-   Memory storage for API calls
-   Automatic cleanup on logout

### 3. API Request Flow

1. Frontend makes API request
2. JWT manager adds token to headers
3. Laravel validates token via middleware
4. If token expired, automatic refresh attempt
5. If refresh fails, redirect to login

## Usage Examples

### Frontend Usage

```typescript
import { useJWT } from "@/hooks/useJWT";

const MyComponent = () => {
    const { token, isAuthenticated, logout } = useJWT();

    const callAPI = async () => {
        // Token automatically added by axios interceptor
        const response = await fetch("/api/me");
        // Handle response
    };

    return (
        <div>
            {isAuthenticated ? "Logged in" : "Not authenticated"}
            <button onClick={logout}>Logout</button>
        </div>
    );
};
```

### Direct API Usage

```javascript
// Token automatically included in headers
fetch("/api/projects", {
    headers: {
        Accept: "application/json",
    },
})
    .then((response) => response.json())
    .then((data) => console.log(data));
```

## Security Features

1. **HTTP-only Cookies**: Prevent XSS attacks
2. **CSRF Protection**: Laravel's built-in CSRF protection
3. **Token Expiration**: Short-lived access tokens (60 min)
4. **Refresh Tokens**: Longer-lived refresh capability
5. **Secure Headers**: Proper CORS and security headers

## Testing

### JWT Test Component

A testing component is available on the dashboard during development:

-   Shows current authentication status
-   Displays token information
-   Tests API calls
-   Provides logout functionality

### Manual API Testing

```bash
# Login to get token
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Use token for protected endpoints
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

### Common Issues

1. **Token not found**

    - Check if JWT middleware is registered
    - Verify token storage in cookies/headers

2. **CORS errors**

    - Ensure CORS is configured properly
    - Check allowed origins and headers

3. **Token refresh fails**
    - Verify JWT configuration
    - Check token expiration settings

### Debugging

Enable JWT debugging by checking:

-   Browser developer tools (Network tab)
-   Laravel logs (`storage/logs/laravel.log`)
-   JWT test component on dashboard

## Production Considerations

1. **Environment Variables**: Ensure JWT_SECRET is properly set
2. **HTTPS**: Use HTTPS in production for secure cookie transmission
3. **Cookie Settings**: Configure secure cookie settings
4. **Rate Limiting**: Implement rate limiting for auth endpoints
5. **Monitoring**: Monitor token refresh patterns and failures

## Future Enhancements

-   [ ] Multi-device token management
-   [ ] Token blacklisting
-   [ ] Remember me functionality
-   [ ] Two-factor authentication integration
-   [ ] Advanced rate limiting
-   [ ] Token usage analytics

## Dependencies

-   `php-open-source-saver/jwt-auth`: JWT implementation for Laravel
-   `@inertiajs/react`: Frontend framework
-   `axios`: HTTP client with interceptors
-   Laravel Breeze: Base authentication scaffolding

This implementation provides a robust, secure, and user-friendly JWT authentication system that seamlessly integrates with existing Laravel Breeze functionality while providing enhanced API capabilities.
