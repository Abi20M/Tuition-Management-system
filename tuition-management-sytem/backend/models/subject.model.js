import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  id: {
    type: String,
    required : true,
    unique : true,
  },
  name: {
    type: String,
    required: true,
  },  
},{timestamps:true});

const Subject = mongoose.model("Subjects", SubjectSchema);

export default Subject;
