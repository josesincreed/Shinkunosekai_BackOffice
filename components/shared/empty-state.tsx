export function EmptyState({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-dashed border-black/10 p-8 text-center text-slate-600">
      {title}
    </div>
  );
}
