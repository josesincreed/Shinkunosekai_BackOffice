"use client";

import { signOutAction } from "@/actions/auth.actions";
import type { Profile } from "@/types/profile.types";

export function UserMenu({ profile }: { profile: Profile }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-semibold text-slate-900">
          {profile.full_name ?? profile.email ?? "Usuario"}
        </p>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          {profile.role}
        </p>
      </div>
      <form action={signOutAction}>
        <button
          type="submit"
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}
