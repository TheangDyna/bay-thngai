import { IDiscountDocument } from "@/types/discount.types";
import mongoose, { Schema } from "mongoose";

const discountSchema = new Schema<IDiscountDocument>(
  {
    name: { type: String },
    type: { type: String, enum: ["flat", "percentage"], required: true },
    amount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Discount = mongoose.model<IDiscountDocument>(
  "Discount",
  discountSchema
);
