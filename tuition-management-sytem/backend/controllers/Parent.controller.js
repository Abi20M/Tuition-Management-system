import parentService from "../services/Parent.service.js";
import Parent from "../models/parent.model.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import generatePassword from "../utils/passowrdGenerator";

export const createParent = async (req, res, next) => {
  //generate random password for parent
  const autoPassword = generatePassword();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(autoPassword, salt);

  //create parent object
  const parent = new Parent({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    phone: req.body.phone,
  });

  await parentService
    .createParent(parent, autoPassword)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getParent = async (req, res, next) => {
  await parentService
    .getParent(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getAllParents = async (req, res, next) => {
  await parentService
    .getAllParents()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const updateParent = async (req, res, next) => {
  await parentService
    .updateParent(req.params.id, req.body)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const deleteParent = async (req, res, next) => {
  await parentService
    .deleteParent(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

//Parent login
export const loginParent = async (req, res, next) => {
  await parentService
    .loginParent(req.body.email, req.body.password)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getParentCount = async (req, res) => {
  await parentService
    .getParentCountService()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
    });
};

export const changeParentPassword = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

  const parentId = req.params.id;
  const password = {
    currentPassword: req.body.currentPassword,
    newPassword: hashedPassword,
  };
  await parentService
    .changeParentPassword(parentId, password)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
    });
};

//get students by parent id
export const getStudents = async (req, res, next) => {
  await parentService
    .getStudents(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getChildrenExamMarks = (req, res) => {
  console.log("hello Controller");
  console.log(req.params.id.split(","));

  const childrenIds = req.params.id.split(",");

  parentService
    .getChildrenExamMarks(childrenIds)
    .then((data) => {
      console.log(data)
      req.handleResponse.successRespond(res)(data);
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
    });
};

module.exports = {
  createParent,
  getParent,
  getAllParents,
  updateParent,
  deleteParent,
  loginParent,
  getParentCount,
  changeParentPassword,
  getStudents,
  getChildrenExamMarks,
};
