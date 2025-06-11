// Permission utility functions for frontend permission checking
import { User } from "@/types";

export interface UserWithPermissions extends User {
    roles?: string[];
    permissions?: string[];
    can?: {
        manage_users?: boolean;
        create_project?: boolean;
        update_project?: boolean;
        delete_project?: boolean;
        view_tasks?: boolean;
        assign_tasks?: boolean;
        update_tasks?: boolean;
        comment_tasks?: boolean;
        comment_projects?: boolean;
        view_dashboard?: boolean;
    };
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(
    user: UserWithPermissions,
    permission: string
): boolean {
    // Admin users have all permissions
    if (hasRole(user, "Admin")) {
        return true;
    }

    // Check permissions using the 'can' object first (most efficient)
    if (user.can) {
        const permissionKey = permission.replace(
            " ",
            "_"
        ) as keyof typeof user.can;
        const canDoAction = user.can[permissionKey];
        if (canDoAction !== undefined) {
            return canDoAction;
        }
    }

    // Check direct permissions array as fallback
    if (user.permissions?.includes(permission)) {
        return true;
    }

    return false;
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: UserWithPermissions, roleName: string): boolean {
    return user.roles?.includes(roleName) ?? false;
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
    user: UserWithPermissions,
    permissions: string[]
): boolean {
    return permissions.some((permission) => hasPermission(user, permission));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
    user: UserWithPermissions,
    permissions: string[]
): boolean {
    return permissions.every((permission) => hasPermission(user, permission));
}

/**
 * Get user's role name for display
 */
export function getUserRole(user: UserWithPermissions): string {
    if (hasRole(user, "Admin")) return "Administrator";
    if (hasRole(user, "Project Manager")) return "Project Manager";
    if (hasRole(user, "Team Member")) return "Team Member";
    return "User";
}

/**
 * Check if user can create projects
 */
export function canCreateProject(user: UserWithPermissions): boolean {
    return hasPermission(user, "create project");
}

/**
 * Check if user can update projects
 */
export function canUpdateProject(user: UserWithPermissions): boolean {
    return hasPermission(user, "update project");
}

/**
 * Check if user can delete projects
 */
export function canDeleteProject(user: UserWithPermissions): boolean {
    return hasPermission(user, "delete project");
}

/**
 * Check if user can assign tasks
 */
export function canAssignTasks(user: UserWithPermissions): boolean {
    return hasPermission(user, "assign tasks");
}

/**
 * Check if user can update tasks
 */
export function canUpdateTasks(user: UserWithPermissions): boolean {
    return hasPermission(user, "update tasks");
}

/**
 * Check if user can delete tasks
 */
export function canDeleteTasks(user: UserWithPermissions): boolean {
    return hasPermission(user, "assign tasks") || hasRole(user, "Admin");
}

/**
 * Check if user can update a specific project (considering ownership and membership)
 */
export function canUpdateSpecificProject(
    user: UserWithPermissions,
    project: any
): boolean {
    // Admin can update any project
    if (hasRole(user, "Admin")) return true;

    // Project owner can update
    if (project.user_id === user.id) return true;

    // Project members with lead role might be able to update (depends on business logic)
    if (project.members && hasPermission(user, "update project")) {
        const userMembership = project.members.find(
            (member: any) => member.id === user.id
        );
        return userMembership && userMembership.pivot?.role === "lead";
    }

    return false;
}

/**
 * Check if user can delete a specific project
 */
export function canDeleteSpecificProject(
    user: UserWithPermissions,
    project: any
): boolean {
    // Admin can delete any project
    if (hasRole(user, "Admin")) return true;

    // Only project owner can delete project
    return project.user_id === user.id && hasPermission(user, "delete project");
}

/**
 * Check if user can view project (read-only access)
 */
export function canViewProject(user: UserWithPermissions, project: any): boolean {
    // Admin can view any project
    if (hasRole(user, "Admin")) return true;

    // Project owner can view
    if (project.user_id === user.id) return true;

    // Project members can view
    if (project.members) {
        return project.members.some((member: any) => member.id === user.id);
    }

    // Users assigned to tasks in the project can view
    if (project.tasks) {
        return project.tasks.some((task: any) => task.assigned_to === user.id);
    }

    return false;
}

/**
 * Check if user can comment on tasks
 */
export function canCommentTasks(user: UserWithPermissions): boolean {
    return hasPermission(user, "comment tasks");
}

/**
 * Check if user can comment on projects
 */
export function canCommentProjects(user: UserWithPermissions): boolean {
    return hasPermission(user, "comment projects");
}

/**
 * Check if user can manage users
 */
export function canManageUsers(user: UserWithPermissions): boolean {
    return hasPermission(user, "manage users");
}

/**
 * Check if user can view dashboard
 */
export function canViewDashboard(user: UserWithPermissions): boolean {
    return hasPermission(user, "view dashboard");
}

/**
 * Check if user can delete a specific task (considering project ownership)
 */
export function canDeleteSpecificTask(
    user: UserWithPermissions,
    task: any
): boolean {
    // Admin can delete any task
    if (hasRole(user, "Admin")) return true;

    // Project owner can delete task (must have assign tasks permission)
    if (task.project && task.project.user_id === user.id && hasPermission(user, "assign tasks")) {
        return true;
    }

    return false;
}
