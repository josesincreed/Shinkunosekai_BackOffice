"use server";

import { revalidatePath } from "next/cache";

import { routes } from "@/lib/constants/routes";
import {
  CategoryServiceError,
  createCategoryService,
  deleteCategoryService,
  updateCategoryService,
} from "@/lib/services/categories/category.service";
import { categoryFormSchema, categoryIdSchema, type CategoryFormValues } from "@/lib/validations/categories/category.schema";
import type { CategoryActionResult } from "@/types/category.types";

function getErrorMessage(error: unknown) {
  if (error instanceof CategoryServiceError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado.";
}

export async function createCategoryAction(
  values: CategoryFormValues,
): Promise<CategoryActionResult> {
  const parsed = categoryFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  try {
    const category = await createCategoryService(parsed.data);
    revalidatePath(routes.categories);

    return {
      ok: true,
      data: category,
      message: "Categoría creada correctamente.",
    };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function updateCategoryAction(
  id: string,
  values: CategoryFormValues,
): Promise<CategoryActionResult> {
  const parsedId = categoryIdSchema.safeParse(id);

  if (!parsedId.success) {
    return { ok: false, error: "ID de categoría inválido." };
  }

  const parsed = categoryFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  try {
    const category = await updateCategoryService(parsedId.data, parsed.data);
    revalidatePath(routes.categories);
    revalidatePath(`${routes.categories}/${parsedId.data}`);

    return {
      ok: true,
      data: category,
      message: "Categoría actualizada correctamente.",
    };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function deleteCategoryAction(id: string): Promise<CategoryActionResult> {
  const parsedId = categoryIdSchema.safeParse(id);

  if (!parsedId.success) {
    return { ok: false, error: "ID de categoría inválido." };
  }

  try {
    const category = await deleteCategoryService(parsedId.data);
    revalidatePath(routes.categories);
    revalidatePath(`${routes.categories}/${parsedId.data}`);

    return {
      ok: true,
      data: category,
      message: "Categoría eliminada correctamente.",
    };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}
