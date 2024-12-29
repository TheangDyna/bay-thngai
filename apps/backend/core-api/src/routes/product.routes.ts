import { Router } from "express";
import {
  CreateProductSchema,
  UpdateProductSchema
} from "../validators/product.validators";
import { validate } from "../middlewares/validation.middleware";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { Product } from "../models/product.model";
import { GenericController } from "../controllers/generic.controller";
import { reviewRoutes } from "./review.routes";
import { GenericRepository } from "../repositories/generic.repository";
import { GenericService } from "../services/generic.service";

const router = Router();
const productRepository = new GenericRepository(Product);
const productService = new GenericService(productRepository);
const productController = new GenericController(productService);

router.use("/:productId/reviews", reviewRoutes);

router.use(protect, restrictTo("admin"));

router
  .route("/")
  .get(productController.getAll)
  .post(validate(CreateProductSchema), productController.createOne);

router
  .route("/:id")
  .get(productController.getOne)
  .patch(validate(UpdateProductSchema), productController.updateOne)
  .delete(productController.deleteOne);

export const productRoutes = router;
