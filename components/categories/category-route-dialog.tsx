"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { CategoryFormDialog } from "@/components/categories/category-form-dialog";
import type { CategoryWithAnimeCount } from "@/types/category.types";
import type { CategoryFormValues } from "@/lib/validations/categories/category.schema";

export function CategoryRouteDialog({
  mode,
  returnHref,
  initialValues,
  category,
}: {
  mode: "create" | "edit";
  returnHref: string;
  initialValues?: CategoryFormValues;
  category?: CategoryWithAnimeCount | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <CategoryFormDialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          router.replace(returnHref);
        }
      }}
      mode={mode}
      initialValues={initialValues}
      category={category}
      onSuccess={() => {
        setOpen(false);
        router.replace(returnHref);
      }}
    />
  );
}
