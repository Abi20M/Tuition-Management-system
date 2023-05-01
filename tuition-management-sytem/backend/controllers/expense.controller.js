import Expense from "../models/expense.model"
import expenseServices from "../services/Expense.service";
import fixedValue from '../models/expense.fixed.value.model';

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
  const updateDetails = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    amount: req.body.amount,
  }
  await expenseServices
    .editExpense(id, updateDetails)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    });
};

//get expense count
export const getExpenseCount = async (req, res,next) => {
  await expenseServices.getExpenseCountService()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    });
};

//add fixed value
export const addFixedValue = async (req, res ,next) => {
  const fixedObj = new fixedValue({
    FixedAmount: req.body.fixedValue
  });
  await expenseServices.addFixedValueService(fixedObj)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
      next();
    });
};


export const getLastFixedValue = async (req, res, next) => {
  expenseServices
    .getLastFixedValue()
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
  getExpenseCount,
  addFixedValue,
  getLastFixedValue,
};