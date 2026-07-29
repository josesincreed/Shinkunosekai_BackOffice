import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  Category,
  CategoryListQuery,
  CategoryListResult,
  CategoryWithAnimeCount,
} from "@/types/category.types";

const CATEGORY_SELECT = "id,name,slug,created_at";

function applySearch(query: any, search?: string) {
  if (!search?.trim()) {
    return query;
  }

  const escaped = search.trim().replace(/,/g, " ");
  return (query as any).or(`name.ilike.%${escaped}%,slug.ilike.%${escaped}%`);
}

export async function listCategories(
  params: CategoryListQuery,
): Promise<CategoryListResult> {
  const supabase = createSupabaseAdminClient();
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const sortBy = params.sortBy ?? "created_at";
  const sortDir = params.sortDir ?? "desc";

  let query = supabase
    .from("categories")
    .select(CATEGORY_SELECT, { count: "exact" })
    .order(sortBy, { ascending: sortDir === "asc" })
    .range(from, to);

  query = applySearch(query, params.search);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const categories = (data ?? []) as Category[];
  const animeCountMap = await countAnimeRelations(categories.map((category) => category.id));

  return {
    items: categories.map((category) => ({
      ...category,
      anime_count: animeCountMap.get(category.id) ?? 0,
    })),
    total: count ?? 0,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  };
}

export async function getCategoryById(id: string): Promise<CategoryWithAnimeCount | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const animeCountMap = await countAnimeRelations([id]);

  return {
    ...(data as Category),
    anime_count: animeCountMap.get(id) ?? 0,
  };
}

export async function createCategory(input: {
  name: string;
  slug: string;
}): Promise<Category> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .insert(input)
    .select(CATEGORY_SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Category;
}

export async function updateCategory(
  id: string,
  input: {
    name: string;
    slug: string;
  },
): Promise<Category> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .update(input)
    .eq("id", id)
    .select(CATEGORY_SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Category;
}

export async function deleteCategory(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function existsBySlug(slug: string, excludeId?: string) {
  const supabase = createSupabaseAdminClient();
  let query = supabase.from("categories").select("id").eq("slug", slug).limit(1);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return Boolean(data);
}

export async function existsByName(name: string, excludeId?: string) {
  const supabase = createSupabaseAdminClient();
  let query = supabase.from("categories").select("id").ilike("name", name).limit(1);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return Boolean(data);
}

export async function countAnimeRelations(categoryIds: string[]) {
  const supabase = createSupabaseAdminClient();

  if (categoryIds.length === 0) {
    return new Map<string, number>();
  }

  const { data, error } = await supabase
    .from("anime_categories")
    .select("category_id")
    .in("category_id", categoryIds);

  if (error) {
    throw new Error(error.message);
  }

  const counts = new Map<string, number>();

  for (const categoryId of categoryIds) {
    counts.set(categoryId, 0);
  }

  for (const row of data ?? []) {
    const categoryId = row.category_id as string;
    counts.set(categoryId, (counts.get(categoryId) ?? 0) + 1);
  }

  return counts;
}
