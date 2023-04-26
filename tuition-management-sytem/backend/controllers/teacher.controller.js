import Teacher from "../models/teacher.model";
import teacherServices from "../services/Teacher.service";
import bcrypt from 'bcrypt';

//create teacher function
export const createTeacher = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create a teacher object with details
    const teacherObj = new Teacher({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
    });

  //call to createTeacher function to create a object in the database
  await teacherServices
    .createTeacher(teacherObj)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    })

};

//get all teacher Details
export const getAllTeacher = async (req, res, next) => {
  await teacherServices
    .getAllTeacher()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    });
};

// delete a teacher
export const deleteTeacher = async (req, res, next) => {
  const id = req.params.id;

  await teacherServices
    .deleteTeacher(id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    });
};

export const editTeacher = async (req, res, next) => {
  const id = req.params.id;
  const updateDetails = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };
  await teacherServices
    .updateTeacher(id, updateDetails)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    });
};

export const getTeacherCount = async (req, res) => {
  await teacherServices.getTeacherCountService()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
    });
};

  
  export const teacherLogin = async (req, res, next) => {
    await teacherServices.loginTeacher(req.body.email, req.body.password)
      .then((data) => {
        req.handleResponse.successRespond(res)(data);
        next();
      })
      .catch((error) => {
        req.handleResponse.errorRespond(res)(error);
      });
  };
  
  
  module.exports = {
    createTeacher,
    getAllTeacher,
    deleteTeacher,
    editTeacher,
    teacherLogin,
    getTeacherCount,
}