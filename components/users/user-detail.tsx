import Link from "next/link";

import { UserRowActions } from "@/components/users/user-row-actions";
import { UserAvatar } from "@/components/users/user-avatar";
import { UserRoleBadge } from "@/components/users/user-role-badge";
import { UserStatusBadge } from "@/components/users/user-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/lib/constants/routes";
import type { UserRow } from "@/types/user.types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "full" }).format(new Date(value));
}

export function UserDetail({ user }: { user: UserRow }) {
  return (
    <Card className="border-slate-200/80 bg-white/90 backdrop-blur">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <UserAvatar name={user.full_name ?? user.email} avatarUrl={user.avatar_url} className="h-16 w-16" />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <UserRoleBadge role={user.role} />
              <UserStatusBadge active={user.active} />
            </div>
            <CardTitle className="text-2xl">{user.full_name ?? user.email}</CardTitle>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
        <UserRowActions user={user} />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-900">Rol</p>
            <UserRoleBadge role={user.role} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-900">Estado</p>
            <UserStatusBadge active={user.active} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-900">Creado</p>
            <p className="text-sm text-slate-600">{formatDate(user.created_at)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-900">Actualizado</p>
            <p className="text-sm text-slate-600">{formatDate(user.updated_at)}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={routes.users}
            className="inline-flex h-10 items-center justify-center rounded-md bg-slate-100 px-4 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200"
          >
            Volver
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
