import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  CreateReviewSchema,
  UpdateReviewSchema
} from "../validators/review.validators";

const router = Router({ mergeParams: true });
const reviewController = new ReviewController();

router.route("/").get(reviewController.getReviewsByProduct);
router.route("/summary").get(reviewController.getRatingSummary);

router.use(protect);

router
  .route("/")
  .post(validate(CreateReviewSchema), reviewController.createReview);

router
  .route("/:id")
  .patch(validate(UpdateReviewSchema), reviewController.updateReview)
  .delete(reviewController.deleteReview);

export const reviewRoutes = router;
