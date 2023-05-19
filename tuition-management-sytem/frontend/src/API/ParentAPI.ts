import axios from "axios";
import requestConfig from "./requestConfig";


const BASE_URL = "http://localhost:3001";

class ParentAPI {
  //get all parents
  static getParents = () => {
    return axios.get(`${BASE_URL}/parent`, requestConfig);
  };
  //add parent
  static addParent = (values: {
    name: string;
    email: string;
    //password: string;
    phone: string;
  }) => {
    return axios.post(`${BASE_URL}/parent`, values, requestConfig);
  };
  //delete parent
  static deleteParent = (id: string) => {
    return axios.delete(`${BASE_URL}/parent/${id}`, requestConfig);
  };
  //update parent
  static editParent = (values: {
    _id: string;
    id: string;
    name: string;
    email: string;
    phone: string;
  }) => {
    let parent = {
      id : values.id,
      name: values.name,
      email:values.email,
      phone:values.phone

    };
    return axios.put(
      `${BASE_URL}/parent/${values._id}`,
      parent,
      requestConfig
    );
  };

  //parent login
  static parentLogin = (email: string, password: string) => {
    const data = {
      email: email,
      password: password,
    };
    return axios.post(`${BASE_URL}/parent/login`, data);
  };

  //get sudents by parent id
  static getStudents = () => {
    const parent = JSON.parse(localStorage.getItem("parent") || "{}");
    const parentID = parent._id;
    return axios.get(`${BASE_URL}/parent/students/${parentID}`, requestConfig);
  };

  //get all exams by student
  static getExamsByStudentId = (id: string) => {
    return axios.get(`${BASE_URL}/student/exams/${id}`, requestConfig);
  };

  static getParentCount = () =>{
    return axios.get(`${BASE_URL}/parent/count`,requestConfig);
    
  }

  static setNewPassword = (values : {
    documentId : string,
    parentId : string,
    currentPassword : string,
    newPassword : string
    
  }) =>{

    let password = {
      parentId : values.parentId,
      currentPassword : values.currentPassword,
      newPassword : values.newPassword
    }

    return axios.put(`${BASE_URL}/parent/changePassword/${values.documentId}`,password,  requestConfig);
    
  }

  static getExamMarksByStudentId = (childrenId : string[])=>{
    return axios.get(`${BASE_URL}/parent/children/marks/${childrenId}`,requestConfig)
  }
}

export default ParentAPI;
