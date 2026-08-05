"use client";

import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStatusCount } from "@/types/dashboard.types";

const statusLabels: Record<DashboardStatusCount["status"], string> = {
  ONGOING: "En emisión",
  FINISHED: "Finalizado",
  UPCOMING: "Próximamente",
  HIATUS: "En pausa",
};

const statusTone: Record<DashboardStatusCount["status"], string> = {
  ONGOING: "bg-emerald-100 text-emerald-700",
  FINISHED: "bg-slate-100 text-slate-700",
  UPCOMING: "bg-amber-100 text-amber-700",
  HIATUS: "bg-slate-900 text-white",
};

export function DashboardStatusBreakdown({ statusCounts }: { statusCounts: DashboardStatusCount[] }) {
  return (
    <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.16 }}>
      <Card className="border-slate-200/80 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle>Resumen por estado</CardTitle>
          <p className="text-sm text-slate-500">Distribución actual de animes por estado editorial.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {statusCounts.map((item) => (
            <div key={item.status} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
              <Badge className={statusTone[item.status]}>{statusLabels[item.status]}</Badge>
              <span className="text-lg font-semibold text-slate-950">{item.count}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
