import { loginAdmin } from "../controllers/admin.controller";
import protect from "../middleware/Auth.middleware";
import classController from "../controllers/class.controller";
import expenseController from "../controllers/expense.controller";
import parentController from "../controllers/Parent.controller";
import studentController from "../controllers/student.controller";

const Routes = (app) => {
  //normal validation root of the user
  app.post("/admin/login", loginAdmin);

  //class Routes
  app.get("/class",protect.adminProtect,classController.getAllClasses);
  app.get("/class/:id",protect.adminProtect,classController.getEnrolledStudentDetails);
  app.post("/class",protect.adminProtect,classController.createClass);
  app.delete("/class/delete/:id",protect.adminProtect,classController.deleteClass);
  app.get("/halls",protect.adminProtect,classController.getAllHallDetails);
  app.put("/class/edit/:id",protect.adminProtect,classController.editClassDetails);
  app.post("/enroll",protect.adminProtect, classController.enrollStudent)  

  //expense Routes
  app.get("/expense",protect.adminProtect,expenseController.getAllExpenses);
  app.post("/expense",protect.adminProtect,expenseController.createExpense);
  app.delete("/expense/delete/:id",protect.adminProtect,expenseController.deleteExpense);
  app.put("/expense/update/:id",protect.adminProtect,expenseController.editExpense);

  //Parent Routes
  app.post("/parent",protect.adminProtect, parentController.createParent);
  app.get("/parent/:id", protect.adminProtect, parentController.getParent);
  app.put("/parent/:id" , protect.adminProtect, parentController.updateParent);
  app.delete("/parent/:id",protect.adminProtect,parentController.deleteParent);
   
    
    
  //parent login
  // app.post("/parent/login" , parentController.loginParent);


  //Student Routes
  app.post("/student", protect.adminProtect, studentController.createStudent);
  app.get("/student",protect.adminProtect, studentController.getAllStudents);
};

module.exports = Routes;
