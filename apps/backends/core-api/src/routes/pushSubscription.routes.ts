// src/routes/pushSubscription.routes.ts
import { PushSubscriptionController } from "@/controllers/pushSubscription.controller";
import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { CreatePushSubscriptionSchema } from "../validators/pushSubscription.validators";

const router = Router();
const controller = new PushSubscriptionController();

// Public: subscribe a new push subscription
router.post("/", validate(CreatePushSubscriptionSchema), controller.subscribe);

// Public or protected? Up to you. But typically any client can delete its own sub:
router.delete("/:endpoint", controller.unsubscribe);

// Public: check if endpoint exists
router.get("/check/:endpoint", controller.check);

// Protected (admin): send a push notification to all users
router.post("/send", protect, restrictTo("admin"), controller.sendNotification);

export const pushSubscriptionRoutes = router;
