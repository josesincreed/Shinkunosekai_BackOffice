import { z } from "zod";

export const animeSchema = z.object({
  title: z.string().min(1),
});
