import student from "../models/student.model";
// import exam from "../models/Exam.model";
// import classes from "../models/Classes.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
// import ClassesModel from "../models/Classes.model";

export const createStudent = async (studentObj) => {
  const emailExists = await student.findOne({ email: studentObj.email });
  if (emailExists) {
    throw new Error("Email already exists");
  } else {
    return await student
      .create(studentObj)
      .then(async (data) => {
        await data.save();
        return data;
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }
};

export const getStudent = async (id) => {
  return await student
    .findById(id)
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Student not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const getAllStudents = async () => {
  return await student
    .find()
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

// export const updateStudent = async (id, studentObj) => {
//   return await student
//     .findByIdAndUpdate(id, studentObj, { new: true })
//     .then((data) => {
//       if (data) {
//         return data;
//       } else {
//         throw new Error("Student not found");
//       }
//     })
//     .catch((err) => {
//       throw new Error(err.message);
//     });
// };

// export const deleteStudent = async (id) => {
//   return await student
//     .findByIdAndDelete(id)
//     .then((data) => {
//       if (data) {
//         return data;
//       } else {
//         throw new Error("Student not found");
//       }
//     })
//     .catch((err) => {
//       throw new Error(err.message);
//     });
// };

// export const loginStudent = async (email, password) => {
//   return await student
//     .findOne({ email })
//     .then((data) => {
//       if (data) {
//         if (bcrypt.compareSync(password, data.password)) {
//           const accessToken = jwt.sign(
//             {
//               _id: data._id,
//               email: data.email,
//               role: "student",
//             },
//             process.env.ACCESS_TOKEN_SECRET,
//             {
//               expiresIn: "1d",
//             }
//           );
//           //create response object
//           const responseObj = {
//             _id: data._id,
//             name: data.name,
//             email: data.email,
//             accessToken: accessToken,
//           };
//           return responseObj;
//         } else {
//           throw new Error("Invalid Login Credentials");
//         }
//       } else {
//         throw new Error("Invalid Login Credentials");
//       }
//     })
//     .catch((err) => {
//       throw new Error(err.message);
//     });
// };

export const verifyStudent = async (token) => {
  return jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      throw new Error("Invalid token");
    } else {
      return decoded;
    }
  });
};

// export const getExamsByStudentId = async (id) => {
//   let allExams = await exam.find();
//   //check if student id is in marks array
//   let studentExams = allExams.filter((exam) => {
//     return exam.marks.some((mark) => {
//       return mark.id == id;
//     });
//   });
//   return studentExams;
// };

module.exports = {
  createStudent,
  getStudent,
  getAllStudents,
//   updateStudent,
//   deleteStudent,
//   loginStudent,
//   verifyStudent,
//   getExamsByStudentId,
};
