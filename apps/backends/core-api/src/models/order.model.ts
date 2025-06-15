// src/models/order.model.ts
import { Document, Schema, Types, model } from "mongoose";

export interface Item {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface Customer {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone: string;
}

export type PaymentMethod = "abapay_khqr" | "cards" | "cod";

export type PaymentStatus =
  | "pending"
  | "approved"
  | "declined"
  | "refunded"
  | "cancelled";

export type DeliveryStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface OrderDoc extends Document {
  tranId: string;
  items: Item[];
  customer: Customer;
  shipping: number;
  tip: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  amount: number;
  deliveryAddress: {
    type: "Point";
    coordinates: [number, number];
    address?: string | undefined;
  };
  deliveryTimeSlot: string;
  instructions: string;
  leaveAtDoor: boolean;
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
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    tranId: { type: String, required: true, unique: true },
    items: { type: [ItemSchema], required: true },
    customer: { type: CustomerSchema, required: true },
    shipping: { type: Number, required: true },
    tip: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ["abapay_khqr", "cards", "cod"],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "approved", "declined", "refunded", "cancelled"],
      default: "pending"
    },
    deliveryStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled"
      ],
      default: "pending"
    },
    amount: { type: Number, required: true },
    deliveryAddress: {
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      },
      address: {
        type: String,
        trim: true
      }
    },
    deliveryTimeSlot: { type: String },
    instructions: { type: String },
    leaveAtDoor: { type: Boolean }
  },
  { timestamps: true }
);

OrderSchema.index({ location: "2dsphere" });

export const OrderModel = model<OrderDoc>("Order", OrderSchema);
