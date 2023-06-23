import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classes",
      required: true,
      unique: true,
    },
    students: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
        Attendance: {
          type: [],
          default: [0, 0, 0, 0],
        },
      },
    ],
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", AttendanceSchema);

export default Attendance;
