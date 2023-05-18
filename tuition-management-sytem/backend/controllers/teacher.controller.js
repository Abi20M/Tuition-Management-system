import Teacher from "../models/teacher.model";
import teacherServices from "../services/Teacher.service";
import bcrypt from 'bcrypt';
import generatePassword from "../utils/passowrdGenerator";

// import generatePassword from "../utils/passowrdGenerator";

//create teacher function
export const createTeacher = async (req, res, next) => {
// //genarate password
  const autoPassword = generatePassword();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(autoPassword, salt);

    // create a teacher object with details
    const teacherObj = new Teacher({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
    });

  //call to createTeacher function to create a object in the database
  await teacherServices
    .createTeacher(teacherObj,autoPassword)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    })

};

export const getStudents = async (req, res, next) => {
  const teacherId = req.params.id;

  await teacherServices
    .getStudents(teacherId)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    });
};



//get all teacher Details
export const getAllTeacher = async (req, res, next) => {
  await teacherServices
    .getAllTeacher()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    });
};

// delete a teacher
export const deleteTeacher = async (req, res, next) => {
  const id = req.params.id;

  await teacherServices
    .deleteTeacher(id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    });
};

export const editTeacher = async (req, res, next) => {
  const id = req.params.id;
  const updateDetails = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };
  await teacherServices
    .updateTeacher(id, updateDetails)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    });
};

export const getTeacherCount = async (req, res) => {
  await teacherServices.getTeacherCountService()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
    });
};

//get class count
export const getClassCount = async (req, res,next) => {

  const teacherName = req.params.name;
  await teacherServices.getClassCountService(teacherName)
    .then((data) => {
      console.log(data)

      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    });
};
  
  export const teacherLogin = async (req, res, next) => {
    await teacherServices.loginTeacher(req.body.email, req.body.password)
      .then((data) => {
        req.handleResponse.successRespond(res)(data);
        next();
      })
      .catch((error) => {
        req.handleResponse.errorRespond(res)(error);
      });
  };

  export const getAllClasses = async (req, res, next) => {
    const teacherId = req.params.id;
  
    await teacherServices
      .getAllClasses(teacherId)
      .then((data) => {
        req.handleResponse.successRespond(res)(data);
        next();
      })
      .catch((error) => {
        req.handleResponse.errorRespond(res)(error);
        next();
      });
  };

  // change password controller
  const changeTeacherPassword = async(req,res) =>{
    const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

  const teacherId = req.params.id;
  const password = {
    currentPassword: req.body.currentPassword,
    newPassword: hashedPassword,
  };

  await teacherServices
    .changeTeacherPassword(teacherId, password)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
    }); 
  }

  
  module.exports = {
    createTeacher,
    getAllTeacher,
    deleteTeacher,
    editTeacher,
    teacherLogin,
    getTeacherCount,
    getStudents,
    getAllClasses,
    getClassCount,
    changeTeacherPassword
}