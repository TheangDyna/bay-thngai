import { CuisineController } from "@/controllers/cuisine.controller";
import { cleanupUploadOnError } from "@/middlewares/cleanupUploadOnError.middleware";
import {
  processThumbnailAndImages,
  upload
} from "@/middlewares/upload.middleware";
import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  CreateCuisineSchema,
  UpdateCuisineSchema
} from "../validators/cuisine.validators";

const router = Router();
const cuisineController = new CuisineController();

router.route("/").get(cuisineController.getAllCuisines);

router.route("/:cuisineId").get(cuisineController.getCuisineById);

router.use(protect, restrictTo("admin"));

router
  .route("/")
  .post(
    upload.fields([{ name: "thumbnail", maxCount: 1 }]) as unknown as any,
    processThumbnailAndImages as unknown as any,
    validate(CreateCuisineSchema),
    cuisineController.createCuisine,
    cleanupUploadOnError as unknown as any
  );

router
  .route("/:cuisineId")
  .patch(
    upload.fields([{ name: "thumbnail", maxCount: 1 }]) as unknown as any,
    processThumbnailAndImages as unknown as any,
    validate(UpdateCuisineSchema),
    cuisineController.updateCuisine,
    cleanupUploadOnError as unknown as any
  );

router.route("/:cuisineId").delete(cuisineController.deleteCuisine);

export const cuisineRoutes = router;
