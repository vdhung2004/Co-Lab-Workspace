import nodemailer from 'nodemailer';
const EMAIL_USERNAME = process.env.EMAIL_USERNAME
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
const DOMAIN = process.env.DOMAIN

// Khởi tạo Transporter một lần duy nhất
const transporter = nodemailer.createTransport({
    // ... Cấu hình transporter như đoạn code bạn đã có
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: EMAIL_USERNAME, 
        pass: EMAIL_PASSWORD, 
    },
    tls: {
        rejectUnauthorized: true,
    }
});


// Hàm xác thực Email
export const sendVerificationEmail = async (toEmail: string, verifyToken: string): Promise<boolean> => {
    
    // Tạo đường link xác minh trỏ đến endpoint API verify-email
    const verificationLink = `${DOMAIN}/api/auth/verify-email?token=${verifyToken}`;

    const mailOptions = {
        from: `"Hệ thống Xác thực" <${EMAIL_USERNAME}>`,
        to: toEmail,
        subject: 'Xác Minh Tài Khoản Của Bạn',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Xác Minh Tài Khoản</h2>
                <p>Vui lòng nhấp vào nút dưới đây để xác minh địa chỉ email của bạn:</p>
                <p style="margin: 20px 0;">
                    <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #1a73e8; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        XÁC MINH NGAY
                    </a>
                </p>
                <p>Liên kết này sẽ hết hạn sau 24 giờ.</p>
                <p>Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email xác thực đã gửi: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
        return false;
    }
};