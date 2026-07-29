import { redirect } from "next/navigation";

import { routes } from "@/lib/constants/routes";
import { getCurrentAuthContext } from "@/lib/services/auth.service";

export default async function Home() {
  const authContext = await getCurrentAuthContext();
  redirect(authContext ? routes.dashboard : routes.login);
}
