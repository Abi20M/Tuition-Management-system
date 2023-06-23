import axios from "axios";
import requestConfig from "./requestConfig";

const BASE_URL = "http://localhost:3001";
class AttendanceAPI{

    static getStudentDetailsFromAttendance = (classId : string) =>{
        return axios.get(`${BASE_URL}/attendance/${classId}/students`,requestConfig);
    }

    static submitAttendance = (markedAttendance : any) =>{
        return axios.put(`${BASE_URL}/attendance/update`,markedAttendance,requestConfig);
    }
}

export default AttendanceAPI;