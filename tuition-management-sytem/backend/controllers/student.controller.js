import studentService from "../services/student.service";
import Student from "../models/student.model";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generatePassword from "../utils/passowrdGenerator";

export const createStudent = async (req, res, next) => {
  // generate random password for student
  const autoPassword = generatePassword();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(autoPassword, salt);

  const studentObj = new Student({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    phone: req.body.phone,
    birthDate: req.body.birthDate,
    school: req.body.school,
    grade: req.body.grade,
    address: req.body.address,
    gender: req.body.gender,
    parent: req.body.parent,
  });

  await studentService
    .createStudent(studentObj, autoPassword)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getStudent = async (req, res, next) => {
  await studentService
    .getStudent(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getAllStudents = async (req, res, next) => {
  await studentService
    .getAllStudents()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const updateStudent = async (req, res, next) => {
  await studentService
    .updateStudent(req.params.id, req.body)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const deleteStudent = async (req, res, next) => {
  await studentService
    .deleteStudent(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

//student login
export const loginStudent = async (req, res, next) => {
  await studentService
    .loginStudent(req.body.email, req.body.password)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getExamsByStudentId = async (req, res, next) => {
  await studentService
    .getExamsByStudentId(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getStudentCount = async (req, res) => {
  await studentService
    .getStudentCountService()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
    });
};

export const changeStudentPassword = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

  const studentId = req.params.id;
  const password = {
    currentPassword: req.body.currentPassword,
    newPassword: hashedPassword,
  };

  await studentService
    .changeStudentPassword(studentId, password)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
    });
};

module.exports = {
  createStudent,
  getStudent,
  getAllStudents,
  updateStudent,
  deleteStudent,
  loginStudent,
  getExamsByStudentId,
  getStudentCount,
  changeStudentPassword,
};
