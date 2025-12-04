import { Router } from "express";
import { RefundController } from "../controllers/refund.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createRefundSchema,
  updateRefundSchema,
} from "../schemas/refund.schema";
import { authenticate, authorizeRole } from "../middlewares/auth.middlerware";

const router = Router();

router.use(authenticate, authorizeRole(["admin"])); // chỉ admin mới truy cập refund

router.get("/", RefundController.getAll);
router.get("/:id", RefundController.getById);

router.post("/", validate(createRefundSchema), RefundController.create);
router.put("/:id", validate(updateRefundSchema), RefundController.updateStatus);

export default router;
