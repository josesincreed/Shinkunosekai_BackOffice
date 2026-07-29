import {
  countAnimeRelations,
  createCategory,
  deleteCategory,
  existsByName,
  existsBySlug,
  getCategoryById,
  listCategories,
  updateCategory,
} from "@/lib/repositories/categories/category.repository";
import { slugifyText } from "@/lib/utils/slug";
import { categoryFormSchema, type CategoryFormValues } from "@/lib/validations/categories/category.schema";
import type {
  Category,
  CategoryListQuery,
  CategoryListResult,
  CategoryWithAnimeCount,
} from "@/types/category.types";

export type CategoryServiceErrorCode = "NOT_FOUND" | "DUPLICATE" | "IN_USE" | "INVALID";

export class CategoryServiceError extends Error {
  code: CategoryServiceErrorCode;

  constructor(message: string, code: CategoryServiceErrorCode) {
    super(message);
    this.name = "CategoryServiceError";
    this.code = code;
  }
}

function normalizeName(name: string) {
  return name.replace(/\s+/g, " ").trim();
}

function buildSlug(name: string) {
  return slugifyText(name);
}

function assertValidName(name: string) {
  const parsed = categoryFormSchema.safeParse({ name });

  if (!parsed.success) {
    throw new CategoryServiceError(
      parsed.error.issues[0]?.message ?? "Nombre de categoría inválido.",
      "INVALID",
    );
  }

  return normalizeName(parsed.data.name);
}

async function ensureCategoryDoesNotDuplicate(name: string, slug: string, excludeId?: string) {
  const [slugExists, nameExists] = await Promise.all([
    existsBySlug(slug, excludeId),
    existsByName(name, excludeId),
  ]);

  if (slugExists || nameExists) {
    throw new CategoryServiceError(
      "Ya existe una categoría con ese nombre.",
      "DUPLICATE",
    );
  }
}

export async function getCategories(params: CategoryListQuery): Promise<CategoryListResult> {
  return listCategories(params);
}

export async function getCategory(id: string): Promise<CategoryWithAnimeCount | null> {
  return getCategoryById(id);
}

export async function createCategoryService(values: CategoryFormValues): Promise<Category> {
  const name = assertValidName(values.name);
  const slug = buildSlug(name);

  await ensureCategoryDoesNotDuplicate(name, slug);

  return createCategory({ name, slug });
}

export async function updateCategoryService(
  id: string,
  values: CategoryFormValues,
): Promise<Category> {
  const name = assertValidName(values.name);
  const slug = buildSlug(name);

  const current = await getCategoryById(id);

  if (!current) {
    throw new CategoryServiceError("La categoría no existe.", "NOT_FOUND");
  }

  await ensureCategoryDoesNotDuplicate(name, slug, id);

  return updateCategory(id, { name, slug });
}

export async function deleteCategoryService(id: string) {
  const current = await getCategoryById(id);

  if (!current) {
    throw new CategoryServiceError("La categoría no existe.", "NOT_FOUND");
  }

  const relationCount = await countAnimeRelations([id]);
  const animeCount = relationCount.get(id) ?? 0;

  if (animeCount > 0) {
    throw new CategoryServiceError(
      "No se puede eliminar una categoría que ya está siendo usada por animes.",
      "IN_USE",
    );
  }

  await deleteCategory(id);

  return current;
}
