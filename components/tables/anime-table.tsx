"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type OnChangeFn, type SortingState } from "@tanstack/react-table";
import { ArrowUpDown, Film, Search } from "lucide-react";
import { motion } from "motion/react";

import { AnimeRowActions } from "@/components/animes/anime-row-actions";
import { AnimeStatusBadge } from "@/components/animes/anime-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";
import { routes } from "@/lib/constants/routes";
import type { AnimeListSortBy, AnimeWithCategories } from "@/types/anime.types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatCategories(anime: AnimeWithCategories) {
  if (anime.categories.length === 0) {
    return <Badge variant="outline">Sin categorías</Badge>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {anime.categories.slice(0, 3).map((category) => (
        <Badge key={category.id} variant="secondary">
          {category.name}
        </Badge>
      ))}
      {anime.categories.length > 3 ? (
        <Badge variant="outline">+{anime.categories.length - 3}</Badge>
      ) : null}
    </div>
  );
}

function booleanBadge(value: boolean, label: string) {
  return <Badge variant={value ? "secondary" : "outline"}>{value ? `Sí, ${label}` : `No, ${label}`}</Badge>;
}

export function AnimeTable({
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
  data: AnimeWithCategories[];
  isLoading?: boolean;
  page: number;
  pageCount: number;
  total: number;
  search: string;
  sortBy: AnimeListSortBy;
  sortDir: "asc" | "desc";
  onSearchChange: (search: string) => void;
  onPageChange: (page: number) => void;
  onSortingChange: OnChangeFn<SortingState>;
}) {
  const [searchValue, setSearchValue] = useState(search);
  const debouncedSearch = useDebounce(searchValue, 350);
  const router = useRouter();

  const handleCreate = () => {
    router.push(`${routes.animes}/new`);
  };

  const columns = useMemo<ColumnDef<AnimeWithCategories>[]>(() => [
    {
      id: "cover",
      header: "",
      cell: ({ row }) => (
        row.original.cover_url ? (
          <Link
            href={`/animes/${row.original.id}`}
            className="block h-16 w-12 overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
          >
            <img
              src={row.original.cover_url}
              alt={`Cover de ${row.original.title}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </Link>
        ) : (
          <Link
            href={`/animes/${row.original.id}`}
            className="flex h-16 w-12 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200"
          >
            <Film className="h-4 w-4 text-slate-500" />
          </Link>
        )
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Título
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Link href={`/animes/${row.original.id}`} className="block space-y-1 text-left">
          <p className="font-medium text-slate-900 hover:underline">{row.original.title}</p>
          <p className="text-xs text-slate-500">{row.original.slug}</p>
        </Link>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Estado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <AnimeStatusBadge status={row.original.status} />,
    },
    {
      id: "categories",
      header: "Categorías",
      cell: ({ row }) => formatCategories(row.original),
    },
    {
      accessorKey: "published",
      header: "Publicado",
      cell: ({ row }) => booleanBadge(row.original.published, "publicado"),
    },
    {
      accessorKey: "featured",
      header: "Destacado",
      cell: ({ row }) => booleanBadge(row.original.featured, "destacado"),
    },
    {
      accessorKey: "display_order",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Orden
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="text-slate-700">{row.original.display_order}</span>,
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
      cell: ({ row }) => <AnimeRowActions anime={row.original} />,
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
      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Animes</CardTitle>
              <p className="text-sm text-slate-500">{total} anime(s) en total</p>
            </div>
            <Button type="button" onClick={handleCreate}>
              Nuevo anime
            </Button>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Buscar por título o slug"
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
            <EmptyState title="No hay animes todavía." />
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
