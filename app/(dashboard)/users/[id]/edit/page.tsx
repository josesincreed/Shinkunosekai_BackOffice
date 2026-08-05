import { notFound, redirect } from "next/navigation";

import { UserRouteDialog } from "@/components/users/user-route-dialog";
import { routes } from "@/lib/constants/routes";
import { getCurrentAuthContext } from "@/lib/services/auth.service";
import { canManageUsers } from "@/lib/users/permissions";
import { getUserService } from "@/lib/services/users/user.service";

export default async function EditUserPage({
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
    <UserRouteDialog
      mode="edit"
      user={user}
      initialValues={{
        fullName: user.full_name ?? "",
        role: user.role,
        active: user.active,
        avatarUrl: user.avatar_url ?? "",
      }}
      returnHref={`/users/${user.id}`}
    />
  );
}
