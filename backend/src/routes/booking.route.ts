import express from "express";

import { validate } from "../middlewares/validate.middleware";

import { BookingController } from "../controllers/booking.controller";
import {
  createBookingSchema,
  updateBookingSchema,
} from "../schemas/booking.schema";
import { authenticate } from "../middlewares/auth.middlerware";

const router = express.Router();

router.get("/", BookingController.getAll);

router.get("/user", authenticate, BookingController.getByUserId);
router.get("/:id", BookingController.getById);

router.post("/", validate(createBookingSchema), BookingController.create);

router.put("/:id", validate(updateBookingSchema), BookingController.update);

router.put("/:id/cancel", BookingController.cancel);

export default router;
