import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";

const router = Router();

router.use(protect, restrictTo("admin"));

router.route("/").get(UserController.getAllUsers).post();

router.route("/:id").get(UserController.getUser).patch().delete();

export const userRoutes = router;
