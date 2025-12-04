import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { validate } from "../middlewares/validate.middleware";
import { createPaymentSchema } from "../schemas/payment.schema";

const router = Router();

router.get("/", PaymentController.getAll);
router.get("/:id", PaymentController.getById);

router.post("/", validate(createPaymentSchema), PaymentController.create);
router.post("/notify", PaymentController.notify); // webhook Momo

export default router;
