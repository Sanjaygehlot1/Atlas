import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
    year: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Year', 
        required: true
    },
    day: {
        type: String, 
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        required: true
    },
    timeSlot: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'TimeSlot', 
        required: true
    },

    subjectName: {
        type: String, 
        required: true
    },               // e.g., "DBMS"
    faculty: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Faculty'
    }],
    rooms: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Room'
    }],

    lectureType: {
        type: String, 
        enum: ['Theory', 'Lab', 'Project', 'Seminar', 'Elective'], 
        default: 'Theory'
    },
    batchInfo: [{
        type: String
    }],                               // e.g., ["B1", "B2", "B3"]
    notes: {
        type: String
    },                                     // Optional remarks

    createdAt: {
        type: Date, 
        default: Date.now
    },
    updatedAt: {
        type: Date, 
        default: Date.now
    }
});

module.exports = mongoose.model('Timetable', timetableSchema);
