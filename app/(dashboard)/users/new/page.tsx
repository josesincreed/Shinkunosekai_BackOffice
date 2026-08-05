import { redirect } from "next/navigation";

import { UserRouteDialog } from "@/components/users/user-route-dialog";
import { routes } from "@/lib/constants/routes";
import { getCurrentAuthContext } from "@/lib/services/auth.service";
import { canManageUsers } from "@/lib/users/permissions";

export default async function NewUserPage() {
  const authContext = await getCurrentAuthContext();

  if (!authContext || !canManageUsers(authContext.profile.role)) {
    redirect(routes.dashboard);
  }

  return <UserRouteDialog mode="create" returnHref={routes.users} />;
}
