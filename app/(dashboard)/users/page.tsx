import { redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/services/auth.service";
import { canManageUsers } from "@/lib/users/permissions";
import { routes } from "@/lib/constants/routes";
import { getUsersService } from "@/lib/services/users/user.service";
import { UsersPage } from "@/components/users/users-page";

function getNumber(value: string | string[] | undefined, fallback: number) {
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  return fallback;
}

export default async function UsersIndexPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const authContext = await getCurrentAuthContext();

  if (!authContext || !canManageUsers(authContext.profile.role)) {
    redirect(routes.dashboard);
  }

  const params = await searchParams;

  const data = await getUsersService({
    page: getNumber(params.page, 1),
    pageSize: getNumber(params.pageSize, 10),
    search: typeof params.search === "string" ? params.search : "",
    role:
      params.role === "ADMIN" ||
      params.role === "EDITOR" ||
      params.role === "USER"
        ? params.role
        : "all",
    status: params.status === "active" ? "active" : params.status === "inactive" ? "inactive" : "all",
    sortBy:
      params.sortBy === "full_name" ||
      params.sortBy === "email" ||
      params.sortBy === "role" ||
      params.sortBy === "active" ||
      params.sortBy === "created_at"
        ? params.sortBy
        : "created_at",
    sortDir: params.sortDir === "asc" ? "asc" : "desc",
  });

  return <UsersPage data={data} />;
}
