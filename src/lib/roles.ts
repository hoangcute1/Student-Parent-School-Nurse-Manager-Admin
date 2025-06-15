/**
 * Role management utilities
 */

// Define the role types for the application
export type RoleName = "parent" | "staff" | "admin";

// Define the role interface
export interface Role {
  id: string;
  name: RoleName;
  description: string;
}

// Define the available roles with their descriptions
export const ROLES: Record<RoleName, Role> = {
  parent: {
    id: "role_parent",
    name: "parent",
    description: "Phụ huynh học sinh",
  },
  staff: {
    id: "role_staff",
    name: "staff",
    description: "Nhân viên y tế trường học",
  },
  admin: {
    id: "role_admin",
    name: "admin",
    description: "Quản trị viên hệ thống",
  },
};

/**
 * Check if a role name is valid
 * @param role Role name to check
 * @returns Boolean indicating if role is valid
 */
export function isValidRole(role: string): role is RoleName {
  return Object.keys(ROLES).includes(role as RoleName);
}

/**
 * Get role details by role name
 * @param roleName Role name to get details for
 * @returns Role object or undefined if not found
 */
export function getRoleByName(roleName: string): Role | undefined {
  return isValidRole(roleName) ? ROLES[roleName as RoleName] : undefined;
}

/**
 * Get role details by role ID
 * @param roleId Role ID to get details for
 * @returns Role object or undefined if not found
 */
export function getRoleById(roleId: string): Role | undefined {
  return Object.values(ROLES).find((role) => role.id === roleId);
}

/**
 * Get all available roles
 * @returns Array of all available roles
 */
export function getAllRoles(): Role[] {
  return Object.values(ROLES);
}

/**
 * Check if a user has a specific role
 * @param userRole The user's role
 * @param requiredRole The required role to check against
 * @returns Boolean indicating if the user has the required role
 */
export function hasRole(userRole: string, requiredRole: RoleName): boolean {
  if (!isValidRole(userRole)) return false;

  if (userRole === "admin") return true;

  return userRole === requiredRole;
}

export function hasPermission(
  userRole: string | null,
  allowedRoles: RoleName[]
): boolean {
  if (userRole && !isValidRole(userRole)) return false;

  if (userRole === "admin") return true;

  return allowedRoles.includes(userRole as RoleName);
}

export default {
  ROLES,
  isValidRole,
  getRoleByName,
  getRoleById,
  getAllRoles,
  hasRole,
  hasPermission,
};
