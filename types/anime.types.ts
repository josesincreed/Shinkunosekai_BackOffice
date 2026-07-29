import type { CategoryRow } from "@/types/category.types";

export type AnimeStatus = "ONGOING" | "FINISHED" | "UPCOMING" | "HIATUS";

export type AnimeRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status: AnimeStatus;
  cover_url: string | null;
  banner_url: string | null;
  trailer_url: string | null;
  opening_url: string | null;
  ending_url: string | null;
  display_order: number;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type Anime = AnimeRow;

export type AnimeWithCategories = AnimeRow & {
  categories: CategoryRow[];
};

export type AnimeFormValues = {
  title: string;
  description?: string;
  status: AnimeStatus;
  categoryIds: string[];
  displayOrder: number;
  published: boolean;
  featured: boolean;
  trailerUrl?: string;
  openingUrl?: string;
  endingUrl?: string;
  coverUrl?: string;
  bannerUrl?: string;
};

export type AnimeListSortBy = "title" | "status" | "display_order" | "created_at";

export type AnimeListQuery = {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: AnimeListSortBy;
  sortDir?: "asc" | "desc";
};

export type AnimeListResult = {
  items: AnimeWithCategories[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export type AnimeActionResult<T = Anime | AnimeWithCategories | null> =
  | { ok: true; data: T; message: string }
  | { ok: false; error: string };
