import Expense from "../models/expense.model"
import expenseServices from "../services/Expense.service";


//create expense function
export const createExpense = async (req, res, next) => {

    // create a expense object with details
    const expenseObj = new Expense({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      amount: req.body.amount,
    });
  
    //call to createExpense function to create a object in the database
    await expenseServices
      .createExpense(expenseObj)
      .then((data) => {
        req.handleResponse.successRespond(res)(data);
        next();
      })
      .catch((error) => {
        req.handleResponse.errorRespond(res)(error);
        next();
      });
  };
  
  //get all expense Details
  export const getAllExpenses = async (req, res, next) => {
    await expenseServices
      .getAllExpenses()
      .then((data) => {
        req.handleResponse.successRespond(res)(data);
        next();
      })
      .catch((error) => {
        req.handleResponse.errorRespond(res)(error);
        next();
      });
  };
  
  // delete a expense
  export const deleteExpense = async (req, res, next) => {
    const id = req.params.id;
  
    await expenseServices
      .deleteExpense(id)
      .then((data) => {
        req.handleResponse.successRespond(res)(data);
        next();
      })
      .catch((error) => {
        req.handleResponse.errorRespond(res)(error);
        next();
      });
  };
  
  //update expense
  export const editExpense = async (req, res, next) => {

    
    const id = req.params.id;
    const updateDetails ={
      name : req.body.name,
      description : req.body.description,
      category : req.body.category,
      amount : req.body.amount,
    }
    await expenseServices
      .editExpense(id,updateDetails)
      .then((data) => {
        req.handleResponse.successRespond(res)(data);
        next();
      })
      .catch((error) => {
        req.handleResponse.errorRespond(res)(error);
        next();
      });
  };
  
  
  
  
  module.exports = {
    createExpense,
    getAllExpenses,
    deleteExpense,
    editExpense,
  };