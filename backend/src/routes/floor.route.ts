import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { FloorController } from "../controllers/floor.controller";
import { createFloorSchema, updateFloorSchema } from "../schemas/floor.schema";
import { authenticate, authorizeRole } from "../middlewares/auth.middlerware";

const router = Router();

router.get("/:id", FloorController.getById);

router.put(
  "/:id",
  validate(updateFloorSchema),
  authenticate,
  authorizeRole(["admin"]),
  FloorController.update
);
router.delete(
  "/:id",
  authenticate,
  authorizeRole(["admin"]),
  FloorController.delete
);
export default router;
