import { Request, Response } from "express";
import { ReportService } from "../services/report.service";

export const ReportController = {
  getBookings: async (req: Request, res: Response) => {
    const {
      page,
      limit,
      status,
      workspaceId,
      userId,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    } = req.query;
    const data = await ReportService.getBookings({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      status: status as string,
      workspaceId: workspaceId as string,
      userId: userId as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as "asc" | "desc",
    });
    res.json(data);
  },

  getRevenue: async (req: Request, res: Response) => {
    const { page, limit, startDate, endDate, sortBy, sortOrder } = req.query;
    const data = await ReportService.getRevenue({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as "asc" | "desc",
    });
    res.json(data);
  },

  getRefunds: async (req: Request, res: Response) => {
    const { page, limit, status, sortBy, sortOrder } = req.query;
    const data = await ReportService.getRefunds({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      status: status as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as "asc" | "desc",
    });
    res.json(data);
  },
};
