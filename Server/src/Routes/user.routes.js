import {Router} from 'express';
import {loginUser,logoutUser,registerUser,getCurrentUser,updateAcademicInfo,verifyUser} from '../Controllers/user.controller.js'
import { AuthMiddleware } from '../Middlewares/auth.middleware.js';


const router = Router();

router.post('/auth/create-account', registerUser);
router.post('/auth/verify',verifyUser);
router.post('/auth/login',loginUser);
router.get('/auth/logout',AuthMiddleware,logoutUser);
router.get('/current-user', AuthMiddleware, getCurrentUser);
router.put('/update-academic-info', AuthMiddleware, updateAcademicInfo);

export {router as userRouter};
