import { notFound } from "next/navigation";

import { AnimeRouteDialog } from "@/components/animes/anime-route-dialog";
import { getCategories } from "@/lib/services/categories/category.service";
import { getAnime } from "@/lib/services/animes/anime.service";
import type { AnimeFormValues } from "@/lib/validations/anime.schema";

export default async function EditAnimePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const anime = await getAnime(id);

  if (!anime) {
    notFound();
  }

  const categories = await getCategories({
    page: 1,
    pageSize: 1000,
    sortBy: "name",
    sortDir: "asc",
  });

  const initialValues: AnimeFormValues = {
    title: anime.title,
    description: anime.description ?? "",
    status: anime.status,
    categoryIds: anime.categories.map((category) => category.id),
    displayOrder: anime.display_order,
    published: anime.published,
    featured: anime.featured,
    trailerUrl: anime.trailer_url ?? "",
    openingUrl: anime.opening_url ?? "",
    endingUrl: anime.ending_url ?? "",
    coverUrl: anime.cover_url ?? "",
    bannerUrl: anime.banner_url ?? "",
  };

  return (
    <AnimeRouteDialog
      mode="edit"
      anime={anime}
      initialValues={initialValues}
      categories={categories.items}
      returnHref="/animes"
    />
  );
}
