import { DiscountInput } from "@/types/discount.types";
import { format } from "date-fns";
import { z } from "zod";

export const DiscountSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["flat", "percentage"]),
    amount: z.union([
      z.string().trim().min(1, "Amount is required."),
      z.number().min(0, "Amount must be a positive number.")
    ]),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    active: z.boolean().default(true)
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "Start date must be before or equal to end date",
    path: ["endDate"]
  });

export const DiscountDefaultValue: DiscountInput = {
  name: "",
  type: "percentage",
  amount: "",
  startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  endDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  active: true
};
