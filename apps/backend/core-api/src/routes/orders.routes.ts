import { Router } from "express";
import { validate } from "../middlewares/validation.middleware";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { GenericController } from "../controllers/generic.controller";
import { Order } from "../models/order.model";
import {
  CreateOrderSchema,
  UpdateOrderSchema
} from "../validators/order.validators";

const router = Router();
const orderController = new GenericController(Order);

router.use(protect, restrictTo("user", "admin"));

router
  .route("/")
  .get(orderController.getAll)
  .post(validate(CreateOrderSchema), orderController.createOne);

router
  .route("/:id")
  .get(orderController.getOne)
  .patch(validate(UpdateOrderSchema), orderController.updateOne)
  .delete(orderController.deleteOne);

export const orderRoutes = router;
