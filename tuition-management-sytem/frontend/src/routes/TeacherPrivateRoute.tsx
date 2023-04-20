import { Navigate, Outlet } from "react-router-dom";

const TeacherPrivateRoute = () => {
  const staff = JSON.parse(localStorage.getItem("teacher") || "{}");
  const accessToken = staff.accessToken;
  return accessToken ? <Outlet /> : <Navigate to="/teacher/login" />;
};

export default TeacherPrivateRoute;
