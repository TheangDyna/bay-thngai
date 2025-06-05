// src/models/order.model.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  tranId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  customer: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  amount: number;
  shipping: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    tranId: { type: String, required: true, unique: true, maxlength: 20 },
    items: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    customer: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String },
      phone: { type: String }
    },
    amount: { type: Number, required: true },
    shipping: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      default: "PENDING"
    }
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);
