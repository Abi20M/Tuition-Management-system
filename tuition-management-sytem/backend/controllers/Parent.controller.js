import parentService from "../services/Parent.service.js";
import Parent from "../models/parent.model.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export const createParent = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create parent object
  const parent = new Parent({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
  });

  await parentService
    .createParent(parent)
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
    .loginParent(req.body.email, res.body.password)
    .then((data) => {
      req.handleResponse.successRespond(res)(err);
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
module.exports = {
  createParent,
  getParent,
  getAllParents,
  updateParent,
  deleteParent,
  loginParent,
  getParentCount,
};
