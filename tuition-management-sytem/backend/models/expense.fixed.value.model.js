import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  FixedAmount:{
    type: String,
    required : true
  },
  
},{timestamps:true});

const FixedExpense = mongoose.model("fixedValues", expenseSchema);

export default FixedExpense;
