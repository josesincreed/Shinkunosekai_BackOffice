"use server";

import { revalidatePath } from "next/cache";

import { routes } from "@/lib/constants/routes";
import {
  UserServiceError,
  createUserService,
  getUserService,
  sendRecoveryService,
  toggleUserStatusService,
  updateUserPasswordService,
  updateUserService,
} from "@/lib/services/users/user.service";
import {
  userCreateFormSchema,
  userIdSchema,
  userPasswordFormSchema,
  userUpdateFormSchema,
  type UserCreateFormValues,
  type UserPasswordFormValues,
  type UserUpdateFormValues,
} from "@/lib/validations/users/user.schema";
import type { UserActionResult } from "@/types/user.types";

function getErrorMessage(error: unknown) {
  if (error instanceof UserServiceError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado.";
}

export async function createUserAction(values: UserCreateFormValues): Promise<UserActionResult> {
  const parsed = userCreateFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  try {
    const user = await createUserService(parsed.data);
    revalidatePath(routes.users);

    return {
      ok: true,
      data: user,
      message: "Usuario creado correctamente.",
    };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function updateUserAction(
  id: string,
  values: UserUpdateFormValues,
): Promise<UserActionResult> {
  const parsedId = userIdSchema.safeParse(id);

  if (!parsedId.success) {
    return { ok: false, error: "ID de usuario inválido." };
  }

  const parsed = userUpdateFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  try {
    const user = await updateUserService(parsedId.data, parsed.data);
    revalidatePath(routes.users);
    revalidatePath(`${routes.users}/${parsedId.data}`);

    return {
      ok: true,
      data: user,
      message: "Usuario actualizado correctamente.",
    };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function updateUserPasswordAction(
  id: string,
  values: UserPasswordFormValues,
): Promise<UserActionResult> {
  const parsedId = userIdSchema.safeParse(id);

  if (!parsedId.success) {
    return { ok: false, error: "ID de usuario inválido." };
  }

  const parsed = userPasswordFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  try {
    const user = await updateUserPasswordService(parsedId.data, parsed.data);
    revalidatePath(routes.users);
    revalidatePath(`${routes.users}/${parsedId.data}`);

    return {
      ok: true,
      data: user,
      message: "Contraseña cambiada correctamente.",
    };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function sendUserRecoveryAction(id: string): Promise<UserActionResult> {
  const parsedId = userIdSchema.safeParse(id);

  if (!parsedId.success) {
    return { ok: false, error: "ID de usuario inválido." };
  }

  try {
    const user = await sendRecoveryService(parsedId.data);
    return {
      ok: true,
      data: user,
      message: "Correo de recuperación enviado correctamente.",
    };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function toggleUserStatusAction(id: string): Promise<UserActionResult> {
  const parsedId = userIdSchema.safeParse(id);

  if (!parsedId.success) {
    return { ok: false, error: "ID de usuario inválido." };
  }

  try {
    const user = await toggleUserStatusService(parsedId.data);
    revalidatePath(routes.users);
    revalidatePath(`${routes.users}/${parsedId.data}`);

    return {
      ok: true,
      data: user,
      message: user.active ? "Usuario activado correctamente." : "Usuario desactivado correctamente.",
    };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}
