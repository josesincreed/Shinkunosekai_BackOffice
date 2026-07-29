"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AnimeFormDialog } from "@/components/animes/anime-form-dialog";
import type { CategoryRow } from "@/types/category.types";
import type { AnimeWithCategories } from "@/types/anime.types";
import type { AnimeFormValues } from "@/lib/validations/anime.schema";

export function AnimeRouteDialog({
  mode,
  returnHref,
  initialValues,
  anime,
  categories,
}: {
  mode: "create" | "edit";
  returnHref: string;
  initialValues?: AnimeFormValues;
  anime?: AnimeWithCategories | null;
  categories: CategoryRow[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <AnimeFormDialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          router.replace(returnHref);
        }
      }}
      mode={mode}
      initialValues={initialValues}
      anime={anime}
      categories={categories}
      onSuccess={() => {
        setOpen(false);
        router.replace(returnHref);
      }}
    />
  );
}
