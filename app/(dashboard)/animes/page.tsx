import { AnimesPage } from "@/components/animes/animes-page";
import { getAnimes } from "@/lib/services/animes/anime.service";

function getNumber(value: string | string[] | undefined, fallback: number) {
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  return fallback;
}

export default async function AnimesIndexPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const data = await getAnimes({
    page: getNumber(params.page, 1),
    pageSize: getNumber(params.pageSize, 10),
    search: typeof params.search === "string" ? params.search : "",
    sortBy:
      params.sortBy === "title" ||
      params.sortBy === "status" ||
      params.sortBy === "display_order" ||
      params.sortBy === "created_at"
        ? params.sortBy
        : "display_order",
    sortDir: params.sortDir === "desc" ? "desc" : "asc",
  });

  return <AnimesPage data={data} />;
}
