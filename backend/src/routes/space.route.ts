import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { SpaceController } from "../controllers/space.controller";
import {
  createSpaceSchema,
  updateSpaceSchema,
  getDeleteSpaceSchema,
  listSpaceSchema,
} from "../schemas/space.schema";
import { authenticate, authorizeRole } from "../middlewares/auth.middlerware";

const router = Router();

// 1. Lấy danh sách Space theo Floor (FloorId trong params)
router.get(
  "/:floorId/spaces",
  validate(listSpaceSchema), // Validate params
  SpaceController.listByFloor // Đã đổi tên hàm
);

// 2. Lấy 1 Space theo ID
router.get(
  "/spaces/:id",
  validate(getDeleteSpaceSchema),
  SpaceController.getById
);

// 3. Tạo Space (FloorId trong params)
router.post(
  "/:floorId/spaces",
  validate(createSpaceSchema),
  authenticate,
  authorizeRole(["admin"]),
  SpaceController.create
);

// 4. Cập nhật Space theo ID
router.put(
  "/spaces/:id",
  validate(updateSpaceSchema),
  authenticate,
  authorizeRole(["admin"]),
  SpaceController.update
);

// 5. Xóa Space theo ID
router.delete(
  "/spaces/:id",
  validate(getDeleteSpaceSchema),
  authenticate,
  authorizeRole(["admin"]),
  SpaceController.delete
);

export default router;
