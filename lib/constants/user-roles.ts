import type { UserRole } from "@/types/user.types";

export const userRoles = ["ADMIN", "EDITOR", "USER"] as const satisfies readonly UserRole[];

export const userRoleLabels: Record<UserRole, string> = {
  ADMIN: "Administrador",
  EDITOR: "Editor",
  USER: "Usuario web",
};
