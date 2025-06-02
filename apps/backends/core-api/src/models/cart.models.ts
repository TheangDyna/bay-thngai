// src/models/cart.model.ts
import { Schema, model, Document, Types } from "mongoose";

export interface ICartItem {
  productId: string;
  qty: number;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
  createdAt: Date;
}

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        qty: { type: Number, required: true, min: 1 }
      }
    ]
  },
  { timestamps: true }
);

export const Cart = model<ICart>("Cart", CartSchema);
