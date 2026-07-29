import { z } from "zod";

export const categoryNameSchema = z
  .string()
  .trim()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(80, "El nombre no puede superar 80 caracteres");

export const categoryFormSchema = z.object({
  name: categoryNameSchema,
});

export const categoryIdSchema = z.string().uuid("ID de categoría inválido");

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
