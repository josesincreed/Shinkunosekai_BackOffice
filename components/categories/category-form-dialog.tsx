"use client";

import { toast } from "sonner";

import { CategoryForm } from "@/components/forms/category-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createCategoryAction, updateCategoryAction } from "@/actions/category.actions";
import type { CategoryActionResult, CategoryWithAnimeCount } from "@/types/category.types";
import type { CategoryFormValues } from "@/lib/validations/categories/category.schema";

export function CategoryFormDialog({
  open,
  onOpenChange,
  mode,
  initialValues,
  category,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialValues?: CategoryFormValues;
  category?: CategoryWithAnimeCount | null;
  onSuccess: () => void;
}) {
  const handleSuccess = (result: CategoryActionResult) => {
    if (result.ok) {
      toast.success(result.message);
      onSuccess();
    } else {
      toast.error(result.error);
    }
  };

  const submit = async (values: CategoryFormValues) => {
    const result =
      mode === "create"
        ? await createCategoryAction(values)
        : await updateCategoryAction(category?.id ?? "", values);

    handleSuccess(result);
    return result;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogClose onClick={() => onOpenChange(false)} />
      <DialogHeader>
        <DialogTitle>
          {mode === "create" ? "Nueva categoría" : "Editar categoría"}
        </DialogTitle>
        <DialogDescription>
          {mode === "create"
            ? "Crea una categoría para organizar los animes del back office."
            : "Actualiza la información de esta categoría."}
        </DialogDescription>
      </DialogHeader>
      <DialogContent>
        <CategoryForm
          mode={mode}
          initialValues={initialValues}
          submitLabel={mode === "create" ? "Guardar" : "Actualizar"}
          onCancel={() => onOpenChange(false)}
          onSubmit={submit}
        />
      </DialogContent>
    </Dialog>
  );
}
