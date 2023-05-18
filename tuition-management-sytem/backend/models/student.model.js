import { model, Schema } from "mongoose";

const StudentSchema = new Schema({
  id: {
    type: String,
    required : true,
    unique : true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPasswordChanged: {
    default : false,
    type: Boolean,
    require : true,
  },
  phone: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "Parent",
  },

  //student fees calculation
  amount: {
    type: String,
    required: false,
    default: '00.00'
  },
  status: {
    type: String,
    required: false,
    default: 'Not-Paid'
  },
});

export default model("Student", StudentSchema);
