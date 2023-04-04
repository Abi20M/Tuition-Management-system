import Admin from "../models/admin.model";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";

const adminLogin = async (email, password) => {
  return await Admin.findOne({ email }).then((data) => {
    if (data) {
      if (password === data.password) {

        //create access token if the password is correct
        const acessToken = jwt.sign(
          {
            id: data._id,
            email: data.email,
            role: "admin",
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );
        //create new Object
        const newAdminObj = {
          _id: data._id,
          adminId : data.adminId,
          email: data.email,
          name: data.name,
          accessToken: acessToken,
        };
        return newAdminObj;//return new Object with accessToken

      } else {
        throw new Error("Password is mismatch");
      }
    } else {
      throw new Error("User credentials are invalid");
    }
  });
};

module.exports = {
  adminLogin,
};
