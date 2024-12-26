import mongoose, { Schema } from "mongoose";
import { ICartDocument, ICartProduct } from "../types/cart.types";
import { defaultSchemaOptions } from "../utils/schemaOptions";

export const cartProductSchema = new mongoose.Schema<ICartProduct>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number }
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema<ICartDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    products: [cartProductSchema]
  },
  defaultSchemaOptions
);

export const Cart = mongoose.model<ICartDocument>("Cart", cartSchema);
