import type { ProfileRole } from "@/types/profile.types";

export const AUTH_ROLES = ["ADMIN", "EDITOR"] as const satisfies readonly ProfileRole[];

export type AuthRole = (typeof AUTH_ROLES)[number];
