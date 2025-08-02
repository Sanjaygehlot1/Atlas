import { mongoose, Schema } from 'mongoose';

const lectureExceptionSchema = new Schema({
    // A reference to the original lecture in the master timetable
    timetableEntry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Timetable',
        required: true
    },
    updatedRoom : {
        type: String,
    },
    name:{
        type: String,
        required: true

    },
    class:{
        type: String,
        required: true,
    },
    faculty:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
    },
    // The specific date this exception applies to
    date: {
        type: Date,
        required: true
    },
    day:{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    // The new status for this specific lecture on this specific date
    status: {
        type: String,
        enum: ['Cancelled', 'Teacher_Absent', 'Rescheduled', 'Replaced', 'Venue_Changed'],
        required: true
    },
    // Optional notes from the teacher
    notes: {
        type: String
    }
}, { timestamps: true });

// Create a compound index to prevent duplicate exceptions for the same lecture on the same day
lectureExceptionSchema.index({ timetableEntry: 1, date: 1 }, { unique: true });

const LectureException = mongoose.model('LectureException', lectureExceptionSchema);
export default LectureException;