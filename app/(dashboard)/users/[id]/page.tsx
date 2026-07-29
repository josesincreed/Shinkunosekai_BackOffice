export default function UserDetailPage({ params }: { params: { id: string } }) {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Detalle de usuario</h1>
      <p className="text-slate-600">Registro: {params.id}</p>
    </section>
  );
}
