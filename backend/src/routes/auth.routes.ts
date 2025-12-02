import express from "express";
import {
  loginController,
  registerController,
  resetPasswordController,
  sendPasswordResetEmailController,
  verifyEmailController,
} from "../controllers/auth.controllert";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/verify/:token", verifyEmailController);
router.post("/send-password-reset-email", sendPasswordResetEmailController);
router.post("/reset-password/:token", resetPasswordController);
export default router;
