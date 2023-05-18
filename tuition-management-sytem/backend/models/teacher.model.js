import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }, isPasswordChanged: {
    default: false,
    type: Boolean,
    require: true,
  },
  phone: {
    type: String,
    required: true,
  },

}, { timestamps: true });

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;