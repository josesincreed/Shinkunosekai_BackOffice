export default function EditUserPage({ params }: { params: { id: string } }) {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Editar usuario</h1>
      <p className="text-slate-600">Edición del registro {params.id}.</p>
    </section>
  );
}
