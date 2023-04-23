import AdminService from "../services/Admin.service";
import Admin from "../models/admin.model";
import bcrypt from "bcrypt";

export const createAdmin = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const admin = new Admin({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    telephone: req.body.telephone,
    address: req.body.address,
  });

  await AdminService.createAdmin(admin)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const loginAdmin = async (req, res, next) => {
  await AdminService.adminLogin(req.body.email, req.body.password)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
    });
};

export const getAdmin = async (req, res, next) => {
  await AdminService.getAdmin(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getAllAdmins = async (req, res, next) => {
  await AdminService.getAllAdmins()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const updateAdmin = async (req, res, next) => {
  await AdminService.updateAdmin(req.params.id, req.body)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const deleteAdmin = async (req, res, next) => {
  await AdminService.deleteAdmin(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getAdminCount = async (req, res) => {
  await AdminService.getAdminCountService()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
    });
};

export const verifyAdmin = async (req, res, next) => {
  await AdminService.verifyAdmin(req.body.token)
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
  createAdmin,
  getAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  getAdminCount,
};
