import { DiscountSchema } from "@/src/validators/discount.validators";
import { Document } from "mongoose";
import { z } from "zod";

export type IDiscount = z.infer<typeof DiscountSchema>;

export interface IDiscountDocument
  extends Omit<IDiscount, "startDate" | "endDate">,
    Document {
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
