import Attendance from "../models/Attendance.model";

export const getStudentDetailsFromAttendance = async (classId) => {
  return await Attendance.find({ classId: classId })
    .populate("students.studentId")
    .then((data) => {
      return data[0].students;
    })
    .catch((error) => {
      console.log(error);
      throw new Error(
        "Something went wrong while fetching attendance of the students"
      );
    });
};

export const updateStudentsAttendance = async (attendanceDetails) => {
  await Attendance.find({ classId: attendanceDetails.classId })
    .then(async (data) => {
      //asssign class to a temporirary variable
      const tempClass = data[0];

      tempClass.students.map((student) => {
        attendanceDetails.students.map((presentStudent) => {
          if (student.studentId.toString() === presentStudent) {
            student.Attendance[attendanceDetails.week] = 1;
          }
        });
      });

      await tempClass.save();

      // await Attendance.deleteOne({classId : attendanceDetails.classId}).then(async (data)=>{
      //     await Attendance.create(tempClass).then((updatedClass) =>{
      //         updatedClass.save();
      //     })
      // })
    })
    .catch((error) => {
      console.log(error);
      throw new Error("Something went wrong while submitting Attendance!");
    });
};

module.exports = {
  getStudentDetailsFromAttendance,
  updateStudentsAttendance,
};
