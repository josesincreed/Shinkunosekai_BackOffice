import { notFound } from "next/navigation";

import { AnimeDetail } from "@/components/animes/anime-detail";
import { getAnime } from "@/lib/services/animes/anime.service";

export default async function AnimeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const anime = await getAnime(id);

  if (!anime) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl font-semibold">Detalle del anime</h1>
        <p className="text-slate-600">Registro {anime.id}</p>
      </div>
      <AnimeDetail anime={anime} />
    </section>
  );
}
