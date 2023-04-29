import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Logout from "../components/logout";
import { AdminDashboard } from "../pages/adminDashboard/index";
import { AdminLoginPage } from "../pages/AllLogin/admin";
import {FinancialManagerLoginPage} from "../pages/AllLogin/financial manager";
import { AllLogin } from "../pages/AllLogin/AllLogin";
import Page404 from "../pages/Page404";
import AdminPrivateRoute from "./adminPrivateRoute";
import ExpensePrivateRoute from "./expensePrivateRoute";
import ParentPrivateRoute from "./ParentPrivateRoute";
import TeacherPrivateRoute from "./TeacherPrivateRoute";
import {AttendanceLoginPage} from "../pages/AllLogin/Manage Attendance";
import AttendancePrivateRoute from "./attendancePrivateRoute";


import { TeacherDashboard } from "../pages/teacherDashboard";
import { ParentDashboard } from "../pages/parentDashboard";
import {ExpenseDashboard} from "../pages/expenseDashboard/index";
import { StudentLoginPage } from "../pages/AllLogin/student-login";
import { ParentLogin } from "../pages/AllLogin/Parent";
import { TeacherLogin } from "../pages/AllLogin/Teacher";
import StudentPrivateRoute from "./StudentPrivateRoute";
import StudentDashboard from "../components/StudentDashboard";

export const AllRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllLogin />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path = "/financial/login" element={<FinancialManagerLoginPage />} />
        <Route path="/student/login" element={<StudentLoginPage />} />
        <Route path = "/parent/login" element={<ParentLogin/>} />
        <Route path = "/teacher/login" element={<TeacherLogin/>} />
        <Route path = "/attendance/login" element={<AttendanceLoginPage/>}/>
        <Route path="/logout" element={<Logout />} />
      
        <Route path="*" element={<Page404/>}/>

        //created private Route for authorization
        <Route path="/admin/" element={<AdminPrivateRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path = "/financial/" element = {<ExpensePrivateRoute/>}>
          <Route path ="/financial/dashboard" element={<ExpenseDashboard />} />
        </Route>

        <Route path = "/parent/" element = {<ParentPrivateRoute/>}>
          <Route path = "/parent/dashboard" element={<ParentDashboard/>} />

        </Route>  


        {/* <Route path = "/attendance/" element = {<AttendancePrivateRoute/>}>
          <Route path = "/attendance/dashboard" element={<AttendanceDashboard/>} />

        </Route>   */}


        <Route path = "/teacher/" element = {<TeacherPrivateRoute/>}>
          <Route path = "/teacher/dashboard" element={<TeacherDashboard/>} />

        </Route>  

        <Route path = "/student/" element = {<StudentPrivateRoute/>}>
          <Route path = "/student/dashboard" element={<StudentDashboard/>} />

        </Route> 
              
      </Routes>
    </Router>
  );
};

