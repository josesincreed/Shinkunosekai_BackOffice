import type * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Avatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100", className)} {...props} />;
}

export function AvatarImage({ className, alt, src }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img alt={alt} src={src} className={cn("h-full w-full object-cover", className)} />;
}

export function AvatarFallback({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex h-full w-full items-center justify-center bg-slate-200 text-sm font-medium text-slate-700", className)} {...props} />;
}
