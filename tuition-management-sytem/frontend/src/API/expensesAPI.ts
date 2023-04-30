import axios from "axios";
import requestConfig from "./requestConfig";

const BASE_URL = "http://localhost:3001";

class ExpensesAPI {
  //get all expenses
  static getExpnses = () => {
    return axios.get(`${BASE_URL}/expense`, requestConfig);
  };
  //add expense
  static addExpenses = (values: {
    name: string;
    description: string;
    category: string;
    amount: string;
  }) => {
    return axios.post(`${BASE_URL}/expense`, values, requestConfig);
  };

  //delete expense
  static deleteExpenses = (id: string) => {
    return axios.delete(`${BASE_URL}/expense/delete/${id}`, requestConfig);
  };

  //update expense
  static editExpenses = (values: {
    _id: string,
    id: string;
    name: string;
    description: string;
    category: string;
    amount: string;
  }) => {

    return axios.put(`${BASE_URL}/expense/update/${values._id}`,
      values,
      requestConfig
    );
  };


  //get expense count
  static getExpenseCount = () => {
    return axios.get(`${BASE_URL}/expense/count`, requestConfig);
  };

  //add fixed value
  static addFixedValue = (values: {
    fixedValue: string;
  }) => {
    return axios.post(`${BASE_URL}/expense/fixed`, values, requestConfig);
  };

  //get fixed value
  static getLastFixedValue = () => {
    return axios.get(`${BASE_URL}/expense/getFixed`, requestConfig);
  };
}

export default ExpensesAPI;
