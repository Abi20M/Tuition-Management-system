import { loginAdmin } from "../controllers/admin.controller";
import protect from "../middleware/Auth.middleware";
import classController from "../controllers/class.controller";
import expenseController from "../controllers/expense.controller";
import teacherController from "../controllers/teacher.controller";
import parentController from "../controllers/Parent.controller";
import studentController from "../controllers/student.controller";
import adminController from "../controllers/admin.controller";

const Routes = (app) => {
  //normal validation root of the user
  app.post("/admin/login", loginAdmin);
  app.post("/admin", protect.adminProtect, adminController.createAdmin);
  app.get("/admin", protect.adminProtect, adminController.getAllAdmins);
  app.get("/admin/count",protect.adminProtect, adminController.getAdminCount);
  app.get("/admin/:id", protect.adminProtect, adminController.getAdmin);
  app.put("/admin/:id",protect.adminProtect,adminController.updateAdmin);
  app.delete("/admin/:id",protect.adminProtect, adminController.deleteAdmin);


  //class Routes
  app.get("/class",protect.adminProtect,classController.getAllClasses);
  app.get("/class/:id",protect.adminProtect,classController.getEnrolledStudentDetails);
  app.post("/class",protect.adminProtect,classController.createClass);
  app.delete("/class/delete/:id",protect.adminProtect,classController.deleteClass);
  app.get("/halls",protect.adminProtect,classController.getAllHallDetails);
  app.put("/class/edit/:id",protect.adminProtect,classController.editClassDetails);
  app.put("/enroll",protect.adminProtect, classController.enrollStudent)  
  app.put("/class/unenroll",protect.adminProtect,classController.unEnrollStudent);


  //expense Routes
  app.get("/expense",protect.adminProtect,expenseController.getAllExpenses);
  app.post("/expense",protect.adminProtect,expenseController.createExpense);
  app.delete("/expense/delete/:id",protect.adminProtect,expenseController.deleteExpense);
  app.put("/expense/update/:id",protect.adminProtect,expenseController.editExpense);

  //teacher Routes
  app.get("/teacher",protect.adminProtect,teacherController.getAllTeacher);
  app.get("/teacher/count",protect.adminProtect, teacherController.getTeacherCount)
  app.post("/teacher",protect.adminProtect,teacherController.createTeacher);
  app.delete("/teacher/:id",protect.adminProtect,teacherController.deleteTeacher);
  app.put("/teacher/:id",protect.adminProtect,teacherController.editTeacher);
  app.post("/teacher/login",teacherController.teacherLogin)
  //Parent Routes
  app.post("/parent",protect.adminProtect, parentController.createParent);
  app.get("/parent", protect.adminProtect, parentController.getAllParents);
  app.get("/parent/count",protect.adminProtect, parentController.getParentCount)
  app.put("/parent/:id" , protect.adminProtect, parentController.updateParent);
  app.delete("/parent/:id",protect.adminProtect,parentController.deleteParent);
   
    
    
  //parent login
  // app.post("/parent/login" , parentController.loginParent);


  //Student Routes
  app.post("/student", protect.adminProtect, studentController.createStudent);
  app.get("/student",protect.adminProtect, studentController.getAllStudents);
  app.get("/students/count",protect.adminProtect, studentController.getStudentCount)
  app.get("/student/:id", protect.adminProtect, studentController.getStudent);
  app.put(
    "/student/:id",
    protect.adminProtect,
    studentController.updateStudent
  );
  app.delete(
    "/student/:id",
    protect.adminProtect,
    studentController.deleteStudent
  );

    //Student Login
    app.post("/student/login", studentController.loginStudent);
    //Student Routes - Accessible to Students only
  app.put("/student/changePassword/:id",protect.studentProtect, studentController.changeStudentPassword);

};




module.exports = Routes;
