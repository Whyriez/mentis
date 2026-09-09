export type UserRole = "super_admin" | "admin" | "editor" | "user";

export function isAdminRole(role?: UserRole | string | null): boolean {
  if (!role) return false;
  return ["super_admin", "admin", "editor"].includes(role);
}

export function canManageUsers(role?: UserRole | string | null): boolean {
  return role === "super_admin";
}

export function canEditContent(role?: UserRole | string | null): boolean {
  if (!role) return false;
  return ["super_admin", "admin", "editor"].includes(role);
}
