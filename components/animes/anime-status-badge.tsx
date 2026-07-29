import { Badge } from "@/components/ui/badge";
import type { AnimeStatus } from "@/types/anime.types";

const statusMeta: Record<AnimeStatus, { label: string; className: string }> = {
  ONGOING: { label: "En emisión", className: "bg-emerald-100 text-emerald-700" },
  FINISHED: { label: "Finalizado", className: "bg-slate-100 text-slate-700" },
  UPCOMING: { label: "Próximamente", className: "bg-amber-100 text-amber-700" },
  HIATUS: { label: "En pausa", className: "bg-violet-100 text-violet-700" },
};

export function AnimeStatusBadge({ status }: { status: AnimeStatus }) {
  const meta = statusMeta[status];

  return <Badge className={meta.className}>{meta.label}</Badge>;
}
