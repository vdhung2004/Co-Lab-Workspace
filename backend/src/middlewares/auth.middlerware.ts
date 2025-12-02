// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { DecodedUserPayLoad } from "../types/auth.t.js";

// Xác thực người dùng (Lấy token, giải mã, gán req.user)
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Bạn cần xác thực" });
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token) as DecodedUserPayLoad;
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token không hợp lệ" });
  }
};

// Ủy quyền vai trò người dùng (Kiểm tra vai trò sau khi xác thực)
export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Nếu middleware authenticate chưa chạy, req.user sẽ không tồn tại
    if (!req.user) {
      return res
        .status(403)
        .json({ error: "Lỗi xác thực: Không tìm thấy thông tin người dùng" });
    }

    // Kiểm tra vai trò
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Bạn không có quyền truy cập" });
    }
    next();
  };
};
