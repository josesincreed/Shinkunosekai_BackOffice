import { notFound } from "next/navigation";

import { CategoryRouteDialog } from "@/components/categories/category-route-dialog";
import { getCategory } from "@/lib/services/categories/category.service";

export default async function EditCategoryPage({
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
    <CategoryRouteDialog
      mode="edit"
      category={category}
      initialValues={{ name: category.name }}
      returnHref={`/categories/${category.id}`}
    />
  );
}
