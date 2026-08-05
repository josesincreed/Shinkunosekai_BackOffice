"use client";

import { toast } from "sonner";

import { createUserAction, updateUserAction } from "@/actions/user.actions";
import { UserForm } from "@/components/forms/user-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UserActionResult, UserRow } from "@/types/user.types";
import type { UserCreateFormValues, UserUpdateFormValues } from "@/lib/validations/users/user.schema";

export function UserFormDialog({
  open,
  onOpenChange,
  mode,
  user,
  initialValues,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  user?: UserRow | null;
  initialValues?: Partial<UserCreateFormValues | UserUpdateFormValues>;
  onSuccess: () => void;
}) {
  const handleSuccess = (result: UserActionResult) => {
    if (result.ok) {
      toast.success(result.message);
      onSuccess();
    } else {
      toast.error(result.error);
    }
  };

  const submitCreate = async (values: UserCreateFormValues) => {
    const result = await createUserAction(values);
    handleSuccess(result);
    return result;
  };

  const submitEdit = async (values: UserUpdateFormValues) => {
    const result = await updateUserAction(user?.id ?? "", values);
    handleSuccess(result);
    return result;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogClose onClick={() => onOpenChange(false)} />
      <DialogHeader>
        <DialogTitle>{mode === "create" ? "Nuevo usuario" : "Editar usuario"}</DialogTitle>
        <DialogDescription>
          {mode === "create"
            ? "Crea un usuario del back office o un usuario web con permisos controlados."
            : "Actualiza la información visible del usuario seleccionado."}
        </DialogDescription>
      </DialogHeader>
      <DialogContent>
        <UserForm
          mode={mode}
          user={user ?? undefined}
          initialValues={initialValues as Partial<UserUpdateFormValues> | undefined}
          onSubmit={mode === "create" ? submitCreate : submitEdit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
