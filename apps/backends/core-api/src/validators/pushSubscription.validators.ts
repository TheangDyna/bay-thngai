// src/validators/pushSubscription.validators.ts
import { z } from "zod";

// A helper for validating the “keys” object inside a Web Push subscription
const SubscriptionKeysSchema = z.object({
  p256dh: z.string().trim().min(1),
  auth: z.string().trim().min(1)
});

export const PushSubscriptionSchema = z.object({
  endpoint: z.string().url().trim().min(1),
  keys: SubscriptionKeysSchema
});

// We only need a single schema (no create vs. update partials), because subscriptions are always “upserted” intact.
export const CreatePushSubscriptionSchema = PushSubscriptionSchema;
export const UpdatePushSubscriptionSchema = PushSubscriptionSchema.partial();
