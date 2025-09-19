import {Router} from 'express';
import {logoutUser,signInUser,getCurrentUser,updateAcademicInfo} from '../Controllers/user.controller.js'
import {verifyToken } from '../Middlewares/auth.middleware.js';


const router = Router();

router.post('/auth/create-account',verifyToken, signInUser);
router.post('/auth/logout',verifyToken,logoutUser);
router.get('/current-user', verifyToken, getCurrentUser);
router.put('/update-academic-info', verifyToken, updateAcademicInfo);

export {router as userRouter};
