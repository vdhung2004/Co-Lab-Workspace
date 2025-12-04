import { Request, Response, NextFunction } from "express";
import { FloorService } from "../services/floor.service";

export const FloorController = {
  // GET /api/workspaces/:workspaceId/floors
  getByWorkspace: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const floors = await FloorService.getByWorkspace(req.params.workspaceId);
      return res.json(floors);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/floors/:id
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const floor = await FloorService.getById(req.params.id);
      return res.json(floor);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/workspaces/:workspaceId/floors
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const floor = await FloorService.create(req.params.workspaceId, req.body);
      return res.status(201).json(floor);
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/floors/:id
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const floor = await FloorService.update(req.params.id, req.body);
      return res.json(floor);
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/floors/:id
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await FloorService.delete(req.params.id);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
