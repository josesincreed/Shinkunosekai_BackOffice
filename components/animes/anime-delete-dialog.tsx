"use client";

import { useState } from "react";
import { toast } from "sonner";

import { deleteAnimeAction } from "@/actions/anime.actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { AnimeWithCategories } from "@/types/anime.types";

export function AnimeDeleteDialog({
  anime,
  open,
  onOpenChange,
  onDeleted,
}: {
  anime: AnimeWithCategories | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!anime) return;

    setIsDeleting(true);
    const result = await deleteAnimeAction(anime.id);
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
        <AlertDialogTitle>Eliminar anime</AlertDialogTitle>
        <AlertDialogDescription>
          {anime
            ? `Vas a eliminar “${anime.title}”. Esta acción no se puede deshacer.`
            : "Esta acción no se puede deshacer."}
        </AlertDialogDescription>
        <p className="text-sm text-slate-500">
          Se eliminarán también sus relaciones con categorías.
        </p>
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
