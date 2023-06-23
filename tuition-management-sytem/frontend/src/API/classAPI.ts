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
        // create a new object with class details
        const classDetails = {
            name : values.name,
            teacher : values.teacher,
            subject : values.subject,
            day : values.day,
            startTime : values.startTime,
            venue : values.venue,
            endTime : values.endTime
        }

        // send a request to backend with class details and accessToken....
        return axios.post(`${BASE_URL}/class`, classDetails, requestConfig);
    }

    static getAllClasses = async () =>{
        return axios.get(`${BASE_URL}/class`,requestConfig);
    }

    //get class count
    static getClassCount = (teacherName : string)=>{
        return axios.post(`${BASE_URL}/class/count/${teacherName}`,requestConfig);
      }

      //get enrollnments by class id
  static getEnrollments = (id: string) => {
    return axios.get(`${BASE_URL}/class/${id}/students`, requestConfig);
  };

    static deleteClass = async(id : string,cusId:string,day:string,hall:string,startTime:string,endTime:string) =>{
        return axios.delete(`${BASE_URL}/class/delete/${id}/${cusId}/${day}/${hall}/${startTime}/${endTime}`,requestConfig)
    }
    
    //get hall Details function
    static getAllHallDetails = async()=>{
        return axios.get(`${BASE_URL}/halls`,requestConfig);
    }

    //edit class details function
    static editClassDetails = async (values : {
        _id : string,
        id:string,
        name : string,
        teacher : string,
        subject : string,
        day : string,
        startTime : Date,
        venue:string,
        endTime : Date
    },currentStartTime : string,currentEndTime:string) =>{
        //create a new object with class details
        const updatedClassDetails = {
            id: values.id,
            name : values.name,
            teacher : values.teacher,
            subject : values.subject,
            day : values.day,
            startTime : values.startTime,
            venue : values.venue,
            endTime : values.endTime
        }

        return axios.put(`${BASE_URL}/class/edit/${values._id}/${currentStartTime}/${currentEndTime}`,updatedClassDetails,requestConfig);
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

    static getHallSchedule = async() =>{
        return axios.get(`${BASE_URL}/class/hallSchedule`,requestConfig);
    }

    static getClassByDate = async () =>{
        const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const date = new Date();
        const day = date.getDay();

        return axios.get(`${BASE_URL}/class/day/${weekday[day]}`,requestConfig);
    }
}