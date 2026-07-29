import { CategoryRouteDialog } from "@/components/categories/category-route-dialog";

export default function NewCategoryPage() {
  // Route-driven modal: the dialog is the page content.
  return (
    <CategoryRouteDialog
      mode="create"
      returnHref="/categories"
    />
  );
}
