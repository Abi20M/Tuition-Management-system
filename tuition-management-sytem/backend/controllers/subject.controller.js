import subjectService from "../services/subject.service";

export const getAllClasses = async (req,res) => {
  subjectService
    .getAllSubjects()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
    })
    .catch((error) => {
      req.handleResponse.errorRespond(res)(error);
    });
};

module.exports = {
  getAllClasses,
};
