import { getDashboardSummary as getDashboardSummaryRepository } from "@/lib/repositories/dashboard.repository";
import type { DashboardSummary } from "@/types/dashboard.types";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return getDashboardSummaryRepository();
}
