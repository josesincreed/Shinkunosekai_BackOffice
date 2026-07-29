"use client";

import { toast } from "sonner";

import { createAnimeAction, updateAnimeAction } from "@/actions/anime.actions";
import { AnimeForm } from "@/components/forms/anime-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CategoryRow } from "@/types/category.types";
import type { AnimeActionResult, AnimeWithCategories } from "@/types/anime.types";
import type { AnimeFormValues } from "@/lib/validations/anime.schema";

export function AnimeFormDialog({
  open,
  onOpenChange,
  mode,
  initialValues,
  anime,
  categories,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialValues?: AnimeFormValues;
  anime?: AnimeWithCategories | null;
  categories: CategoryRow[];
  onSuccess: () => void;
}) {
  const handleSuccess = (result: AnimeActionResult) => {
    if (result.ok) {
      toast.success(result.message);
      onSuccess();
    } else {
      toast.error(result.error);
    }
  };

  const submit = async (values: AnimeFormValues) => {
    const result =
      mode === "create"
        ? await createAnimeAction(values)
        : await updateAnimeAction(anime?.id ?? "", values);

    handleSuccess(result);
    return result;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogClose onClick={() => onOpenChange(false)} />
      <DialogHeader>
        <DialogTitle>{mode === "create" ? "Nuevo anime" : "Editar anime"}</DialogTitle>
        <DialogDescription>
          {mode === "create"
            ? "Crea un anime con toda su metadata, estado y relaciones."
            : "Actualiza la información del anime seleccionado."}
        </DialogDescription>
      </DialogHeader>
      <DialogContent>
        <AnimeForm
          mode={mode}
          initialValues={initialValues}
          categories={categories}
          submitLabel={mode === "create" ? "Guardar" : "Actualizar"}
          onCancel={() => onOpenChange(false)}
          onSubmit={submit}
        />
      </DialogContent>
    </Dialog>
  );
}
