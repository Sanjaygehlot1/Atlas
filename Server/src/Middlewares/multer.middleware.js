import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadDir = path.resolve('src/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for Cloudinary (temporary local storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    
    // Handle different types of uploads
    if (req.body.classId) {
      // Timetable upload
      const classId = req.body.classId?.replace(/\s+/g, '-').toLowerCase() || 'unknown';
      cb(null, `timetable-${classId}-${timestamp}${ext}`);
    } else if (req.body.subjectName) {
      // Note upload (temporary file for Cloudinary)
      const subjectName = req.body.subjectName?.replace(/\s+/g, '-').toLowerCase() || 'unknown';
      cb(null, `temp-note-${subjectName}-${timestamp}${ext}`);
    } else {
      // Default upload
      cb(null, `upload-${timestamp}${ext}`);
    }
  },
});

// Alternative: Use memory storage for direct Cloudinary upload
// const storage = multer.memoryStorage();

export const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow documents and images
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload documents, images, or presentations.'));
    }
  }
});