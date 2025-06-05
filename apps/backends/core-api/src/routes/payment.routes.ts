// src/routes/payment.routes.ts
import { PaymentController } from "@/src/controllers/payment.controller";
import { Router } from "express";

const router = Router();
const controller = new PaymentController();

// 1) Create signed payload: { endpoint, payload }
router.post("/purchase", controller.createTransaction);

// 2) PayWay’s server‐to‐server callback:
router.post("/callback", controller.handleCallback);

export const paymentRoutes = router;
