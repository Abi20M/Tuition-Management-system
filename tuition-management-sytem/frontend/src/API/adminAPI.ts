import axios from "axios";
import requestConfigJson from "./requestConfig";

const BASE_URL = "http://localhost:3001";

export class adminAPI {
  //Admin Login
  static loginAdmin = (email: string, password: string) => {
    let credentials = {
      email: email,
      password: password,
    };
    return axios.post(`${BASE_URL}/admin/login`, credentials);
  };
  //get all admins
  static getAdmins = () => {
    return axios.get(`${BASE_URL}/admin`, requestConfigJson);
  };

  //add admin
  static addAdmin = (values: {
    name: string;
    email: string;
    password: string;
    telephone: string;
    address:string;
  }) => {
    return axios.post(`${BASE_URL}/admin`, values, requestConfigJson);
  };
  //delete admin
  static deleteAdmin = (id: string) => {
    return axios.delete(`${BASE_URL}/admin/${id}`, requestConfigJson);
  };
  //update admin
  static editAdmin = (values: {
    id: string;
    customId: string;
    name: string;
    email: string;
    telephone: string;
    address:string;
  }) => {

    let admin = {
      name: values.name,
      email: values.email,
    };
    return axios.put(
      `${BASE_URL}/admin/${values.id}`,
      admin,
      requestConfigJson
    );
  };
  //get all exam marks
  static getAllExams = () => {
    return axios.get(`${BASE_URL}/exam`, requestConfigJson);
  };
  //get all exams by student
  static getExamsByStudentId = (id: string) => {
    return axios.get(`${BASE_URL}/student/${id}/exams`, requestConfigJson);
  };

  static getAdminCount = () =>{
    return axios.get(`${BASE_URL}/admin/count`,requestConfigJson);
  };
}

export default adminAPI;
