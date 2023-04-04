import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique : true,
  },
  parent : {
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

const Parent = mongoose.model("Parents", parentSchema);

export default Parent;
