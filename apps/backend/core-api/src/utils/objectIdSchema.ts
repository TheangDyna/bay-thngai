import mongoose from "mongoose";
import { z } from "zod";

export const objectIdSchema = z
  .any()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId"
  });
