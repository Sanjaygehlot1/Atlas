import { mongoose, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const userSchema = new Schema({
    name: {
        type: String,
        trim: true

    },
    googleId:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    picture : {
        type : String,
    },
    rollNo: {
        type: String
    },
    department: {
        type: String,
        enum: ['CMPN', 'ECS', 'EXTC', 'INFT']
    },
    year: {
        type: String,
        enum: ['FE', 'SE', 'TE', 'BE']
    },
    class: {
        type: String
    },
    dob: {
        type: String
    },
    gender:{
        type: String,
        enum: ["male", "female","other"]
    },
    phone: {
        type: String,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number.']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@atharvacoe\.ac\.in$/, 'Only college emails are allowed.']
    },
    role: {
        type: String,
        required: true,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    hasFilledDetails: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);
export default User;