import axios from "axios";
import requestConfig from "./requestConfig";
import { AttendanceData } from "../components/ManageExams/ManageExams";

const BASE_URL = "http://localhost:3001";

class ExamAPI {
  //get all exams
  static getExams = () => {
    return axios.get(`${BASE_URL}/exam`, requestConfig);
  };
  //add exam
  static addExam = (values: {
    name: string;
    description: string;
    class: string;
    status: string;
    date: string;
    time: string;
    duration: number;
    durationUnit: string;
  }) => {
    return axios.post(`${BASE_URL}/exam`, values, requestConfig);
  };

  //delete exam
  static deleteExam = (id: string) => {
    return axios.delete(`${BASE_URL}/exam/${id}`, requestConfig);
  };

  //update exam
  static editExam = (values: {
    id: string;
    examId: string;
    name: string;
    description: string;
    class: string;
    status: string;
    date: string;
    time: string;
    duration: number;
    durationUnit: string;
  }) => {
    let exam = {
      examId: values.examId,
      name: values.name,
      description: values.description,
      class: values.class,
      status: values.status,
      date: values.date,
      time: values.time,
      duration: values.duration,
      durationUnit: values.durationUnit,
    };
    return axios.put(`${BASE_URL}/exam/${values.id}`, exam, requestConfig);
  };

  //get all classes
  static getClasses = () => {
    return axios.get(`${BASE_URL}/class`, requestConfig);
  };

  static getStudentsByClass = (classId: string) => {
    return axios.get(`${BASE_URL}/class/${classId}`, requestConfig);
  };

  static getMarksByExam = (examId: string) => {
    return axios.get(`${BASE_URL}/exam/${examId}/marks`, requestConfig);
  };

  static getAttendanceByExam = (examId: string) => {
    return axios.get(`${BASE_URL}/exam/${examId}/attendance`, requestConfig);
  };

  static addExamMarks = (
    examId: string,
    values: {
      id: string;
      name: string;
      marks: string;
    }
  ) => {
    const data = {
      id: values.id,
      marks: values.marks,
    };
    return axios.post(`${BASE_URL}/exam/${examId}/marks`, data, requestConfig);
  };

  static saveAttendance(id: string, attendance: AttendanceData[]) {
    const data = attendance.map((item) => {
      return {
        id: item.id,
        status: item.status,
      };
    });
    const user = JSON.parse(localStorage.getItem("teacher") || "{}");
    return axios.post(`${BASE_URL}/exam/${id}/attendance`, data, {
      headers: {
        authorization: "Bearer " + user.accessToken || "",
        "Content-Type": "application/json",
      },
    });
  }

  static releaseUnofficialResults = (examId: string) => {
    return axios.put(
      `${BASE_URL}/exam/${examId}/release/unofficial`,
      {},
      requestConfig
    );
  };

  static releaseOfficialResults = (examId: string) => {
    return axios.put(
      `${BASE_URL}/exam/${examId}/release/official`,
      {},
      requestConfig
    );
  };

  static getExamsByStudent = () => {
    const studentId = JSON.parse(localStorage.getItem("student") || "{}")._id;
    return axios.get(`${BASE_URL}/student/${studentId}/exams`, requestConfig);
  };
}

export default ExamAPI;
