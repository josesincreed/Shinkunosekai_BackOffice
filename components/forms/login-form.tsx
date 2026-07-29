"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { signInAction } from "@/actions/auth.actions";
import { loginSchema, type LoginFormValues } from "@/lib/validations/login.schema";

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    const result = await signInAction(values);

    if (result?.error) {
      setServerError(result.error);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <label className="block space-y-2 text-sm">
        <span className="font-medium text-slate-700">Correo</span>
        <input
          type="email"
          autoComplete="email"
          placeholder="admin@shinkunosekai.bo"
          className="w-full rounded-lg border border-black/10 px-4 py-3 outline-none ring-0 transition-colors focus:border-slate-400"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        ) : null}
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium text-slate-700">Contraseña</span>
        <input
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-lg border border-black/10 px-4 py-3 outline-none ring-0 transition-colors focus:border-slate-400"
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        ) : null}
      </label>

      {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
