// Server/src/Models/subject.model.js
import mongoose from "mongoose";
import { Schema } from "mongoose";

const subjectSchema = new Schema({
    class: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    subjectName: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
    },
    shortForm: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema);
export { Subject };
