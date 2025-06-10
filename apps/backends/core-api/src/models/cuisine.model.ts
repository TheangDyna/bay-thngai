import mongoose, { Schema } from "mongoose";
import { ICuisineDocument } from "../types/cuisine.types";
import { defaultSchemaOptions } from "../utils/schemaOptions";

const cuisineSchema = new Schema<ICuisineDocument>(
  {
    name: { type: String, unique: true },
    description: { type: String },
    thumbnail: { type: String }
  },
  defaultSchemaOptions
);

export const Cuisine = mongoose.model<ICuisineDocument>(
  "Cuisine",
  cuisineSchema
);
