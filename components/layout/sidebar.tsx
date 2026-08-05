 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Clapperboard, Grid2x2, Settings, Users } from "lucide-react";

import { routes } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: routes.dashboard, label: "Dashboard", icon: BarChart3 },
  { href: routes.animes, label: "Animes", icon: Clapperboard },
  { href: routes.categories, label: "Categorías", icon: Grid2x2 },
  { href: routes.users, label: "Usuarios", icon: Users },
  { href: routes.settings, label: "Configuración", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-black/10 bg-white px-4 py-6 md:block">
      <div className="mb-8">
        <p className="text-lg font-semibold">Shinku no Sekai BO</p>
        <p className="text-sm text-slate-500">Anime admin</p>
      </div>
      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === routes.dashboard
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
