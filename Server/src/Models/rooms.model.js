import {mongoose,Schema} from 'mongoose';

const roomSchema = new Schema({
  roomCode: { type: String, required: true, unique: true },  // e.g., "R1"
  floor: { type: String },                                   // e.g., "First"
  type: { type: String, enum: ['Classroom', 'Lab', 'Smart Classroom', 'Other'], default: 'Classroom' },
});

const Rooms = mongoose.model('Room', roomSchema);
export default Rooms;