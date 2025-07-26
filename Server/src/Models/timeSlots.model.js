import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  label: { type: String, required: true },            // e.g., "Slot 1"
  startTime: { type: String, required: true },        // "09:05"
  endTime: { type: String, required: true },          // "10:05"
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
