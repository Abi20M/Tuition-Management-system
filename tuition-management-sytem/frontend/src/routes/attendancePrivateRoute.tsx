import { Outlet, Navigate } from "react-router-dom";

const AttendancePrivateRoute = () =>{
    let admin = JSON.parse(localStorage.getItem('admin') || '{}');
    let accessToken = admin.accessToken;

    return accessToken ? <Outlet/> : <Navigate to={"/attendance/login"}/>
}

export default AttendancePrivateRoute;