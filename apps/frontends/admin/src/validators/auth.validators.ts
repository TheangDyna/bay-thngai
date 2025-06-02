import { z } from "zod";

export const LoginSchema = z
  .object({
    email: z.string().trim().min(1, "Email address is required"),
    password: z.string().trim().min(1, "Password is required")
  })
  .strict();
