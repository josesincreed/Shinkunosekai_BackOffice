import { getSession } from "@/lib/auth/session";

export async function getAuthServiceSession() {
  return getSession();
}
