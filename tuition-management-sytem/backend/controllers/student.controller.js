import studentService from "../services/student.service";
import Student from "../models/student.model";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const createStudent = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

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
    .createStudent(studentObj)
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

module.exports = {
  createStudent,
  getStudent,
  getAllStudents,
  updateStudent,
  deleteStudent,
  loginStudent,
  getExamsByStudentId,
};
