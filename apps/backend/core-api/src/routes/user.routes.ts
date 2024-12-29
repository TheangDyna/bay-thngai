import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { GenericController } from "../controllers/generic.controller";
import { User } from "../models/user.model";
import { GenericRepository } from "../repositories/generic.repository";
import { GenericService } from "../services/generic.service";

const router = Router();
const userRepository = new GenericRepository(User);
const userService = new GenericService(userRepository);
const userController = new GenericController(userService);

router.use(protect, restrictTo("admin"));

router.route("/").get(userController.getAll);

router.route("/:id").get(userController.getOne);

export const userRoutes = router;
