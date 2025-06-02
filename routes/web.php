<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectCommentController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskCommentController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\ProjectsCalendarController;
use App\Http\Controllers\TasksCalendarController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\TestCloudinaryController;
use App\Http\Controllers\TaskAttachmentController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard - accessible by all authenticated users with view dashboard permission
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('permission:view dashboard')
        ->name('dashboard');

    // Profile routes - accessible by all authenticated users
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Project routes with permission-based access (fixed order: specific routes before parameterized)
    Route::middleware('permission:view dashboard')->group(function () {
        Route::get('/projects/calendar', [ProjectsCalendarController::class, 'index'])->name('projects.calendar');
        Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
        Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
        Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    });
    
    Route::middleware('permission:create project')->group(function () {
        Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
        Route::post('projects/{project}/duplicate-template', [ProjectController::class, 'duplicateAsTemplate'])->name('projects.duplicate-template');
    });
    
    Route::middleware('permission:update project')->group(function () {
        Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
        Route::patch('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
        Route::post('projects/{project}/attachments', [ProjectController::class, 'addAttachment'])->name('projects.attachments.store');
        Route::delete('projects/{project}/attachments/{index}', [ProjectController::class, 'removeAttachment'])->name('projects.attachments.destroy');
        Route::post('projects/{project}/tags', [ProjectController::class, 'addTag'])->name('projects.tags.store');
        Route::delete('projects/{project}/tags/{tag}', [ProjectController::class, 'removeTag'])->name('projects.tags.destroy');
        Route::post('projects/{project}/budget', [ProjectController::class, 'updateBudget'])->name('projects.budget.update');
        Route::post('projects/{project}/calculate-progress', [ProjectController::class, 'calculateProgress'])->name('projects.calculate-progress');
    });
    
    Route::middleware('permission:delete project')->group(function () {
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');
    });
    
    // Project comment routes with permission-based access
    Route::middleware('permission:comment projects')->group(function () {
        Route::post('/projects/{project}/comments', [ProjectCommentController::class, 'store'])->name('projects.comments.store');
        Route::patch('/projects/{project}/comments/{comment}', [ProjectCommentController::class, 'update'])->name('projects.comments.update');
        Route::delete('/projects/{project}/comments/{comment}', [ProjectCommentController::class, 'destroy'])->name('projects.comments.destroy');
    });
    
    // Task routes with permission-based access (fixed order: specific routes before parameterized)
    Route::middleware('permission:view dashboard')->group(function () {
        Route::get('/tasks/calendar', [TasksCalendarController::class, 'index'])->name('tasks.calendar');
        Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
    });
    
    Route::middleware('permission:assign tasks')->group(function () {
        Route::get('/tasks/create', [TaskController::class, 'create'])->name('tasks.create');
        Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    });
    
    Route::middleware('permission:view dashboard')->group(function () {
        Route::get('/tasks/{task}', [TaskController::class, 'show'])->name('tasks.show');
    });
    
    Route::middleware('permission:update tasks')->group(function () {
        Route::get('/tasks/{task}/edit', [TaskController::class, 'edit'])->name('tasks.edit');
        Route::put('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
        Route::patch('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.patch');
        Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus'])->name('tasks.update-status');
        Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
        
        // Task Attachments
        Route::post('/tasks/{task}/attachments', [TaskAttachmentController::class, 'store'])->name('tasks.attachments.store');
        Route::delete('/tasks/{task}/attachments/{attachment}', [TaskAttachmentController::class, 'destroy'])->name('tasks.attachments.destroy');
    });
    
    Route::middleware('permission:comment tasks')->group(function () {
        Route::post('/tasks/{task}/comments', [TaskCommentController::class, 'store'])->name('tasks.comments.store');
        Route::put('/tasks/{task}/comments/{comment}', [TaskCommentController::class, 'update'])->name('tasks.comments.update');
        Route::delete('/tasks/{task}/comments/{comment}', [TaskCommentController::class, 'destroy'])->name('tasks.comments.destroy');
        Route::post('/tasks/{task}/attachments/{attachment}/comments', [TaskAttachmentController::class, 'storeComment'])->name('tasks.attachments.comments.store');
    });

    // Calendar routes - accessible by all authenticated users with view dashboard permission
    Route::middleware('permission:view dashboard')->group(function () {
        Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar.index');
        Route::post('/calendar', [CalendarController::class, 'store'])->name('calendar.store');
        Route::get('/calendar/{event}', [CalendarController::class, 'show'])->name('calendar.show');
        Route::put('/calendar/{event}', [CalendarController::class, 'update'])->name('calendar.update');
        Route::delete('/calendar/{event}', [CalendarController::class, 'destroy'])->name('calendar.destroy');
        Route::patch('/calendar/{event}/complete', [CalendarController::class, 'markComplete'])->name('calendar.complete');
        Route::patch('/calendar/{event}/cancel', [CalendarController::class, 'markCancelled'])->name('calendar.cancel');
    });
});

Route::get('/test-cloudinary', [TestCloudinaryController::class, 'test']);

require __DIR__.'/auth.php';

// Debug route to test user data
Route::middleware(['auth', 'verified'])->get('/debug-user', function () {
    return Inertia::render('Debug/UserData', [
        'user' => Auth::user(),
        'permissions' => Auth::user()->getAllPermissions()->pluck('name'),
        'roles' => Auth::user()->getRoleNames(),
        'can_create_project' => Auth::user()->can('create project'),
        'can_assign_tasks' => Auth::user()->can('assign tasks'),
    ]);
});