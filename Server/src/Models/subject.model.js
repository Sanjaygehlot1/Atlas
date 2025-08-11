// Server/src/Models/subject.model.js
import mongoose from "mongoose";
import { Schema } from "mongoose";

const subjectSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        default: 3
    },
    semester: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    description: {
        type: String
    }
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema);
export { Subject };
