import { Request, Response, NextFunction } from "express";
import {
  ILogin,
  IRegister,
  IResetPassword,
  ISendPasswordResetEmail,
} from "../schemas/auth.schema";
import {
  loginService,
  registerService,
  resetPasswordService,
  sendPasswordResetEmailService,
  verifyEmailService,
} from "../services/auth.service";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: IRegister = req.body;
    const user = await registerService(body);
    return res.status(201).json({
      message: "Vui lòng kiểm tra email để xác minh tài khoản",
      user: { id: user.id, email: user.email },
    });
  } catch (err: any) {
    next(err);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginService({ email, password });

    // Set HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // chỉ https production
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24, // 1 ngày
      path: "/", // cookie dùng toàn app
    });
    return res.status(200).json({ message: "Đăng nhập thành công", user });
  } catch (err: any) {
    next(err);
  }
};

export const verifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    await verifyEmailService(token);
    res.status(200).json({ message: "Xác minh email thành công" });
  } catch (err: any) {
    next(err);
  }
};

export const sendPasswordResetEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: ISendPasswordResetEmail = req.body;
    const result = await sendPasswordResetEmailService(body);
    res.status(200).json(result);
  } catch (err: any) {
    next(err);
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;
    const body: IResetPassword = req.body;
    await resetPasswordService(token, body);
    res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
  } catch (err: any) {
    next(err);
  }
};
export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (err: any) {
    next(err);
  }
};
