import mongoose, { Schema } from "mongoose";
import { defaultSchemaOptions } from "../utils/schemaOptions";
import { IReviewDocument } from "../types/review.types";

const reviewSchema = new mongoose.Schema<IReviewDocument>(
  {
    rating: { type: Number },
    review: { type: String },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    user: { type: Schema.Types.ObjectId, ref: "User" }
  },
  defaultSchemaOptions
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.pre(
  /^find/,
  function (this: mongoose.Query<any, IReviewDocument>, next) {
    this.select("-product");
    this.populate({
      path: "user",
      select: "firstName lastName email -_id"
    });
    next();
  }
);

export const Review = mongoose.model<IReviewDocument>("Review", reviewSchema);
