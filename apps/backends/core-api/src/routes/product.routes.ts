import { ProductController } from "@/controllers/product.controller";
import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { cleanupUploadOnError } from "../middlewares/cleanupUploadOnError.middleware";
import { sanitizeProductInput } from "../middlewares/sanitizeInput.middleware";
import {
  processThumbnailAndImages,
  upload
} from "../middlewares/upload.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  CreateProductSchema,
  UpdateProductSchema
} from "../validators/product.validators";
import { reviewRoutes } from "./review.routes";

const router = Router();

const productController = new ProductController();

router.use("/:productId/reviews", reviewRoutes);

router.route("/").get(productController.getAllProducts);

router.route("/:productId").get(productController.getProductById);

router.use(protect, restrictTo("admin"));

router.route("/").post(
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 4 }
  ]) as unknown as any,
  processThumbnailAndImages as unknown as any,
  sanitizeProductInput,
  validate(CreateProductSchema),
  productController.createProduct,
  cleanupUploadOnError as unknown as any
);

router.route("/:productId").patch(
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 4 }
  ]) as unknown as any,
  processThumbnailAndImages as unknown as any,
  sanitizeProductInput,
  validate(UpdateProductSchema),
  productController.updateProduct
);

router
  .route("/:productId")
  .delete(protect, restrictTo("admin"), productController.deleteProduct);

export const productRoutes = router;
