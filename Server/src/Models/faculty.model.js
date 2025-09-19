import {mongoose,Schema} from 'mongoose';

const facultySchema = new Schema({
  uid : {type : String, required : true , unique : true},
  code: { type: String, required: true}, 
  name: { type: String, required: true },               
  department: { type: String, required: true },         
});

const Faculty = mongoose.model('Faculty', facultySchema);
export default Faculty;