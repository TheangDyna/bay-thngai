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

router.post("/signup", validate(SignUpSchema), AuthController.signUp);
router.post(
  "/resend-confirm-code",
  validate(ResendConfirmCodeSchema),
  AuthController.resendConfirmCode
);
router.post(
  "/confirm-signup",
  validate(ConfirmSignUpSchema),
  AuthController.confirmSignUp
);

router.post("/signin", validate(SignInSchema), AuthController.signIn);

router.get("/google", AuthController.googleLogin);
router.get("/google/callback", AuthController.googleCallback);

router.use(protect);

router.get("/me", AuthController.getMe);
router.post("/forgot-password"); // not yet
router.patch("/update-my-password"); // not yet
router.patch("/update-me"); // not yet
router.delete("/delete-me"); // not yet

router.post("/signout", AuthController.signOut);

export const authRoutes = router;
