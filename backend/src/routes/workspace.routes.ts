// src/modules/workspace/workspace.route.ts
import { Router } from "express";

import { authenticate, authorizeRole } from "../middlewares/auth.middlerware";
import WorkspaceController from "../controllers/workspace.controller";
import { validate } from "../middlewares/validate.middleware";
import { workspaceSchema } from "../schemas/workspace.schema";
import { FloorController } from "../controllers/floor.controller";
import { createFloorSchema } from "../schemas/floor.schema";
import { SpaceController } from "../controllers/space.controller";

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
router.post(
  "/:id/images",
  authenticate,
  authorizeRole(["admin"]),
  WorkspaceController.addImage
);
router.delete(
  "/:workspaceId/images/:imageId",
  authenticate,
  authorizeRole(["admin"]),
  WorkspaceController.deleteImage
);
router.put(
  "/:workspaceId/images/:imageId",
  authenticate,
  authorizeRole(["admin"]),
  WorkspaceController.deleteImage
);
router.get("/:workspaceId/floors", FloorController.getByWorkspace);

router.post(
  "/:workspaceId/floors",
  validate(createFloorSchema),
  authenticate,
  authorizeRole(["admin"]),
  FloorController.create
);

router.get("/:workspaceId/spaces", SpaceController.listByWorkspace);

export default router;
