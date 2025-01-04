import { z } from "zod";
import { CuisineSchema } from "../validators/cuisine.validators";

export type CuisineInput = z.infer<typeof CuisineSchema>;
