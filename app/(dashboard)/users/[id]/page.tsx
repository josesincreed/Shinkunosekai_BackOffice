import { notFound, redirect } from "next/navigation";

import { UserDetail } from "@/components/users/user-detail";
import { routes } from "@/lib/constants/routes";
import { getCurrentAuthContext } from "@/lib/services/auth.service";
import { canManageUsers } from "@/lib/users/permissions";
import { getUserService } from "@/lib/services/users/user.service";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const authContext = await getCurrentAuthContext();

  if (!authContext || !canManageUsers(authContext.profile.role)) {
    redirect(routes.dashboard);
  }

  const { id } = await params;
  const user = await getUserService(id);

  if (!user) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl font-semibold">Detalle de usuario</h1>
        <p className="text-slate-600">Registro {user.id}</p>
      </div>
      <UserDetail user={user} />
    </section>
  );
}
