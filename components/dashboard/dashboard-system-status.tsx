"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardSystemStatus } from "@/types/dashboard.types";

function StatusRow({ label, value }: { label: string; value: string | number | boolean }) {
  const isBoolean = typeof value === "boolean";

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      {isBoolean ? (
        <Badge variant={value ? "secondary" : "destructive"}>{value ? "Sí" : "No"}</Badge>
      ) : (
        <span className="text-sm font-medium text-slate-950">{value}</span>
      )}
    </div>
  );
}

export function DashboardSystemStatus({ system }: { system: DashboardSystemStatus }) {
  return (
    <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.16 }}>
      <Card className="border-slate-200/80 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle>Estado del sistema</CardTitle>
          <p className="text-sm text-slate-500">Estado rápido de la infraestructura y contenido.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <StatusRow label="Supabase conectado" value={system.supabaseConnected} />
          <StatusRow label="Cloudflare R2" value={system.cloudflareR2Ready} />
          <StatusRow label="Usuarios activos" value={system.activeUsers} />
          <StatusRow label="Categorías" value={system.totalCategories} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
