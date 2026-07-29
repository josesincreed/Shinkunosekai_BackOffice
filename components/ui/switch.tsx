"use client";

import { cn } from "@/lib/utils/cn";

type SwitchProps = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
};

export function Switch({
  checked = false,
  onCheckedChange,
  disabled,
  id,
  name,
}: SwitchProps) {
  return (
    <button
      id={id}
      name={name}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full border border-transparent transition-colors",
        checked ? "bg-slate-900" : "bg-slate-200",
        disabled && "cursor-not-allowed opacity-50",
      )}
      onClick={() => onCheckedChange?.(!checked)}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
