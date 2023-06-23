import attendanceService from "../services/attendance.service";

export const getStudentDetailsFromAttendance = (req, res) => {
  const classId = req.params.id;

  attendanceService
    .getStudentDetailsFromAttendance(classId)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error.message);
    });
};

export const updateStudentsAttendance = (req, res) => {

  // attendance object
  const attendanceDetails = {
    classId : req.body.classId,
    students : JSON.parse(req.body.students),
    week : req.body.week
  }

  attendanceService
    .updateStudentsAttendance(attendanceDetails)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error.message);
    });
};

module.exports = {
  getStudentDetailsFromAttendance,
  updateStudentsAttendance,
};
