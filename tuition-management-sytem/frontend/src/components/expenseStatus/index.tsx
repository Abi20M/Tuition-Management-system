import { ExpenseCount } from "../expenseOverview";
import { ProgressCardColored } from "../expenseOverview";

interface propType {
    totalExpenses: number
    lastFixed : number
}
const ExpenseStatus =(prop : propType) =>{

    return(
        <div>
            <ExpenseCount />
            <ProgressCardColored 
            totalExpense  = {prop.totalExpenses}
            lastFixed = {prop.lastFixed}
            />
        </div>
    )
}

export default ExpenseStatus;