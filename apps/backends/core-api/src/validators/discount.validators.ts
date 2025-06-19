import { z } from "zod";

const DiscountBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["flat", "percentage"]),
  amount: z.number().min(1, "Amount must be at least 1"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  active: z.boolean().default(true)
});

export const DiscountSchema = DiscountBaseSchema.refine(
  (data) => new Date(data.startDate) <= new Date(data.endDate),
  {
    message: "Start date must be before or equal to end date",
    path: ["endDate"]
  }
);

export const CreateDiscountSchema = DiscountSchema;
export const UpdateDiscountSchema = DiscountBaseSchema.partial().refine(
  (data) =>
    !data.startDate ||
    !data.endDate ||
    new Date(data.startDate) <= new Date(data.endDate),
  {
    message: "Start date must be before or equal to end date",
    path: ["endDate"]
  }
);
