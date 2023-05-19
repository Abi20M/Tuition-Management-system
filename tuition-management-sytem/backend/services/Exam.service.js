import exam from "../models/Exam.model.js";
import classService from "./Class.service.js";
import examMailService from "../Mails/exam.mails";
import "dotenv/config";

const generateExamId = async () => {
  const lastExam = await exam.findOne().sort({ _id: -1 });
  if (lastExam) {
    const lastExamId = lastExam.examId;
    const oldExamId = parseInt(lastExamId.split("-")[1]);
    const newExamId = `EXM-${oldExamId + 1}`;
    return newExamId;
  } else {
    return "EXM-1001";
  }
};

export const createExam = async (examObj) => {
  examObj.examId = await generateExamId();
  return await exam
    .create(examObj)
    .then(async (data) => {
      await data.save();
      const students = await classService.getEnrolledStudentsData(data.class);
      const classObj = await classService.getClassById(data.class);
      await examMailService.sendNewExamNotification(
        students,
        classObj.name,
        data
      );
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const getExam = async (id) => {
  return await exam
    .findById(id)
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Exam not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const getAllExams = async () => {
  return await exam
    .find()
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const updateExam = async (id, examObj) => {
  const oldExam = await exam.findById(id);
  return await exam
    .findByIdAndUpdate(id, examObj, { new: true })
    .then(async (data) => {
      if (data) {
        const students = await classService.getEnrolledStudentsData(data.class);
        const classObj = await classService.getClassById(data.class);
        await examMailService.sendExamUpdateNotification(
          students,
          classObj.name,
          data
        );
        if (oldExam.status !== "Cancelled" && examObj.status === "Cancelled") {
          await examMailService.sendExamCancelNotification(
            students,
            classObj.name,
            data
          );
        }
        return data;
      } else {
        throw new Error("Exam not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const deleteExam = async (id) => {
  return await exam
    .findByIdAndDelete(id)
    .then(async (data) => {
      if (data) {
        const students = await classService.getEnrolledStudentsData(data.class);
        const classObj = await classService.getClassById(data.class);
        await examMailService.sendExamCancelNotification(
          students,
          classObj.name,
          data
        );
        return data;
      } else {
        throw new Error("Exam not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const getMarksByExam = async (id) => {
  return await exam
    .findById(id)
    .populate("marks")
    .then((data) => {
      if (data) {
        return data.marks;
      } else {
        throw new Error("Exam not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const addMarks = async (id, marksObj) => {
  return await exam
    .findById(id)
    .then(async (data) => {
      if (data) {
        //if id is present in marks array then update the marks else add new marks
        const index = data.marks.findIndex((mark) => mark.id == marksObj.id);
        if (index > -1) {
          data.marks[index] = marksObj;
        }
        //if id is not present in marks array then add new marks
        else {
          data.marks.push(marksObj);
        }
        await data.save();
        return data;
      } else {
        throw new Error("Exam not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const getAllExamMarks = async () => {
  return await exam
    .find()
    .populate("marks")
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const getAttendanceByExam = async (id) => {
  return await exam
    .findById(id)
    .populate("attendance")
    .then((data) => {
      if (data) {
        return data.attendance;
      } else {
        throw new Error("Exam not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const saveAttendance = async (id, attendanceArr) => {
  return await exam
    .findByIdAndUpdate(id)
    .then(async (data) => {
      if (data) {
        data.attendance = [];
        for (let i = 0; i < attendanceArr.length; i++) {
          data.attendance.push(attendanceArr[i]);
        }
        await data.save();
        return data;
      } else {
        throw new Error("Exam not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const releaseUnofficialResults = async (id) => {
  return await exam
    .findByIdAndUpdate(id, { status: "Results Released - Unofficial" })
    .then(async (data) => {
      if (data) {
        await data.save();
        return data;
      } else {
        throw new Error("Exam not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const releaseOfficialResults = async (id) => {
  return await exam
    .findByIdAndUpdate(id, { status: "Results Released - Official" })
    .then(async (data) => {
      if (data) {
        await data.save();
        const students = await classService.getEnrolledStudentsData(data.class);
        const classObj = await classService.getClassById(data.class);
        await examMailService.sendExamResultNotification(
          students,
          classObj.name,
          data
        );
        return data;
      } else {
        throw new Error("Exam not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const getExamsByStudent = async (id) => {
  try {
    const classes = await classService.getAllClasses();
    let studentClasses = [];
    for (let i = 0; i < classes.length; i++) {
      const index = classes[i].students.findIndex((student) => student == id);
      if (index > -1) {
        studentClasses.push(classes[i]);
      }
    }
    const exams = await getAllExams();
    let studentExams = [];
    for (let i = 0; i < exams.length; i++) {
      const index = studentClasses.findIndex((studentClass) => {
        return studentClass._id.toString() == exams[i].class.toString();
      });
      if (index > -1) {
        studentExams.push(exams[i]);
      }
    }
    let examData = [];
    let result = undefined;
    studentExams.forEach((exam) => {
      result = undefined;
      exam.marks.forEach((mark) => {
        if (mark.id.toString() == id) {
          result = mark.marks;
        }
      });
      if (!result && result != 0) {
        examData.push({
          _id: exam._id,
          examId: exam.examId,
          name: exam.name,
          description: exam.description,
          class: exam.class,
          status: exam.status,
          date: exam.date,
          time: exam.time,
          result: "Not Released",
          marks: exam.marks,
          attendance: exam.attendance,
          duration: exam.duration,
          durationUnit: exam.durationUnit,
        });
      } else {
        examData.push({
          _id: exam._id,
          examId: exam.examId,
          name: exam.name,
          description: exam.description,
          class: exam.class,
          status: exam.status,
          date: exam.date,
          time: exam.time,
          result: result,
          marks: exam.marks,
          attendance: exam.attendance,
          duration: exam.duration,
          durationUnit: exam.durationUnit,
        });
      }
    });
    const data = {
      exams: examData,
      classes: studentClasses,
    };
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  createExam,
  getExam,
  getAllExams,
  updateExam,
  deleteExam,
  getMarksByExam,
  addMarks,
  getAllExamMarks,
  getAttendanceByExam,
  saveAttendance,
  releaseUnofficialResults,
  releaseOfficialResults,
  getExamsByStudent,
};
