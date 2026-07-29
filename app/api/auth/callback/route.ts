import { NextResponse } from "next/server";

import { routes } from "@/lib/constants/routes";
import { getCurrentAuthContext } from "@/lib/services/auth.service";

export async function GET(request: Request) {
  const authContext = await getCurrentAuthContext();

  return NextResponse.redirect(
    new URL(authContext ? routes.dashboard : routes.login, request.url),
  );
}
