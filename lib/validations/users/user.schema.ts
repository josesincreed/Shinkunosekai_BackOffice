import { z } from "zod";

import { userRoles } from "@/lib/constants/user-roles";
import type { UserRole } from "@/types/user.types";

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

export const userRoleSchema = z.enum(userRoles);

export const userActiveSchema = z.boolean();

export const userCreateFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(120, "El nombre no puede superar 120 caracteres"),
  email: z.string().trim().email("Ingresa un correo válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(128, "La contraseña no puede superar 128 caracteres"),
  role: userRoleSchema,
  active: z.boolean().default(true),
  avatarUrl: optionalUrlSchema,
});

export const userUpdateFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(120, "El nombre no puede superar 120 caracteres"),
  role: userRoleSchema,
  active: z.boolean().default(true),
  avatarUrl: optionalUrlSchema,
});

export const userPasswordFormSchema = z.object({
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(128, "La contraseña no puede superar 128 caracteres"),
});

export const userIdSchema = z.string().uuid("ID de usuario inválido");

export type UserCreateFormValues = z.infer<typeof userCreateFormSchema>;
export type UserUpdateFormValues = z.infer<typeof userUpdateFormSchema>;
export type UserPasswordFormValues = z.infer<typeof userPasswordFormSchema>;
export type UserRoleValue = UserRole;
