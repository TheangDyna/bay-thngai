import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { OrderController } from "../controllers/order.controller";

const router = Router();
const ctrl = new OrderController();

router.use(protect, restrictTo("user", "admin"));

router.post("/", ctrl.createOrder);

router.get("/", ctrl.getMyOrders);
router.get("/:id", ctrl.getOrder);

export const orderRoutes = router;
