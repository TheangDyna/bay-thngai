import { Router } from "express";
import {
  CreateCuisineSchema,
  UpdateCuisineSchema
} from "../validators/cuisine.validators";
import { validate } from "../middlewares/validation.middleware";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { CuisineController } from "@/src/controllers/cuisine.controller";

const router = Router();
const cuisineController = new CuisineController();

router.route("/").get(cuisineController.getAllCuisines);

router.route("/:id").get(cuisineController.getCuisineById);

router.use(protect, restrictTo("admin"));

router
  .route("/")
  .post(validate(CreateCuisineSchema), cuisineController.createCuisine);

router
  .route("/:id")
  .patch(validate(UpdateCuisineSchema), cuisineController.updateCuisine)
  .delete(cuisineController.deleteCuisine);

export const cuisineRoutes = router;
