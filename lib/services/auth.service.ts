import type { User } from "@supabase/supabase-js";

import { AUTH_ROLES } from "@/lib/auth/roles";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LoginFormValues } from "@/lib/validations/login.schema";
import type { Profile } from "@/types/profile.types";

export type AuthContext = {
  user: User;
  profile: Profile;
};

export type AuthSuccess = {
  user: User;
  profile: Profile;
};

export type AuthFailure = {
  ok: false;
  error: string;
};

const AUTHORIZED_ROLES = new Set(AUTH_ROLES);
const PROFILE_SELECT =
  "id,email,full_name,avatar_url,role,active,created_at,updated_at";

function formatAuthError(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return fallback;
}

function isAuthorizedProfile(profile: Profile) {
  return profile.active && AUTHORIZED_ROLES.has(profile.role);
}

async function fetchAuthorizedProfile(userId: string) {
  const supabaseAdmin = createSupabaseAdminClient();
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(formatAuthError(error, "No se pudo leer el perfil."));
  }

  if (!data) {
    return null;
  }

  return data as Profile;
}

export async function authenticateWithPassword(
  values: LoginFormValues,
): Promise<{ ok: true; data: AuthSuccess } | AuthFailure> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword(values);

  if (error) {
    return {
      ok: false,
      error: formatAuthError(error, "No se pudo iniciar sesión."),
    };
  }

  if (!data.user) {
    return {
      ok: false,
      error: "No se pudo obtener el usuario autenticado.",
    };
  }

  const profile = await fetchAuthorizedProfile(data.user.id);

  if (!profile) {
    await supabase.auth.signOut();
    return {
      ok: false,
      error: "Tu perfil no está registrado o no tiene acceso al back office.",
    };
  }

  if (!isAuthorizedProfile(profile)) {
    await supabase.auth.signOut();
    return {
      ok: false,
      error: "Tu cuenta está inactiva o no tiene permisos para acceder.",
    };
  }

  return {
    ok: true,
    data: {
      user: data.user,
      profile,
    },
  };
}

export async function getCurrentAuthContext(): Promise<AuthContext | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  const profile = await fetchAuthorizedProfile(data.user.id);

  if (!profile || !isAuthorizedProfile(profile)) {
    return null;
  }

  return {
    user: data.user,
    profile,
  };
}

export async function signOutCurrentUser() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}
