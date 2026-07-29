"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { categoryFormSchema, type CategoryFormValues } from "@/lib/validations/categories/category.schema";
import type { CategoryActionResult } from "@/types/category.types";

export function CategoryForm({
  mode,
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  mode: "create" | "edit";
  initialValues?: CategoryFormValues;
  submitLabel?: string;
  onSubmit: (values: CategoryFormValues) => Promise<CategoryActionResult>;
  onCancel: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
    },
  });

  const submitText = submitLabel ?? (mode === "create" ? "Guardar" : "Actualizar");

  const handleFormSubmit = async (values: CategoryFormValues) => {
    setServerError(null);
    const result = await onSubmit(values);

    if (!result.ok) {
      setServerError(result.error);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          placeholder="Ej. Acción"
          autoComplete="off"
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-xs text-red-600">{errors.name.message}</p>
        ) : null}
      </div>

      <Separator />

      {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}

      <div className="flex items-center justify-end gap-3">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : submitText}
        </Button>
      </div>
    </form>
  );
}
