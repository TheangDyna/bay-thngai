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
import {
  processThumbnailAndImages,
  upload
} from "../middlewares/upload.middleware";
import { sanitizeProductInput } from "../middlewares/sanitizeInput.middleware";
import { cleanupUploadOnError } from "../middlewares/cleanupUploadOnError.middleware";

const router = Router();
const searchFields = ["name", "description"];
const productRepository = new GenericRepository(Product, searchFields);
const productService = new GenericService(productRepository);
const productController = new GenericController(productService);

router.use("/:productId/reviews", reviewRoutes);

router.route("/").get(productController.getAll);

router.route("/:id").get(productController.getOne);

router.use(protect, restrictTo("admin"));

router.route("/").post(
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 }
  ]) as unknown as any,
  processThumbnailAndImages as unknown as any,
  sanitizeProductInput,
  validate(CreateProductSchema),
  productController.createOne,
  cleanupUploadOnError as unknown as any
);

router
  .route("/:id")
  .patch(validate(UpdateProductSchema), productController.updateOne)
  .delete(protect, restrictTo("admin"), productController.deleteOne);

export const productRoutes = router;
