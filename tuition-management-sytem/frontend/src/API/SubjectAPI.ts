import axios from "axios";
import requestConfig from "./requestConfig";

const BASE_URL = "http://localhost:3001";

class SubjectAPI {
  //get all subjects
  static getSubjects = () => {
    return axios.get(`${BASE_URL}/subject`, requestConfig);
  };
  //add subject
  static addSubject = (values: {
    name: string;
  }) => {
    return axios.post(`${BASE_URL}/subject`, values, requestConfig);
  };
  //delete subject
  static deleteSubject = (id: string) => {
    return axios.delete(`${BASE_URL}/subject/${id}`, requestConfig);
  };
  //update subject
  static editSubject = (values: {
    _id: string;
    id: string;
    name: string;
  }) => {
    let subject = {
      id : values.id,
      name: values.name,
    };
    return axios.put(
      `${BASE_URL}/subject/${values._id}`,
      subject,
      requestConfig
    );
  };

  static getSubjectCount = () =>{
    return axios.get(`${BASE_URL}/subject/count`,requestConfig);
  }
}

export default SubjectAPI;
