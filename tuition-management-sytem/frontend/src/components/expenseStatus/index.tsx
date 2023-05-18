import { Group } from "@mantine/core";
import { ExpenseCount } from "../expenseOverview";
import { ProgressCardColored } from "../expenseOverview";
import { DoughnutChart } from "../expenseOverview";

interface propType {
    totalExpenses: number
    lastFixed: number
}
const ExpenseStatus = (prop: propType) => {

    return (
        
            <Group 
            position="apart"
            >
                <ExpenseCount />
                <DoughnutChart />

                <ProgressCardColored
                    totalExpense={prop.totalExpenses}
                    lastFixed={prop.lastFixed}

                />

                

                
            </Group>
            


           
    )
}

export default ExpenseStatus;