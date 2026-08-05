import { format } from "date-fns";
import { es } from "date-fns/locale";
import { redirect } from "next/navigation";

import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { getDashboardSummary } from "@/lib/services/dashboard.service";
import { getCurrentAuthContext } from "@/lib/services/auth.service";
import { routes } from "@/lib/constants/routes";

export default async function DashboardIndexPage() {
  const [authContext, summary] = await Promise.all([
    getCurrentAuthContext(),
    getDashboardSummary(),
  ]);

  if (!authContext) {
    redirect(routes.login);
  }

  const welcomeName =
    authContext.profile.full_name ??
    authContext.profile.email ??
    "Administrador";

  const dateLabel = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", {
    locale: es,
  });

  return (
    <DashboardPage
      summary={summary}
      welcomeName={welcomeName}
      dateLabel={dateLabel}
    />
  );
}
