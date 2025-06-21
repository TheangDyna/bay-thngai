// src/routes/user.routes.ts
import { UserController } from "@/controllers/user.controller";
import { protect, restrictTo } from "@/middlewares/auth.middleware";
import { Router } from "express";

const userController = new UserController();
const router = Router();

router.use(protect, restrictTo("admin"));

// User CRUD
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export const userRoutes = router;
