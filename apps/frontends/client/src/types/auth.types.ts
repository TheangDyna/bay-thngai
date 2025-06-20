import { z } from "zod";
import {
  ConfirmRegisterSchema,
  LoginSchema,
  SignupSchema
} from "../validators/auth.validators";

export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;
export type ConfirmRegisterInput = z.infer<typeof ConfirmRegisterSchema>;
