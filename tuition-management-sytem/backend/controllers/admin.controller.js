import AdminService from "../services/Admin.service";

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
