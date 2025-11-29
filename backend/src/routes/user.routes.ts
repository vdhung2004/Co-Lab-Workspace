import { Router } from 'express'
import { showUserData,
    changeUserpassController,
    updateUserPhoneAndFullNameController
 } from '../controllers/user.controller';
import { authenticateToken, authorize } from '../middlewares/auth.middle';


const userRoutes = Router();

userRoutes.get('/profile', authenticateToken, showUserData);

userRoutes.put('/profile', authenticateToken, updateUserPhoneAndFullNameController);

userRoutes.post('/profile/change-password', authenticateToken, changeUserpassController);

export default userRoutes;