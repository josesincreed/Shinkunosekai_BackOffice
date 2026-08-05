import type { AnimeStatus } from "@/types/anime.types";

export type DashboardAnimeSummaryItem = {
  id: string;
  title: string;
  slug: string;
  status: AnimeStatus;
  published: boolean;
  featured: boolean;
  cover_url: string | null;
  created_at: string;
};

export type DashboardCategorySummaryItem = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type DashboardStatusCount = {
  status: AnimeStatus;
  count: number;
};

export type DashboardMetrics = {
  totalAnimes: number;
  totalCategories: number;
  totalUsers: number;
  publishedAnimes: number;
  featuredAnimes: number;
  activeUsers: number;
};

export type DashboardSystemStatus = {
  supabaseConnected: boolean;
  cloudflareR2Ready: boolean;
  activeUsers: number;
  totalCategories: number;
};

export type DashboardSummary = {
  metrics: DashboardMetrics;
  statusCounts: DashboardStatusCount[];
  recentAnimes: DashboardAnimeSummaryItem[];
  recentCategories: DashboardCategorySummaryItem[];
  system: DashboardSystemStatus;
};
