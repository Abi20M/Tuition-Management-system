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

  await classServices
    .deleteClass(id)
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
    .editClassDetails(classId, classObj)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    });
};

module.exports = {
  createClass,
  getAllClasses,
  deleteClass,
  getAllHallDetails,
  editClassDetails,
};
