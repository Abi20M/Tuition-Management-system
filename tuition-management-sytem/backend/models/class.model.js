import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique : true,
  },
  teacher : {
    type : String,
    required : true
  },
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  venue:{
    type:String,
    required : true
  },
  endTime:{
    type: String,
    required : true
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
},{timestamps:true});

const Class = mongoose.model("Classes", classSchema);

export default Class;
