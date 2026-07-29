"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";

import { CategoryTable } from "@/components/categories/category-table";
import { PageHeader } from "@/components/shared/page-header";
import type { CategoryListResult } from "@/types/category.types";
import { routes } from "@/lib/constants/routes";

export function CategoriesPage({ data }: { data: CategoryListResult }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const sortBy = (searchParams.get("sortBy") as "name" | "created_at") ?? "created_at";
  const sortDir = (searchParams.get("sortDir") as "asc" | "desc") ?? "desc";

  const updateQuery = (patch: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams(searchParams.toString());

    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });

    router.push(`${routes.categories}?${next.toString()}`);
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
        title="Categorías"
        description="Organiza los animes del catálogo con un sistema de categorías limpio y escalable."
      />

      <CategoryTable
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
