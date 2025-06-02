import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { PaymentController } from "../controllers/payment.controller";

const router = Router();
const controller = new PaymentController();

router.use(protect, restrictTo("user", "admin"));
router.post("/purchase", controller.createTransaction);

export const paymentRoutes = router;
