import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CategoryRow } from "@/types/category.types";
import type {
  Anime,
  AnimeListQuery,
  AnimeListResult,
  AnimeRow,
  AnimeWithCategories,
} from "@/types/anime.types";

const ANIME_SELECT =
  "id,title,slug,description,status,cover_url,banner_url,trailer_url,opening_url,ending_url,display_order,published,featured,created_at,updated_at";

type AnimeUpsertInput = {
  title: string;
  slug: string;
  description: string | null;
  status: Anime["status"];
  cover_url: string | null;
  banner_url: string | null;
  trailer_url: string | null;
  opening_url: string | null;
  ending_url: string | null;
  display_order: number;
  published: boolean;
  featured: boolean;
};

function applySearch(query: any, search?: string) {
  if (!search?.trim()) {
    return query;
  }

  const escaped = search.trim().replace(/,/g, " ");
  return (query as any).or(`title.ilike.%${escaped}%,slug.ilike.%${escaped}%,description.ilike.%${escaped}%`);
}

async function fetchCategoriesForAnimeIds(animeIds: string[]) {
  const supabase = createSupabaseAdminClient();

  if (animeIds.length === 0) {
    return new Map<string, CategoryRow[]>();
  }

  const { data: relations, error: relationError } = await supabase
    .from("anime_categories")
    .select("anime_id,category_id")
    .in("anime_id", animeIds);

  if (relationError) {
    throw new Error(relationError.message);
  }

  const uniqueCategoryIds = Array.from(
    new Set((relations ?? []).map((relation) => relation.category_id as string)),
  );

  const categoriesById = new Map<string, CategoryRow>();

  if (uniqueCategoryIds.length > 0) {
    const { data: categories, error: categoryError } = await supabase
      .from("categories")
      .select("id,name,slug,created_at")
      .in("id", uniqueCategoryIds);

    if (categoryError) {
      throw new Error(categoryError.message);
    }

    for (const category of categories ?? []) {
      const row = category as CategoryRow;
      categoriesById.set(row.id, row);
    }
  }

  const result = new Map<string, CategoryRow[]>();

  for (const animeId of animeIds) {
    result.set(animeId, []);
  }

  for (const relation of relations ?? []) {
    const animeId = relation.anime_id as string;
    const categoryId = relation.category_id as string;
    const category = categoriesById.get(categoryId);

    if (!category) {
      continue;
    }

    result.set(animeId, [...(result.get(animeId) ?? []), category]);
  }

  return result;
}

async function attachCategories(animes: AnimeRow[]): Promise<AnimeWithCategories[]> {
  const categoriesMap = await fetchCategoriesForAnimeIds(animes.map((anime) => anime.id));

  return animes.map((anime) => ({
    ...anime,
    categories: categoriesMap.get(anime.id) ?? [],
  }));
}

export async function listAnimes(params: AnimeListQuery): Promise<AnimeListResult> {
  const supabase = createSupabaseAdminClient();
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const sortBy = params.sortBy ?? "display_order";
  const sortDir = params.sortDir ?? "asc";

  let query = supabase
    .from("animes")
    .select(ANIME_SELECT, { count: "exact" })
    .order(sortBy, { ascending: sortDir === "asc" })
    .range(from, to);

  query = applySearch(query, params.search);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const animes = (data ?? []) as AnimeRow[];

  return {
    items: await attachCategories(animes),
    total: count ?? 0,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  };
}

export async function getAnimeById(id: string): Promise<AnimeWithCategories | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("animes")
    .select(ANIME_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const [anime] = await attachCategories([data as AnimeRow]);
  return anime ?? null;
}

export async function createAnime(input: AnimeUpsertInput): Promise<Anime> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("animes")
    .insert(input)
    .select(ANIME_SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Anime;
}

export async function updateAnime(
  id: string,
  input: AnimeUpsertInput,
): Promise<Anime> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("animes")
    .update(input)
    .eq("id", id)
    .select(ANIME_SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Anime;
}

export async function deleteAnime(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("animes").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function existsSlug(slug: string, excludeId?: string) {
  const supabase = createSupabaseAdminClient();
  let query = supabase.from("animes").select("id").eq("slug", slug).limit(1);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return Boolean(data);
}

export async function syncCategories(animeId: string, categoryIds: string[]) {
  const supabase = createSupabaseAdminClient();

  const deleteResponse = await supabase.from("anime_categories").delete().eq("anime_id", animeId);

  if (deleteResponse.error) {
    throw new Error(deleteResponse.error.message);
  }

  if (categoryIds.length === 0) {
    return;
  }

  const payload = categoryIds.map((categoryId) => ({
    anime_id: animeId,
    category_id: categoryId,
  }));

  const { error } = await supabase.from("anime_categories").insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}
