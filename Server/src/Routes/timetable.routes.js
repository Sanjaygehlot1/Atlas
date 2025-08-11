import express from 'express';
import { upload } from '../Middlewares/multer.middleware.js';
import { handleTimetableUpload, getTimetableForAClass, updateLectureStatus, getExceptionsForAClass, getScheduleForATeacher, getExceptionsForAFaculty, getCompleteTimetable } from '../Controllers/timetable.controller.js';
import {AuthMiddleware} from '../Middlewares/auth.middleware.js'
const router = express.Router();

router.post('/upload', upload.single('file'),AuthMiddleware, handleTimetableUpload);
router.post('/get-timetable', AuthMiddleware,getTimetableForAClass)
router.post('/get-exceptional-timetable',AuthMiddleware, getExceptionsForAClass)
router.post('/get-faculty-exceptional-timetable',AuthMiddleware, getExceptionsForAFaculty)
router.patch('/:lectureId/status',AuthMiddleware, updateLectureStatus)
router.get('/get-teacher-schedule',AuthMiddleware,getScheduleForATeacher)
router.get('/get-complete-tt',AuthMiddleware,getCompleteTimetable)

export default router;