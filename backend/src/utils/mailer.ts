// src/utils/email.ts
import * as nodemailer from "nodemailer";
import dotenv from "dotenv";

// Kiểm tra và lấy biến môi trường
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587"); // Đảm bảo là số
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.error("Thiếu cấu hình SMTP trong biến môi trường.");
  // Có thể dừng ứng dụng hoặc đặt chế độ "mock" email ở môi trường dev
}

// 📧 Tạo Transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  // secure: true nếu port là 465 (SSL), false nếu port là 587 (TLS)
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Kiểm tra kết nối (Nên chạy khi khởi động server)
transporter.verify(function (error, success) {
  if (error) {
    console.error("Lỗi kết nối SMTP:", error);
  } else {
    console.log("Máy chủ SMTP đã sẵn sàng gửi thư.");
  }
});

export const sendVerificationEmail = async (
  email: string,
  token: string,
  fullName: string
) => {
  // Tùy chỉnh URL frontend của bạn
  const verificationLink = `${process.env.CLIENT_URL}/verify?token=${token}`;

  await transporter.sendMail({
    from: '"Your App" <no-reply@yourapp.com>',
    to: email,
    subject: "Xác minh tài khoản của bạn",
    html: `
            Xin chào **${fullName}**,
            <br><br>
            Cảm ơn bạn đã đăng ký. Vui lòng click vào link sau để xác minh tài khoản:
            <br>
            <a href="${verificationLink}">${verificationLink}</a>
            <br><br>
            Link này sẽ hết hạn sau **24 giờ**.
        `,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  // Tùy chỉnh URL frontend của bạn
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: '"Your App" <no-reply@yourapp.com>',
    to: email,
    subject: "Yêu cầu đặt lại mật khẩu",
    html: `
            Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
            <br><br>
            Vui lòng click vào link sau để đặt lại mật khẩu:
            <br>
            <a href="${resetLink}">${resetLink}</a>
            <br><br>
            Nếu bạn không yêu cầu, vui lòng bỏ qua email này. Link này sẽ hết hạn sau **30 phút**.
        `,
  });
};
