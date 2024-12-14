import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";

const router = Router();

router.use(protect, restrictTo("admin"));

router.route("/").get().post();

router.route("/:id").get().patch().delete();

export const authRoutes = router;
