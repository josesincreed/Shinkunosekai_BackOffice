"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/lib/constants/routes";
import type { DashboardCategorySummaryItem } from "@/types/dashboard.types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(new Date(value));
}

export function DashboardRecentCategories({ categories }: { categories: DashboardCategorySummaryItem[] }) {
  return (
    <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.16 }}>
      <Card className="border-slate-200/80 bg-white/90 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Últimas categorías</CardTitle>
            <p className="text-sm text-slate-500">Las categorías creadas más recientemente.</p>
          </div>
          <Link
            href={routes.categories}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Ver todas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3 transition-colors hover:bg-slate-50"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-950">{category.name}</p>
                <p className="text-sm text-slate-500">{category.slug}</p>
              </div>
              <Badge variant="outline">{formatDate(category.created_at)}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
