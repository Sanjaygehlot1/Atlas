import mongoose from "mongoose";
import { Schema } from "mongoose";

const lectureNotesSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    timeSlot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeSlot',
        required: false
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: false
    },
    subjectName: {
        type: String,
        required: true
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: false
    },
    description: {
        type: String,
    },
    topic: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    url: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const LectureNotes = mongoose.model('LectureNotes', lectureNotesSchema);
export { LectureNotes };
