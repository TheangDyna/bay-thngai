// src/types/pushSubscription.types.ts
import { Document } from "mongoose";
import { z } from "zod";
import { PushSubscriptionSchema } from "../validators/pushSubscription.validators";

export type IPushSubscription = z.infer<typeof PushSubscriptionSchema>;

export interface IPushSubscriptionDocument extends IPushSubscription, Document {
  createdAt: Date;
  updatedAt: Date;
}
