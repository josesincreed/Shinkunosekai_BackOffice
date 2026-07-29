import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--surface)] px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        <div className="mb-6 space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Shinkunosekai BO
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">Iniciar sesión</h1>
          <p className="text-sm leading-6 text-slate-600">
            Acceso al panel administrativo de anime.
          </p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
