import mongoose from "mongoose";
import { Schema } from "mongoose";

const lectureNotesSchema = new Schema({
    title: {
        type: String, required: true
    },
    timeSlot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeSlot',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    },
    description: {
        type: String,
    }



})

const LectureNotes = mongoose.model('LectureNotes', lectureNotesSchema);