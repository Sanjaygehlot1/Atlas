import {Router} from 'express';
import {logoutUser,signInUser,getCurrentUser,updateAcademicInfo} from '../Controllers/user.controller.js'
import {AuthMiddleware } from '../Middlewares/auth.middleware.js';


const router = Router();

router.post('/auth/signin',AuthMiddleware, signInUser);
router.post('/auth/logout',AuthMiddleware,logoutUser);
router.get('/current-user', AuthMiddleware, getCurrentUser);
router.put('/update-academic-info', AuthMiddleware, updateAcademicInfo);

export {router as userRouter};
