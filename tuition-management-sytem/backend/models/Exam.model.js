import { model, Schema } from "mongoose";

const ExamSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
  },
  examId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  class: {
    type: Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  status: {
    type: String,
    default: "Scheduled",
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  attendance: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
      status: {
        type: Boolean,
        default: false,
      },
    },
  ],
  marks: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
      marks: {
        type: Number,
        default: 0,
      },
    },
  ],
});

export default model("Exam", ExamSchema);
