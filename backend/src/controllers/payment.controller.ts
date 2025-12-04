import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";

export const PaymentController = {
  getAll: async (req: Request, res: Response) => {
    const data = await PaymentService.getAll(req.query);
    res.json(data);
  },

  getById: async (req: Request, res: Response) => {
    const data = await PaymentService.getById(req.params.id);
    res.json(data);
  },

  create: async (req: Request, res: Response) => {
    const data = await PaymentService.create(req.body);
    res.status(201).json(data);
  },

  // Webhook Momo notify
  notify: async (req: Request, res: Response) => {
    const { orderId, resultCode } = req.body;
    const status = resultCode === 0 ? "success" : "failed";
    await PaymentService.updateStatus(orderId, status);
    res.json({ message: "OK" });
  },
};
