import Link from "next/link";

import { routes } from "@/lib/constants/routes";

const items = [
  { href: routes.dashboard, label: "Dashboard" },
  { href: routes.animes, label: "Animes" },
  { href: routes.categories, label: "Categorías" },
  { href: routes.users, label: "Usuarios" },
  { href: routes.settings, label: "Configuración" },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 border-r border-black/10 bg-white px-4 py-6 lg:block">
      <div className="mb-8">
        <p className="text-lg font-semibold">Shinku no Sekai BO</p>
        <p className="text-sm text-slate-500">Anime admin</p>
      </div>
      <nav className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
