import axios from "axios";
import requestConfig from "./requestConfig";

const BASE_URL = "http://localhost:3001";

export class ClassAPI {

    static addClass =  async (values : {
        name : string,
        teacher : string,
        subject : string,
        day : string,
        startTime : Date,
        venue:string,
        endTime : Date
    })=>{
        
        // convert time into Readable String
        const startTime = values.startTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: false});

        const endTime = values.endTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: false});
        
        //create a new object with class details
        const classDetails = {
            name : values.name,
            teacher : values.teacher,
            subject : values.subject,
            day : values.day,
            startTime : startTime,
            venue : values.venue,
            endTime : endTime
        }

        //send a request to backend with class details and accessToken....
        return axios.post(`${BASE_URL}/class`, classDetails, requestConfig);
    }

    static getAllClasses = async () =>{
        return axios.get(`${BASE_URL}/class`,requestConfig);
    }

    static deleteClass = async(id : string) =>{
        return axios.delete(`${BASE_URL}/class/delete/${id}`,requestConfig)
    }
    
    //get hall Details function
    static getAllHallDetails = async()=>{
        return axios.get(`${BASE_URL}/halls`,requestConfig);
    }

    //edit class details function
    static editClassDetails = async (values : {
        _id : string,
        name : string,
        teacher : string,
        subject : string,
        day : string,
        startTime : Date,
        venue:string,
        endTime : Date
    }) =>{

        // convert time into Readable String
        const startTime = values.startTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: false});

        const endTime = values.endTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: false});
        
        //create a new object with class details
        const updatedClassDetails = {
            name : values.name,
            teacher : values.teacher,
            subject : values.subject,
            day : values.day,
            startTime : startTime,
            venue : values.venue,
            endTime : endTime
        }

        return axios.put(`${BASE_URL}/class/edit/${values._id}`,updatedClassDetails,requestConfig);
    }

    static getClassById = async (classId : string) => {
        return axios.get(`${BASE_URL}/class/${classId}`,requestConfig);
    }

    static  enrollStudent = async (studentId : string,studentEmail : string, studentName : string, classId : string, className : string) => {

        const enrollDetails = {
            studentid : studentId,
            studentname : studentName,
            studentemail : studentEmail,
            classid : classId,
            classname : className
        }

        return axios.put(`${BASE_URL}/enroll`,enrollDetails,requestConfig);
    }

    static unEnrollStudent = async (studentId : string, studentName : string, studentEmail : string, classId : string, className : string) =>{

        const unEnrollDetails = {
            studentId : studentId,
            studentName : studentName,
            studentEmail : studentEmail,
            classId : classId,
            className : className
        }
        return axios.put(`${BASE_URL}/class/unenroll`,unEnrollDetails,requestConfig);
    } 
}