import Link from "next/link";

import { AnimeStatusBadge } from "@/components/animes/anime-status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/lib/constants/routes";
import type { AnimeWithCategories } from "@/types/anime.types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "full" }).format(new Date(value));
}

function urlRow(label: string, value: string | null) {
  if (!value) {
    return null;
  }

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-slate-900">{label}</p>
      <a className="break-all text-sm text-sky-600 hover:underline" href={value} target="_blank" rel="noreferrer">
        {value}
      </a>
    </div>
  );
}

export function AnimeDetail({ anime }: { anime: AnimeWithCategories }) {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <AnimeStatusBadge status={anime.status} />
          {anime.published ? <Badge variant="secondary">Publicado</Badge> : <Badge variant="outline">Borrador</Badge>}
          {anime.featured ? <Badge variant="secondary">Destacado</Badge> : null}
        </div>
        <CardTitle>{anime.title}</CardTitle>
        <p className="text-sm text-slate-500">Slug: {anime.slug}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-900">Descripción</p>
            <p className="text-sm text-slate-600">{anime.description ?? "Sin descripción."}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-900">Categorías</p>
            <div className="flex flex-wrap gap-2">
              {anime.categories.length > 0 ? (
                anime.categories.map((category) => (
                  <Badge key={category.id} variant="secondary">
                    {category.name}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline">Sin categorías</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-900">Orden</p>
            <p className="text-sm text-slate-600">{anime.display_order}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-900">Fechas</p>
            <p className="text-sm text-slate-600">Creado el {formatDate(anime.created_at)}</p>
            <p className="text-sm text-slate-600">Actualizado el {formatDate(anime.updated_at)}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {urlRow("Trailer", anime.trailer_url)}
          {urlRow("Opening", anime.opening_url)}
          {urlRow("Ending", anime.ending_url)}
          {urlRow("Cover", anime.cover_url)}
          {urlRow("Banner", anime.banner_url)}
        </div>

        <div className="flex gap-2">
          <Link
            href={`${routes.animes}/${anime.id}/edit`}
            className="inline-flex min-w-[5.5rem] h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            style={{ color: "#ffffff" }}
          >
            Editar
          </Link>
          <Link
            href={routes.animes}
            className="inline-flex min-w-[5.5rem] h-10 items-center justify-center rounded-md bg-slate-100 px-4 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Volver
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
