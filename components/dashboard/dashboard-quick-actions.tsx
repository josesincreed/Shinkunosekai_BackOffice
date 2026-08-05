"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { FolderPlus, Clapperboard, Users } from "lucide-react";
import { motion } from "motion/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/lib/constants/routes";

type QuickAction = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  cta: string;
};

const actions: QuickAction[] = [
  {
    title: "Nueva categoría",
    description: "Crea una nueva categoría para organizar el catálogo.",
    href: `${routes.categories}/new`,
    icon: FolderPlus,
    cta: "Crear categoría",
  },
  {
    title: "Nuevo anime",
    description: "Registra un anime con su estado, orden y relaciones.",
    href: `${routes.animes}/new`,
    icon: Clapperboard,
    cta: "Crear anime",
  },
  {
    title: "Administrar usuarios",
    description: "Revisa el acceso y estado de los usuarios del back office.",
    href: routes.users,
    icon: Users,
    cta: "Ir a usuarios",
  },
];

export function DashboardQuickActions() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <motion.div key={action.href} whileHover={{ y: -2 }} transition={{ duration: 0.18 }}>
            <Card className="h-full border-slate-200/80 bg-white/90 backdrop-blur">
              <CardHeader className="space-y-4">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>{action.title}</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">{action.description}</p>
                </div>
              </CardHeader>
              <CardContent>
                <Link
                  href={action.href}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                >
                  {action.cta}
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
