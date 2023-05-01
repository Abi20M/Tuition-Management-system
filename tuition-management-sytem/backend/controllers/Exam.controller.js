import examService from "../services/Exam.service";

export const createExam = async (req, res, next) => {
  await examService
    .createExam(req.body)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getExam = async (req, res, next) => {
  await examService
    .getExam(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getAllExams = async (req, res, next) => {
  await examService
    .getAllExams()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const updateExam = async (req, res, next) => {
  await examService
    .updateExam(req.params.id, req.body)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const deleteExam = async (req, res, next) => {
  await examService
    .deleteExam(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getMarksByExam = async (req, res, next) => {
  await examService
    .getMarksByExam(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const addMarks = async (req, res, next) => {
  await examService
    .addMarks(req.params.id, req.body)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getAllExamMarks = async (req, res, next) => {
  await examService
    .getAllExamMarks()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getAttendanceByExam = async (req, res, next) => {
  await examService
    .getAttendanceByExam(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const saveAttendance = async (req, res, next) => {
  await examService
    .saveAttendance(req.params.id, req.body)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const releaseUnofficialResults = async (req, res, next) => {
  await examService
    .releaseUnofficialResults(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const releaseOfficialResults = async (req, res, next) => {
  await examService
    .releaseOfficialResults(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getExamsByStudent = async (req, res, next) => {
  await examService
    .getExamsByStudent(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
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
