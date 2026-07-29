import { cn } from "@/lib/utils/cn";

export function Separator({ className }: { className?: string }) {
  return <hr className={cn("border-slate-200", className)} />;
}
