// src/modules/workspace/workspace.route.ts
import { Router } from "express";

import { authenticate, authorizeRole } from "../middlewares/auth.middlerware";
import WorkspaceController from "../controllers/workspace.controller";
import { validate } from "../middlewares/validate.middleware";
import { workspaceSchema } from "../schemas/workspace.schema";

const router = Router();

router.get("/", WorkspaceController.getAll);

router.get("/:id", WorkspaceController.getById);
router.post(
  "/",
  validate(workspaceSchema),
  authenticate,
  authorizeRole(["admin"]),
  WorkspaceController.create
);
router.put(
  "/:id",
  validate(workspaceSchema.partial()),
  authenticate,
  authorizeRole(["admin"]),
  WorkspaceController.update
);
router.delete(
  "/:id",
  authenticate,
  authorizeRole(["admin"]),
  WorkspaceController.delete
);

export default router;
