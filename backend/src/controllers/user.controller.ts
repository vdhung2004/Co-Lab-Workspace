import { CreateUserPayload, User, UserPublicData } from '../types/user.t';
import { Request, Response } from 'express';
import { register } from '../services/auth.service';
import { isValidEmail, 
    isValidVietnamesePhoneNumber,
    checkEmailExists,
    generateToken,
    login,
    isStrongPassword,
    verifyEmail } from '../services/auth.service';
import { sendVerificationEmail } from '../services/email.service';
import { showUserProfile,
    changePasswordService,
    updateUserPhoneAndFullNameService
 } from '../services/user.service';

export const createUser = async (req: Request, res: Response) => {
    const payload: CreateUserPayload = req.body;

    const {
        fullName,
        email,
        phone,
        password,
        role,
        status,
        verified
    } = payload;

    try {
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Định dạng email không hợp lệ.' });
        }

        const cleanedPhone = phone.replace(/[\s.-]/g, '');
        if (!isValidVietnamesePhoneNumber(cleanedPhone)) {
            return res.status(400).json({ error: 'Số điện thoại không hợp lệ.' });
        }
        payload.phone = cleanedPhone;

        if (!isStrongPassword(password)) {
            return res.status(400).json({ 
                error: 'Mật khẩu phải có tối thiểu 8 ký tự, ít nhất 1 chữ hoa, và 1 ký tự đặc biệt.' 
            });
        }

        const isEmailExists = await checkEmailExists(email);

        if (isEmailExists) {
            return res.status(409).json({ error: 'Email đã được sử dụng.' });
        }

        const newUser: User = await register(payload);
    
        // Kiểm tra email có verify
        const isEmailVerified = await sendVerificationEmail(payload.email, newUser.verifyToken!);

        if (!isEmailVerified) {
            return res.status(400).json({ 
                error: 'Verify email không được', 
            });
        }

        const userPublicData: UserPublicData = {
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.fullName,
            phone: newUser.phone,
            role: newUser.role,
            status: newUser.status,
            verified: newUser.verified
        } 

        const accessToken = generateToken(userPublicData);

        return res.status(201).json({
            message: "Vui lòng kiểm tra email để xác minh tài khoản",
            user: userPublicData,
            accessToken: accessToken,
            userID: userPublicData.id,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    try {
        const user: UserPublicData | null = await login(email, password);
        if (!user) res.status(404).json({ message: "Khong co user" });
        const accessToken = generateToken(user!);
        
        res.status(200).json({ token: accessToken, user: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: '401 Unauthorized' });
    }
}

export const verifyEmailController = async (req: Request, res: Response) => {
    // Lấy token từ query parameter
    const verifyToken = req.query.token as string;

    // Kiểm tra nếu token không tồn tại
    if (!verifyToken) {
        // Gửi lỗi 400 Bad Request nếu thiếu token
        return res.status(400).send("Lỗi: Token xác minh không được cung cấp.");
    }
    
    try {
        // Gọi hàm ở dưới service để verify email và trả về message: "Thành công"
        const result = await verifyEmail(verifyToken);
        
        return res.status(200).json(result.message); 

    } catch (error) {
        return res.status(400).json(`Xác minh thất bại: ${error}`);
    }
}

export const showUserData = async (req: Request, res: Response) => {
    const id = req.user?.id;
    const user: UserPublicData = await showUserProfile(id!);

    return res.status(200).json(user);
}

export const changeUserpassController = async (req: Request, res: Response) => {
    const id = req.user?.id;
    const { oldPass, newPass } = req.body;

    const newPassHash = await changePasswordService(id!, oldPass, newPass);

    if (!newPassHash) {
        return res.status(404).json("Thay doi mat khau khong duoc");
    }

    return res.status(201).json({ msg: "Thay doi mat khau thanh cong" });
}

export const updateUserPhoneAndFullNameController = async (req: Request, res: Response) => {
    const id = req.user?.id;
    const { phone, fullName } = req.body;

    if (!id) {
        // Bắt lỗi ở middleware
        return res.status(401).json({ msg: "Lỗi xác thực người dùng." });
    }

    try {
        await updateUserPhoneAndFullNameService(id, fullName, phone);
        return res.status(200).json({ msg: "Thay đổi SDT va ten thanh cong" });

    } catch (error) {
        // Bắt lỗi nghiệp vụ từ Service
        const errorMessage = (error instanceof Error) ? error.message : "Lỗi không xác định.";

        return res.status(400).json({ msg: errorMessage });
    }
}