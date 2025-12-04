// src/routes/amenity.route.ts
import { Router } from "express";
import { AmenityController } from "../controllers/amenity.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createAmenitySchema,
  updateAmenitySchema,
} from "../schemas/amenity.schema";
import { authenticate, authorizeRole } from "../middlewares/auth.middlerware";

const router = Router();

router.get("/", AmenityController.getAll);
router.get("/:id", AmenityController.getById);

router.post(
  "/",
  validate(createAmenitySchema),
  authenticate,
  authorizeRole(["admin"]),
  AmenityController.create
);

router.put(
  "/:id",
  validate(updateAmenitySchema),
  authenticate,
  authorizeRole(["admin"]),
  AmenityController.update
);

router.delete(
  "/:id",
  authenticate,
  authorizeRole(["admin"]),
  AmenityController.delete
);

export default router;
