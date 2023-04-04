import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique : true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  amount:{
    type: String,
    required : true
  },
  
},{timestamps:true});

const Expense = mongoose.model("Expenses", expenseSchema);

export default Expense;
