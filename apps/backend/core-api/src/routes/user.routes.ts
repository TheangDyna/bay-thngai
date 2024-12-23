import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { GenericController } from "../controllers/generic.controller";
import { User } from "../models/user.model";

const router = Router();
const userController = new GenericController(User);

router.use(protect, restrictTo("admin"));

router.route("/").get(userController.getAll);

router.route("/:id").get(userController.getOne);

export const userRoutes = router;
