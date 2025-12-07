import { NextFunction, Request, Response } from "express";
import { BookingService } from "../services/booking.service";

export const BookingController = {
  getAll: async (req: Request, res: Response) => {
    const data = await BookingService.getAll(req.query);
    res.json(data);
  },

  getByUserId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.user_id;
      const { bookings } = await BookingService.getByUserId(userId);
      res.json({ message: "Lấy danh sách booking thành công", bookings });
    } catch (err) {
      next(err);
    }
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
