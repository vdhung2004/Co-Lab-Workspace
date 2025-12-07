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
    const body: ILogin = req.body;
    const result = await loginService(body);
    return res.status(200).json({ message: "Đăng nhập thành công", ...result });
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
    console.log(token);
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
    const { token } = req.params;
    const body: IResetPassword = req.body;
    await resetPasswordService(token, body);
    res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
  } catch (err: any) {
    next(err);
  }
};
