export default function CategoryDetailPage({ params }: { params: { id: string } }) {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Detalle de categoría</h1>
      <p className="text-slate-600">Registro: {params.id}</p>
    </section>
  );
}
