import axios from "axios";
import requestConfig from "./requestConfig";

const BASE_URL = "http://localhost:3001";

class subjectAPI{
    static getAllSubjects = async () =>{
        return axios.get(`${BASE_URL}/subjects`,requestConfig);
    }
}


export default subjectAPI;