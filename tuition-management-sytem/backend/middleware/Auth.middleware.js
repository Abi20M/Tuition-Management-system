import jwt from "jsonwebtoken";
import Admin from "../models/admin.model";
import Student from '../models/student.model';

export const adminProtect = async (req,res,next) =>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            if(decoded.role != 'admin'){
                return res.status(401).json({ message: "Not authorized to access this route" });
            }else{
                req.admin = await Admin.findById(decoded._id).select("password");
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

export const studentProtect = async (req,res,next) =>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            if(decoded.role != 'student'){
                return res.status(401).json({ message: "Not authorized to access this route" });
            }else{
                req.student = await Student.findById(decoded._id).select("password");
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
module.exports = {
    adminProtect,
    studentProtect
}