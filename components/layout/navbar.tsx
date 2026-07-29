import { UserMenu } from "@/components/layout/user-menu";

export function Navbar() {
  return (
    <header className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-4">
      <div>
        <p className="text-sm text-slate-500">Panel administrativo</p>
        <h2 className="text-base font-semibold">Shinkunosekai BO</h2>
      </div>
      <UserMenu />
    </header>
  );
}
