import { Router } from "express";
import { ReportController } from "../controllers/report.controller";
import { authenticate, authorizeRole } from "../middlewares/auth.middlerware";

const router = Router();

router.use(authenticate, authorizeRole(["admin"]));

// Lấy booking tổng quan với phân trang/lọc/sắp xếp
router.get("/bookings", ReportController.getBookings);

// Lấy doanh thu với phân trang/lọc theo ngày/sắp xếp
router.get("/revenue", ReportController.getRevenue);

// Lấy refund với phân trang/lọc trạng thái
router.get("/refunds", ReportController.getRefunds);

export default router;
