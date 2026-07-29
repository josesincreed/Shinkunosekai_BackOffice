import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { routes } from "@/lib/constants/routes";
import { getCurrentAuthContext } from "@/lib/services/auth.service";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const authContext = await getCurrentAuthContext();

  if (!authContext) {
    redirect(routes.login);
  }

  return (
    <div className="flex min-h-screen bg-[var(--surface)] text-slate-900">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar profile={authContext.profile} />
        <main className="flex-1 px-6 py-8">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
