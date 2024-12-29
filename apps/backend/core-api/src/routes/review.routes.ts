import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { GenericController } from "../controllers/generic.controller";
import { Review } from "../models/review.model";
import { setProductAndUserIds } from "../middlewares/populateBody.middleware";
import { validate } from "../middlewares/validation.middleware";
import { CreateReviewSchema } from "../validators/review.validators";

const router = Router({ mergeParams: true });
const reviewController = new GenericController(Review);

router.use(protect);

router
  .route("/")
  .get()
  .post(
    setProductAndUserIds,
    validate(CreateReviewSchema),
    reviewController.createOne
  );

router.route("/:id").get().patch().delete();

export const reviewRoutes = router;
