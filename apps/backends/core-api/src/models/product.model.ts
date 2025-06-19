import mongoose, { Schema } from "mongoose";
import { IProductDocument } from "../types/product.types";
import { defaultSchemaOptions } from "../utils/schemaOptions";

const productSchema = new Schema<IProductDocument>(
  {
    name: { type: String, unique: true },
    description: { type: String },
    price: { type: Number },
    cuisines: [{ type: Schema.Types.ObjectId, ref: "Cuisine" }],
    dietaries: [{ type: Schema.Types.ObjectId, ref: "Dietary" }],
    inStock: { type: Boolean }, // change to availble or not
    calories: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
    fats: { type: Number },
    ingredients: [{ type: String }],
    ratingsAverage: { type: Number },
    ratingsQuantity: { type: Number },
    thumbnail: { type: String },
    images: [{ type: String }],
    sold: { type: Number, default: 0 },
    discount: { type: mongoose.Schema.Types.ObjectId, ref: "Discount" }
  },
  defaultSchemaOptions
);

productSchema.pre(
  /^find/,
  function (this: mongoose.Query<any, IProductDocument>, next) {
    this.populate({
      path: "cuisines",
      select: "name"
    });
    next();
  }
);

// productSchema.virtual("reviews", {
//   ref: "Review",
//   foreignField: "product",
//   localField: "_id"
// });

export const Product = mongoose.model<IProductDocument>(
  "Product",
  productSchema
);
