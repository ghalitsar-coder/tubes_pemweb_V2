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
    return hasPermission(user, "update tasks"); // Using update tasks permission for delete as well
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
