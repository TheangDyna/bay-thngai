import { Document } from "mongoose";
import { z } from "zod";
import { CuisineSchema } from "../validators/cuisine.validators";

export type ICuisine = z.infer<typeof CuisineSchema>;

export interface ICuisineDocument extends ICuisine, Document {
  createdAt: Date;
  updatedAt: Date;
}
