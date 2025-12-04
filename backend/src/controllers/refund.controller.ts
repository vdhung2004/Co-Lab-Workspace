import { Request, Response } from "express";
import { RefundService } from "../services/refund.service";

export const RefundController = {
  getAll: async (req: Request, res: Response) => {
    const data = await RefundService.getAll(req.query);
    res.json(data);
  },

  getById: async (req: Request, res: Response) => {
    const data = await RefundService.getById(req.params.id);
    res.json(data);
  },

  create: async (req: Request, res: Response) => {
    const adminId = req.user?.user_id as string; // giả sử middleware JWT đã gán user
    const refund = await RefundService.create(req.body, adminId);
    res.status(201).json(refund);
  },

  updateStatus: async (req: Request, res: Response) => {
    const refund = await RefundService.updateStatus(
      req.params.id,
      req.body.status
    );
    res.json(refund);
  },
};
