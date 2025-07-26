import {mongoose,Schema} from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true

    },
    rollNo:{
        type: String,
             
    },
    department:{
        type: String,
        enum : ['CMPN', 'ECS', 'EXTC', 'INFT']
    },
    year:{
        type: String,
        enum : ['FE', 'SE', 'TE', 'BE']
    },
    class:{
        type: String,
    },
    email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@atharvacoe\\.ac\\.in$/, 'Only college emails are allowed.']
    },

    password:{
        type: String,
        required: true,
        minlength: 6,
        maxlength: 15
    },
    role: {
        type: String,
        required: true,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    createdAt: {
     type: Date, default: Date.now
     },
  updatedAt: {
     type: Date, default: Date.now 
    }


})

const User = mongoose.model('User', studentSchema);
export default User;
