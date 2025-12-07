import { Request, Response, NextFunction } from "express";
import {
  getProfileService,
  updateProfileService,
  changePasswordService,
  getAllUsersService,
  updateUserByAdminService,
} from "../services/user.service.js";
import { IUpdateProfile } from "../schemas/user.schema.js";
import { UserRole, UserStatus } from "../types/user.t.js";

export const getProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getProfileService(req.user!.user_id);
    res.status(200).json({ message: "Lấy profile thành công", user });
  } catch (err) {
    next(err);
  }
};

export const updateProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: IUpdateProfile = req.body;
    const user = await updateProfileService(req.user!.user_id, data);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const changePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await changePasswordService(
      req.user!.user_id,
      currentPassword,
      newPassword
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// Admin controllers
export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, role, status, sortBy, order } = req.query;

    const result = await getAllUsersService({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      role: role as UserRole | undefined,
      status: status as UserStatus | undefined,
      sortBy: sortBy as string | undefined,
      order: (order as "asc" | "desc") || "desc",
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateUserByAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const data: { role?: UserRole; status?: UserStatus } = req.body; // role, status
    const user = await updateUserByAdminService(userId, data);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
