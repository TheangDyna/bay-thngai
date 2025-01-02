import mongoose from "mongoose";
import { z } from "zod";

export const ObjectIdSchema = z
  .any()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format"
  });
