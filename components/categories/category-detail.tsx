import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/lib/constants/routes";
import type { CategoryWithAnimeCount } from "@/types/category.types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "full" }).format(new Date(value));
}

export function CategoryDetail({ category }: { category: CategoryWithAnimeCount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
        <p className="text-sm text-slate-500">Slug: {category.slug}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={category.anime_count > 0 ? "secondary" : "outline"}>
            {category.anime_count} anime(s)
          </Badge>
          <span className="text-sm text-slate-500">Creada el {formatDate(category.created_at)}</span>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`${routes.categories}/${category.id}/edit`}>Editar</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href={routes.categories}>Volver</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
