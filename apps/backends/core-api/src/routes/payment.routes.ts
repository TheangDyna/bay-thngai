// src/routes/payment.routes.ts

import { PaymentController } from "@/src/controllers/payment.controller";
import { protect, restrictTo } from "@/src/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();
const controller = new PaymentController();

// Only authenticated “user” roles may initiate a purchase
router.use(protect, restrictTo("user", "admin"));

// POST /api/payment/purchase
router.post("/purchase", controller.createTransaction);

export const paymentRoutes = router;
