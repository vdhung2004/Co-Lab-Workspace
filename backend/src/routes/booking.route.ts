import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";

import { BookingController } from "../controllers/booking.controller";
import {
  createBookingSchema,
  updateBookingSchema,
} from "../schemas/booking.schema";

const router = Router();

router.get("/", BookingController.getAll);
router.get("/:id", BookingController.getById);

router.post("/", validate(createBookingSchema), BookingController.create);

router.put("/:id", validate(updateBookingSchema), BookingController.update);

router.put("/:id/cancel", BookingController.cancel);

export default router;
