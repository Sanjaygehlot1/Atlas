
import mongoose from "mongoose";
import { LectureNotes } from "../Models/lectureNotes.model.js";
import { ApiResponse } from '../Utils/ApiResponse.js';
import { ApiError } from '../Utils/ApiError.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import { Subject } from "../Models/subject.model.js";


export const getSubjects = AsyncHandler(async (req, res) => {
    const { className } = req.body; // Back to req.body for POST

    if (!className) {
        throw new ApiError(400, 'Bad Request: className is required');
    }
console.log(className)
    try {
        const clas = className.split(" ");
        const subjects = await Subject.find({class:clas, department: clas[1] })
        
        console.log('📝 Subjects:', subjects);
        
        return res.status(200).json(new ApiResponse(200, subjects, 'Notes fetched successfully'));
    } catch (error) {
        console.error('❌ Error fetching notes:', error);
        throw new ApiError(500, `Error fetching notes: ${error.message}`);
    }
})
