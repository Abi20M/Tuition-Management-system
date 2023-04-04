import axios from 'axios';


const BASE_URL = "http://localhost:3001"

export class adminAPI {
    static loginAdmin = (email : string, password : string)=>{
    
        let credentials = {
            email: email,
            password : password
        }
        return axios.post(`${BASE_URL}/admin/login`,credentials);
    }
}

