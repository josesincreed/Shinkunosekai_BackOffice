"use client";

import { Shield, UserCheck, UserMinus, UserRound, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";

import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { UserTable } from "@/components/tables/user-table";
import { PageHeader } from "@/components/shared/page-header";
import { routes } from "@/lib/constants/routes";
import type { UserListQuery, UserListResult, UserListRoleFilter, UserListSortBy, UserListStatusFilter } from "@/types/user.types";

export function UsersPage({ data }: { data: UserListResult }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const role = (searchParams.get("role") as UserListRoleFilter) ?? "all";
  const status = (searchParams.get("status") as UserListStatusFilter) ?? "all";
  const sortBy = (searchParams.get("sortBy") as UserListSortBy) ?? "created_at";
  const sortDir = (searchParams.get("sortDir") as "asc" | "desc") ?? "desc";

  const updateQuery = (patch: Partial<Record<keyof UserListQuery | "role" | "status", string | number | undefined>>) => {
    const next = new URLSearchParams(searchParams.toString());

    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });

    router.push(`${routes.users}?${next.toString()}`);
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const currentSorting: SortingState = [
      {
        id: sortBy,
        desc: sortDir === "desc",
      },
    ];

    const nextSorting = typeof updater === "function" ? updater(currentSorting) : updater;
    const current = nextSorting[0];

    if (!current) return;

    updateQuery({
      sortBy: current.id,
      sortDir: current.desc ? "desc" : "asc",
      page: 1,
    });
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title="Usuarios"
        description="Administra perfiles del back office y usuarios web con permisos y estados controlados."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <DashboardStatCard title="Administradores" value={String(data.stats.admins)} description="Acceso total al panel." icon={Shield} />
        <DashboardStatCard title="Editores" value={String(data.stats.editors)} description="Pueden gestionar contenido." icon={UserRound} />
        <DashboardStatCard title="Usuarios web" value={String(data.stats.webUsers)} description="Registrados en el sitio público." icon={Users} />
        <DashboardStatCard title="Usuarios activos" value={String(data.stats.active)} description="Pueden iniciar sesión." icon={UserCheck} />
        <DashboardStatCard title="Usuarios inactivos" value={String(data.stats.inactive)} description="Suspendidos o deshabilitados." icon={UserMinus} />
      </section>

      <UserTable
        data={data.items}
        page={data.page}
        pageCount={data.pageCount}
        total={data.total}
        search={currentSearch}
        role={role}
        status={status}
        sortBy={sortBy}
        sortDir={sortDir}
        onSearchChange={(value) => updateQuery({ search: value, page: 1 })}
        onPageChange={(page) => updateQuery({ page })}
        onSortingChange={handleSortingChange}
        onRoleChange={(nextRole) => updateQuery({ role: nextRole, page: 1 })}
        onStatusChange={(nextStatus) => updateQuery({ status: nextStatus, page: 1 })}
      />
    </section>
  );
}
