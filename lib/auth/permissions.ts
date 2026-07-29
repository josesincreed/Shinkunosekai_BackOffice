import { AUTH_ROLES } from "@/lib/auth/roles";
import type { ProfileRole } from "@/types/profile.types";

export function canAccessBackOffice(role: ProfileRole) {
  return AUTH_ROLES.includes(role);
}
