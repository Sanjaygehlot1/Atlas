import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true },  // e.g., "R1"
  floor: { type: String },                                   // e.g., "First"
  type: { type: String, enum: ['Classroom', 'Lab', 'Smart Classroom', 'Other'], default: 'Classroom' },
});

module.exports = mongoose.model('Room', roomSchema);
