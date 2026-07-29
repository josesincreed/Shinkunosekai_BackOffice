"use client";

import { useCallback, useState } from "react";

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  const toast = useCallback((value: string) => {
    setMessage(value);
  }, []);

  return { message, toast, clear: () => setMessage(null) };
}
