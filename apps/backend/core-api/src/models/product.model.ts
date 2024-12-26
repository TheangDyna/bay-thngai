import mongoose, { Schema } from "mongoose";
import { IProductDocument } from "../types/product.types";
import { defaultSchemaOptions } from "../utils/schemaOptions";

const productSchema = new Schema<IProductDocument>(
  {
    name: { type: String, unique: true },
    description: { type: String },
    price: { type: Number },
    cuisines: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category"
      }
    ],
    dietaries: [
      {
        type: Schema.Types.ObjectId,
        ref: "Dietary"
      }
    ],
    inStock: { type: Boolean },
    calories: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
    fats: { type: Number },
    ingredients: [{ type: String }]
  },
  defaultSchemaOptions
);

export const Product = mongoose.model<IProductDocument>(
  "Product",
  productSchema
);
