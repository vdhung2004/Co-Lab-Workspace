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
  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  // Nội dung TEXT (Văn bản thuần) giúp email hiển thị tốt hơn trên các client khác nhau
  const textContent = `Xin chào ${fullName},\n\nCảm ơn bạn đã đăng ký. Vui lòng truy cập liên kết sau để xác minh tài khoản: ${verificationLink}\n\nLink này sẽ hết hạn sau 24 giờ.`;

  // Nội dung HTML đã được định dạng
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác minh Tài khoản</title>
        <style>
            /* CSS cơ bản cho email */
            body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { background-color: #007bff; color: #ffffff; padding: 20px; text-align: center; }
            .content { padding: 30px; line-height: 1.6; color: #333333; }
            .button-area { text-align: center; margin: 25px 0; }
            .button { display: inline-block; padding: 12px 25px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; }
            .footer { background-color: #eeeeee; color: #777777; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #dddddd; }
            .expiry { color: #dc3545; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Xác Minh Tài Khoản Của Bạn</h2>
            </div>
            <div class="content">
                <p>Xin chào <b>${fullName}</b>,</p>
                <p>Cảm ơn bạn đã đăng ký tài khoản tại ứng dụng của chúng tôi.</p>
                <p>Vui lòng click vào nút dưới đây để hoàn tất việc xác minh email và kích hoạt tài khoản:</p>
                
                <div class="button-area">
                    <a href="${verificationLink}" class="button">KÍCH HOẠT TÀI KHOẢN</a>
                </div>
                
                <p>Hoặc truy cập trực tiếp bằng liên kết sau:</p>
                <p style="word-break: break-all;"><a href="${verificationLink}">${verificationLink}</a></p>
                
                <p><b>Lưu ý quan trọng:</b></p>
                <ul>
                    <li>Liên kết này sẽ hết hạn sau <span class="expiry">24 giờ</span>.</li>
                    <li>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</li>
                </ul>
                
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Your App. All rights reserved.</p>
                <p>Đây là email tự động. Vui lòng không trả lời.</p>
            </div>
        </div>
    </body>
    </html>
    `;

  await transporter.sendMail({
    from: '"Your App" <no-reply@yourapp.com>',
    to: email,
    subject: "Xác minh tài khoản của bạn",
    text: textContent, // Quan trọng: Thêm text content
    html: htmlContent, // Nội dung HTML đã được định dạng
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  // Tùy chỉnh URL frontend của bạn
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  // Nội dung TEXT (Văn bản thuần)
  const textContent = `Yêu cầu đặt lại mật khẩu.\n\nVui lòng truy cập liên kết sau để đặt lại mật khẩu: ${resetLink}\n\nLiên kết này sẽ hết hạn sau 30 phút. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.`;

  // Nội dung HTML đã được định dạng
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Đặt lại Mật khẩu</title>
        <style>
            /* CSS cơ bản cho email */
            body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { background-color: #dc3545; color: #ffffff; padding: 20px; text-align: center; }
            .content { padding: 30px; line-height: 1.6; color: #333333; }
            .button-area { text-align: center; margin: 25px 0; }
            .button { display: inline-block; padding: 12px 25px; background-color: #dc3545; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; }
            .footer { background-color: #eeeeee; color: #777777; padding: 20px; text-align: center; font-size: 12px; border-top: 1px solid #dddddd; }
            .expiry { color: #dc3545; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Yêu Cầu Đặt Lại Mật Khẩu</h2>
            </div>
            <div class="content">
                <p>Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                <p>Nếu bạn thực hiện yêu cầu này, vui lòng click vào nút dưới đây để tạo mật khẩu mới:</p>
                
                <div class="button-area">
                    <a href="${resetLink}" class="button">ĐẶT LẠI MẬT KHẨU</a>
                </div>
                
                <p>Hoặc truy cập trực tiếp bằng liên kết sau:</p>
                <p style="word-break: break-all;"><a href="${resetLink}">${resetLink}</a></p>
                
                <p><b>Cảnh báo:</b></p>
                <ul>
                    <li>Liên kết này chỉ có hiệu lực trong <span class="expiry">30 phút</span>.</li>
                    <li><b></b>Nếu bạn không yêu cầu đặt lại mật khẩu</b>, vui lòng bỏ qua email này. Mật khẩu của bạn vẫn an toàn.</li>
                </ul>
                
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Your App. All rights reserved.</p>
                <p>Đây là email tự động. Vui lòng không trả lời.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: '"Your App" <no-reply@yourapp.com>',
    to: email,
    subject: "Yêu cầu đặt lại mật khẩu",
    text: textContent, // Quan trọng: Thêm text content
    html: htmlContent, // Nội dung HTML đã được định dạng
  });
};
