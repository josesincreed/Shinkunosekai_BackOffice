export default function AnimeDetailPage({ params }: { params: { id: string } }) {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Detalle del anime</h1>
      <p className="text-slate-600">Registro: {params.id}</p>
    </section>
  );
}
