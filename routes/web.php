<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
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
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Project routes
    Route::resource('projects', ProjectController::class);
    Route::post('projects/{project}/attachments', [ProjectController::class, 'addAttachment'])->name('projects.attachments.store');
    Route::delete('projects/{project}/attachments/{index}', [ProjectController::class, 'removeAttachment'])->name('projects.attachments.destroy');
    Route::post('projects/{project}/tags', [ProjectController::class, 'addTag'])->name('projects.tags.store');
    Route::delete('projects/{project}/tags/{tag}', [ProjectController::class, 'removeTag'])->name('projects.tags.destroy');
    Route::post('projects/{project}/duplicate-template', [ProjectController::class, 'duplicateAsTemplate'])->name('projects.duplicate-template');
    Route::post('projects/{project}/budget', [ProjectController::class, 'updateBudget'])->name('projects.budget.update');
    Route::post('projects/{project}/calculate-progress', [ProjectController::class, 'calculateProgress'])->name('projects.calculate-progress');
    
    // Task routes
    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::get('/tasks/create', [TaskController::class, 'create'])->name('tasks.create');
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::get('/tasks/{task}', [TaskController::class, 'show'])->name('tasks.show');
    Route::get('/tasks/{task}/edit', [TaskController::class, 'edit'])->name('tasks.edit');
    Route::put('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::patch('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.patch');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
    Route::post('/tasks/{task}/comments', [TaskController::class, 'addComment'])->name('tasks.comments.store');

    // Task Attachments
    Route::post('/tasks/{task}/attachments', [TaskAttachmentController::class, 'store'])->name('tasks.attachments.store');
    Route::delete('/tasks/{task}/attachments/{attachment}', [TaskAttachmentController::class, 'destroy'])->name('tasks.attachments.destroy');
    Route::post('/tasks/{task}/attachments/{attachment}/comments', [TaskAttachmentController::class, 'storeComment'])->name('tasks.attachments.comments.store');
});

Route::get('/test-cloudinary', [TestCloudinaryController::class, 'test']);

require __DIR__.'/auth.php'; 