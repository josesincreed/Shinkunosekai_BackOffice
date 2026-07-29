import { z } from "zod";

import type { AnimeStatus } from "@/types/anime.types";

const optionalTextSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}, z.string().optional());

const optionalUrlSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}, z.string().url("Ingresa una URL válida").optional());

export const animeStatusSchema = z.enum(["ONGOING", "FINISHED", "UPCOMING", "HIATUS"]);

export const animeFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "El título debe tener al menos 2 caracteres")
    .max(160, "El título no puede superar 160 caracteres"),
  description: optionalTextSchema,
  status: animeStatusSchema,
  categoryIds: z.array(z.string().uuid("ID de categoría inválido")).default([]),
  displayOrder: z
    .coerce.number()
    .int("El orden debe ser un número entero")
    .min(0, "El orden no puede ser negativo"),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  trailerUrl: optionalUrlSchema,
  openingUrl: optionalUrlSchema,
  endingUrl: optionalUrlSchema,
  coverUrl: optionalUrlSchema,
  bannerUrl: optionalUrlSchema,
});

export const animeIdSchema = z.string().uuid("ID de anime inválido");

export type AnimeFormValues = z.infer<typeof animeFormSchema>;
export type AnimeStatusValue = AnimeStatus;
