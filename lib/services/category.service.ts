import { listCategories } from "@/lib/repositories/category.repository";

export async function getCategories() {
  return listCategories();
}
