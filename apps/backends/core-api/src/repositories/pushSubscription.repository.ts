// src/repositories/pushSubscription.repository.ts
import { PushSubscription } from "@/src/models/pushSubscription.model";
import { IPushSubscriptionDocument } from "@/src/types/pushSubscription.types";
import { AppError } from "@/src/utils/appError";

export class PushSubscriptionRepository {
  public async createOrUpdateSubscription(
    data: Partial<IPushSubscriptionDocument>
  ): Promise<IPushSubscriptionDocument> {
    // Upsert by endpoint
    const filter = { endpoint: data.endpoint };
    const update = { ...data };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const sub = await PushSubscription.findOneAndUpdate(
      filter,
      update,
      options
    );
    if (!sub) {
      // In practice, findOneAndUpdate with upsert:true should always return a doc.
      throw new AppError("Failed to create or update subscription.", 500);
    }
    return sub;
  }

  public async getAllSubscriptions(): Promise<IPushSubscriptionDocument[]> {
    return await PushSubscription.find({});
  }

  public async deleteSubscriptionByEndpoint(endpoint: string): Promise<void> {
    const result = await PushSubscription.findOneAndDelete({ endpoint });
    if (!result) {
      throw new AppError("Subscription not found.", 404);
    }
  }

  public async findByEndpoint(
    endpoint: string
  ): Promise<IPushSubscriptionDocument | null> {
    return await PushSubscription.findOne({ endpoint });
  }
}
