import { AnimeRouteDialog } from "@/components/animes/anime-route-dialog";
import { getCategories } from "@/lib/services/categories/category.service";

export default async function NewAnimePage() {
  const categories = await getCategories({
    page: 1,
    pageSize: 1000,
    sortBy: "name",
    sortDir: "asc",
  });

  return <AnimeRouteDialog mode="create" categories={categories.items} returnHref="/animes" />;
}
