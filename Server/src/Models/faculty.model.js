import {mongoose,Schema} from 'mongoose';

const facultySchema = new Schema({
  code: { type: String, required: true, unique: true }, 
  name: { type: String, required: true },               
  department: { type: String, required: true },         
});

const Faculty = mongoose.model('Faculty', facultySchema);
export default Faculty;