import express from 'express';
import { upload } from '../Middlewares/multer.middleware.js';
import { handleTimetableUpload, getTimetableForAClass } from '../Controllers/timetable.controller.js';
import {AuthMiddleware} from '../Middlewares/auth.middleware.js'
const router = express.Router();

router.post('/upload', upload.single('file'),AuthMiddleware, handleTimetableUpload);
router.post('/get-timetable', getTimetableForAClass)
export default router;