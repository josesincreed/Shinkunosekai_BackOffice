"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

const DropdownMenuContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-flex">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  const context = React.useContext(DropdownMenuContext);

  if (!context) return null;

  return (
    <button
      type="button"
      className={cn("inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2.5 py-2 text-slate-600 hover:bg-slate-50", className)}
      onClick={() => context.setOpen(!context.open)}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const context = React.useContext(DropdownMenuContext);

  if (!context?.open) return null;

  return (
    <div className={cn("absolute right-0 top-full z-50 mt-2 min-w-40 rounded-md border border-slate-200 bg-white p-1 shadow-lg", className)}>
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, onSelect, className, destructive }: { children: React.ReactNode; onSelect?: () => void; className?: string; destructive?: boolean }) {
  const context = React.useContext(DropdownMenuContext);

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center rounded-sm px-2 py-2 text-left text-sm hover:bg-slate-50",
        destructive && "text-red-600 hover:bg-red-50",
        className,
      )}
      onClick={() => {
        onSelect?.();
        context?.setOpen(false);
      }}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-slate-200" />;
}
