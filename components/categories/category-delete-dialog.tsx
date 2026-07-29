"use client";

import { useState } from "react";
import { toast } from "sonner";

import { deleteCategoryAction } from "@/actions/category.actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { CategoryWithAnimeCount } from "@/types/category.types";

export function CategoryDeleteDialog({
  category,
  open,
  onOpenChange,
  onDeleted,
}: {
  category: CategoryWithAnimeCount | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!category) return;

    setIsDeleting(true);
    const result = await deleteCategoryAction(category.id);
    setIsDeleting(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message);
    onOpenChange(false);
    onDeleted?.();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogHeader>
        <AlertDialogTitle>Eliminar categoría</AlertDialogTitle>
        <AlertDialogDescription>
          {category
            ? `Vas a eliminar “${category.name}”. Esta acción no se puede deshacer.`
            : "Esta acción no se puede deshacer."}
        </AlertDialogDescription>
        {category?.anime_count ? (
          <p className="text-sm text-red-600">
            Esta categoría tiene {category.anime_count} anime(s) asociado(s) y no puede eliminarse.
          </p>
        ) : null}
      </AlertDialogHeader>
      <AlertDialogFooter>
        <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button variant="destructive" type="button" disabled={isDeleting} onClick={confirmDelete}>
          {isDeleting ? "Eliminando..." : "Eliminar"}
        </Button>
      </AlertDialogFooter>
    </AlertDialog>
  );
}
