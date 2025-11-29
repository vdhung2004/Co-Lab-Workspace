import { prisma } from "../lib/prisma";
import { UserRepoPayload, UserPublicData, User } from "../types/user.t";

export const createUser = async (payload: UserRepoPayload) => {
    const userData: UserRepoPayload = {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        passwordHash: payload.passwordHash,
        role: payload.role,
        status: payload.status,
        verified: payload.verified,
        verifyToken: payload.verifyToken,
        verifyExpireAt: payload.verifyExpireAt,
        verifySentAt: payload.verifySentAt,
    };

    return prisma.user.create({
        data: userData,
    })
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    // Lấy email người dùng
    const user = await prisma.user.findUnique({
        where: {
            email: email    
        }
    });

    // Không có user thì trả về null
    if (!user) {
        return null;
    }
    return user;
}

// Lấy người dùng verify token
export const getUserByVerifyToken = async (verifyToken: string): Promise<User | null> => {
    const user = await prisma.user.findFirst({
        where: {
            verifyToken: verifyToken
        }
    });

    if (!user) {
        return null;
    }

    return user;
}

// Cập nhật các trường về verify email
export const updateUserVerificationStatus = async (userID: string) => {
    return prisma.user.update({
        where: {id: userID},
        data: {
            verified: true,
            verifyExpireAt: null,
            verifyToken: null,
            verifySentAt: null,
        }
    });
};

// Hàm trả dữ liệu người không chứa pass cho JWT
export const getUserPublicData = async (userID: string): Promise<UserPublicData | null> => {
    // Dùng select để loại bỏ các trường nhạy cảm
    return prisma.user.findUnique({
        where: { id: userID },
        select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            verified: true
        }
    });
};

export const updateUserPassRepo = async (userID: string, newPassHash: string) => {
    return prisma.user.update({
        where: { id: userID },
        data: {
            passwordHash: newPassHash
        }
    });
};

export const updateUserPhoneAndFullNameRepo = async (userID: string, fullName: string, phone: string) => {
    return prisma.user.update({
        where: { id: userID },
        data: {
            fullName: fullName,
            phone: phone,
        }
    });
};


export const getUserPasswordHashRepo = async (userID: string) => {
    // Chỉ chọn ID và passwordHash
    return prisma.user.findUnique({
        where: { id: userID },
        select: {
            id: true,
            passwordHash: true,
        }
    });
};