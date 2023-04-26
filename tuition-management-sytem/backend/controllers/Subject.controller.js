import subjectService from "../services/Subject.service";
import Subject from "../models/subject.model";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export const createSubject = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create subject object
  const subject = new Subject({
    name: req.body.name,
  });

  await subjectService
    .createSubject(subject)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getSubject = async (req, res, next) => {
  await subjectService
    .getSubject(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getAllSubjects = async (req, res, next) => {
  await subjectService
    .getAllSubjects()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const updateSubject = async (req, res, next) => {
  await subjectService
    .updateSubject(req.params.id, req.body)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const deleteSubject = async (req, res, next) => {
  await subjectService
    .deleteSubject(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

// //Parent login
// export const loginParent = async (req, res, next) => {
//   await parentService
//     .loginParent(req.body.email, res.body.password)
//     .then((data) => {
//       req.handleResponse.successRespond(res)(err);
//       next();
//     });
// };

export const getSubjectCount = async (req, res) => {
  await subjectService
    .getSubjectCountService()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
    });
};
module.exports = {
  createSubject,
  getSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
//   loginSubject,
  getSubjectCount,
};
