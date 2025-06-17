import { z } from "zod";
import { ObjectIdSchema } from "../utils/objectIdSchema";

export const ReviewSchema = z
  .object({
    rating: z.number().int().min(1).max(5),
    review: z.string().trim().optional(),
    user: ObjectIdSchema,
    product: ObjectIdSchema
  })
  .strict();

export const CreateReviewSchema = ReviewSchema.omit({
  user: true,
  product: true
});
export const UpdateReviewSchema = ReviewSchema.partial();
