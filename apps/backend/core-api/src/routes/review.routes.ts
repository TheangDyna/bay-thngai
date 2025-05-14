import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  CreateReviewSchema,
  UpdateReviewSchema
} from "../validators/review.validators";
import { ReviewController } from "../controllers/review.controller";

const router = Router({ mergeParams: true });
const reviewController = new ReviewController();

router.use(protect);

router
  .route("/")
  .post(validate(CreateReviewSchema), reviewController.createReview);

router
  .route("/:id")
  .patch(validate(UpdateReviewSchema), reviewController.updateReview)
  .delete(reviewController.deleteReview);

export const reviewRoutes = router;
