import { loginAdmin } from "../controllers/admin.controller";
import protect from "../middleware/Auth.middleware";
import classController from "../controllers/class.controller";
import expenseController from "../controllers/expense.controller";
import teacherController from "../controllers/teacher.controller";
import parentController from "../controllers/Parent.controller";
import studentController from "../controllers/student.controller";
import adminController from "../controllers/admin.controller";
import subjectController from "../controllers/subject.controller";
import examController from "../controllers/Exam.controller";

const Routes = (app) => {
  //normal validation root of the user
  app.post("/admin/login", loginAdmin);
  app.post("/admin", protect.adminProtect, adminController.createAdmin);
  app.get("/admin", protect.adminProtect, adminController.getAllAdmins);
  app.get("/admin/count", protect.adminProtect, adminController.getAdminCount);
  app.get("/admin/:id", protect.adminProtect, adminController.getAdmin);
  app.put("/admin/:id", protect.adminProtect, adminController.updateAdmin);
  app.delete("/admin/:id", protect.adminProtect, adminController.deleteAdmin);

  //class Routes
  app.get(
    "/class",
    protect.adminOrTeacherOrParent,
    classController.getAllClasses
  );
  app.get(
    "/class/hallSchedule",
    protect.adminProtect,
    classController.getHallSchedule
  );
  app.get(
    "/class/:id",
    protect.adminOrTeacherProtect,
    classController.getEnrolledStudentDetails
  );
  app.post("/class", protect.adminProtect, classController.createClass);
  app.delete(
    "/class/delete/:id/:cusId/:day/:hall/:startTime/:endTime",
    protect.adminProtect,
    classController.deleteClass
  );
  app.get("/halls", protect.adminProtect, classController.getAllHallDetails);
  app.put(
    "/class/edit/:id/:cuStartTime/:cuEndTime",
    protect.adminProtect,
    classController.editClassDetails
  );
  app.put("/enroll", protect.adminProtect, classController.enrollStudent);
  app.put(
    "/class/unenroll",
    protect.adminProtect,
    classController.unEnrollStudent
  );

  //expense Routes
  app.get("/expense", protect.adminProtect, expenseController.getAllExpenses);
  app.post("/expense", protect.adminProtect, expenseController.createExpense);
  app.delete(
    "/expense/delete/:id",
    protect.adminProtect,
    expenseController.deleteExpense
  );
  app.put(
    "/expense/update/:id",
    protect.adminProtect,
    expenseController.editExpense
  );
  app.get(
    "/expense/count",
    protect.adminProtect,
    expenseController.getExpenseCount
  );
  app.post(
    "/expense/fixed",
    protect.adminProtect,
    expenseController.addFixedValue
  );
  app.get(
    "/expense/getFixed",
    protect.adminProtect,
    expenseController.getLastFixedValue
  );
  app.post("/admin/details",protect.adminProtect,expenseController.getAdminInfo)
  app.get("/expenses/categories",protect.adminProtect,expenseController.getCategories)
  app.get("/fees/amount",protect.adminProtect,expenseController.getFeesAmount)



  //teacher Routes
  app.get("/teacher", protect.adminProtect, teacherController.getAllTeacher);
  app.get(
    "/teacher/count",
    protect.adminProtect,
    teacherController.getTeacherCount
  );
  app.post("/teacher", protect.adminProtect, teacherController.createTeacher);
  app.delete(
    "/teacher/:id",
    protect.adminProtect,
    teacherController.deleteTeacher
  );
  app.put("/teacher/:id", protect.adminProtect, teacherController.editTeacher);
  app.post("/teacher/login", teacherController.teacherLogin);

  //Teacher Routes - Accessible to Teachers only
  //get students of the specific teacher by teacher id
  app.get(
    "/teacher/:id/students",
    protect.teacherProtect,
    teacherController.getStudents
  );

  // change password route
  app.put("/teacher/changePassword/:id", protect.teacherProtect, teacherController.changeTeacherPassword)

  app.get(
    "/teacher/:id/class",
    protect.teacherProtect,
    teacherController.getAllClasses
  );

  app.post("/class/count/:name",
    protect.teacherProtect,
    teacherController.getClassCount
  )



  //Parent Routes
  //parent login
  app.post("/parent/login", parentController.loginParent);

  // app.post("/parent/login" , parentController.loginParent);
  app.post("/parent", protect.adminProtect, parentController.createParent);
  app.get("/parent", protect.adminOrTeacherProtect, parentController.getAllParents);
  app.get("/parent/count", protect.adminProtect, parentController.getParentCount);
  app.put("/parent/:id", protect.adminProtect, parentController.updateParent);
  app.delete("/parent/:id", protect.adminProtect, parentController.deleteParent);
  app.put("/parent/changePassword/:id", protect.parentProtect, parentController.changeParentPassword);

  //get sudents by parent id
  app.get(
    "/parent/students/:id",
    protect.parentProtect,
    parentController.getStudents
  );

  app.get("/student/exams/:id",protect.parentProtect,studentController.getExamsByStudentId)

  //Student Routes
  //Student Routes
  app.post("/student", protect.adminProtect, studentController.createStudent);
  app.get(
    "/student",
    protect.adminOrTeacherProtect,
    studentController.getAllStudents
  );
  // get student gender distribution
  app.get(
    "/student/gender",
    protect.adminProtect,
    studentController.getStudentsGenderDistribution
  );
  // get student grade distribution
  app.get(
    "/student/grade",
    protect.adminProtect,
    studentController.getStudentsGrade
  );
  app.get(
    "/students/count",
    protect.adminProtect,
    studentController.getStudentCount
  );
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

  app.get("/student/:id/classes",protect.studentProtect, studentController.getClassesByStudentId)
  app.put("/student/changePassword/:id", protect.studentProtect, studentController.changeStudentPassword);


  //Subject Routes
  app.post("/subject", protect.adminProtect, subjectController.createSubject);
  app.get("/subject", protect.adminProtect, subjectController.getAllSubjects);
  app.get(
    "/subject/count",
    protect.adminProtect,
    subjectController.getSubjectCount
  );
  app.put(
    "/subject/:id",
    protect.adminProtect,
    subjectController.updateSubject
  );
  app.delete(
    "/subject/:id",
    protect.adminProtect,
    subjectController.deleteSubject
  );

  //Fee Routes
  app.put("/fee/:id", protect.adminProtect, studentController.updateFee);

  //Manage Exams
  app.post("/exam", protect.adminOrTeacherProtect, examController.createExam);
  app.get("/exam", protect.adminOrTeacherProtect, examController.getAllExams);
  app.get("/exam/:id", protect.adminOrTeacherProtect, examController.getExam);
  app.put(
    "/exam/:id",
    protect.adminOrTeacherProtect,
    examController.updateExam
  );
  app.delete(
    "/exam/:id",
    protect.adminOrTeacherProtect,
    examController.deleteExam
  );
  app.get(
    "/exam/:id/marks",
    protect.adminOrTeacherProtect,
    examController.getMarksByExam
  );
  app.post(
    "/exam/:id/marks",
    protect.adminOrTeacherProtect,
    examController.addMarks
  );
  app.get(
    "/exam/:id/attendance",
    protect.adminOrTeacherProtect,
    examController.getAttendanceByExam
  );
  app.post(
    "/exam/:id/attendance",
    protect.adminOrTeacherProtect,
    examController.saveAttendance
  );
  app.put(
    "/exam/:id/release/unofficial",
    protect.adminOrTeacherProtect,
    examController.releaseUnofficialResults
  );
  app.put(
    "/exam/:id/release/official",
    protect.adminProtect,
    examController.releaseOfficialResults
  );
  app.get(
    "/student/:id/exams",
    protect.studentProtect,
    examController.getExamsByStudent
  );
};

module.exports = Routes;
