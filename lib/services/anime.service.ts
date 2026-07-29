import { listAnimes } from "@/lib/repositories/anime.repository";

export async function getAnimes() {
  return listAnimes();
}
