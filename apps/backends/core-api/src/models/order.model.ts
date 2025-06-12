// src/models/order.model.ts
import { Document, Schema, Types, model } from "mongoose";

export interface Item {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export type PaymentMethod = "khqr" | "card" | "cod";

export interface OrderDoc extends Document {
  tranId: string;
  items: Item[];
  customer: Customer;
  shipping: number;
  tip: number;
  paymentMethod: PaymentMethod;
  status: string;
  amount: number;
  deliveryAddressId: string;
  deliveryTimeSlot: string;
  instructions?: string;
}

const ItemSchema = new Schema<Item>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  },
  { _id: false }
);

const CustomerSchema = new Schema<Customer>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  { _id: false }
);

const OrderSchema = new Schema<OrderDoc>(
  {
    tranId: { type: String, required: true, unique: true },
    items: { type: [ItemSchema], required: true },
    customer: { type: CustomerSchema, required: true },
    shipping: { type: Number, required: true },
    tip: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ["khqr", "card", "cod"],
      required: true
    },
    status: {
      type: String,
      default: "pending"
    },
    amount: { type: Number, required: true },
    deliveryAddressId: { type: String, required: true },
    deliveryTimeSlot: { type: String, required: true },
    instructions: { type: String }
  },
  { timestamps: true }
);

export const OrderModel = model<OrderDoc>("Order", OrderSchema);
