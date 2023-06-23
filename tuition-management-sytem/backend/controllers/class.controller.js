import Class from "../models/class.model";
import classServices from "../services/Class.service";

//create class function
export const createClass = async (req, res, next) => {
  // create a class object with details
  const classObj = new Class({
    name: req.body.name,
    teacher: req.body.teacher,
    subject: req.body.subject,
    day: req.body.day,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    venue: req.body.venue,
  });

  //call to createClass function to create a object in the database
  await classServices
    .createClass(classObj)
    .then((data) => {
      console.log("then" + data);
      req.handleResponse.successRespond(res)(data);
    })
    .catch((error) => {
      console.log(error.message);
      req.handleResponse.errorRespond(res)(error.message);
    });
};

// Get class by id
export const getEnrolledStudentDetails = async (req, res, next) => {
  const classId = req.params.id;

  await classServices
    .getEnrolledStudentsData(classId)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    });
};

//get all class Details
export const getAllClasses = async (req, res, next) => {
  await classServices
    .getAllClasses()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    });
};

// delete a class
export const deleteClass = async (req, res, next) => {
  const id = req.params.id;
  const cusId = req.params.cusId;
  const day = req.params.day;
  const hall = req.params.hall;
  const startTime = req.params.startTime;
  const endTime = req.params.endTime;

  await classServices
    .deleteClass(id, cusId, day, hall, startTime, endTime)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    });
};

export const getAllHallDetails = async (req, res, next) => {
  await classServices
    .getAllHallDetails()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    });
};

export const editClassDetails = async (req, res, next) => {
  const classId = req.params.id;
  const currentStartTime = req.params.cuStartTime;
  const currentEndTime = req.params.cuEndTime;
  const classCustomId = req.body.id;

  const classObj = {
    name: req.body.name,
    teacher: req.body.teacher,
    subject: req.body.subject,
    day: req.body.day,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    venue: req.body.venue,
  };

  await classServices
    .editClassDetails(
      classId,
      classCustomId,
      classObj,
      currentStartTime,
      currentEndTime
    )
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error.message);
      next();
    });
};

export const enrollStudent = async (req, res, next) => {
  const enrollStudent = {
    studentID: req.body.studentid,
    studentName: req.body.studentname,
    studentEmail: req.body.studentemail,
    classId: req.body.classid,
    className: req.body.classname,
  };

  classServices
    .enrollStudent(enrollStudent)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    });
};

export const unEnrollStudent = (req, res, next) => {
  const stdId = req.body.studentId;
  const studentName = req.body.studentName;
  const studentEmail = req.body.studentEmail;
  const classId = req.body.classId;
  const className = req.body.className;

  classServices
    .unEnrollStudent(stdId, studentName, studentEmail, classId, className)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    });
};

export const getHallSchedule = (req, res) => {
  classServices
    .getHallScheduleService()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
    });
};

export const getClassByDay = (req, res) => {

  const day = req.params.day;

  classServices
    .getClassByDay(day)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error.message);
    });
};
module.exports = {
  createClass,
  getAllClasses,
  deleteClass,
  getAllHallDetails,
  editClassDetails,
  enrollStudent,
  getEnrolledStudentDetails,
  unEnrollStudent,
  getHallSchedule,
  getClassByDay,
};
