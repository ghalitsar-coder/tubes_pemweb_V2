<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
use Illuminate\Support\Facades\Cache;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'settings',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'settings' => 'array',
        ];
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    // Project Members Relationships
    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_members')
                    ->withPivot(['role', 'joined_at'])
                    ->withTimestamps()
                    ->orderBy('project_members.created_at', 'desc');
    }

    public function projectMemberships()
    {
        return $this->hasMany(ProjectMember::class);
    }

    // Helper methods for project membership
    public function isProjectMember(Project $project): bool
    {
        return $this->projects()->where('project_id', $project->id)->exists();
    }

    public function getProjectRole(Project $project): ?string
    {
        $membership = $this->projects()->where('project_id', $project->id)->first();
        return $membership ? $membership->pivot->role : null;
    }

    public function getProjectsAsLead()
    {
        return $this->projects()->wherePivot('role', 'lead');
    }

    public function getProjectsAsMember()
    {
        return $this->projects()->whereIn('project_members.role', ['member', 'contributor']);
    }

    public function isOnline()
    {
        return Cache::has('user-is-online-' . $this->id);
    }
}
