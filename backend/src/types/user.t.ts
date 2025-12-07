export type UserRole = "customer" | "admin";
export type UserStatus = "active" | "locked";

// ----------------------------------------------------------------------

export interface User {
  // Sử dụng tên trường CAMELCASE từ Prisma Client

  /** Ánh xạ từ cột user_id (@map("user_id")) */
  id: string; // Trong Prisma Schema là 'id'
  /** Ánh xạ từ cột full_name (@map("full_name")) */
  fullName: string;
  email: string;
  phone: string;
  /** Ánh xạ từ cột password_hash (@map("password_hash")) */
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  verified: boolean;
  /** Ánh xạ từ cột created_at (@map("created_at")) */
  createdAt: Date;

  // Cột tùy chọn (camelCase)
  verifyToken?: string | null;
  verifySentAt?: Date | null;
  verifyExpireAt?: Date | null;
  resetToken?: string | null;
  resetSentAt?: Date | null;
  resetExpireAt?: Date | null;
}

// ----------------------------------------------------------------------

// Interface này vẫn giữ nguyên vì nó chỉ là dữ liệu đầu vào (Payload)
export interface CreateUserPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  verified: boolean;
}

// Interface này là tổng hợp của Payload thô + các giá trị Service tự tạo
export interface UserRepoPayload {
  // Dữ liệu từ người dùng
  fullName: string;
  email: string;
  phone: string;

  // Dữ liệu được Service tạo/chuẩn hóa
  passwordHash: string; // Thực chất là passwordHash
  role: UserRole;
  status: UserStatus;
  verified: boolean; // false

  // Dữ liệu Token (bắt buộc khi tạo)
  verifyToken: string;
  verifySentAt: Date;
  verifyExpireAt: Date;
}

export interface UserPublicData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  verified: boolean;
}
