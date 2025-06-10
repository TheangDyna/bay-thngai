import { z } from "zod";
import { CuisineSchema } from "../validators/cuisine.validators";

export type CuisineInput = z.infer<typeof CuisineSchema>;

export interface Cuisine {
  _id: string;
  name: string;
  description: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
}
