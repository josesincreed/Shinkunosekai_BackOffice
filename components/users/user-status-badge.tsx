import { Badge } from "@/components/ui/badge";

export function UserStatusBadge({ active }: { active: boolean }) {
  return (
    <Badge variant={active ? "secondary" : "outline"} className={active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}>
      {active ? "Activo" : "Inactivo"}
    </Badge>
  );
}
