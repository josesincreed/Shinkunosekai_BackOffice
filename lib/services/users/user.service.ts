import {
  createAuthUser,
  createProfile,
  deleteAuthUser,
  getUserByEmail,
  getUserById,
  getUserStats,
  getUsers,
  sendResetPassword,
  updatePassword,
  updateUser,
} from "@/lib/repositories/users/user.repository";
import { getCurrentAuthContext } from "@/lib/services/auth.service";
import {
  userCreateFormSchema,
  userIdSchema,
  userPasswordFormSchema,
  userUpdateFormSchema,
  type UserCreateFormValues,
  type UserPasswordFormValues,
  type UserUpdateFormValues,
} from "@/lib/validations/users/user.schema";
import type {
  UserActionResult,
  UserListQuery,
  UserListResult,
  UserRow,
  UserStats,
  UserRole,
} from "@/types/user.types";

export type UserServiceErrorCode = "NOT_FOUND" | "FORBIDDEN" | "DUPLICATE" | "INVALID" | "LAST_ADMIN";

export class UserServiceError extends Error {
  code: UserServiceErrorCode;

  constructor(message: string, code: UserServiceErrorCode) {
    super(message);
    this.name = "UserServiceError";
    this.code = code;
  }
}

function normalizeName(name: string) {
  return name.replace(/\s+/g, " ").trim();
}

function normalizeOptionalUrl(value?: string) {
  const normalized = value?.replace(/\s+/g, " ").trim();
  return normalized ? normalized : null;
}

async function requireAdminContext() {
  const context = await getCurrentAuthContext();

  if (!context || context.profile.role !== "ADMIN") {
    throw new UserServiceError("No tienes permisos para administrar usuarios.", "FORBIDDEN");
  }

  return context;
}

function assertUserId(id: string) {
  const parsed = userIdSchema.safeParse(id);

  if (!parsed.success) {
    throw new UserServiceError("ID de usuario inválido.", "INVALID");
  }

  return parsed.data;
}

function assertCreateValues(values: UserCreateFormValues) {
  const parsed = userCreateFormSchema.safeParse(values);

  if (!parsed.success) {
    throw new UserServiceError(
      parsed.error.issues[0]?.message ?? "Datos de usuario inválidos.",
      "INVALID",
    );
  }

  return {
    ...parsed.data,
    fullName: normalizeName(parsed.data.fullName),
    avatarUrl: normalizeOptionalUrl(parsed.data.avatarUrl),
  };
}

function assertUpdateValues(values: UserUpdateFormValues) {
  const parsed = userUpdateFormSchema.safeParse(values);

  if (!parsed.success) {
    throw new UserServiceError(
      parsed.error.issues[0]?.message ?? "Datos de usuario inválidos.",
      "INVALID",
    );
  }

  return {
    ...parsed.data,
    fullName: normalizeName(parsed.data.fullName),
    avatarUrl: normalizeOptionalUrl(parsed.data.avatarUrl),
  };
}

function assertPasswordValues(values: UserPasswordFormValues) {
  const parsed = userPasswordFormSchema.safeParse(values);

  if (!parsed.success) {
    throw new UserServiceError(
      parsed.error.issues[0]?.message ?? "Contraseña inválida.",
      "INVALID",
    );
  }

  return parsed.data;
}

function ensureAdminProtection({
  actorId,
  currentUser,
  activeAdmins,
  nextRole,
  nextActive,
}: {
  actorId: string;
  currentUser: UserRow;
  activeAdmins: number;
  nextRole: UserRole;
  nextActive: boolean;
}) {
  const isSelfMutation = actorId === currentUser.id;
  const roleWillChange = nextRole !== currentUser.role;
  const activeWillChange = nextActive !== currentUser.active;

  if (isSelfMutation && (roleWillChange || (!nextActive && currentUser.active))) {
    throw new UserServiceError(
      "No puedes cambiar tu propio rol ni desactivarte a ti mismo.",
      "FORBIDDEN",
    );
  }

  const currentIsOnlyActiveAdmin = currentUser.role === "ADMIN" && activeAdmins <= 1 && currentUser.active;

  if (currentIsOnlyActiveAdmin && (roleWillChange || !nextActive)) {
    throw new UserServiceError(
      "Debe existir al menos un administrador activo. No puedes modificar al único admin activo.",
      "LAST_ADMIN",
    );
  }
}

function buildStats(stats: UserStats) {
  return {
    admins: stats.admins,
    editors: stats.editors,
    webUsers: stats.webUsers,
    active: stats.active,
    inactive: stats.inactive,
  };
}

export async function getUsersService(params: UserListQuery): Promise<UserListResult> {
  await requireAdminContext();
  return getUsers(params);
}

export async function getUserService(id: string): Promise<UserRow | null> {
  await requireAdminContext();
  return getUserById(assertUserId(id));
}

export async function createUserService(values: UserCreateFormValues): Promise<UserRow> {
  await requireAdminContext();
  const input = assertCreateValues(values);

  const existing = await getUserByEmail(input.email);

  if (existing) {
    throw new UserServiceError("Ya existe un usuario con ese correo.", "DUPLICATE");
  }

  const stats = await getUserStats();

  if (input.role === "ADMIN" && !input.active && stats.activeAdmins === 0) {
    throw new UserServiceError(
      "No puedes crear un administrador inactivo si no existe otro admin activo.",
      "LAST_ADMIN",
    );
  }

  const authUser = await createAuthUser({
    email: input.email,
    password: input.password,
    fullName: input.fullName,
    avatarUrl: input.avatarUrl ?? undefined,
    role: input.role,
    active: input.active,
  });

  try {
    return await createProfile({
      id: authUser.id,
      email: input.email,
      full_name: input.fullName,
      avatar_url: input.avatarUrl,
      role: input.role,
      active: input.active,
    });
  } catch (error) {
    await deleteAuthUser(authUser.id).catch(() => undefined);
    throw error;
  }
}

export async function updateUserService(
  id: string,
  values: UserUpdateFormValues,
): Promise<UserRow> {
  const actor = await requireAdminContext();
  const userId = assertUserId(id);
  const input = assertUpdateValues(values);
  const current = await getUserById(userId);

  if (!current) {
    throw new UserServiceError("El usuario no existe.", "NOT_FOUND");
  }

  const stats = await getUserStats();

  ensureAdminProtection({
    actorId: actor.profile.id,
    currentUser: current,
    activeAdmins: stats.activeAdmins,
    nextRole: input.role,
    nextActive: input.active,
  });

  return updateUser(userId, {
    full_name: input.fullName,
    avatar_url: input.avatarUrl,
    role: input.role,
    active: input.active,
  });
}

export async function toggleUserStatusService(id: string): Promise<UserRow> {
  const actor = await requireAdminContext();
  const userId = assertUserId(id);
  const current = await getUserById(userId);

  if (!current) {
    throw new UserServiceError("El usuario no existe.", "NOT_FOUND");
  }

  const stats = await getUserStats();

  ensureAdminProtection({
    actorId: actor.profile.id,
    currentUser: current,
    activeAdmins: stats.activeAdmins,
    nextRole: current.role,
    nextActive: !current.active,
  });

  return updateUser(userId, {
    full_name: current.full_name ?? "",
    avatar_url: current.avatar_url,
    role: current.role,
    active: !current.active,
  });
}

export async function updateUserPasswordService(
  id: string,
  values: UserPasswordFormValues,
) {
  await requireAdminContext();
  const userId = assertUserId(id);
  const input = assertPasswordValues(values);
  const current = await getUserById(userId);

  if (!current) {
    throw new UserServiceError("El usuario no existe.", "NOT_FOUND");
  }

  await updatePassword(userId, input);

  return current;
}

export async function sendRecoveryService(id: string) {
  await requireAdminContext();
  const userId = assertUserId(id);
  const current = await getUserById(userId);

  if (!current) {
    throw new UserServiceError("El usuario no existe.", "NOT_FOUND");
  }

  await sendResetPassword(current.email);

  return current;
}

export async function getUsersStatsService() {
  await requireAdminContext();
  const stats = await getUserStats();
  return buildStats(stats);
}
