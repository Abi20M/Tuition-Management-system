import parent from "../models/parent.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

//generate Parent Id
const generateParentId = async () => {
  //get last parent object, if there is a parent, then return that parent object, otherwise return empty array
  const lastParentDetails = await parent.find().sort({ _id: -1 }).limit(1);
  
  //check if the result array is empty or not, if its empty then return first parent Id
  if (lastParentDetails.length == 0) {
    return "PTD-001";
  }

  //if array is not null, last parent object id
  const parentId = lastParentDetails.map((data) => {
    return data.id;
  });

  //then we get the Integer value from the last part of the ID
  const oldParentId = parseInt(parentId[0].split("-")[1]);

  const newParentId = oldParentId + 1; //then we add 1 to the past value

  //then we return the id according to below conditions
  if (newParentId >= 100) {
    return `PTD-${newParentId}`;
  } else if (newParentId >= 10) {
    return `PTD-0${newParentId}`;
  } else {
    return `PTD-00${newParentId}`;
  }
};

export const createParent = async (parentObj) => {
    const emailExists = await parent.findOne({ email: parentObj.email});
    if (emailExists) {
        throw new Error("Email already exists");

    } else{

      //generate Parent Id
      const ptdId = await generateParentId();

      //create new student obj with custom student ID
      const newParentObj = {
        id : ptdId,
        name : parentObj.name,
        email: parentObj.email,
        password : parentObj.password,
        phone: parentObj.phone,
      }
      
        return await parent
            .create(newParentObj)
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

  export const getParentCountService = async () =>{
    return await parent.countDocuments();
  }
  module.exports = {
    createParent,
    getParent,
    getAllParents,
    updateParent,
    deleteParent,
    loginParent,
    verifyParent,
    getParentCountService
  };

