import { listUsers } from "@/lib/repositories/user.repository";

export async function getUsers() {
  return listUsers();
}
