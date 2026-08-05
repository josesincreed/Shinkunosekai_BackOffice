"use client";

import { useState } from "react";
import { MoreHorizontal, PencilLine, RefreshCw, Shield, UserCog, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { toggleUserStatusAction } from "@/actions/user.actions";
import { UserPasswordDialog } from "@/components/users/user-password-dialog";
import { UserRecoveryDialog } from "@/components/users/user-recovery-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserRow } from "@/types/user.types";

export function UserRowActions({ user }: { user: UserRow }) {
  const router = useRouter();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const toggleStatus = async () => {
    setIsToggling(true);
    const result = await toggleUserStatusAction(user.id);
    setIsToggling(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message);
    router.refresh();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => router.push(`/users/${user.id}`)}>
            <UserRound className="mr-2 h-4 w-4" />
            Ver perfil
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push(`/users/${user.id}/edit`)}>
            <PencilLine className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setPasswordOpen(true)}>
            <Shield className="mr-2 h-4 w-4" />
            Cambiar contraseña
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setRecoveryOpen(true)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Enviar recuperación
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={toggleStatus} disabled={isToggling}>
            <UserCog className="mr-2 h-4 w-4" />
            {user.active ? "Desactivar" : "Activar"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserPasswordDialog
        user={user}
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
      />

      <UserRecoveryDialog
        user={user}
        open={recoveryOpen}
        onOpenChange={setRecoveryOpen}
      />
    </>
  );
}
