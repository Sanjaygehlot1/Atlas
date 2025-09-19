import mongoose from "mongoose";
import fs from "fs";
import { LectureNotes } from "../Models/lectureNotes.model.js";
import { ApiResponse } from '../Utils/ApiResponse.js';
import { ApiError } from '../Utils/ApiError.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});





const getnotes = AsyncHandler(async (req, res) => {
    const { subjectId } = req.body; // Back to req.body for POST

    if (!subjectId) {
        throw new ApiError(400, 'Bad Request: subjectId is required');
    }
console.log(subjectId)
    try {
        // Students should see ALL notes for a subject, not just their own uploads
        // Search by subject only (remove user filter for student access)
        
        let query;
        if (mongoose.Types.ObjectId.isValid(subjectId)) {
            // If it's a valid ObjectId, search by subject field
            query = { subject: subjectId };
        } else {
            // If it's a string (subject name), search by subjectName
            query = { subjectName: subjectId };
        }
        
        console.log('🔍 Searching for notes with query:', query);
        
        const notes = await LectureNotes.find(query)
          .populate('faculty', 'name')
          .populate('timeSlot', 'startTime endTime')
          .sort({ createdAt: -1 });
        
        console.log('📝 Found notes:', notes.length);
        
        return res.status(200).json(new ApiResponse(200, notes, 'Notes fetched successfully'));
    } catch (error) {
        console.error('❌ Error fetching notes:', error);
        throw new ApiError(500, `Error fetching notes: ${error.message}`);
    }
})


const uploadnotes = AsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { title, description, subjectName, topic } = req.body;
    
    if (!title || !subjectName) {
        throw new ApiError(400, 'Title and subject name are required');
    }

    if (!req.file) {
        throw new ApiError(400, 'Note file is required');
    }

    try {
        console.log('📤 Uploading file to Cloudinary...');
        
        // Upload file to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'atlas-notes',
            resource_type: 'auto', // Automatically detect file type
            public_id: `note-${subjectName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
        });

        console.log('✅ Cloudinary upload successful:', uploadResult.secure_url);

        // Clean up temporary file
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
            console.log('🗑️ Temporary file cleaned up');
        }

        const noteData = {
            title,
            description,
            topic,
            subjectName,
            user: userId,
            url: uploadResult.secure_url, // Store Cloudinary URL
        };

        const newNote = new LectureNotes(noteData);
        await newNote.save();

        console.log('📝 Note saved to database successfully:', newNote);
        
        return res.status(201).json(new ApiResponse(201, newNote, 'Note uploaded successfully'));
    } catch (error) {
        console.error('❌ Error uploading note:', error);
        
        // Clean up temporary file in case of error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
            console.log('🗑️ Temporary file cleaned up after error');
        }
        
        throw new ApiError(500, `Error uploading note: ${error.message}`);
    }
})
export { getnotes, uploadnotes };