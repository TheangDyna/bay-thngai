import { Document } from "mongoose";
import { z } from "zod";
import { OrderSchema } from "../validators/order.validators";

export type IOrder = z.infer<typeof OrderSchema>;

export interface IOrderDocument extends IOrder, Document {
  createdAt: Date;
  updatedAt: Date;
}
