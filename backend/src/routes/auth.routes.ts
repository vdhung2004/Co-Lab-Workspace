import express from "express";
import {
  loginController,
  logoutController,
  registerController,
  resetPasswordController,
  sendPasswordResetEmailController,
  verifyEmailController,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  sendPasswordResetEmailSchema,
} from "../schemas/auth.schema";

const router = express.Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.get("/verify/:token", verifyEmailController);
router.post(
  "/send-password-reset-email",
  validate(sendPasswordResetEmailSchema),
  sendPasswordResetEmailController
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPasswordController
);
router.post("/logout", logoutController);
export default router;
