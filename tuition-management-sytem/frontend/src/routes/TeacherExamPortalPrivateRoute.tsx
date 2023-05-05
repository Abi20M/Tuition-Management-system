import { Outlet, Navigate } from "react-router-dom";

const TeacherExamPortalPrivateRoute = () => {
  let admin = JSON.parse(localStorage.getItem("teacher") || "{}");
  let accessToken = admin.accessToken;

  return accessToken ? (
    <Outlet />
  ) : (
    <Navigate to={"/exam-portal/teacher-login"} />
  );
};

export default TeacherExamPortalPrivateRoute;
