import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  ConfirmRegisterSchema,
  LoginSchema,
  RegisterSchema,
  ResendConfirmCodeSchema
} from "../validators/auth.validators";

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

// ─── ADDRESS ROUTES ──────────────────────────────────────────────────────
router.route("/me/addresses").get(authController.getAllAddresses);
router.route("/me/addresses").post(authController.addAddress);
router.route("/me/addresses/:addressId").put(authController.updateAddress);
router.route("/me/addresses/:addressId").delete(authController.deleteAddress);

// ─── CONTACT ROUTES ──────────────────────────────────────────────────────
router.route("/me/contacts").get(authController.getAllContacts);
router.route("/me/contacts").post(authController.addContact);
router.route("/me/contacts/:contactId").put(authController.updateContact);
router.route("/me/contacts/:contactId").delete(authController.deleteContact);

export const authRoutes = router;
