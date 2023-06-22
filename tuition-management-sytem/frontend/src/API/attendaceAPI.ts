import axios from "axios";
import requestConfig from "./requestConfig";

const BASE_URL = "http://localhost:3001";
class AttendanceAPI{

    static getStudentDetailsFromAttendance = (classId : string) =>{
        return axios.get(`${BASE_URL}/attendance/${classId}/students`,requestConfig);
    }
}

export default AttendanceAPI;