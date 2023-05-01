import { Outlet, Navigate } from "react-router-dom";

const StudentExamPortalPrivateRoute = () => {
  let admin = JSON.parse(localStorage.getItem("student") || "{}");
  let accessToken = admin.accessToken;

  return accessToken ? (
    <Outlet />
  ) : (
    <Navigate to={"/exam-portal/student-login"} />
  );
};

export default StudentExamPortalPrivateRoute;
