import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { UserController } from "@/src/controllers/user.controller";

const userController = new UserController();

const router = Router();

router.use(protect, restrictTo("admin"));

router.route("/").get(userController.getAllUsers);

router.route("/:id").get(userController.getUserById);

export const userRoutes = router;
