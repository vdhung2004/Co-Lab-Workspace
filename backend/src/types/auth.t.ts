import { UserRole } from './user.t'
export interface DecodedUserPayLoad {
    id: string,
    role: UserRole,
    iat: number,
    exp: number
}

declare module 'express' {
    interface Request {
        user?: DecodedUserPayLoad; // Thêm thuộc tính 'user'
    }
}