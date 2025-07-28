import {mongoose, Schema} from 'mongoose';

const timeSlotSchema = new Schema({
  label: { type: String, required: true },            // e.g., "Slot 1"
  startTime: { type: String, required: true },        // "09:05"
  endTime: { type: String, required: true },          // "10:05"
});

const timeSlot = mongoose.model('TimeSlot', timeSlotSchema);
export default timeSlot;
