import express from "express";
import { AuthMiddleware, verifyToken } from '../Middlewares/auth.middleware.js';
import { upload } from '../Middlewares/multer.middleware.js';
import {uploadnotes,getnotes} from '../Controllers/notes.controller.js'
import {getSubjects} from '../Controllers/subjects.controller.js'


const router = express.Router();

// POST route to fetch notes
router.post('/get-student-subjects', AuthMiddleware, getSubjects);

// POST route to upload notes
router.post('/upload-notes', AuthMiddleware, upload.single('noteFile'),uploadnotes );

export default router
