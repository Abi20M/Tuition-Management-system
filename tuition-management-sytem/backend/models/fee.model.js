import mongoose from "mongoose";

const FeeSchema = new mongoose.Schema({
  id: {
    type: String,
    required : true,
    unique : true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: false,
    default: 'Not Paid'
  },  
},{timestamps:true});

const Fee = mongoose.model("Fees", FeeSchema);

export default Fee;
