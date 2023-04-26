import feeService from "../services/Fee.service";
import Fee from "../models/fee.model";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export const createFee = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create fee object
  const fee = new Fee({
    name: req.body.name,
  });

  await feeService
    .createFee(fee)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getFee = async (req, res, next) => {
  await feeService
    .getFee(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getAllFees = async (req, res, next) => {
  await feeService
    .getAllFees()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const updateFee = async (req, res, next) => {
  await feeService
    .updateFee(req.params.id, req.body)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const deleteFee = async (req, res, next) => {
  await feeService
    .deleteFee(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};


export const getFeeCount = async (req, res) => {
  await feeService
    .getFeeCountService()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
    });
};
module.exports = {
  createFee,
  getFee,
  getAllFees,
  updateFee,
  deleteFee,
  getFeeCount,
};
