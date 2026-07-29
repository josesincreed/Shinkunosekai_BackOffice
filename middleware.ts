import { NextResponse, type NextRequest } from "next/server";

import { routes } from "@/lib/constants/routes";
import {
  copyResponseCookies,
  createSupabaseMiddlewareClient,
} from "@/lib/supabase/middleware";

const PROTECTED_PREFIXES = [
  routes.dashboard,
  routes.animes,
  routes.categories,
  routes.users,
  routes.settings,
] as const;

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function shouldBypass(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/logo.svg" ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons") ||
    pathname === routes.authCallback
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  const baseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  const supabase = createSupabaseMiddlewareClient(request, baseResponse);
  const { data } = await supabase.auth.getUser();
  const isAuthenticated = Boolean(data.user);

  if (pathname === routes.home) {
    const destination = isAuthenticated ? routes.dashboard : routes.login;
    const redirectResponse = NextResponse.redirect(new URL(destination, request.url));
    copyResponseCookies(baseResponse, redirectResponse);
    return redirectResponse;
  }

  if (pathname === routes.login) {
    if (isAuthenticated) {
      const redirectResponse = NextResponse.redirect(
        new URL(routes.dashboard, request.url),
      );
      copyResponseCookies(baseResponse, redirectResponse);
      return redirectResponse;
    }

    return baseResponse;
  }

  if (!isProtectedPath(pathname)) {
    return baseResponse;
  }

  if (!isAuthenticated) {
    const redirectResponse = NextResponse.redirect(new URL(routes.login, request.url));
    copyResponseCookies(baseResponse, redirectResponse);
    return redirectResponse;
  }

  return baseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
