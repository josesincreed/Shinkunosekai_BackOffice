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
        <CardContent className="h-full p-5">
          <div className="flex h-full flex-col justify-between gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium leading-tight text-slate-500">{title}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-sm leading-5 text-slate-500">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
