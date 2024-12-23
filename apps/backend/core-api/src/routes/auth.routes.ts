import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import {
  ConfirmSignUpSchema,
  ResendConfirmCodeSchema,
  SignInSchema,
  SignUpSchema
} from "../validators/auth.validators";
import { protect } from "../middlewares/auth.middleware";

const router = Router();
const authController = new AuthController();

router.post("/signup", validate(SignUpSchema), authController.signUp);
router.post(
  "/resend-confirm-code",
  validate(ResendConfirmCodeSchema),
  authController.resendConfirmCode
);
router.post(
  "/confirm-signup",
  validate(ConfirmSignUpSchema),
  authController.confirmSignUp
);

router.post("/signin", validate(SignInSchema), authController.signIn);

router.get("/google", authController.googleLogin);
router.get("/google/callback", authController.googleCallback);

router.use(protect);

router.get("/me", authController.getMe);
router.post("/forgot-password"); // not yet
router.patch("/update-my-password"); // not yet
router.patch("/update-me"); // not yet
router.delete("/delete-me"); // not yet

router.post("/signout", authController.signOut);

export const authRoutes = router;
