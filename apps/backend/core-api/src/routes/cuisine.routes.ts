import { Router } from "express";
import {
  CreateCuisineSchema,
  UpdateCuisineSchema
} from "../validators/cuisine.validators";
import { validate } from "../middlewares/validation.middleware";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { GenericController } from "../controllers/generic.controller";
import { Cuisine } from "../models/cuisine.model";

const router = Router();
const cuisineController = new GenericController(Cuisine);

router.use(protect, restrictTo("admin"));

router
  .route("/")
  .get(cuisineController.getAll)
  .post(validate(CreateCuisineSchema), cuisineController.createOne);

router
  .route("/:id")
  .get(cuisineController.getOne)
  .patch(validate(UpdateCuisineSchema), cuisineController.updateOne)
  .delete(cuisineController.deleteOne);

export const cuisineRoutes = router;
