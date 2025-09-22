import { mongoose, Schema } from 'mongoose';

const lectureSchema = new Schema({
  timetableRef: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timetable',
  },
  year: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Year',
    required: true,
  },
  class: { 
    type: String,
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
    enum: ['Theory', 'Lab', 'Project', 'Seminar', 'Elective', 'Break','Other'],
    default: 'Theory',
  },
  timeSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimeSlot',
    required: true,
  },
  date: {   // key difference from template
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Cancelled', 'Venue_Changed'],
    default: 'Scheduled',
  },
  updatedRoom : {
    type : String,
    default : null
  }
}, { timestamps: true });

lectureSchema.index({ class: 1, date: 1 });

const Lecture = mongoose.model('Lecture', lectureSchema);
export { Lecture };
