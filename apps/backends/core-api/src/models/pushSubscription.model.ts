// src/models/pushSubscription.model.ts
import mongoose, { Schema } from "mongoose";
import { IPushSubscriptionDocument } from "../types/pushSubscription.types";
import { defaultSchemaOptions } from "../utils/schemaOptions";

const pushSubscriptionSchema = new Schema<IPushSubscriptionDocument>(
  {
    endpoint: { type: String, required: true, unique: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true }
    }
  },
  defaultSchemaOptions
);

export const PushSubscription = mongoose.model<IPushSubscriptionDocument>(
  "PushSubscription",
  pushSubscriptionSchema
);
