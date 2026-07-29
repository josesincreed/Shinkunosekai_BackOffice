import { getCurrentAuthContext } from "@/lib/services/auth.service";

export async function getSession() {
  return getCurrentAuthContext();
}

export async function getSessionProfile() {
  return (await getCurrentAuthContext())?.profile ?? null;
}
