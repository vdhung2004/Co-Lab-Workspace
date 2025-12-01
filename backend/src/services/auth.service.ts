import bcrypt from 'bcrypt'
import { User, UserPublicData } from '../types/user.t';
import jwt from 'jsonwebtoken';
import { getUserByEmail, 
    getUserByVerifyToken, 
    updateUserVerificationStatus,
    getUserPublicData } from '../repositories/user.repository';
import { CreateUserPayload, UserRepoPayload } from '../types/user.t';
import { createUser } from '../repositories/user.repository';
import { generateVerifyToken, getExpirationDate } from '../utils/crypto';
import { UserStatus } from '../../generated/prisma';

const JWT_SECRET: string = process.env.JWT_SECRET!;

// Hàm hash password
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    
    return passwordHash;
};

// Hàm tạo Token
export const generateToken = (user: UserPublicData): string => {
    
    const accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: '1d'})
    return accessToken;
}

// Kiểm tra Email
export const checkEmailExists = async (email: string): Promise<boolean> => {
    const user = await getUserByEmail(email);

    return user !== null;
}

// Kiểm tra định dạng Email
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Kiểm tra email có khớp với regex không
    return emailRegex.test(email);
};

// Kiểm tra SĐT Việt Nam
export const isValidVietnamesePhoneNumber = (phone: string): boolean => {
    const cleanedPhone = phone.replace(/[\s.-]/g, '');
    
    // Regex cho 10 chữ số bắt đầu bằng 0 (ví dụ: 090xxxxxxx)
    const tenDigitRegex = /^0\d{9}$/;
    
    // Regex cho (+84) và theo sau là 9 chữ số (ví dụ: +8490xxxxxxx)
    const plus84Regex = /^\+84\d{9}$/;

    // Kiểm tra với chuỗi đã được làm sạch
    return tenDigitRegex.test(cleanedPhone) || plus84Regex.test(cleanedPhone);
};

// Kiểm tra password phù hợp
export const isStrongPassword = (password: string): boolean => {
    // 1. Kiểm tra độ dài: Tối thiểu 8 ký tự.
    const minLengthRegex = /.{8,}/; 
    
    // 2. Kiểm tra chữ hoa: Chứa ít nhất 1 chữ cái viết hoa (A-Z).
    const uppercaseRegex = /[A-Z]+/;
    
    // 3. Kiểm tra ký tự đặc biệt: Chứa ít nhất 1 trong các ký tự đặc biệt phổ biến.
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+/;
    
    return minLengthRegex.test(password) &&
           uppercaseRegex.test(password) &&
           specialCharRegex.test(password);
};

// Kiểm tra status user 
export const isUserActive = (status: UserStatus): boolean => {
    const activeUser: UserStatus = 'active';
    return activeUser === status;
}

// Hàm đăng nhập
export const login = async (email: string, password: string): Promise<UserPublicData | null> => {
    const user = await getUserByEmail(email);

    if (!user) {
        console.log('DEBUG: Người dùng KHÔNG được tìm thấy.');
        throw new Error('Email hoặc mật khẩu không đúng');
    }

    if (!isUserActive) {
        console.log('DEBUG: Người dùng KHÔNG Active.');
        throw new Error('Người dùng không active');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    const publicUser: UserPublicData | null = await getUserPublicData(user.id);

    if (!publicUser) {
        throw new Error('Không thể tìm thấy dữ liệu người dùng');
    }
    
    if (!passwordMatch) {
        throw new Error('Email hoặc mật khẩu không đúng');
    }

    return publicUser;
}

export const register = async (payload: CreateUserPayload): Promise<User> => {

    // 2. Phối hợp: Gọi Auth Service để băm mật khẩu
    const passwordHash = await hashPassword(payload.password);

    // Tạo Token và Ngày tháng
    const verifyToken = generateVerifyToken();
    const expireDate = getExpirationDate();

    // 3. Chuẩn bị Payload cho Repository
    const repoPayload: UserRepoPayload = {
        ...payload,
        status: 'active',
        passwordHash: passwordHash, // Thay thế mật khẩu thô bằng hash
        verified: false,

        verifyToken: verifyToken,
        verifySentAt: new Date(),
        verifyExpireAt: expireDate,
    };

    // 4. Gọi Repository để lưu vào CSDL
    const newUser = await createUser(repoPayload); 

    return newUser;
};

export const verifyEmail = async (verifyToken: string) => {
    const user: User | null= await getUserByVerifyToken(verifyToken);

    if (!user) {
        throw Error("Khong tim duoc user");
    }

    if (user.verifyExpireAt && user.verifyExpireAt < new Date()) {
        // Kiểm tra xem thời gian hiện tại đã vượt quá thời gian hết hạn chưa
        throw new Error("Token đã hết hạn. Vui lòng yêu cầu gửi lại email xác minh.");
    }

    if (user.verified) {
        // Người dùng đã được xác minh rồi
        return { message: "Email đã được xác minh trước đó." };
    }

    await updateUserVerificationStatus(user.id);

    return { message: "Xác minh email thành công!" };
}

