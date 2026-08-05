"use client";

import { Clapperboard, Grid2x2, Star, Users, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions";
import { DashboardRecentAnimes } from "@/components/dashboard/dashboard-recent-animes";
import { DashboardRecentCategories } from "@/components/dashboard/dashboard-recent-categories";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { DashboardStatusBreakdown } from "@/components/dashboard/dashboard-status-breakdown";
import { DashboardSystemStatus } from "@/components/dashboard/dashboard-system-status";
import { Separator } from "@/components/ui/separator";
import type { DashboardSummary } from "@/types/dashboard.types";

export function DashboardPage({
  summary,
  welcomeName,
  dateLabel,
}: {
  summary: DashboardSummary;
  welcomeName: string;
  dateLabel: string;
}) {
  const { metrics } = summary;

  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Dashboard</p>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Bienvenido nuevamente, {welcomeName}.</h1>
          <p className="text-sm text-slate-500">{dateLabel}</p>
        </div>
      </header>

      <Separator />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <DashboardStatCard
          title="Total de animes"
          value={String(metrics.totalAnimes)}
          description="Catálogo total cargado en la plataforma."
          icon={Clapperboard}
        />
        <DashboardStatCard
          title="Total de categorías"
          value={String(metrics.totalCategories)}
          description="Taxonomías disponibles para organizar contenido."
          icon={Grid2x2}
        />
        <DashboardStatCard
          title="Total de usuarios"
          value={String(metrics.totalUsers)}
          description="Cuentas activas o inactivas en el back office."
          icon={Users}
        />
        <DashboardStatCard
          title="Animes publicados"
          value={String(metrics.publishedAnimes)}
          description="Registros visibles para consumo externo."
          icon={CheckCircle2}
        />
        <DashboardStatCard
          title="Animes destacados"
          value={String(metrics.featuredAnimes)}
          description="Contenido promocionado en secciones clave."
          icon={Star}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DashboardStatusBreakdown statusCounts={summary.statusCounts} />
        <DashboardSystemStatus system={summary.system} />
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <DashboardRecentAnimes animes={summary.recentAnimes} />
        </div>
        <div className="xl:col-span-4">
          <DashboardRecentCategories categories={summary.recentCategories} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Actividad rápida</h2>
          <p className="text-sm text-slate-500">Acciones frecuentes para moverte más rápido dentro del panel.</p>
        </div>
        <DashboardQuickActions />
      </section>
    </motion.section>
  );
}
