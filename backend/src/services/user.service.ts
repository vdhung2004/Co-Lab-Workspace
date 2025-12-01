import { getUserPublicData, 
    updateUserPassRepo, 
    getUserPasswordHashRepo,
    updateUserPhoneAndFullNameRepo
} from '../repositories/user.repository';
import { UserPublicData } from '../types/user.t';
import { hashPassword, isValidVietnamesePhoneNumber, isStrongPassword } from './auth.service';
import bcrypt from 'bcrypt';

export const showUserProfile = async (userID: string): Promise<UserPublicData> => {
    try {
        const user: UserPublicData | null = await getUserPublicData(userID);

        if (!user) {
            throw new Error("Khong co user");
        }

        return user;
    } catch (error) {
        console.error(error);
        throw new Error("loi");
    }
    
}

export const changePasswordService = async (userID: string, oldPass: string, newPass: string) => {  
    if (!isStrongPassword(newPass)) {
        throw new Error("Mat khau khong du manh");
    }
    // Lấy mật khẩu cũ ở CSDL
    const user = await getUserPasswordHashRepo(userID);

    if (!user || !user.passwordHash) {
        // Lỗi này xảy ra khi user không tồn tại hoặc dữ liệu bị thiếu
        throw new Error('Người dùng không tồn tại.');
    }

    const isPasswordMatch = await bcrypt.compare(oldPass, user.passwordHash);

    if (!isPasswordMatch) {
        // Đây là lỗi nghiệp vụ: Mật khẩu cũ không đúng
        throw new Error('Mật khẩu cũ không chính xác.'); 
    }

    const newPassHash = await hashPassword(newPass);
    
    // Cập nhật mật khẩu mới vào CSDL
    await updateUserPassRepo(userID, newPassHash);

    return { success: true };
};

export const updateUserPhoneAndFullNameService = async (userID: string, fullName: string, phone: string) => {
    if (!isValidVietnamesePhoneNumber(phone)) {
        throw new Error("Nhap lai so dien thoai");
    }
    await updateUserPhoneAndFullNameRepo(userID, fullName, phone);
    return { success: true };
}