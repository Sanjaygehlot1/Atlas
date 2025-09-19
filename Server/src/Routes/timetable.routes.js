import express from 'express';
import { upload } from '../Middlewares/multer.middleware.js';
import { handleTimetableUpload, getTimetableForAClass, updateLectureStatus, getExceptionsForAClass, getScheduleForATeacher, getExceptionsForAFaculty, getCompleteTimetable } from '../Controllers/timetable.controller.js';
import {verifyToken} from '../Middlewares/auth.middleware.js'
const router = express.Router();

router.post('/upload', upload.single('file'),verifyToken, handleTimetableUpload);
router.post('/get-timetable', verifyToken,getTimetableForAClass)
router.post('/get-exceptional-timetable',verifyToken, getExceptionsForAClass)
router.post('/get-faculty-exceptional-timetable',verifyToken, getExceptionsForAFaculty)
router.patch('/:lectureId/status',verifyToken, updateLectureStatus)
router.get('/get-teacher-schedule',verifyToken,getScheduleForATeacher)
router.get('/get-complete-tt',verifyToken,getCompleteTimetable)

export default router;