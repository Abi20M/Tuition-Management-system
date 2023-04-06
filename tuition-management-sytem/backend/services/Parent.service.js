import parent from "../models/parent.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const createParent = async (parentObj) => {
    const emailExists = await parent.findOne({ email: parentObj.email});
    if (emailExists) {
        throw new Error("Email already exists");

    } else{
        return await parent
            .create(parentObj)
            .then(async (data) => {
                await data.save();
                return data;
            })
            .catch((err) => {
                throw new Error(err.message);
            });
    }
};

export const getParent = async (id) => {
    return await parent
        .findById(id)
        .then((data) => {
            if(data) {
                    return data;
                }else {
                    throw new Error("Parent not found");
                }
        })
        .catch((err) => {
            throw new Error(err.message);
        });
};

export const getAllParents = async () => {
    return await parent
        .find()
        .then((data) => {
            return data;
        })
        .catch((err) => {
            throw new Error(err.message);
        });
};

export const updateParent = async (id, parentObj) => {
    return await parent
      .findByIdAndUpdate(id, parentObj, { new: true })
      .then((data) => {
        if (data) {
          return data;
        } else {
          throw new Error("Parent not found");
        }
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  };

  export const deleteParent = async (id) => {
    return await parent
      .findByIdAndDelete(id)
      .then((data) => {
        if (data) {
          return data;
        } else {
          throw new Error("Parent not found");
        }
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  };

  //Login parent
  export const loginParent = async (email, password) => {
    return await parent
      .findOne({ email })
      .then((data) => {
        if (data) {
          if (bcrypt.compareSync(password, data.password)) {
            const accessToken = jwt.sign(
              {
                _id: data._id,
                email: data.email,
                role: "parent",
              },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: "1d",
              }
            );
            //create response object
            const responseObj = {
              _id: data._id,
              name: data.name,
              email: data.email,
              accessToken: accessToken,
            };
            return responseObj;
          } else {
            throw new Error("Invalid Login Credentials");
          }
        } else {
          throw new Error("Invalid Login Credentials");
        }
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  };

  export const verifyParent = async (token) => {
    return jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        throw new Error("Invalid token");
      } else {
        return decoded;
      }
    });
  };

  module.exports = {
    createParent,
    getParent,
    getAllParents,
    updateParent,
    deleteParent,
    loginParent,
    verifyParent,
    
  };

