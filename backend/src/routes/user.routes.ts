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
import { validate } from "../middlewares/validate.middleware";
import {
  changePasswordSchema,
  updateProfileSchema,
} from "../schemas/user.schema.js";

const router = Router();

// User routes
router.get("/profile", authenticate, getProfileController);
router.put(
  "/profile",
  validate(updateProfileSchema),
  authenticate,
  updateProfileController
);
router.post(
  "/change-password",
  validate(changePasswordSchema),
  authenticate,
  changePasswordController
);

// Admin routes
router.get("/", authenticate, authorizeRole(["admin"]), getAllUsersController);
router.put(
  "/:userId",
  authenticate,
  authorizeRole(["admin"]),
  updateUserByAdminController
);

export default router;
