import jwt from "jsonwebtoken";
import Admin from "../models/admin.model";
import Teacher from "../models/teacher.model";


import Student from "../models/student.model";
import Parent from "../models/parent.model";

export const adminProtect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      if (decoded.role != "admin") {
        return res
          .status(401)
          .json({ message: "Not authorized to access this route" });
      } else {
        req.admin = await Admin.findById(decoded.id).select("password");
        next();
      }
    } catch (error) {
      req.handleResponse.unauthorizedRespond(res)(
        "Not authorized to access this route"
      );
    }
  }
  if (!token) {
    req.handleResponse.unauthorizedRespond(res)(
      "Not authorized to access this route"
    );
  }
};

export const adminOrTeacherProtect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decoded.role !== "admin" && decoded.role !== "teacher") {
        return res
          .status(401)
          .json({ message: "Not authorized to access this route" });
      } else {
        next();
      }
    } catch (error) {
      res.status(401);
      req.handleResponse.unauthorizedRespond(res)(
        "Not authorized to access this route"
      );
    }
  }
  if (!token) {
    res.status(401);
    req.handleResponse.unauthorizedRespond(res)(
      "Not authorized to access this route"
    );
  }
};

export const studentProtect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decoded.role != "student") {
        return res
          .status(401)
          .json({ message: "Not authorized to access this route" });
      } else {
        req.student = await Student.findById(decoded._id).select("password");
        next();
      }
    } catch (error) {
      req.handleResponse.unauthorizedRespond(res)(
        "Not authorized to access this route"
      );
    }
  }
  if (!token) {
    req.handleResponse.unauthorizedRespond(res)(
      "Not authorized to access this route"
    );
  }
};


//teacher protect
export const teacherProtect = async (req,res,next) =>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            if(decoded.role != 'teacher'){
                return res.status(401).json({ message: "Not authorized to access this route" });
            }else{
                req.admin = await Teacher.findById(decoded.id).select("password");
                next(); 
            }

        }catch(error){
            req.handleResponse.unauthorizedRespond(res)("Not authorized to access this route");
        }
    }
    if(!token){
        req.handleResponse.unauthorizedRespond(res)("Not authorized to access this route");
    }

}




   
export const parentProtect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      if (decoded.role != "parent") {
        return res
          .status(401)
          .json({ message: "Not authorized to access this route" });
      } else {
        req.Parent = await Parent.findById(decoded._id).select("password");
        next();
      }
    } catch (error) {
      req.handleResponse.unauthorizedRespond(res)(
        "Not authorized to access this route"
      );
    }
  }
  if (!token) {
    req.handleResponse.unauthorizedRespond(res)(
      "Not authorized to access this route"
    );
  }
};

export const adminOrTeacherOrParent = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decoded.role !== "admin" && decoded.role !== "teacher" && decoded.role !== "parent") {
        return res
          .status(401)
          .json({ message: "Not authorized to access this route" });
      } else {
        next();
      }
    } catch (error) {
      res.status(401);
      req.handleResponse.unauthorizedRespond(res)(
        "Not authorized to access this route"
      );
    }
  }
  if (!token) {
    res.status(401);
    req.handleResponse.unauthorizedRespond(res)(
      "Not authorized to access this route"
    );
  }
};


module.exports = {
  adminProtect,
  studentProtect,
  adminOrTeacherProtect,
  teacherProtect,
  parentProtect,
  adminOrTeacherOrParent
};
