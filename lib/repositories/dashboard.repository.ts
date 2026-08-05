import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  DashboardAnimeSummaryItem,
  DashboardCategorySummaryItem,
  DashboardMetrics,
  DashboardStatusCount,
  DashboardSystemStatus,
  DashboardSummary,
} from "@/types/dashboard.types";

type AnimeSummaryRow = {
  status: DashboardStatusCount["status"];
  published: boolean;
  featured: boolean;
};

type RecentAnimeRow = DashboardAnimeSummaryItem;

type RecentCategoryRow = DashboardCategorySummaryItem;

function buildStatusCounts(rows: AnimeSummaryRow[]) {
  const initial: DashboardStatusCount[] = [
    { status: "ONGOING", count: 0 },
    { status: "FINISHED", count: 0 },
    { status: "UPCOMING", count: 0 },
    { status: "HIATUS", count: 0 },
  ];

  const counts = new Map(initial.map((item) => [item.status, item.count]));

  for (const row of rows) {
    counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
  }

  return initial.map((item) => ({
    ...item,
    count: counts.get(item.status) ?? 0,
  }));
}

function hasR2Config() {
  return Boolean(
    process.env.R2_BUCKET_NAME &&
      process.env.R2_PUBLIC_URL &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_ENDPOINT,
  );
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const supabase = createSupabaseAdminClient();

  const [
    { data: animeRows, error: animeError, count: animeCount },
    { data: recentAnimes, error: recentAnimeError },
    { data: categoryRows, error: categoryError, count: categoryCount },
    { data: profiles, error: profileError, count: profileCount },
  ] = await Promise.all([
    supabase.from("animes").select("status,published,featured", { count: "exact" }),
    supabase
      .from("animes")
      .select("id,title,slug,status,published,featured,cover_url,created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("categories")
      .select("id,name,slug,created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("profiles").select("active", { count: "exact" }),
  ]);

  if (animeError) {
    throw new Error(animeError.message);
  }

  if (recentAnimeError) {
    throw new Error(recentAnimeError.message);
  }

  if (categoryError) {
    throw new Error(categoryError.message);
  }

  if (profileError) {
    throw new Error(profileError.message);
  }

  const animeData = (animeRows ?? []) as AnimeSummaryRow[];
  const publishedAnimes = animeData.filter((row) => row.published).length;
  const featuredAnimes = animeData.filter((row) => row.featured).length;
  const activeUsers = (profiles ?? []).filter((row) => row.active).length;
  const totalUsers = profileCount ?? profiles?.length ?? 0;
  const totalCategories = categoryCount ?? 0;
  const totalAnimes = animeCount ?? 0;

  const metrics: DashboardMetrics = {
    totalAnimes,
    totalCategories,
    totalUsers,
    publishedAnimes,
    featuredAnimes,
    activeUsers,
  };

  const system: DashboardSystemStatus = {
    supabaseConnected: true,
    cloudflareR2Ready: hasR2Config(),
    activeUsers,
    totalCategories,
  };

  return {
    metrics,
    statusCounts: buildStatusCounts(animeData),
    recentAnimes: (recentAnimes ?? []) as RecentAnimeRow[],
    recentCategories: (categoryRows ?? []) as RecentCategoryRow[],
    system,
  };
}
