import { Badge } from "@/components/ui/badge";
import { userRoleLabels } from "@/lib/constants/user-roles";
import type { UserRole } from "@/types/user.types";

const roleTone: Record<UserRole, string> = {
  ADMIN: "bg-slate-900 text-white",
  EDITOR: "bg-sky-100 text-sky-700",
  USER: "bg-emerald-100 text-emerald-700",
};

export function UserRoleBadge({ role }: { role: UserRole }) {
  return <Badge className={roleTone[role]}>{userRoleLabels[role]}</Badge>;
}
