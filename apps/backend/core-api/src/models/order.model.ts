import { Schema, model, Document } from "mongoose";

interface OrderItem {
  product: Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrderDocument extends Document {
  user: string;
  items: OrderItem[];
  total: number;
  paymentStatus: "pending" | "paid" | "failed";
  paymentRef?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    user: { type: String, ref: "User", required: true },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },
    paymentRef: String
  },
  { timestamps: true }
);

export const Order = model<IOrderDocument>("Order", OrderSchema);
