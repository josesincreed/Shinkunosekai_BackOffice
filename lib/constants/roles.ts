import { AUTH_ROLES } from "@/lib/auth/roles";
import type { ProfileRole } from "@/types/profile.types";

export const roles = AUTH_ROLES;

export const roleLabels: Record<ProfileRole, string> = {
  ADMIN: "Administrador",
  EDITOR: "Editor",
};
