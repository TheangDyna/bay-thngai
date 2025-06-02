import { Router } from "express";
import {
  CreateProductSchema,
  UpdateProductSchema
} from "../validators/product.validators";
import { validate } from "../middlewares/validation.middleware";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { reviewRoutes } from "./review.routes";
import {
  processThumbnailAndImages,
  upload
} from "../middlewares/upload.middleware";
import { sanitizeProductInput } from "../middlewares/sanitizeInput.middleware";
import { cleanupUploadOnError } from "../middlewares/cleanupUploadOnError.middleware";
import { ProductController } from "@/src/controllers/product.controller";

const router = Router();

const productController = new ProductController();

router.use("/:productId/reviews", reviewRoutes);

router.route("/").get(productController.getAllProducts);

router.route("/:id").get(productController.getProductById);

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

router
  .route("/:id")
  .patch(
    upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 4 }
    ]) as unknown as any,
    processThumbnailAndImages as unknown as any,
    sanitizeProductInput,
    validate(UpdateProductSchema),
    productController.updateProduct
  )
  .delete(protect, restrictTo("admin"), productController.deleteProduct);

export const productRoutes = router;
