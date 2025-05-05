import mongoose, { Schema } from "mongoose";
import { defaultSchemaOptions } from "../utils/schemaOptions";
import { ICartDocument } from "@/src/types/cart.types";

const CartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    }
  },
  { _id: false }
);

const CartSchema = new Schema<ICartDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    items: {
      type: [CartItemSchema],
      default: []
    }
  },
  defaultSchemaOptions
);

CartSchema.pre(
  /^find/,
  function (this: mongoose.Query<any, ICartDocument>, next) {
    this.populate({ path: "items.product", select: "name price thumbnail" });
    next();
  }
);

export const Cart = mongoose.model<ICartDocument>("Cart", CartSchema);

export { ICartDocument };
