"use server";

import { UserService } from "../services/user-service";
import { UserRole, UserAccountStatus } from "../types";

const userService = new UserService();

export async function updateUserRoleAction(
  userId: string,
  newRole: UserRole
): Promise<{ success: boolean }> {
  const ok = await userService.updateUserRole(userId, newRole);
  return { success: ok };
}

export async function toggleUserStatusAction(
  userId: string,
  newStatus: UserAccountStatus
): Promise<{ success: boolean }> {
  const ok = await userService.toggleUserStatus(userId, newStatus);
  return { success: ok };
}

export async function resetUserProgressAction(
  userId: string
): Promise<{ success: boolean }> {
  const ok = await userService.resetUserProgress(userId);
  return { success: ok };
}
