// src/routes/cart.routes.ts
import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema
} from "../validators/cart.validator";
import { protect } from "@/src/middlewares/auth.middleware";
import { validate } from "@/src/middlewares/validation.middleware";

const router = Router();
const ctrl = new CartController();

router.use(protect);

router.get("/", ctrl.getCart.bind(ctrl));

router.post("/", validate(addToCartSchema), ctrl.addToCart.bind(ctrl));

router.patch(
  "/",
  validate(updateCartItemSchema),
  ctrl.updateCartItem.bind(ctrl)
);

router.delete(
  "/:productId",
  validate(removeCartItemSchema),
  ctrl.removeCartItem.bind(ctrl)
);

router.delete("/clear", ctrl.clearCart.bind(ctrl));

export const cartRoutes = router;
