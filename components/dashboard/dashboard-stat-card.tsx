"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

import { Card, CardContent } from "@/components/ui/card";

export function DashboardStatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18 }}>
      <Card className="h-full border-slate-200/80 bg-white/90 backdrop-blur">
        <CardContent className="flex h-full items-start gap-4 p-5">
          <div className="rounded-2xl bg-slate-900 p-3 text-white shadow-sm">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
