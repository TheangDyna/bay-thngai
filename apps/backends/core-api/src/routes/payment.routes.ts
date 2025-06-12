import PaymentController from "@/src/controllers/payment.controller";
import { Router } from "express";

const router = Router();
const paymentController = new PaymentController();

router.get("/callback", paymentController.getCallback);

router.post("/callback", paymentController.callback);

export const paymentRoutes = router;
