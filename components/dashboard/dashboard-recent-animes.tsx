"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { routes } from "@/lib/constants/routes";
import type { DashboardAnimeSummaryItem } from "@/types/dashboard.types";

const statusLabels: Record<DashboardAnimeSummaryItem["status"], string> = {
  ONGOING: "En emisión",
  FINISHED: "Finalizado",
  UPCOMING: "Próximamente",
  HIATUS: "En pausa",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" }).format(new Date(value));
}

export function DashboardRecentAnimes({ animes }: { animes: DashboardAnimeSummaryItem[] }) {
  return (
    <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.16 }}>
      <Card className="border-slate-200/80 bg-white/90 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Últimos animes</CardTitle>
            <p className="text-sm text-slate-500">Los 5 registros más recientes del catálogo.</p>
          </div>
          <Link
            href={routes.animes}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Imagen</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Publicado</TableHead>
                  <TableHead>Fecha creación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {animes.map((anime) => (
                  <TableRow key={anime.id}>
                    <TableCell>
                      <Link
                        href={`${routes.animes}/${anime.id}`}
                        className="flex h-14 w-10 overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                      >
                        {anime.cover_url ? (
                          <img
                            src={anime.cover_url}
                            alt={`Cover de ${anime.title}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200" />
                        )}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`${routes.animes}/${anime.id}`} className="font-medium text-slate-950 hover:underline">
                        {anime.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={anime.status === "FINISHED" ? "secondary" : "outline"}
                        className={
                          anime.status === "ONGOING"
                            ? "bg-emerald-100 text-emerald-700"
                            : anime.status === "UPCOMING"
                              ? "bg-amber-100 text-amber-700"
                              : anime.status === "HIATUS"
                                ? "bg-violet-100 text-violet-700"
                                : undefined
                        }
                      >
                        {statusLabels[anime.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={anime.published ? "secondary" : "outline"}>
                        {anime.published ? "Sí" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500">{formatDate(anime.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
