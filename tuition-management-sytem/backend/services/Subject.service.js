import subject from "../models/subject.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

//generate Subject Id
const generateSubjectId = async () => {
  //get last subject object, if there is a subject, then return that subject object, otherwise return empty array
  const lastSubjectDetails = await subject.find().sort({ _id: -1 }).limit(1);
  
  //check if the result array is empty or not, if its empty then return first subject Id
  if (lastSubjectDetails.length == 0) {
    return "SUB-001";
  }

  //if array is not null, last subject object id
  const subjectId = lastSubjectDetails.map((data) => {
    return data.id;
  });

  //then we get the Integer value from the last part of the ID
  const oldSubjectId = parseInt(subjectId[0].split("-")[1]);

  const newSubjectId = oldSubjectId + 1; //then we add 1 to the past value

  //then we return the id according to below conditions
  if (newSubjectId >= 100) {
    return `SUB-${newSubjectId}`;
  } else if (newSubjectId >= 10) {
    return `SUB-0${newSubjectId}`;
  } else {
    return `SUB-00${newSubjectId}`;
  }
};

export const createSubject = async (subjectObj) => {
    const emailExists = await subject.findOne({ email: subjectObj.email});
    if (emailExists) {
        throw new Error("Email already exists");

    } else{

      //generate Subject Id
      const subId = await generateSubjectId();

      //create new Subject obj with custom Subject ID
      const newSubjectObj = {
        id : subId,
        name : subjectObj.name,
      }
      
        return await subject
            .create(newSubjectObj)
            .then(async (data) => {
                await data.save();
                return data;
            })
            .catch((err) => {
                throw new Error(err.message);
            });
    }
};

export const getSubject = async (id) => {
    return await subject
        .findById(id)
        .then((data) => {
            if(data) {
                    return data;
                }else {
                    throw new Error("Subject not found");
                }
        })
        .catch((err) => {
            throw new Error(err.message);
        });
};

export const getAllSubjects = async () => {
    return await subject
        .find()
        .then((data) => {
            return data;
        })
        .catch((err) => {
            throw new Error(err.message);
        });
};

export const updateSubject = async (id, subjectObj) => {
    return await subject
      .findByIdAndUpdate(id, subjectObj, { new: true })
      .then((data) => {
        if (data) {
          return data;
        } else {
          throw new Error("Subject not found");
        }
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  };

  export const deleteSubject = async (id) => {
    return await subject
      .findByIdAndDelete(id)
      .then((data) => {
        if (data) {
          return data;
        } else {
          throw new Error("Subject not found");
        }
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  };

//   //Login subject
//   export const loginSubject = async (email, password) => {
//     return await subject
//       .findOne({ email })
//       .then((data) => {
//         if (data) {
//           if (bcrypt.compareSync(password, data.password)) {
//             const accessToken = jwt.sign(
//               {
//                 _id: data._id,
//                 email: data.email,
//                 role: "subject",
//               },
//               process.env.ACCESS_TOKEN_SECRET,
//               {
//                 expiresIn: "1d",
//               }
//             );
//             //create response object
//             const responseObj = {
//               _id: data._id,
//               name: data.name,
//               email: data.email,
//               accessToken: accessToken,
//             };
//             return responseObj;
//           } else {
//             throw new Error("Invalid Login Credentials");
//           }
//         } else {
//           throw new Error("Invalid Login Credentials");
//         }
//       })
//       .catch((err) => {
//         throw new Error(err.message);
//       });
//   };

//   export const verifySubject = async (token) => {
//     return jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
//       if (err) {
//         throw new Error("Invalid token");
//       } else {
//         return decoded;
//       }
//     });
//   };

  export const getSubjectCountService = async () =>{
    return await subject.countDocuments();
  }
  module.exports = {
    createSubject,
    getSubject,
    getAllSubjects,
    updateSubject,
    deleteSubject,
    // loginSubject,
    // verifySubject,
    getSubjectCountService
  };

