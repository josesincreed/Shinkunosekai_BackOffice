export * from "@/lib/validations/users/user.schema";
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1),
});
