import OrderController from "@/src/controllers/order.controller";
import { protect } from "@/src/middlewares/auth.middleware";
import { validate } from "@/src/middlewares/validation.middleware";
import { CreateOrderSchema } from "@/src/validators/order.validators";
import { Router } from "express";

const router = Router();
const orderController = new OrderController();

router.post("/", protect, validate(CreateOrderSchema), orderController.create);

router.route("/").get(orderController.getAllOrders);

router.get("/user", protect, orderController.getUserOrders);

router.get("/:tranId", orderController.getOrderByTranId);

router.patch("/:orderId/delivery-status", orderController.updateDeliveryStatus);

export const orderRoutes = router;
