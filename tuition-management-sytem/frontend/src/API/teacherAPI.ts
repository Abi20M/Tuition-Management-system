import axios from "axios";
import requestConfig from "./requestConfig";


const BASE_URL = "http://localhost:3001";

class TeacherAPI {
  //get all teachers
  static getTeachers = () => {
    return axios.get(`${BASE_URL}/teacher`, requestConfig);
  };
  //add teacher
  static addTeacher = (values: {
    name: string;
    email: string;
    phone: string;
  }) => {
    return axios.post(`${BASE_URL}/teacher`, values, requestConfig);
  };
  //delete teacher
  static deleteTeacher = (id: string) => {
    return axios.delete(`${BASE_URL}/teacher/${id}`, requestConfig);
  };
  //update teacher
  static editTeacher = (values: {
    _id: string,
    id: string;
    name: string;
    email: string;
    phone: string;
  }) => {
    let teacher = {
      name: values.name,
      email: values.email,
      phone: values.phone
    };
    return axios.put(
      `${BASE_URL}/teacher/${values._id}`,
      teacher,
      requestConfig
    );
  };

  //teacher login
  static teacherLogin = (email: string, password: string) => {
    const data = {
      email: email,
      password: password,
    };
    return axios.post(`${BASE_URL}/teacher/login`, data);
  };

  //get students of the specific teacher by teacher id
  static getStudents = () => {
    const teacher = JSON.parse(localStorage.getItem("teacher") || "{}");
    const teacherId = teacher.name;
    return axios.get(
      `${BASE_URL}/teacher/${teacherId}/students`,
      requestConfig
    );
  };

  // //get class of the specific teacher by teacher id
  static getAllClasses = () => {
    const teacher = JSON.parse(localStorage.getItem("teacher") || "{}");
    const teacherId = teacher.name;
    return axios.get(
      `${BASE_URL}/teacher/${teacherId}/class`,
      requestConfig
    );
  };

  //get all exams by student
  static getExamsByStudentId = (id: string) => {
    return axios.get(`${BASE_URL}/student/${id}/exams`, requestConfig);
  };




  // get Teacher count
  static getTeacherCount = () => {
    return axios.get(`${BASE_URL}/teacher/count`, requestConfig);
  }
  static getTeacherClasses = async () => {
    return axios.get(`${BASE_URL}teacher/class`, requestConfig);
  }
  static setNewPassword = (values: {
    documentId: string,
    teacherId: string,
    currentPassword: string,
    newPassword: string

  }) => {

    let password = {
      teacherId: values.teacherId,
      currentPassword: values.currentPassword,
      newPassword: values.newPassword
    }
    return axios.put(`${BASE_URL}/teacher/changePassword/${values.documentId}`, password, requestConfig);
  }
}

export default TeacherAPI;
