import { prisma } from "../lib/prisma.js";
import {
  IRegister,
  ILogin,
  ISendPasswordResetEmail,
  IResetPassword,
} from "../schemas/auth.schema.js";
import { hashPassword, comparePassword } from "../utils/hash";
import { signToken } from "../utils/jwt.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/mailer.js";
import { v4 as uuidv4 } from "uuid";

export const registerService = async (data: IRegister) => {
  // Kiểm tra nếu email đã tồn tại
  console.log(data);
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw { status: 409, message: "Email đã được sử dụng." };
  }
  // Băm mật khẩu
  const hashedPassword = await hashPassword(data.password);
  // 4. Lưu user mới
  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      passwordHash: hashedPassword,
      role: "customer",
      verified: false,
      status: "active",
    },
  });

  // 5. Gửi email xác minh
  await sendVerificationEmailService(data.email, data.fullName);
  return user;
};

export const loginService = async (data: ILogin) => {
  // Tìm user theo email
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!user) {
    throw { status: 401, message: "Email hoặc mật khẩu không đúng." };
  }
  const isValidPassword = await comparePassword(
    data.password,
    user.passwordHash
  );
  if (!isValidPassword) {
    throw { status: 401, message: "Email hoặc mật khẩu không đúng." };
  }

  if (user.status !== "active") {
    throw { status: 403, message: "Tài khoản của bạn đã bị khóa" };
  }

  if (!user.verified) {
    await sendVerificationEmailService(user.email, user.fullName);
    throw {
      status: 403,
      message: "Vui lòng xác minh email trước khi đăng nhập.",
    };
  }

  const token = signToken({
    user_id: user.id,
    role: user.role,
  });
  if (!token) {
    throw { status: 500, message: "Không thể tạo token đăng nhập." };
  }

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      verified: user.verified,
    },
  };
};

export const sendVerificationEmailService = async (
  email: string,
  fullName: string
) => {
  // 1. Tạo verify token mới
  const verifyToken = uuidv4();
  const verifySentAt = new Date();
  const verifyExpireAt = new Date(verifySentAt.getTime() + 24 * 60 * 60 * 1000); // 24h
  console.log("Verify token:", verifyToken);

  // 2. Cập nhật token vào DB
  await prisma.user.update({
    where: { email: email },
    data: { verifyToken, verifySentAt, verifyExpireAt },
  });

  // 3. Gửi email (thay link bằng frontend của bạn)
  await sendVerificationEmail(email, verifyToken, fullName);

  return { verifyToken, verifySentAt, verifyExpireAt };
};

export const verifyEmailService = async (token: string) => {
  const user = await prisma.user.findFirst({
    where: { verifyToken: token },
  });

  if (!user) {
    throw { status: 400, message: "Token không hợp lệ" };
  }
  if (user.verified) {
    throw { status: 400, message: "Email đã được xác thực" };
  }
  const now = new Date();
  if (!user.verifyExpireAt || user.verifyExpireAt < now) {
    throw { status: 400, message: "Token đã hết hạn" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { verified: true, verifyToken: null, verifyExpireAt: null },
  });

  return user;
};

export const sendPasswordResetEmailService = async (
  data: ISendPasswordResetEmail
) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw { status: 404, message: "Không tìm thấy người dùng với email này." };
  }
  const resetToken = uuidv4();
  const resetSentAt = new Date();
  const resetExpireAt = new Date(resetSentAt.getTime() + 1 * 60 * 60 * 1000); // 1 giờ

  await prisma.user.update({
    where: { email: data.email },
    data: { resetToken, resetSentAt, resetExpireAt },
  });

  await sendPasswordResetEmail(user.email, resetToken);

  return { message: "Đã gửi email đặt lại mật khẩu vào email của bạn" };
};

export const resetPasswordService = async (
  token: string,
  data: IResetPassword
) => {
  const user = await prisma.user.findFirst({
    where: { resetToken: token },
  });
  if (!user) {
    throw { status: 400, message: "Token không hợp lệ" };
  }
  const now = new Date();
  if (!user.resetExpireAt || user.resetExpireAt < now) {
    console.log("token:", token);
    console.log("User's resetExpireAt:", user);
    console.log("Now:", now);
    console.log("ExpireAt:", user.resetExpireAt);
    throw { status: 400, message: "Token đã hết hạn" };
  }
  const hashedPassword = await hashPassword(data.newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: hashedPassword,
      resetToken: null,
      resetExpireAt: null,
    },
  });
  return user;
};
