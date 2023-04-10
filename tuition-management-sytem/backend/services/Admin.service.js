import Admin from "../models/admin.model";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";



export const createAdmin = async (adminObj) => {
  const emailExists = await admin.findOne({ email: adminObj.email });
  if (emailExists) {
    throw new Error("Email already exists");
  } else {
    return await admin
      .create(adminObj)
      .then(async (data) => {
        await data.save();
        return data;
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }
};

export const getAdmin = async (id) => {
  return await admin
    .findById(id)
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Admin not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const getAllAdmins = async () => {
  return await admin
    .find()
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const updateAdmin = async (id, adminObj) => {
  return await admin
    .findByIdAndUpdate(id, adminObj, { new: true })
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Admin not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const deleteAdmin = async (id) => {
  return await admin
    .findByIdAndDelete(id)
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Admin not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

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
  createAdmin,
  getAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
};
