import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import {
  ConfirmRegisterSchema,
  ResendConfirmCodeSchema,
  LoginSchema,
  RegisterSchema
} from "../validators/auth.validators";
import { protect } from "../middlewares/auth.middleware";

const router = Router();
const authController = new AuthController();

router.post("/register", validate(RegisterSchema), authController.register);
router.post(
  "/resend-confirm-code",
  validate(ResendConfirmCodeSchema),
  authController.resendConfirmCode
);
router.post(
  "/confirm-register",
  validate(ConfirmRegisterSchema),
  authController.confirmRegister
);

router.post("/login", validate(LoginSchema), authController.login);

router.get("/google", authController.googleLogin);
router.get("/google/callback", authController.googleCallback);

router.use(protect);

router.get("/me", authController.getMe);
router.post("/forgot-password"); // not yet
router.patch("/update-my-password"); // not yet
router.patch("/update-me"); // not yet
router.delete("/delete-me"); // not yet

router.post("/logout", authController.logOut);

export const authRoutes = router;
