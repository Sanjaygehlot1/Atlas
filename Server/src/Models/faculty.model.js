import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // e.g., "SK"
  name: { type: String, required: true },               // Full name
  department: { type: String, required: true },         // e.g., "INFT"
});

module.exports = mongoose.model('Faculty', facultySchema);
