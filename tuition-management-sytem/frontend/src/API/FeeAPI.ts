import axios from "axios";
import requestConfig from "./requestConfig";

const BASE_URL = "http://localhost:3001";

class FeeAPI {
  //get all fees
  static getFees = () => {
    return axios.get(`${BASE_URL}/fee`, requestConfig);
  };
  //add fee
  static addFee = (values: {
    name: string;
    status: string;
  }) => {
    return axios.post(`${BASE_URL}/fee`, values, requestConfig);
  };
  //delete fee
  static deleteFee = (id: string) => {
    return axios.delete(`${BASE_URL}/fee/${id}`, requestConfig);
  };
  //update fee
  static editFee = (values: {
    _id: string;
    id: string;
    name: string;
    status: string;
  }) => {
    let fee = {
      id : values.id,
      name: values.name,
      status: values.status
    };
    return axios.put(
      `${BASE_URL}/fee/${values._id}`,
      fee,
      requestConfig
    );
  };

  static getFeeCount = () =>{
    return axios.get(`${BASE_URL}/fee/count`,requestConfig);
  }
}

export default FeeAPI;
