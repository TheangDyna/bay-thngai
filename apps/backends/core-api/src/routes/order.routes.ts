import OrderController from "@/src/controllers/order.controller";
import { validate } from "@/src/middlewares/validation.middleware";
import { CreateOrderSchema } from "@/src/validators/order.validators";
import { Router } from "express";

const router = Router();
const orderController = new OrderController();

router.post("/", validate(CreateOrderSchema), orderController.create);

export const orderRoutes = router;
