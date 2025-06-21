// src/controllers/pushSubscription.controller.ts
import { PushSubscriptionService } from "@/services/pushSubscription.service";
import { catchAsync } from "@/utils/catchAsync";
import { Request, Response } from "express";
import webpush from "web-push";

export class PushSubscriptionController {
  private service: PushSubscriptionService;

  constructor() {
    this.service = new PushSubscriptionService();
  }

  // POST /push  → subscribe/upsert (already implemented)
  public subscribe = catchAsync(async (req: Request, res: Response) => {
    await this.service.upsertSubscription(req.body);
    res.status(201).json({ status: "success" });
  });

  // DELETE /push/:endpoint  → delete subscription
  public unsubscribe = catchAsync(async (req: Request, res: Response) => {
    const { endpoint } = req.params;
    await this.service.removeSubscription(endpoint);
    res.status(204).send();
  });

  // GET /push/check/:endpoint  → returns 200 if exists, 404 if not
  public check = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { endpoint } = req.params;
      const exists = await this.service.exists(endpoint);
      if (!exists) {
        res.status(404).json({ status: "fail", message: "Not found" });
        return;
      }
      res.status(200).json({ status: "success", message: "Found" });
    }
  );

  // 3) Trigger a push notification to all saved subscribers
  public sendNotification = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      // Expect body: { title: string; message: string }
      const { title, message } = req.body as { title: string; message: string };

      // Build payload
      const payload = JSON.stringify({ title, message });

      // web-push (VAPID keys already configured in server bootstrap)
      const subscriptions = await this.service.listAllSubscriptions();
      const sendPromises = subscriptions.map((sub) =>
        webpush.sendNotification(sub as any, payload).catch(async (err) => {
          // If subscription is no longer valid (410/404), remove it
          if (err.statusCode === 410 || err.statusCode === 404) {
            await this.service.removeSubscription((sub as any).endpoint);
          } else {
            console.error("Push send error:", err);
          }
        })
      );

      await Promise.all(sendPromises);
      res.status(200).json({
        status: "success",
        message: "Notifications sent."
      });
    }
  );
}
