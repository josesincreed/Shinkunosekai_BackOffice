"use server";

import { revalidatePath } from "next/cache";

import { routes } from "@/lib/constants/routes";
import {
  AnimeServiceError,
  createAnimeService,
  deleteAnimeService,
  updateAnimeService,
} from "@/lib/services/animes/anime.service";
import { uploadFile } from "@/lib/services/upload.service";
import { storageBuckets } from "@/lib/constants/storage";
import { animeFormSchema, animeIdSchema, type AnimeFormValues } from "@/lib/validations/anime.schema";
import type { AnimeActionResult } from "@/types/anime.types";
import type { ActionResult } from "@/types/api.types";

function getErrorMessage(error: unknown) {
  if (error instanceof AnimeServiceError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado.";
}

export async function createAnimeAction(
  values: AnimeFormValues,
): Promise<AnimeActionResult> {
  const parsed = animeFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  try {
    const anime = await createAnimeService(parsed.data);
    revalidatePath(routes.animes);

    return {
      ok: true,
      data: anime,
      message: "Anime creado correctamente.",
    };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function updateAnimeAction(
  id: string,
  values: AnimeFormValues,
): Promise<AnimeActionResult> {
  const parsedId = animeIdSchema.safeParse(id);

  if (!parsedId.success) {
    return { ok: false, error: "ID de anime inválido." };
  }

  const parsed = animeFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  try {
    const anime = await updateAnimeService(parsedId.data, parsed.data);
    revalidatePath(routes.animes);
    revalidatePath(`${routes.animes}/${parsedId.data}`);

    return {
      ok: true,
      data: anime,
      message: "Anime actualizado correctamente.",
    };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function deleteAnimeAction(id: string): Promise<AnimeActionResult> {
  const parsedId = animeIdSchema.safeParse(id);

  if (!parsedId.success) {
    return { ok: false, error: "ID de anime inválido." };
  }

  try {
    const anime = await deleteAnimeService(parsedId.data);
    revalidatePath(routes.animes);
    revalidatePath(`${routes.animes}/${parsedId.data}`);

    return {
      ok: true,
      data: anime,
      message: "Anime eliminado correctamente.",
    };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function uploadAnimeImageAction(formData: FormData): Promise<ActionResult<string>> {
  const file = formData.get("file");
  const field = formData.get("field");

  if (!(file instanceof File)) {
    return { ok: false, error: "Archivo inválido." };
  }

  const target = field === "banner" ? "banners" : "covers";

  try {
    const result = await uploadFile({
      file,
      folder: `${storageBuckets.animeImages}/${target}`,
    });

    return {
      ok: true,
      data: result.url,
      message: "Imagen cargada correctamente.",
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo cargar la imagen.",
    };
  }
}
