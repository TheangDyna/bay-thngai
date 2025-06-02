import { Schema, model, Document, Types } from "mongoose";

export interface IOrder extends Document {
  userId: Types.ObjectId;
  items: { productId: Types.ObjectId; qty: number; price: number }[];
  address: string;
  addressNotes?: string;
  label?: "Home" | "Work" | "Partner" | "Other";
  contactless: boolean;
  deliveryOption: "standard" | "priority";
  paymentMethod: "cod" | "card" | "aba";
  tip: number;
  status: "pending" | "paid" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        qty: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    address: { type: String, required: true },
    addressNotes: String,
    label: String,
    contactless: { type: Boolean, default: false },
    deliveryOption: {
      type: String,
      enum: ["standard", "priority"],
      default: "standard"
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "aba"],
      default: "cod"
    },
    tip: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", OrderSchema);
