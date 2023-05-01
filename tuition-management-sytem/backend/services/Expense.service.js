import Expense from "../models/expense.model";
import FixedValue from '../models/expense.fixed.value.model';

//generate expense Id
const generateExpenseId = async () => {
  //get last expense object, if there is a expense, then return that expense object, otherwise return empty array
  const lastExpenseDetails = await Expense.find().sort({ _id: -1 }).limit(1);
  
  //check if the result array is empty or not, if its empty then return first expense Id
  if (lastExpenseDetails.length == 0) {
    return "EXP-001";
  }

  //if array is not null, last expense object id
  const expenseId = lastExpenseDetails.map((data) => {
    return data.id;
  });

  //then we get the Integer value from the last part of the ID
  const oldExpenseId = parseInt(expenseId[0].split("-")[1]);

  const newExpenseId = oldExpenseId + 1; //then we add 1 to the past value

  //then we return the id according to below conditions
  if (newExpenseId >= 100) {
    return `EXP-${newExpenseId}`;
  } else if (newExpenseId >= 10) {
    return `EXP-0${newExpenseId}`;
  } else {
    return `EXP-00${newExpenseId}`;
  }
};

export const createExpense = async (expenseObj) => {
  //generate the expense ID  
  const id = await generateExpenseId();

//create a new object by adding generated ID
  const newExpenseObj = {
    id : id,
    name : expenseObj.name,
    description : expenseObj.description,
    category : expenseObj.category,
    amount : expenseObj.amount,
  }

  return await Expense.create(newExpenseObj).then(async (obj) =>{
      await obj.save();
      return obj;
  }).catch((error) =>{
    throw new Error(error.message);
  })
};

export const getAllExpenses = async () =>{
  return await Expense.find();
  
}

export const deleteExpense = async(id) =>{
  return await Expense.findByIdAndDelete(id);
}

export const editExpense = async (id,updatedExpense) => {

  return await Expense.findByIdAndUpdate(id, updatedExpense, { new: true });
};

//get admin count 
export const getExpenseCountService = async () => {
  return await Expense
   .countDocuments()
   .then((data) => {
     return data;
   })
   .catch((error) =>{
     throw new Error(error.message);
   });
   
};

//add fixed value
const addFixedValueService = async (fixedvalue) => {
  return await FixedValue.create(fixedvalue).then((res)=>{
    res.save();
    return res;
  }).catch((error) =>{
    return error.message;
  })
};

//get last added fixed value
const getLastFixedValue = async () => {
  try {
    const lastDocument = await FixedValue.find().sort({ _id: -1 }).limit(1);
    return lastDocument;
  } catch (error) {
    return error.message;
  }
  
};


module.exports = {
  createExpense,
  getAllExpenses,
  deleteExpense,
  editExpense,
  getExpenseCountService,
  addFixedValueService,
  getLastFixedValue,
};
