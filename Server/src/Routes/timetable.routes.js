import express from 'express';
import { upload } from '../Middlewares/multer.middleware.js';
import { handleTimetableUpload, getTimetableForAClass, updateLectureStatus, getScheduleForATeacher, getCompleteTimetable } from '../Controllers/timetable.controller.js';
import {AuthMiddleware} from '../Middlewares/auth.middleware.js'
const router = express.Router();

router.post('/upload', upload.single('file'),AuthMiddleware, handleTimetableUpload);
router.post('/get-timetable', AuthMiddleware,getTimetableForAClass)
router.patch('/:lectureId/status',AuthMiddleware, updateLectureStatus)
router.get('/get-teacher-schedule',AuthMiddleware,getScheduleForATeacher)
router.get('/get-complete-tt',AuthMiddleware,getCompleteTimetable)

export default router;