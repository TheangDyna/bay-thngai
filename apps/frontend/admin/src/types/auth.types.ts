import { z } from "zod";
import { LoginSchema } from "../validators/auth.validators";

export type LoginInput = z.infer<typeof LoginSchema>;
