import Class from "../models/class.model";
import Hall from "../models/hall.model";
import Student from "../models/student.model";
import classMails from "../Mails/class.mails";
import Schedule from "../models/hallSchedule.model";

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

export const validateNewClass = (data, nS, nE) => {
  var allocatedSlotCount = 0;

  console.log(nS);
  console.log(nE);

  data.map((data) => {
    // convert exsiting class start date to 24Hr time format
    const oS = new Date(data.startTime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });

    // convert exsiting class start date to 24Hr time format
    const oE = new Date(data.endTime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });

    console.log(oS);
    console.log(oE);

    // validate class
    if (nS < oS && nE > oS) {
      allocatedSlotCount++;
    } else if (nS >= oS && nE <= oE) {
      allocatedSlotCount++;
    } else if (nS < oE && nE >= oE) {
      allocatedSlotCount++;
    }
  });

  // return true when class can shedule withing given time period
  return allocatedSlotCount === 0;
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

  const newScheduleObj = {
    classId : newClassObj.id,
    hallId: newClassObj.venue,
    day: newClassObj.day,
    startTime: newClassObj.startTime,
    endTime: newClassObj.endTime,
  };

  //extract start time from newclass object and then it convert into 24hour format for comparing
  const nS = new Date(newScheduleObj.startTime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  //extract end time from newclass object and then it convert into 24hour format for comparing
  const nE = new Date(newScheduleObj.endTime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  //todo here we have to validate class data and add return statements to the else part
  return Schedule.find({ hallId: newClassObj.venue, day: newClassObj.day })
    .then(async (data) => {
      // filter hall using hallId and day, if there is no data, then we can create a class directly without validation
      if (data.length !== 0) {
        //validate new class
        if (validateNewClass(data, nS, nE)) {
          // create schedule object and save in the database
          return Schedule.create(newScheduleObj).then(async (data) => {
            await data.save();
            // create class object and save and return saved class object
            return Class.create(newClassObj).then(async (data) => {
              await data.save();
              return data;
            });
          });
        } else {
          throw new Error("Timeslot is already alocated for another class");
        }
      } else {
        // create schedule object and save in the database
        return await Schedule.create(newScheduleObj).then(async (data) => {
          await data.save();
          // create class object and save and return saved class object
          return Class.create(newClassObj).then(async (obj) => {
            await obj.save();
            return obj;
          });
        });
      }
    })
    .catch((error) => {
      throw new Error("Timeslot is already alocated for another class");
    });

  // return await Class.create(newClassObj)
  // .then(async (obj) => {
  //   await obj.save();
  //   return obj;
  // })
  // .catch((error) => {
  //   throw new Error(error.message);
  // });
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
