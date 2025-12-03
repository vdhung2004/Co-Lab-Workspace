import { User } from "../generated/prisma/client.js";
import { UserRole, UserStatus } from "../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import {
  IRegister,
  ILogin,
  ISendPasswordResetEmail,
  IResetPassword,
} from "../schemas/auth.schema.js";
import { IUpdateProfile } from "../schemas/user.schema.js";
import { hashPassword, comparePassword } from "../utils/hash";
import { signToken } from "../utils/jwt.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/mailer.js";
import { v4 as uuidv4 } from "uuid";
// User
export const getProfileService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      fullName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      verified: true,
      createdAt: true,
    },
  });
  if (!user) throw { status: 404, message: "Người dùng không tồn tại" };
  return user;
};
export const updateProfileService = async (
  userId: string,
  data: IUpdateProfile
) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      fullName: data.fullName,
      phone: data.phone,
    },
    select: {
      fullName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      verified: true,
      createdAt: true,
    },
  });
  if (!user) throw { status: 404, message: "Người dùng không tồn tại" };
  return user;
};

export const changePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw { status: 404, message: "Không tìm thấy người dùng" };

  const isValid = await comparePassword(currentPassword, user.passwordHash);
  if (!isValid) throw { status: 400, message: "Mật khẩu hiện tại không đúng" };

  const passwordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return { message: "Đổi mật khẩu thành công" };
};
// Admin

interface GetAllUsersOptions {
  page?: number; // trang hiện tại, default 1
  limit?: number; // số bản ghi mỗi trang, default 10
  role?: UserRole; // lọc theo role
  status?: UserStatus; // lọc theo status
  sortBy?: string; // trường sắp xếp
  order?: "asc" | "desc"; // hướng sắp xếp
}

export const getAllUsersService = async (options: GetAllUsersOptions) => {
  const page = options.page && options.page > 0 ? options.page : 1;
  const limit = options.limit && options.limit > 0 ? options.limit : 10;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (options.role) where.role = options.role;
  if (options.status) where.status = options.status;

  const sortableFields = ["fullName", "email", "createdAt", "role", "status"];
  const sortBy = sortableFields.includes(options.sortBy || "")
    ? options.sortBy!
    : "createdAt";
  const order = options.order === "asc" ? "asc" : "desc";

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        verified: true,
        createdAt: true,
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return { total, totalPages, page, limit, users };
};
export const updateUserByAdminService = async (
  userId: string,
  data: { role?: UserRole; status?: UserStatus }
) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      verified: true,
    },
  });
  return user;
};
