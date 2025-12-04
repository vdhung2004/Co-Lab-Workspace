import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";

export const BookingController = {
  getAll: async (req: Request, res: Response) => {
    const data = await BookingService.getAll(req.query);
    res.json(data);
  },

  getById: async (req: Request, res: Response) => {
    const data = await BookingService.getById(req.params.id);
    res.json(data);
  },

  create: async (req: Request, res: Response) => {
    const data = await BookingService.create(req.body);
    res.status(201).json(data);
  },

  update: async (req: Request, res: Response) => {
    const data = await BookingService.update(req.params.id, req.body);
    res.json(data);
  },

  cancel: async (req: Request, res: Response) => {
    const data = await BookingService.cancel(req.params.id, req.body.reason);
    res.json(data);
  },
};
