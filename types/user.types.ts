export type UserRole = "ADMIN" | "EDITOR" | "USER";

export type UserRow = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type UserListSortBy = "full_name" | "email" | "role" | "active" | "created_at";

export type UserListRoleFilter = "all" | UserRole;

export type UserListStatusFilter = "all" | "active" | "inactive";

export type UserListQuery = {
  page: number;
  pageSize: number;
  search?: string;
  role?: UserListRoleFilter;
  status?: UserListStatusFilter;
  sortBy?: UserListSortBy;
  sortDir?: "asc" | "desc";
};

export type UserStats = {
  admins: number;
  editors: number;
  webUsers: number;
  active: number;
  inactive: number;
};

export type UserListResult = {
  items: UserRow[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  stats: UserStats;
};

export type UserFormValues = {
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
  active: boolean;
  avatarUrl?: string;
};

export type UserUpdateValues = {
  fullName: string;
  role: UserRole;
  active: boolean;
  avatarUrl?: string;
};

export type UserPasswordValues = {
  password: string;
};

export type UserActionResult<T = UserRow | null> =
  | { ok: true; data: T; message: string }
  | { ok: false; error: string };
