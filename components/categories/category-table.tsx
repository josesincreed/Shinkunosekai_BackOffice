"use client";

import { useEffect, useMemo, useState } from "react";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type OnChangeFn, type SortingState } from "@tanstack/react-table";
import { ArrowUpDown, FolderOpen, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

import { CategoryRowActions } from "@/components/categories/category-row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";
import { routes } from "@/lib/constants/routes";
import type { CategoryWithAnimeCount } from "@/types/category.types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function CategoryTable({
  data,
  isLoading,
  page,
  pageCount,
  total,
  search,
  sortBy,
  sortDir,
  onSearchChange,
  onPageChange,
  onSortingChange,
}: {
  data: CategoryWithAnimeCount[];
  isLoading?: boolean;
  page: number;
  pageCount: number;
  total: number;
  search: string;
  sortBy: "name" | "created_at";
  sortDir: "asc" | "desc";
  onSearchChange: (search: string) => void;
  onPageChange: (page: number) => void;
  onSortingChange: OnChangeFn<SortingState>;
}) {
  const [searchValue, setSearchValue] = useState(search);
  const debouncedSearch = useDebounce(searchValue, 350);
  const router = useRouter();
  const handleCreate = () => {
    router.push(`${routes.categories}/new`);
  };

  const columns = useMemo<ColumnDef<CategoryWithAnimeCount>[]>(() => [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-medium text-slate-900">{row.original.name}</span>,
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => <span className="text-slate-500">{row.original.slug}</span>,
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
      accessorKey: "anime_count",
      header: "Animes",
      cell: ({ row }) => (
        <Badge variant={row.original.anime_count > 0 ? "secondary" : "outline"}>
          {row.original.anime_count}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => <CategoryRowActions category={row.original} />,
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

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  useEffect(() => {
    if (debouncedSearch !== search) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, onSearchChange, search]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Categorías</CardTitle>
              <p className="text-sm text-slate-500">{total} categoría(s) en total</p>
            </div>
            <Button type="button" onClick={handleCreate}>
              Nueva categoría
            </Button>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <Input
              value={searchValue}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Buscar por nombre o slug"
              className="border-0 px-0 shadow-none focus-visible:ring-0"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <EmptyState title="No hay categorías todavía." />
          ) : (
            <div className="overflow-visible rounded-lg border border-slate-200">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
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
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= pageCount}
                onClick={() => onPageChange(page + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
