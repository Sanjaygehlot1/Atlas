import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadDir = path.resolve('src/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const classId = req.body.classId?.replace(/\s+/g, '-').toLowerCase() || 'unknown';
    cb(null, `timetable-${classId}-${timestamp}${ext}`);
  },
});

export const upload = multer({ storage });