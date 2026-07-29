import { CategoriesPage } from "@/components/categories/categories-page";
import { getCategories } from "@/lib/services/categories/category.service";

function getNumber(value: string | string[] | undefined, fallback: number) {
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  return fallback;
}

export default async function CategoriesIndexPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const data = await getCategories({
    page: getNumber(params.page, 1),
    pageSize: getNumber(params.pageSize, 10),
    search: typeof params.search === "string" ? params.search : "",
    sortBy:
      params.sortBy === "name" || params.sortBy === "created_at"
        ? params.sortBy
        : "created_at",
    sortDir: params.sortDir === "asc" ? "asc" : "desc",
  });

  return <CategoriesPage data={data} />;
}
