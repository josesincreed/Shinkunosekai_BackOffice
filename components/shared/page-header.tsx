export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="space-y-2">
      <h1 className="text-3xl font-semibold">{title}</h1>
      {description ? <p className="text-slate-600">{description}</p> : null}
    </header>
  );
}
