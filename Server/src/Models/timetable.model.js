
import { mongoose, Schema } from 'mongoose';

const timetableSchema = new Schema({
  year: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Year',
    required: true,
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  timeSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimeSlot',
    required: true,
  },
  subjectName: {
    type: String,
    required: true,
  },
  faculty: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
  }],
  rooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  }],
  lectureType: {
    type: String,
    enum: ['Theory', 'Lab', 'Project', 'Seminar', 'Elective', 'Break'],
    default: 'Theory',
  },
  class: { 
    type: String,
    required: true,
  },
  entryHash: { 
    type: String,
    required: true,
    unique: true, 
  },
}, { timestamps: true });

const Timetable = mongoose.model('Timetable', timetableSchema);
export default Timetable;