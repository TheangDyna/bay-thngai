import { Router } from "express";
import { validate } from "../middlewares/validation.middleware";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { AddToCartSchema } from "@/src/validators/cart.validators";
import { CartController } from "@/src/controllers/cart.controller";

const router = Router();
const cartController = new CartController();

router.use(protect, restrictTo("user", "admin"));

router
  .route("/")
  .get(cartController.getCart)
  .post(validate(AddToCartSchema), cartController.addToCart)
  .delete(cartController.clearCart);

router.route("/:productId").delete(cartController.removeFromCart);

export const cartRoutes = router;
