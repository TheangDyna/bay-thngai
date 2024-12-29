import { Router } from "express";
import {
  CreateCuisineSchema,
  UpdateCuisineSchema
} from "../validators/cuisine.validators";
import { validate } from "../middlewares/validation.middleware";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { GenericController } from "../controllers/generic.controller";
import { Cuisine } from "../models/cuisine.model";
import { GenericRepository } from "../repositories/generic.repository";
import { GenericService } from "../services/generic.service";

const router = Router();
const cuisineRepository = new GenericRepository(Cuisine);
const cuisineService = new GenericService(cuisineRepository);
const cuisineController = new GenericController(cuisineService);

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
