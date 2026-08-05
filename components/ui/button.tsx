import type * as React from "react";
import { cloneElement, isValidElement } from "react";
import { cn } from "@/lib/utils/cn";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50";

const variants = {
  default: "bg-slate-900 !text-white hover:bg-slate-800",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  outline: "border border-slate-200 bg-white hover:bg-slate-50",
  ghost: "hover:bg-slate-100",
  destructive: "bg-red-600 text-white hover:bg-red-500",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: "sm" | "default" | "lg";
  asChild?: boolean;
};

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const sizeClasses =
    size === "sm"
      ? "h-9 px-3"
      : size === "lg"
        ? "h-11 px-6"
        : "h-10 px-4";

  const mergedClassName = cn(base, variants[variant], sizeClasses, className);

  if (asChild && isValidElement(children)) {
    return cloneElement(
      children as React.ReactElement,
      {
        className: cn(mergedClassName, (children.props as { className?: string }).className),
        ...(props as Record<string, unknown>),
      } as any,
    );
  }

  return (
    <button className={mergedClassName} {...props}>
      {children}
    </button>
  );
}
