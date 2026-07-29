export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Category = CategoryRow;

export type CategoryWithAnimeCount = CategoryRow & {
  anime_count: number;
};

export type CategoryFormValues = {
  name: string;
};

export type CategoryListQuery = {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: "name" | "created_at";
  sortDir?: "asc" | "desc";
};

export type CategoryListResult = {
  items: CategoryWithAnimeCount[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export type CategoryActionResult<T = Category | CategoryWithAnimeCount | null> =
  | { ok: true; data: T; message: string }
  | { ok: false; error: string };
