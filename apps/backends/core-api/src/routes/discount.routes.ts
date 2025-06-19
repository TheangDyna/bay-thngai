import { DiscountController } from "@/src/controllers/discount.controller";
import { validate } from "@/src/middlewares/validation.middleware";
import {
  CreateDiscountSchema,
  UpdateDiscountSchema
} from "@/src/validators/discount.validators";
import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";

const router = Router();
const controller = new DiscountController();

router.use(protect, restrictTo("admin"));

router.post("/", validate(CreateDiscountSchema), controller.create);
router.get("/", controller.getAll);
router.post("/assign", controller.assignToProducts);
router.post("/remove", controller.removeFromProducts);
router.get("/:discountId", controller.getOne);
router.patch("/:discountId", validate(UpdateDiscountSchema), controller.update);

export const discountRoutes = router;
