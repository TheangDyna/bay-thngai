import { z } from "zod";

const UserSchema = z.object({});

export const CreateUserSchema = UserSchema;
export const UpdateUserSchema = UserSchema.partial();
