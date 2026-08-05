"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { UserFormDialog } from "@/components/users/user-form-dialog";
import type { UserRow } from "@/types/user.types";
import type { UserCreateFormValues, UserUpdateFormValues } from "@/lib/validations/users/user.schema";

export function UserRouteDialog({
  mode,
  returnHref,
  user,
  initialValues,
}: {
  mode: "create" | "edit";
  returnHref: string;
  user?: UserRow | null;
  initialValues?: Partial<UserCreateFormValues | UserUpdateFormValues>;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <UserFormDialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          router.replace(returnHref);
        }
      }}
      mode={mode}
      user={user}
      initialValues={initialValues}
      onSuccess={() => {
        setOpen(false);
        router.replace(returnHref);
      }}
    />
  );
}
