import { Navigate, Outlet } from "react-router-dom";

const StudentPrivateRoute = () => {
  const staff = JSON.parse(localStorage.getItem("student") || "{}");
  const accessToken = staff.accessToken;
  return accessToken ? <Outlet /> : <Navigate to="/student/login" />;
};

export default StudentPrivateRoute;