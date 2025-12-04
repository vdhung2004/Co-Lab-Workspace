import { Request, Response, NextFunction } from "express";
import { GetSpaceOptions, SpaceService } from "../services/space.service";
import { CreateSpaceInput } from "../schemas/space.schema";

export const SpaceController = {
  // GET /api/floors/:floorId/spaces
  listByFloor: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { floorId } = req.params;
      const data = await SpaceService.getByFloorId(floorId);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/workspaces/:workspaceId/spaces
  listByWorkspace: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { workspaceId } = req.params;
      const {
        floorId,
        type,
        status,
        keyword,
        minPrice,
        maxPrice,
        capacity,
        sortBy,
        sortOrder,
      }: any = req.query;
      const data = await SpaceService.getAll({
        workspaceId,
        floorId: floorId as string,
        type: type as string,
        status: status as string,
        keyword: keyword as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        capacity: capacity ? Number(capacity) : undefined,
        sortBy: sortBy as string,
        sortOrder: sortOrder as "asc" | "desc",
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/spaces/:id
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await SpaceService.getById(req.params.id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/floors/:floorId/spaces
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // floorId lấy từ params
      const { floorId } = req.params;
      const data = await SpaceService.create(
        floorId,
        req.body as CreateSpaceInput // Body không còn chứa floorId
      );
      return res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/spaces/:id
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await SpaceService.update(req.params.id, req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/spaces/:id
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await SpaceService.delete(req.params.id);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
