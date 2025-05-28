import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { placeOrderSchema } from "../validators/order.validator";
import { protect } from "@/src/middlewares/auth.middleware";
import { validate } from "@/src/middlewares/validation.middleware";

const router = Router();
const ctrl = new OrderController();

router.post("/orders", protect, validate(placeOrderSchema), ctrl.placeOrder);

export const orderRoutes = router;
