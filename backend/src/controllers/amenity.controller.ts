// src/controllers/amenity.controller.ts
import { Request, Response, NextFunction } from "express";
import { AmenityService } from "../services/amenity.service";

export const AmenityController = {
  // GET /api/amenities
  getAll: async (
    req: Request,
    res: Response,
    next: NextFunction // Thêm NextFunction
  ) => {
    try {
      const data = await AmenityService.getAll();
      return res.json(data);
    } catch (err) {
      next(err); // Chuyển lỗi đến Error Handler
    }
  },

  // GET /api/amenities/:id
  getById: async (
    req: Request,
    res: Response,
    next: NextFunction // Thêm NextFunction
  ) => {
    try {
      const data = await AmenityService.getById(req.params.id);
      return res.json(data);
    } catch (err) {
      next(err); // Chuyển lỗi đến Error Handler
    }
  },

  // POST /api/amenities
  create: async (
    req: Request,
    res: Response,
    next: NextFunction // Thêm NextFunction
  ) => {
    try {
      const data = await AmenityService.create(req.body);
      return res.status(201).json(data);
    } catch (err) {
      next(err); // Chuyển lỗi đến Error Handler
    }
  },

  // PUT /api/amenities/:id
  update: async (
    req: Request,
    res: Response,
    next: NextFunction // Thêm NextFunction
  ) => {
    try {
      const data = await AmenityService.update(req.params.id, req.body);
      return res.json(data);
    } catch (err) {
      next(err); // Chuyển lỗi đến Error Handler
    }
  },

  // DELETE /api/amenities/:id
  delete: async (
    req: Request,
    res: Response,
    next: NextFunction // Thêm NextFunction
  ) => {
    try {
      const result = await AmenityService.delete(req.params.id);
      return res.json(result);
    } catch (err) {
      next(err); // Chuyển lỗi đến Error Handler
    }
  },
};
