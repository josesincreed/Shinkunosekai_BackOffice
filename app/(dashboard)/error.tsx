"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">No se pudo cargar el dashboard</h1>
        <p className="max-w-md text-sm text-slate-500">
          Intenta nuevamente. Si el problema persiste, revisa la conexión con Supabase o refresca la sesión.
        </p>
      </div>
      <Button type="button" onClick={reset}>
        Reintentar
      </Button>
    </section>
  );
}
