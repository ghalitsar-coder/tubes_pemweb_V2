<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view dashboard');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Task $task): bool
    {
        return $user->can('view dashboard') && 
               ($user->id === $task->assignee_id || 
                $user->id === $task->project->user_id || 
                $user->hasRole('Admin'));
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('assign tasks');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Task $task): bool
    {
        // Team members can update tasks assigned to them
        if ($user->can('update tasks') && $user->id === $task->assignee_id) {
            return true;
        }
        
        // Project managers and admins can update project tasks
        if ($user->can('assign tasks') && 
            ($user->id === $task->project->user_id || $user->hasRole('Admin'))) {
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Task $task): bool
    {
        return $user->can('assign tasks') && 
               ($user->id === $task->project->user_id || $user->hasRole('Admin'));
    }

    /**
     * Determine whether the user can assign the task to someone.
     */
    public function assign(User $user, Task $task): bool
    {
        return $user->can('assign tasks') && 
               ($user->id === $task->project->user_id || $user->hasRole('Admin'));
    }

    /**
     * Determine whether the user can comment on the task.
     */
    public function comment(User $user, Task $task): bool
    {
        return $user->can('comment tasks') && 
               ($user->id === $task->assignee_id || 
                $user->id === $task->project->user_id || 
                $user->hasRole('Admin'));
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Task $task): bool
    {
        return $user->hasRole('Admin');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Task $task): bool
    {
        return $user->hasRole('Admin');
    }
}
