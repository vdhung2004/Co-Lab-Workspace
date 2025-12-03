// src/modules/workspace/workspace.controller.ts
import { Request, Response, NextFunction } from "express";
import { WorkspaceService } from "../services/workspace.service";

export const WorkspaceController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, status, sortBy, sortOrder } = req.query;
      const result = await WorkspaceService.getAll({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        status: status as string,
        sortBy: sortBy as string,
        sortOrder: (sortOrder as "asc" | "desc") || "desc",
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const workspace = await WorkspaceService.getById(id);
      if (!workspace)
        return res.status(404).json({ message: "Workspace not found" });
      res.json(workspace);
    } catch (err) {
      next(err);
    }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspace = await WorkspaceService.create(req.body);
      res.status(201).json(workspace);
    } catch (err) {
      next(err);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const workspace = await WorkspaceService.update(id, req.body);
      res.json(workspace);
    } catch (err) {
      next(err);
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await WorkspaceService.delete(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
  addImage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { workspaceId } = req.params;
      const { url } = req.body;

      const image = await WorkspaceService.addImage(workspaceId, url);

      res.status(201).json(image);
    } catch (err) {
      next(err);
    }
  },
  deleteImage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { imageId } = req.params;

      await WorkspaceService.deleteImage(imageId);

      res.json({ message: "Image deleted successfully" });
    } catch (err) {
      next(err);
    }
  },
  updateImage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { imageId } = req.params;
      const { url } = req.body;

      const updated = await WorkspaceService.updateImage(imageId, url);

      res.json(updated);
    } catch (err) {
      next(err);
    }
  },
};

export default WorkspaceController;
