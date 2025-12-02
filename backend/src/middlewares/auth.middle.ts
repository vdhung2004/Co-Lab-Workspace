// import { Request, Response, NextFunction } from 'express';
// import { DecodedUserPayLoad } from '../types/auth.t';
// import { UserRole } from '../types/user.t'
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET;

// export const authorize = (allowedRoles: UserRole) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         if (!req.user) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Cần xác thực người dùng"
//             });
//         }

//         const userRole = req.user.role;
//         if (allowedRoles.includes(userRole)) {
//             next()
//         } else {
//             return res.status(403).json({
//                 success: false,
//                 message: "Bạn không có quyền truy cập"
//             });
//         }
//     }
// }

// export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {

//     const authHeader = req.headers.authorization;
//     const token = authHeader?.split(' ')[1];
//     try {
//         const decodedToken = jwt.verify(token!, JWT_SECRET!);
//         req.user = decodedToken as DecodedUserPayLoad;
//         // console.log(decodedToken);
//         next();
//     } catch (error) {
//         return res.status(403).json({
//             success: false,
//             message: "Hết hạn token"
//         })
//     }
// }
