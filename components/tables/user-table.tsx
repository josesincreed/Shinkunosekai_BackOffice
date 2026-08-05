"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type OnChangeFn, type SortingState } from "@tanstack/react-table";
import { ArrowUpDown, Search } from "lucide-react";
import { motion } from "motion/react";

import { UserAvatar } from "@/components/users/user-avatar";
import { UserRoleBadge } from "@/components/users/user-role-badge";
import { UserRowActions } from "@/components/users/user-row-actions";
import { UserStatusBadge } from "@/components/users/user-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";
import { routes } from "@/lib/constants/routes";
import type { UserListRoleFilter, UserListSortBy, UserListStatusFilter, UserRow } from "@/types/user.types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(new Date(value));
}

const filters: Array<{ label: string; role?: UserListRoleFilter; status?: UserListStatusFilter }> = [
  { label: "Todos" },
  { label: "Administradores", role: "ADMIN" },
  { label: "Editores", role: "EDITOR" },
  { label: "Usuarios Web", role: "USER" },
  { label: "Activos", status: "active" },
  { label: "Inactivos", status: "inactive" },
];

export function UserTable({
  data,
  isLoading,
  page,
  pageCount,
  total,
  search,
  role,
  status,
  sortBy,
  sortDir,
  onSearchChange,
  onPageChange,
  onSortingChange,
  onRoleChange,
  onStatusChange,
}: {
  data: UserRow[];
  isLoading?: boolean;
  page: number;
  pageCount: number;
  total: number;
  search: string;
  role: UserListRoleFilter;
  status: UserListStatusFilter;
  sortBy: UserListSortBy;
  sortDir: "asc" | "desc";
  onSearchChange: (search: string) => void;
  onPageChange: (page: number) => void;
  onSortingChange: OnChangeFn<SortingState>;
  onRoleChange: (role: UserListRoleFilter) => void;
  onStatusChange: (status: UserListStatusFilter) => void;
}) {
  const [searchValue, setSearchValue] = useState(search);
  const debouncedSearch = useDebounce(searchValue, 350);
  const router = useRouter();

  const columns = useMemo<ColumnDef<UserRow>[]>(() => [
    {
      id: "avatar",
      header: "",
      cell: ({ row }) => (
        <Link href={`/users/${row.original.id}`}>
          <UserAvatar name={row.original.full_name ?? row.original.email} avatarUrl={row.original.avatar_url} />
        </Link>
      ),
    },
    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="space-y-1">
          <Link href={`/users/${row.original.id}`} className="font-medium text-slate-950 hover:underline">
            {row.original.full_name ?? "Sin nombre"}
          </Link>
          <p className="text-xs text-slate-500">#{row.original.id.slice(0, 8)}</p>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Correo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="text-slate-600">{row.original.email}</span>,
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Rol
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <UserRoleBadge role={row.original.role} />,
    },
    {
      accessorKey: "active",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Estado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <UserStatusBadge active={row.original.active} />,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Fecha creación
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="text-slate-500">{formatDate(row.original.created_at)}</span>,
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => <UserRowActions user={row.original} />,
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    onSortingChange,
    state: {
      sorting: [{ id: sortBy, desc: sortDir === "desc" }],
    },
  });

  useEffect(() => {
    if (debouncedSearch !== search) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, onSearchChange, search]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Card className="border-slate-200/80 bg-white/90 backdrop-blur">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Usuarios</CardTitle>
              <p className="text-sm text-slate-500">{total} usuario(s) en total</p>
            </div>
            <Button type="button" onClick={() => router.push(`${routes.users}/new`)}>
              Nuevo usuario
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const isActive =
                filter.role === role && filter.status === status ||
                (!filter.role && !filter.status && role === "all" && status === "all");

              return (
                <button
                  key={filter.label}
                  type="button"
                  className={[
                    "inline-flex items-center rounded-full border px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                  onClick={() => {
                    onRoleChange(filter.role ?? "all");
                    onStatusChange(filter.status ?? "all");
                  }}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Buscar por nombre o correo"
              className="border-0 px-0 shadow-none focus-visible:ring-0"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <EmptyState title="No hay usuarios para mostrar." />
          ) : (
            <div className="overflow-visible rounded-lg border border-slate-200">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span>
              Página {page} de {pageCount}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                Anterior
              </Button>
              <Button variant="secondary" size="sm" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
