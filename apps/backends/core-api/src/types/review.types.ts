import { Document } from "mongoose";
import { z } from "zod";
import { ReviewSchema } from "../validators/review.validators";

export type IReview = z.infer<typeof ReviewSchema>;

export interface IReviewDocument extends IReview, Document {
  createdAt: Date;
  updatedAt: Date;
}
