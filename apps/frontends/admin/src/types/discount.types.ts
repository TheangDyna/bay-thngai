import { DiscountSchema } from "@/validators/discount.validators";
import { z } from "zod";

export type DiscountInput = z.infer<typeof DiscountSchema>;

export interface Discount {
  _id: string;
  type: "flat" | "percentage";
  amount: number;
  startDate: string;
  endDate: string;
  active: boolean;
}
