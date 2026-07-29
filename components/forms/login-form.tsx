export function LoginForm() {
  return (
    <form className="space-y-4">
      <label className="block space-y-2 text-sm">
        <span className="font-medium text-slate-700">Correo</span>
        <input
          type="email"
          placeholder="admin@shinkunosekai.bo"
          className="w-full rounded-lg border border-black/10 px-4 py-3 outline-none ring-0 focus:border-slate-400"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-medium text-slate-700">Contraseña</span>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full rounded-lg border border-black/10 px-4 py-3 outline-none ring-0 focus:border-slate-400"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
      >
        Entrar
      </button>
    </form>
  );
}
