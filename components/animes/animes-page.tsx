"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";

import { AnimeTable } from "@/components/tables/anime-table";
import { PageHeader } from "@/components/shared/page-header";
import { routes } from "@/lib/constants/routes";
import type { AnimeListResult, AnimeListSortBy } from "@/types/anime.types";

export function AnimesPage({ data }: { data: AnimeListResult }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const sortBy = (searchParams.get("sortBy") as AnimeListSortBy) ?? "display_order";
  const sortDir = (searchParams.get("sortDir") as "asc" | "desc") ?? "asc";

  const updateQuery = (patch: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams(searchParams.toString());

    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });

    router.push(`${routes.animes}?${next.toString()}`);
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
        title="Animes"
        description="Administra el catálogo de animes con estado, categorías, flags y orden editorial."
      />

      <AnimeTable
        data={data.items}
        page={data.page}
        pageCount={data.pageCount}
        total={data.total}
        search={currentSearch}
        sortBy={sortBy}
        sortDir={sortDir}
        onSearchChange={(value) => updateQuery({ search: value, page: 1 })}
        onPageChange={(page) => updateQuery({ page })}
        onSortingChange={handleSortingChange}
      />
    </section>
  );
}
