<?php

namespace App\Policies;

use App\Models\CalendarEvent;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CalendarEventPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, CalendarEvent $calendarEvent): bool
    {
        // Users can view their own events or events in their projects
        return $user->id === $calendarEvent->user_id || 
               ($calendarEvent->project && $calendarEvent->project->users->contains($user));
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CalendarEvent $calendarEvent): bool
    {
        // Users can only update their own events
        return $user->id === $calendarEvent->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CalendarEvent $calendarEvent): bool
    {
        // Users can only delete their own events
        return $user->id === $calendarEvent->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, CalendarEvent $calendarEvent): bool
    {
        return $user->id === $calendarEvent->user_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, CalendarEvent $calendarEvent): bool
    {
        return $user->id === $calendarEvent->user_id;
    }
}
