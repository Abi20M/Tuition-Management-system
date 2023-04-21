import admin from "../models/admin.model";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";

//generate Admin Id
const generateAdminId = async () => {
  //get last class object, if there is a class, then return that class object, otherwise return empty array
  const lastAdminDetails = await admin.find().sort({ _id: -1 }).limit(1);

  //check if the result array is empty or not, if its empty then return first Admin Id
  if (lastAdminDetails.length == 0) {
    return "ADM-001";
  }

  //if array is not null, last class object id
  const AdminId = lastAdminDetails.map((data) => {
    return data.id;
  });

  //then we get the Integer value from the last part of the ID
  const oldAdminId = parseInt(AdminId[0].split("-")[1]);

  const newAdminId = oldAdminId + 1; //then we add 1 to the past value

  //then we return the id according to below conditions
  if (newAdminId >= 100) {
    return `ADM-${newAdminId}`;
  } else if (newAdminId >= 10) {
    return `ADM-0${newAdminId}`;
  } else {
    return `ADM-00${newAdminId}`;
  }
};

export const createAdmin = async (adminObj) => {
  const emailExists = await admin.findOne({ email: adminObj.email });
  if (emailExists) {
    throw new Error("Email already exists");
  } else {
    //generate the Class ID
    const id = await generateAdminId();

    const newAdminObj = {
      name: adminObj.name,
      id: id,
      email: adminObj.email,
      password: adminObj.password,
      telephone: adminObj.telephone,
      address: adminObj.address,
    };

    return await admin
      .create(newAdminObj)
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
  return await admin.findOne({ email }).then((data) => {
    if (data) {
      if (bcrypt.compareSync(password, data.password)) {
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
          adminId: data.adminId,
          email: data.email,
          name: data.name,
          telephone: data.telephone,
          address: data.address,
          accessToken: acessToken,
        };
        return newAdminObj; //return new Object with accessToken
      } else {
        throw new Error("Password is mismatch");
      }
    } else {
      throw new Error("User credentials are invalid");
    }
  });
};

export const getAdminCountService = async () => {
   return await admin
    .countDocuments()
    .then((data) => {
      return data;
    })
    .catch((error) =>{
      throw new Error(error.message);
    });
    
};

module.exports = {
  adminLogin,
  createAdmin,
  getAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  getAdminCountService,
};
