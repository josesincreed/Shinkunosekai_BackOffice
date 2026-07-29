"use server";

import { redirect } from "next/navigation";

import { routes } from "@/lib/constants/routes";
import {
  authenticateWithPassword,
  signOutCurrentUser,
} from "@/lib/services/auth.service";
import { loginSchema, type LoginFormValues } from "@/lib/validations/login.schema";

export type SignInActionResult = {
  error?: string;
};

export async function signInAction(
  input: LoginFormValues,
): Promise<SignInActionResult | void> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const result = await authenticateWithPassword(parsed.data);

  if (!result.ok) {
    return { error: result.error };
  }

  redirect(routes.dashboard);
}

export async function signOutAction() {
  await signOutCurrentUser();
  redirect(routes.login);
}
