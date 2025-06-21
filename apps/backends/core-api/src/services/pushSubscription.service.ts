// src/services/pushSubscription.service.ts
import { PushSubscriptionRepository } from "@/repositories/pushSubscription.repository";
import { IPushSubscription } from "@/types/pushSubscription.types";

export class PushSubscriptionService {
  private repository: PushSubscriptionRepository;

  constructor() {
    this.repository = new PushSubscriptionRepository();
  }

  public async upsertSubscription(
    data: Partial<IPushSubscription>
  ): Promise<void> {
    await this.repository.createOrUpdateSubscription(data as any);
  }

  public async exists(endpoint: string): Promise<boolean> {
    // Return true if repository finds a matching doc
    return Boolean(await this.repository.findByEndpoint(endpoint));
  }

  public async removeSubscription(endpoint: string): Promise<void> {
    await this.repository.deleteSubscriptionByEndpoint(endpoint);
  }

  public async listAllSubscriptions(): Promise<IPushSubscription[]> {
    const docs = await this.repository.getAllSubscriptions();
    return docs.map((doc) => ({
      endpoint: doc.endpoint,
      keys: { p256dh: doc.keys.p256dh, auth: doc.keys.auth }
    }));
  }
}
