import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { setProductAndUserIds } from "../middlewares/populateBody.middleware";
import { validate } from "../middlewares/validation.middleware";
import { CreateReviewSchema } from "../validators/review.validators";
import { GenericController } from "../controllers/generic.controller";
import { ReviewService } from "../services/review.service";

const router = Router({ mergeParams: true });
const reviewService = new ReviewService();
const reviewController = new GenericController(reviewService);

router.use(protect);

router
  .route("/")
  .get(reviewController.getAll)
  .post(
    setProductAndUserIds,
    validate(CreateReviewSchema),
    reviewController.createOne
  );

router.route("/:id").get().patch().delete();

export const reviewRoutes = router;
