import {mongoose,Schema} from 'mongoose';

const YearSchema = new Schema({
  name: { type: String, required: true, unique: true }, // e.g., "SE IT 1"
  year: { type: String, enum: ['FE','SE', 'TE', 'BE'], required: true },
  division: { type: String, required: true },           // e.g., "1", "2"
  department: { type: String, required: true },         // e.g., "INFT"
});

const Year = mongoose.model('Year', YearSchema);
export default Year;