import {
  createAnime,
  deleteAnime,
  existsSlug,
  getAnimeById,
  listAnimes,
  syncCategories,
  updateAnime,
} from "@/lib/repositories/animes/anime.repository";
import { slugifyText } from "@/lib/utils/slug";
import { animeFormSchema, type AnimeFormValues } from "@/lib/validations/anime.schema";
import type {
  Anime,
  AnimeListQuery,
  AnimeListResult,
  AnimeWithCategories,
} from "@/types/anime.types";

export type AnimeServiceErrorCode = "NOT_FOUND" | "DUPLICATE" | "INVALID";

export class AnimeServiceError extends Error {
  code: AnimeServiceErrorCode;

  constructor(message: string, code: AnimeServiceErrorCode) {
    super(message);
    this.name = "AnimeServiceError";
    this.code = code;
  }
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeOptionalText(value?: string) {
  const normalized = value?.replace(/\s+/g, " ").trim();
  return normalized ? normalized : null;
}

function normalizeCategoryIds(categoryIds: string[]) {
  return Array.from(new Set(categoryIds));
}

function buildSlug(title: string) {
  return slugifyText(title);
}

function assertValidValues(values: AnimeFormValues) {
  const parsed = animeFormSchema.safeParse(values);

  if (!parsed.success) {
    throw new AnimeServiceError(
      parsed.error.issues[0]?.message ?? "Datos de anime inválidos.",
      "INVALID",
    );
  }

  return {
    ...parsed.data,
    title: normalizeText(parsed.data.title),
    description: normalizeOptionalText(parsed.data.description),
    trailerUrl: normalizeOptionalText(parsed.data.trailerUrl),
    openingUrl: normalizeOptionalText(parsed.data.openingUrl),
    endingUrl: normalizeOptionalText(parsed.data.endingUrl),
    coverUrl: normalizeOptionalText(parsed.data.coverUrl),
    bannerUrl: normalizeOptionalText(parsed.data.bannerUrl),
    categoryIds: normalizeCategoryIds(parsed.data.categoryIds),
  };
}

async function ensureAnimeDoesNotDuplicate(slug: string, excludeId?: string) {
  const slugExists = await existsSlug(slug, excludeId);

  if (slugExists) {
    throw new AnimeServiceError("Ya existe un anime con ese título.", "DUPLICATE");
  }
}

export async function getAnimes(params: AnimeListQuery): Promise<AnimeListResult> {
  return listAnimes(params);
}

export async function getAnime(id: string): Promise<AnimeWithCategories | null> {
  return getAnimeById(id);
}

export async function createAnimeService(values: AnimeFormValues): Promise<Anime> {
  const input = assertValidValues(values);
  const slug = buildSlug(input.title);

  await ensureAnimeDoesNotDuplicate(slug);

  const anime = await createAnime({
    title: input.title,
    slug,
    description: input.description,
    status: input.status,
    cover_url: input.coverUrl,
    banner_url: input.bannerUrl,
    trailer_url: input.trailerUrl,
    opening_url: input.openingUrl,
    ending_url: input.endingUrl,
    display_order: input.displayOrder,
    published: input.published,
    featured: input.featured,
  });

  await syncCategories(anime.id, input.categoryIds);

  return anime;
}

export async function updateAnimeService(
  id: string,
  values: AnimeFormValues,
): Promise<Anime> {
  const input = assertValidValues(values);
  const current = await getAnimeById(id);

  if (!current) {
    throw new AnimeServiceError("El anime no existe.", "NOT_FOUND");
  }

  const slug = buildSlug(input.title);

  await ensureAnimeDoesNotDuplicate(slug, id);

  const anime = await updateAnime(id, {
    title: input.title,
    slug,
    description: input.description,
    status: input.status,
    cover_url: input.coverUrl,
    banner_url: input.bannerUrl,
    trailer_url: input.trailerUrl,
    opening_url: input.openingUrl,
    ending_url: input.endingUrl,
    display_order: input.displayOrder,
    published: input.published,
    featured: input.featured,
  });

  await syncCategories(id, input.categoryIds);

  return anime;
}

export async function deleteAnimeService(id: string) {
  const current = await getAnimeById(id);

  if (!current) {
    throw new AnimeServiceError("El anime no existe.", "NOT_FOUND");
  }

  await syncCategories(id, []);
  await deleteAnime(id);

  return current;
}
