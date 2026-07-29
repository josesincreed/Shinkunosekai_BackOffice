"use client";

import { useState } from "react";
import { MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { AnimeDeleteDialog } from "@/components/animes/anime-delete-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { AnimeWithCategories } from "@/types/anime.types";

export function AnimeRowActions({ anime }: { anime: AnimeWithCategories }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => router.push(`/animes/${anime.id}/edit`)}>
            <PencilLine className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive onSelect={() => setDeleteOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AnimeDeleteDialog anime={anime} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
}
