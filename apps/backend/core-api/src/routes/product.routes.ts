import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import {
  CreateProductSchema,
  UpdateProductSchema
} from "../validators/product.validators";
import { validate } from "../middlewares/validation.middleware";

const router = Router();

router
  .route("/")
  .get(ProductController.getAllProducts)
  .post(validate(CreateProductSchema), ProductController.createProduct);

router
  .route("/:id")
  .get(ProductController.getProduct)
  .patch(validate(UpdateProductSchema), ProductController.updateProduct)
  .delete(ProductController.deleteProduct);

export const productRoutes = router;
