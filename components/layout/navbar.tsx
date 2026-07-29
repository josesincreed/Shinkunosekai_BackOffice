import type { Profile } from "@/types/profile.types";

import { UserMenu } from "@/components/layout/user-menu";
import { Logo } from "@/components/shared/logo";

export function Navbar({ profile }: { profile: Profile }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-black/10 bg-white px-6 py-4">
      <div className="space-y-1">
        <Logo />
        <p className="text-sm text-slate-500">
          {profile.full_name ?? profile.email ?? "Administrador"}
        </p>
      </div>
      <UserMenu profile={profile} />
    </header>
  );
}
