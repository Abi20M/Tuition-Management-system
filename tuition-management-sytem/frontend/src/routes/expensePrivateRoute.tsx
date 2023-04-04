import { Outlet, Navigate } from "react-router-dom";

const ExpensePrivateRoute = () =>{
    let admin = JSON.parse(localStorage.getItem('admin') || '{}');
    let accessToken = admin.accessToken;

    return accessToken ? <Outlet/> : <Navigate to={"/financial/login"}/>
}

export default ExpensePrivateRoute;