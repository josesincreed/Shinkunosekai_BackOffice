"use client";

import * as React from "react";
import { FormProvider, useFormContext, type ControllerRenderProps, type FieldPath, type FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils/cn";

export const Form = FormProvider;

const FormFieldContext = React.createContext<{ name: string } | null>(null);

export function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  name,
  render,
}: {
  name: TName;
  render: (props: { field: ControllerRenderProps<TFieldValues, TName> }) => React.ReactNode;
}) {
  const { control } = useFormContext<TFieldValues>();
  // Minimal adapter: use the controller from RHF's context.
  const field = React.useMemo(() => ({ name } as const), [name]);
  return (
    <FormFieldContext.Provider value={{ name: String(name) }}>
      {render({ field: { ...field } as ControllerRenderProps<TFieldValues, TName> })}
    </FormFieldContext.Provider>
  );
}

export function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

export function FormLabel({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-medium leading-none", className)} {...props} />;
}

export function FormControl({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function FormMessage({ className, children }: { className?: string; children?: React.ReactNode }) {
  if (!children) {
    return null;
  }

  return <p className={cn("text-xs text-red-600", className)}>{children}</p>;
}
