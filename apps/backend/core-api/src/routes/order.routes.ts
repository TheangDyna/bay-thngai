import { Router } from "express";
import { validate } from "../middlewares/validation.middleware";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { GenericController } from "../controllers/generic.controller";
import { Order } from "../models/order.model";
import {
  CreateOrderSchema,
  UpdateOrderSchema
} from "../validators/order.validators";
import { GenericRepository } from "../repositories/generic.repository";
import { GenericService } from "../services/generic.service";

const router = Router();
const ordereRepository = new GenericRepository(Order);
const ordereService = new GenericService(ordereRepository);
const orderController = new GenericController(ordereService);

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
