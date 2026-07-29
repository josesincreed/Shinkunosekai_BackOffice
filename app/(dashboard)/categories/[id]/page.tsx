import { notFound } from "next/navigation";

import { CategoryDetail } from "@/components/categories/category-detail";
import { getCategory } from "@/lib/services/categories/category.service";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategory(id);

  if (!category) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl font-semibold">Detalle de categoría</h1>
        <p className="text-slate-600">Registro {category.id}</p>
      </div>
      <CategoryDetail category={category} />
    </section>
  );
}
