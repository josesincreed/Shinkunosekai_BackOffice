export function canManageUsers(role?: string | null) {
  return role === "ADMIN";
}
