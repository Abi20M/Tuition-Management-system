import { loginAdmin } from "../controllers/admin.controller";
import protect from "../middleware/Auth.middleware";
import classController from "../controllers/class.controller";
import expenseController from "../controllers/expense.controller";
import teacherController from "../controllers/teacher.controller";

const Routes = (app) => {
  //normal validation root of the user
  app.post("/admin/login", loginAdmin);

  //class Routes
  app.get("/class",protect.adminProtect,classController.getAllClasses);
  app.post("/class",protect.adminProtect,classController.createClass);
  app.delete("/class/delete/:id",protect.adminProtect,classController.deleteClass);
  app.get("/halls",protect.adminProtect,classController.getAllHallDetails);

  //expense Routes
  app.get("/expense",protect.adminProtect,expenseController.getAllExpenses);
  app.post("/expense",protect.adminProtect,expenseController.createExpense);
  app.delete("/expense/delete/:id",protect.adminProtect,expenseController.deleteExpense);
  app.put("/expense/update/:id",protect.adminProtect,expenseController.editExpense);

  //teacher Routes
  app.get("/teacher",protect.adminProtect,teacherController.getAllTeacher);
  app.post("/teacher",protect.adminProtect,expenseController.createTeacher);
  app.delete("/teacher/delete/:id",protect.adminProtect,teacherController.deleteTeacher);
  app.put("/teacher/update/:id",protect.adminProtect,teacherController.editTeacher);



};

module.exports = Routes;
