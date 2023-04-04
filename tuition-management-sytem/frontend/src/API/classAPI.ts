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
}