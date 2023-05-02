import Class from "../models/class.model";
import Hall from "../models/hall.model";
import Student from "../models/student.model";
import classMails from "../Mails/class.mails";

//generate Class Id
const generateClassId = async () => {
  //get last class object, if there is a class, then return that class object, otherwise return empty array
  const lastClassDetails = await Class.find().sort({ _id: -1 }).limit(1);

  //check if the result array is empty or not, if its empty then return first Class Id
  if (lastClassDetails.length == 0) {
    return "CLS-001";
  }

  //if array is not null, last class object id
  const classId = lastClassDetails.map((data) => {
    return data.id;
  });

  //then we get the Integer value from the last part of the ID
  const oldClassId = parseInt(classId[0].split("-")[1]);

  const newClassId = oldClassId + 1; //then we add 1 to the past value

  //then we return the id according to below conditions
  if (newClassId >= 100) {
    return `CLS-${newClassId}`;
  } else if (newClassId >= 10) {
    return `CLS-0${newClassId}`;
  } else {
    return `CLS-00${newClassId}`;
  }
};

export const createClass = async (classobj) => {
  //generate the Class ID
  const id = await generateClassId();

  //create a new object by adding generated ID
  const newClassObj = {
    id: id,
    name: classobj.name,
    teacher: classobj.teacher,
    subject: classobj.subject,
    day: classobj.day,
    startTime: classobj.startTime,
    venue: classobj.venue,
    endTime: classobj.endTime,
    students: [],
  };

  return await Class.create(newClassObj)
  .then(async (obj) => {
    await obj.save();
    return obj;
  })
  .catch((error) => {
    throw new Error(error.message);
  });
  // query for checking if the hall is already assigned at the specified time
  // const query = {
  //   hallName: classobj.venue,
  //   day: classobj.day,
  //   $or: [
  //     {
  //       startTime: { $lte: classobj.startTime },
  //       endTime: { $gte: classobj.startTime },
  //     }, // check if the class start time is within the assigned time
  //     {
  //       startTime: { $lte: classobj.endTime },
  //       endTime: { $gte: classobj.endTime },
  //     }, // check if the class end time is within the assigned time
  //     {
  //       startTime: { $gte: classobj.startTime },
  //       endTime: { $lte: classobj.endTime },
  //     }, // check if the assigned time is within the class start and end time
  //   ],
  // };

  // try {
  //   // execute the query to find any conflicting classes
  //   const conflictClassCount = await Class.find(query).count();

  //   //if there not any conflict class, we are going to add the class
  //   if (conflictClassCount === 0) {
  //     const obj = await Class.create(newClassObj);
  //     await obj.save();
  //     return obj;
  //   } else {
  //     throw new Error("This hall is allocated for this time slot!");
  //   }
  // } catch (error) {
  //   return error;
  // }
};

export const getAllClasses = async () => {
  return await Class.find();
};

export const getClassById = async (id) => {
  return await Class.findById(id);
};

export const deleteClass = async (id) => {
  return await Class.findByIdAndDelete(id);
};

// get hall details
export const getAllHallDetails = async () => {
  return await Hall.find();
};

// edit class details
export const editClassDetails = async (id, editedDetails) => {
    // query for checking if the hall is already assigned at the specified time
    // const query = {
    //   hallName: classobj.venue,
    //   day: classobj.day,
    //   $or: [
    //     {
    //       startTime: { $lte: classobj.startTime },
    //       endTime: { $gte: classobj.startTime },
    //     }, // check if the class start time is within the assigned time
    //     {
    //       startTime: { $lte: classobj.endTime },
    //       endTime: { $gte: classobj.endTime },
    //     }, // check if the class end time is within the assigned time
    //     {
    //       startTime: { $gte: classobj.startTime },
    //       endTime: { $lte: classobj.endTime },
    //     }, // check if the assigned time is within the class start and end time
    //   ],
    // };

    // try {
    //   // execute the query to find any conflicting classes
    //   const conflictClassCount = await Class.find(query).count();
  
    //   //if there not any conflict class, we are going to add the class
    //   if (conflictClassCount === 0) {
    //     return await Class.findByIdAndUpdate(id, editedDetails, { new: true });
    //   } else {
    //     throw new Error("This hall is allocated for this time slot!");
    //   }
    // } catch (error) {
    //   return error;
    // }


    return await Class.findByIdAndUpdate(id, editedDetails, { new: true });
  
};

export const enrollStudent = async (enrollmentData) => {
  classMails.sendEnrollEmail(
    enrollmentData.studentName,
    enrollmentData.studentEmail,
    enrollmentData.className
  );
  return await Class.findByIdAndUpdate(
    { _id: enrollmentData.classId },
    { $push: { students: enrollmentData.studentID } },
    { new: true }
  );
};

export const getEnrolledStudentsData = async (classID) => {
  return await Class.findById(classID)
    .populate("students")
    .then((data) => {
      if (data) {
        return data.students;
      } else {
        throw new Error("Class not found");
      }
    })
    .catch((err) => {
      throw new Error(err.messasge);
    });
};

export const unEnrollStudent = async (
  studentId,
  studentName,
  studentEmail,
  classId,
  className
) => {
  await classMails.sendUnenrollEmail(studentName, studentEmail, className);
  return await Class.findByIdAndUpdate(
    { _id: classId },
    { $pull: { students: studentId } },
    { new: true }
  )
    .populate("students")
    .then((data) => {
      if (data) {
        return data.students;
      } else {
        throw new Error("Class not found");
      }
    })
    .catch((err) => {
      throw new Error(err.messasge);
    });
};
module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  deleteClass,
  getAllHallDetails,
  editClassDetails,
  enrollStudent,
  getEnrolledStudentsData,
  unEnrollStudent,
};
