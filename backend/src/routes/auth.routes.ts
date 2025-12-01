import { Router } from 'express';
import { createUser, loginUser, verifyEmailController } from '../controllers/user.controller';
import { authenticateToken, authorize } from '../middlewares/auth.middle';
import { Request, Response } from 'express';
const authRoutes = Router();

authRoutes.post('/register', createUser);

authRoutes.post('/login', loginUser);

authRoutes.get('/verify-email', verifyEmailController)

// authRoutes.get('/test', authenticateToken, (req: Request, res: Response) => {
//     console.log('Authen thanh cong');
// })

// authRoutes.get('/test/author', authenticateToken, authorize('admin'), (req: Request, res: Response) => {
//     console.log('authorize thanh cong');
// })

export default authRoutes;