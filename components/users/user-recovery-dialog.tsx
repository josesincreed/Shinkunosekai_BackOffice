"use client";

import { useState } from "react";
import { toast } from "sonner";

import { sendUserRecoveryAction } from "@/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { UserRow } from "@/types/user.types";

export function UserRecoveryDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: {
  user: UserRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const [isSending, setIsSending] = useState(false);

  const confirmSend = async () => {
    if (!user) return;

    setIsSending(true);
    const result = await sendUserRecoveryAction(user.id);
    setIsSending(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message);
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogHeader>
        <AlertDialogTitle>Enviar recuperación</AlertDialogTitle>
        <AlertDialogDescription>
          Se enviará un correo de recuperación a {user?.email ?? "este usuario"}.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button type="button" disabled={isSending} onClick={confirmSend}>
          {isSending ? "Enviando..." : "Enviar"}
        </Button>
      </AlertDialogFooter>
    </AlertDialog>
  );
}
