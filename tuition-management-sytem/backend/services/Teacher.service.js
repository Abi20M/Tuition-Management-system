import teacher from "../models/teacher.model";
import Class from "../models/class.model";
import student from "../models/student.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

//generate Teacher Id
const generateTeacherId = async () => {
  //get last class object, if there is a teacher, then return that class object, otherwise return empty array
  const lastTeacherDetails = await teacher.find().sort({ _id: -1 }).limit(1);
  
  //check if the result array is empty or not, if its empty then return first Teacher Id
  if (lastTeacherDetails.length == 0) {
    return "TCH-001";
  }

  //if array is not null, last class object id
  const TeacherId = lastTeacherDetails.map((data) => {
    return data.id;
  });

  //then we get the Integer value from the last part of the ID
  const oldTeacherId = parseInt(TeacherId[0].split("-")[1]);

  const newTeacherId = oldTeacherId + 1; //then we add 1 to the past value

  //then we return the id according to below conditions
  if (newTeacherId >= 100) {
    return `TCH-${newTeacherId}`;
  } else if (newTeacherId >= 10) {
    return `TCH-0${newTeacherId}`;
  } else {
    return `TCH-00${newTeacherId}`;
  }
};

export const createTeacher = async (teacherObj) => {
  const emailExists = await teacher.findOne({ email: teacherObj.email });
  if (emailExists) {
    throw new Error("Email already exists");
  } else {

    const customTeacherId = await generateTeacherId();

    const newTeacherObj ={
      id : customTeacherId,
      name:  teacherObj.name,
      email:  teacherObj.email,
      password:  teacherObj.password,
      phone: teacherObj.phone,
    }
    return await teacher
      .create(newTeacherObj)
      .then(async (data) => {
        await data.save();
        return data;
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }
};

export const getTeacher = async (id) => {
  return await teacher
    .findById(id)
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Teacher not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const getAllTeacher = async () => {
  return await teacher
    .find()
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const updateTeacher = async (id, teacherObj) => {
  return await teacher
    .findByIdAndUpdate(id, teacherObj, { new: true })
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Teacher not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const deleteTeacher = async (id) => {
  return await teacher
    .findByIdAndDelete(id)
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Teacher not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const loginTeacher = async (email, password) => {
  return await teacher
    .findOne({ email })
    .then((data) => {
      if (data) {
        if (bcrypt.compareSync(password, data.password)) {
          const accessToken = jwt.sign(
            {
              _id: data._id,
              email: data.email,
              role: "teacher",
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

export const verifyTeacher = async (token) => {
  return jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      throw new Error("Invalid token");
    } else {
      return decoded;
    }
  });
};

export const getStudents = async (id) => {
  //get classes from class model where teacher id is equal to id
  let students = [];
  return await classes
    .find({ teacher: id })
    .then(async (data) => {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          //loop through data.students
          for (let j = 0; j < data[i].students.length; j++) {
            //get student from student model where student id is equal to data.students[j]
            await student
              .findById(data[i].students[j])
              .then((studentData) => {
                if (studentData) {
                  students.push(studentData);
                }
              })
              .catch((err) => {
                throw new Error(err.message);
              });
          }
        }
        return students;
      } else {
        throw new Error("Teacher not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const getTeacherCountService = async () =>{
  return await teacher.countDocuments();
}
module.exports = {
  createTeacher,
  getTeacher,
  getAllTeacher,
  updateTeacher,
  deleteTeacher,
  loginTeacher,
  verifyTeacher,
  getStudents,
  getTeacherCountService
};



// my 
// import Teacher from "../models/teacher.model";
// import classes from "../models/classes.model";
// import student from "../models/student.model";


// //generate teacher Id
// const generateTeacherId = async () => {
//   //get last teacher object, if there is a teacher, then return that teacher object, otherwise return empty array
//   const lastTeacherDetails = await Teacher.find().sort({ _id: -1 }).limit(1);
  
//   //check if the result array is empty or not, if its empty then return first Teacher Id
//   if (lastTeacherDetails.length == 0) {
//     return "Te-001";
//   }

//   //if array is not null, last teacher object id
//   const TeacherId = lastTeacherDetails.map((data) => {
//     return data.id;
//   });

//   //then we get the Integer value from the last part of the ID
//   const oldTeacherId = parseInt(TeacherId[0].split("-")[1]);

//   const newTeacherId = oldTeacherId + 1; //then we add 1 to the past value

//   //then we return the id according to below conditions
//   if (newTeacherId >= 100) {
//     return `T-${newTeacherId}`;
//   } else if (newTeacherId >= 10) {
//     return `T-0${newTeacherId}`;
//   } else {
//     return `T-00${newTeacherId}`;
//   }
// };

// export const createTeacher = async (teacherobj) => {
//   //generate the teacher ID  
//   const id = await generateTeacherId();

// //create a new object by adding generated ID
//   const newTeacherObj = {
//     id : id,
//     name : teacherobj.name,
//     email : teacherobj.email,
//     phone : teacherobj.phone,

//   }

//   return await Teacher.create(newTeacherObj).then(async (obj) =>{
//       await obj.save();
//       return obj;
//   }).catch((error) =>{
//     throw new Error(error.message);
//   })
// };

// export const getAllTeacher = async () =>{
//   return await Teacher.find();
  
// }

// export const deleteTeacher = async(id) =>{
//   return await Teacher.findByIdAndDelete(id);
// }
// export const editTeacher = async (id, updatedTeacher) => {

//     console.log(id);
//     console.log(updatedTeacher);
//     return await Teacher.findByIdAndUpdate(id, updatedTeacher, { new: true });
//   };
  



// module.exports = {
// createTeacher,
// getAllTeacher,
// deleteTeacher,
// editTeacher,
// };


