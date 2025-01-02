import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { setProductAndUserRequest } from "../middlewares/populateRequest.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  CreateReviewSchema,
  UpdateReviewSchema
} from "../validators/review.validators";
import { ReviewController } from "../controllers/review.controller";

const router = Router({ mergeParams: true });
const reviewController = new ReviewController();

router.use(protect, setProductAndUserRequest);

router
  .route("/")
  .get(reviewController.getAll)
  .post(validate(CreateReviewSchema), reviewController.createOne);

router
  .route("/:id")
  .get(reviewController.getOne)
  .patch(validate(UpdateReviewSchema), reviewController.updateOne)
  .delete(reviewController.deleteOne);

export const reviewRoutes = router;
