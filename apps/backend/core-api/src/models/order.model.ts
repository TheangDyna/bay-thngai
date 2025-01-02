import mongoose, { Schema } from "mongoose";
import { IOrderDocument } from "../types/order.types";
import { defaultSchemaOptions } from "../utils/schemaOptions";
import { cartProductSchema } from "./cart.model";

const orderSchema = new mongoose.Schema<IOrderDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    products: [cartProductSchema],
    total: { type: Number },
    status: { type: String },
    shippingAddress: {
      coordinates: [{ type: Number }]
    }
    // discount:
  },
  defaultSchemaOptions
);

export const Order = mongoose.model<IOrderDocument>("Order", orderSchema);
