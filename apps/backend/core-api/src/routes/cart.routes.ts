import { Router } from "express";
import {
  CreateCartSchema,
  UpdateCartSchema
} from "../validators/cart.validators";
import { validate } from "../middlewares/validation.middleware";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { GenericController } from "../controllers/generic.controller";
import { Cart } from "../models/cart.model";

const router = Router();
const cartController = new GenericController(Cart);

router.use(protect, restrictTo("user", "admin"));

router
  .route("/")
  .get(cartController.getAll)
  .post(validate(CreateCartSchema), cartController.createOne);

router
  .route("/:id")
  .get(cartController.getOne)
  .patch(validate(UpdateCartSchema), cartController.updateOne)
  .delete(cartController.deleteOne);

export const cartRoutes = router;
