import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  UserListQuery,
  UserListResult,
  UserPasswordValues,
  UserRole,
  UserRow,
  UserStats,
  UserUpdateValues,
} from "@/types/user.types";

const USER_SELECT = "id,email,full_name,avatar_url,role,active,created_at,updated_at";

type UserStatsInternal = UserStats & {
  activeAdmins: number;
};

type CreateAuthUserInput = {
  email: string;
  password: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  active: boolean;
};

type CreateProfileInput = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  active: boolean;
};

type UpdateProfileInput = {
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  active: boolean;
};

function applySearch<T>(query: T, search?: string): T {
  if (!search?.trim()) {
    return query;
  }

  const escaped = search.trim().replace(/,/g, " ");
  return (query as unknown as { or(condition: string): T }).or(
    `full_name.ilike.%${escaped}%,email.ilike.%${escaped}%`,
  );
}

function applyFilters<T>(
  query: T,
  filters: { role?: string; status?: string },
): T {
  let next = query as unknown as {
    eq(column: string, value: string | boolean): T;
  };

  if (filters.role && filters.role !== "all") {
    next = next.eq("role", filters.role);
  }

  if (filters.status && filters.status !== "all") {
    next = next.eq("active", filters.status === "active");
  }

  return next as T;
}

function buildStats(rows: Array<{ role: UserRole; active: boolean }>): UserStatsInternal {
  const initial: UserStatsInternal = {
    admins: 0,
    editors: 0,
    webUsers: 0,
    active: 0,
    inactive: 0,
    activeAdmins: 0,
  };

  return rows.reduce<UserStatsInternal>((accumulator, row) => {
    if (row.role === "ADMIN") {
      accumulator.admins += 1;
      if (row.active) {
        accumulator.activeAdmins += 1;
      }
    }

    if (row.role === "EDITOR") {
      accumulator.editors += 1;
    }

    if (row.role === "USER") {
      accumulator.webUsers += 1;
    }

    if (row.active) {
      accumulator.active += 1;
    } else {
      accumulator.inactive += 1;
    }

    return accumulator;
  }, initial);
}

export async function getUsers(
  params: UserListQuery,
): Promise<UserListResult> {
  const supabase = createSupabaseAdminClient();
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, params.pageSize || 10);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const sortBy = params.sortBy ?? "created_at";
  const sortDir = params.sortDir ?? "desc";

  let listQuery = supabase
    .from("profiles")
    .select(USER_SELECT, { count: "exact" })
    .order(sortBy, { ascending: sortDir === "asc" })
    .range(from, to);

  listQuery = applySearch(listQuery, params.search);
  listQuery = applyFilters(listQuery, {
    role: params.role,
    status: params.status,
  });

  const [
    { data, error, count },
    { data: statsRows, error: statsError },
  ] = await Promise.all([
    listQuery,
    supabase.from("profiles").select("role,active"),
  ]);

  if (error) {
    throw new Error(error.message);
  }

  if (statsError) {
    throw new Error(statsError.message);
  }

  const stats = buildStats((statsRows ?? []) as Array<{ role: UserRole; active: boolean }>);

  return {
    items: (data ?? []) as UserRow[],
    total: count ?? 0,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
    stats: {
      admins: stats.admins,
      editors: stats.editors,
      webUsers: stats.webUsers,
      active: stats.active,
      inactive: stats.inactive,
    },
  };
}

export async function getUserById(id: string): Promise<UserRow | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(USER_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as UserRow | null) ?? null;
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(USER_SELECT)
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as UserRow | null) ?? null;
}

export async function getUserStats(): Promise<UserStatsInternal> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("profiles").select("role,active");

  if (error) {
    throw new Error(error.message);
  }

  return buildStats((data ?? []) as Array<{ role: UserRole; active: boolean }>);
}

export async function countAdmins() {
  const stats = await getUserStats();
  return stats.admins;
}

export async function countEditors() {
  const stats = await getUserStats();
  return stats.editors;
}

export async function countUsers() {
  const stats = await getUserStats();
  return stats.admins + stats.editors + stats.webUsers;
}

export async function countActive() {
  const stats = await getUserStats();
  return stats.active;
}

export async function countInactive() {
  const stats = await getUserStats();
  return stats.inactive;
}

export async function createAuthUser(input: CreateAuthUserInput) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      full_name: input.fullName,
      avatar_url: input.avatarUrl ?? null,
      role: input.role,
      active: input.active,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("No se pudo crear el usuario en Auth.");
  }

  return data.user;
}

export async function deleteAuthUser(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function createProfile(input: CreateProfileInput): Promise<UserRow> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .insert(input)
    .select(USER_SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserRow;
}

export async function updateUser(
  id: string,
  input: UpdateProfileInput,
): Promise<UserRow> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(input)
    .eq("id", id)
    .select(USER_SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserRow;
}

export async function updateRole(id: string, role: UserRole): Promise<UserRow> {
  const current = await getUserById(id);

  if (!current) {
    throw new Error("Usuario no encontrado.");
  }

  return updateUser(id, {
    full_name: current.full_name ?? "",
    avatar_url: current.avatar_url,
    role,
    active: current.active,
  });
}

export async function updateStatus(id: string, active: boolean): Promise<UserRow> {
  const current = await getUserById(id);

  if (!current) {
    throw new Error("Usuario no encontrado.");
  }

  return updateUser(id, {
    full_name: current.full_name ?? "",
    avatar_url: current.avatar_url ?? null,
    role: current.role,
    active,
  });
}

export async function updatePassword(id: string, input: UserPasswordValues) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(id, {
    password: input.password,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function sendResetPassword(email: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    throw new Error(error.message);
  }
}
