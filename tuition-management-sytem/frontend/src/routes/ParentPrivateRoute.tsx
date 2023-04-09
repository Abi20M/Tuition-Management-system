import { Navigate, Outlet } from "react-router-dom";

const ParentPrivateRoute = () => {
  const staff = JSON.parse(localStorage.getItem("parent") || "{}");
  const accessToken = staff.accessToken;
  return accessToken ? <Outlet /> : <Navigate to="/parent/login" />;
};

export default ParentPrivateRoute;
