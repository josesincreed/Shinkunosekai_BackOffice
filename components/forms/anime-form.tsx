"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { Check, ChevronDown, ImageUp, Loader2, Sparkles } from "lucide-react";

import { uploadAnimeImageAction } from "@/actions/anime.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";
import type { CategoryRow } from "@/types/category.types";
import { animeFormSchema, type AnimeFormValues } from "@/lib/validations/anime.schema";
import type { AnimeActionResult } from "@/types/anime.types";

const statusLabels: Record<AnimeFormValues["status"], string> = {
  ONGOING: "En emisión",
  FINISHED: "Finalizado",
  UPCOMING: "Próximamente",
  HIATUS: "En pausa",
};

export function AnimeForm({
  mode,
  initialValues,
  categories,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  mode: "create" | "edit";
  initialValues?: AnimeFormValues;
  categories: CategoryRow[];
  submitLabel?: string;
  onSubmit: (values: AnimeFormValues) => Promise<AnimeActionResult>;
  onCancel: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<"coverUrl" | "bannerUrl" | null>(null);
  const [uploadErrors, setUploadErrors] = useState<{ coverUrl: string | null; bannerUrl: string | null }>({
    coverUrl: null,
    bannerUrl: null,
  });
  const defaultValues = useMemo<AnimeFormValues>(
    () => ({
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      status: initialValues?.status ?? "ONGOING",
      categoryIds: initialValues?.categoryIds ?? [],
      displayOrder: initialValues?.displayOrder ?? 0,
      published: initialValues?.published ?? false,
      featured: initialValues?.featured ?? false,
      trailerUrl: initialValues?.trailerUrl ?? "",
      openingUrl: initialValues?.openingUrl ?? "",
      endingUrl: initialValues?.endingUrl ?? "",
      coverUrl: initialValues?.coverUrl ?? "",
      bannerUrl: initialValues?.bannerUrl ?? "",
    }),
    [initialValues],
  );

  const form = useForm<AnimeFormValues>({
    resolver: zodResolver(animeFormSchema) as Resolver<AnimeFormValues>,
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const selectedCategoryIds = watch("categoryIds");
  const published = watch("published");
  const featured = watch("featured");
  const coverUrl = watch("coverUrl");
  const bannerUrl = watch("bannerUrl");
  const submitText = submitLabel ?? (mode === "create" ? "Guardar" : "Actualizar");

  const toggleCategory = (categoryId: string) => {
    const next = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter((id) => id !== categoryId)
      : [...selectedCategoryIds, categoryId];

    setValue("categoryIds", next, { shouldValidate: true, shouldDirty: true });
  };

  const handleFormSubmit = async (values: AnimeFormValues) => {
    setServerError(null);
    const result = await onSubmit(values);

    if (!result.ok) {
      setServerError(result.error);
    }
  };

  const handleImageUpload = async (field: "coverUrl" | "bannerUrl", file: File | null) => {
    if (!file) {
      return;
    }

    setUploadingField(field);
    setUploadErrors((current) => ({ ...current, [field]: null }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("field", field === "coverUrl" ? "cover" : "banner");

    const result = await uploadAnimeImageAction(formData);
    setUploadingField(null);

    if (!result.ok) {
      setUploadErrors((current) => ({ ...current, [field]: result.error }));
      return;
    }

    setValue(field, result.data ?? "", { shouldDirty: true, shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" placeholder="Ej. One Piece" autoComplete="off" {...register("title")} />
            {errors.title ? <p className="text-xs text-red-600">{errors.title.message}</p> : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" placeholder="Describe brevemente el anime..." rows={4} {...register("description")} />
            {errors.description ? <p className="text-xs text-red-600">{errors.description.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select id="status" {...register("status")}>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            {errors.status ? <p className="text-xs text-red-600">{errors.status.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayOrder">Orden</Label>
            <Input id="displayOrder" type="number" min={0} step={1} {...register("displayOrder", { valueAsNumber: true })} />
            {errors.displayOrder ? <p className="text-xs text-red-600">{errors.displayOrder.message}</p> : null}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label>Publicado</Label>
              <Switch checked={published} onCheckedChange={(checked) => setValue("published", checked, { shouldDirty: true })} />
            </div>
            <p className="text-xs text-slate-500">El anime se mostrará en el front office.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label>Destacado</Label>
              <Switch checked={featured} onCheckedChange={(checked) => setValue("featured", checked, { shouldDirty: true })} />
            </div>
            <p className="text-xs text-slate-500">Usar para destacar el anime en listados especiales.</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label>Categorías</Label>
            <span className="text-xs text-slate-500">
              {selectedCategoryIds.length} seleccionada(s)
            </span>
          </div>

          <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.length === 0 ? (
              <div className="col-span-full rounded-lg border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                No hay categorías para seleccionar.
              </div>
            ) : (
              categories.map((category) => {
                const active = selectedCategoryIds.includes(category.id);

                return (
                  <button
                    key={category.id}
                    type="button"
                    className={[
                      "flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                      active
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                    ].join(" ")}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <span className="font-medium">{category.name}</span>
                    {active ? <Check className="h-4 w-4" /> : <ChevronDown className="h-4 w-4 opacity-50" />}
                  </button>
                );
              })
            )}
          </div>
          {errors.categoryIds ? <p className="text-xs text-red-600">{errors.categoryIds.message}</p> : null}
        </div>

        <Separator />

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="trailerUrl">Trailer URL</Label>
            <Input id="trailerUrl" placeholder="https://..." autoComplete="off" {...register("trailerUrl")} />
            {errors.trailerUrl ? <p className="text-xs text-red-600">{errors.trailerUrl.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="openingUrl">Opening URL</Label>
            <Input id="openingUrl" placeholder="https://..." autoComplete="off" {...register("openingUrl")} />
            {errors.openingUrl ? <p className="text-xs text-red-600">{errors.openingUrl.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="endingUrl">Ending URL</Label>
            <Input id="endingUrl" placeholder="https://..." autoComplete="off" {...register("endingUrl")} />
            {errors.endingUrl ? <p className="text-xs text-red-600">{errors.endingUrl.message}</p> : null}
          </div>
          <div className="space-y-2 md:col-span-2">
            <input type="hidden" {...register("coverUrl")} />
            <input type="hidden" {...register("bannerUrl")} />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label htmlFor="coverFile">Cover</Label>
                <p className="text-xs text-slate-500">Sube una imagen para la portada del anime.</p>
              </div>
              <ImageUp className="h-4 w-4 text-slate-500" />
            </div>
            <Input
              id="coverFile"
              type="file"
              accept="image/*"
              disabled={uploadingField === "coverUrl"}
              onChange={(event) => handleImageUpload("coverUrl", event.target.files?.[0] ?? null)}
            />
            <div className="text-xs text-slate-500">
              {uploadingField === "coverUrl" ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Subiendo cover...
                </span>
              ) : coverUrl ? (
                "Cover cargado correctamente."
              ) : (
                "Aún no se ha cargado ningún cover."
              )}
            </div>
            {errors.coverUrl ? <p className="text-xs text-red-600">{errors.coverUrl.message}</p> : null}
            {uploadErrors.coverUrl ? <p className="text-xs text-red-600">{uploadErrors.coverUrl}</p> : null}
          </div>

          <div className="space-y-3 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label htmlFor="bannerFile">Banner</Label>
                <p className="text-xs text-slate-500">Sube una imagen para el banner del anime.</p>
              </div>
              <ImageUp className="h-4 w-4 text-slate-500" />
            </div>
            <Input
              id="bannerFile"
              type="file"
              accept="image/*"
              disabled={uploadingField === "bannerUrl"}
              onChange={(event) => handleImageUpload("bannerUrl", event.target.files?.[0] ?? null)}
            />
            <div className="text-xs text-slate-500">
              {uploadingField === "bannerUrl" ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Subiendo banner...
                </span>
              ) : bannerUrl ? (
                "Banner cargado correctamente."
              ) : (
                "Aún no se ha cargado ningún banner."
              )}
            </div>
            {errors.bannerUrl ? <p className="text-xs text-red-600">{errors.bannerUrl.message}</p> : null}
            {uploadErrors.bannerUrl ? <p className="text-xs text-red-600">{uploadErrors.bannerUrl}</p> : null}
          </div>
        </div>

        {serverError ? (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <Sparkles className="h-4 w-4" />
            <span>{serverError}</span>
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
