import { Router } from "express";
import {
  CreateCartSchema,
  UpdateCartSchema
} from "../validators/cart.validators";
import { validate } from "../middlewares/validation.middleware";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { GenericController } from "../controllers/generic.controller";
import { Cart } from "../models/cart.model";
import { GenericRepository } from "../repositories/generic.repository";
import { GenericService } from "../services/generic.service";

const router = Router();
const cartRepository = new GenericRepository(Cart);
const cartService = new GenericService(cartRepository);
const cartController = new GenericController(cartService);

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
