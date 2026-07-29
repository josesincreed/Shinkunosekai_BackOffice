import Link from "next/link";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/animes", label: "Animes" },
  { href: "/categories", label: "Categorías" },
  { href: "/users", label: "Usuarios" },
  { href: "/settings", label: "Configuración" },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 border-r border-black/10 bg-white px-4 py-6 lg:block">
      <div className="mb-8">
        <p className="text-lg font-semibold">Shinkunosekai BO</p>
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
