import { Router } from "express";
import {
  changePasswordController,
  getAllUsersController,
  getProfileController,
  updateProfileController,
  updateUserByAdminController,
} from "../controllers/user.controller.js";
import {
  authenticate,
  authorizeRole,
} from "../middlewares/auth.middlerware.js";

const router = Router();

// User routes
router.get("/profile", authenticate, getProfileController);
router.put("/profile", authenticate, updateProfileController);
router.post("/change-password", authenticate, changePasswordController);

// Admin routes
router.get("/", authenticate, authorizeRole(["admin"]), getAllUsersController);
router.put(
  "/:userId",
  authenticate,
  authorizeRole(["admin"]),
  updateUserByAdminController
);

export default router;
