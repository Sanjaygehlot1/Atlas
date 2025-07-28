import express from 'express';
import { upload } from '../Middlewares/multer.middleware.js';
import { handleTimetableUpload } from '../Controllers/timetable.controller.js';

const router = express.Router();

router.post('/upload', upload.single('file'), handleTimetableUpload);

export default router;