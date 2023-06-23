import Class from "../models/class.model";
import Hall from "../models/hall.model";
import classMails from "../Mails/class.mails";
import Schedule from "../models/hallSchedule.model";
import Attendance from "../models/Attendance.model";

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

  data.map((classObj) => {
    classObj.classes.map((Schedule) => {
      // convert exsiting class start date to 24Hr time format
      const oS = new Date(Schedule.startTime).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      });

      // convert exsiting class start date to 24Hr time format
      const oE = new Date(Schedule.endTime).toLocaleTimeString("en-US", {
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
    id: newClassObj.id,
    startTime: newClassObj.startTime,
    endTime: newClassObj.endTime,
  };

  const scheduleStructure = {
    hallId: newClassObj.venue,
    day: newClassObj.day,
    classes: [newScheduleObj],
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
  return Schedule.find({
    hallId: newClassObj.venue,
    day: newClassObj.day,
  }).then(async (data) => {
    // filter hall using hallId and day, if there is no data, then we can create a class directly without validation
    if (data.length !== 0) {
      //validate new class
      if (validateNewClass(data, nS, nE)) {
        // create schedule object and save in the database
        return Schedule.findOneAndUpdate(
          { hallId: newClassObj.venue, day: newClassObj.day },
          { $push: { classes: newScheduleObj } },
          { new: true }
        ).then(async (scheduleObj) => {
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
      return await Schedule.create(scheduleStructure).then(async (data) => {
        await data.save();
        // create class object and save and return saved class object
        return Class.create(newClassObj).then(async (obj) => {
          await obj.save();
          return obj;
        });
      });
    }
  });
};

export const getAllClasses = async () => {
  return await Class.find();
};

export const getClassById = async (id) => {
  return await Class.findById(id);
};

export const deleteClass = async (id, cusId, day, hall, startTime, endTime) => {
  return await Schedule.findOneAndUpdate(
    { hallId: hall, day: day },
    {
      $pull: { classes: { id: cusId, startTime: startTime, endTime: endTime } },
    }
  ).then(async (result) => {
    return await Class.findByIdAndDelete(id).then((data)=>{
      Attendance.findOneAndDelete({classId : data._id});
    });

  });
};

// get hall details
export const getAllHallDetails = async () => {
  return await Hall.find();
};

// edit class details
export const editClassDetails = async (
  id,
  classCustomId,
  editedDetails,
  currentStartTime,
  currentEndTime
) => {
  const newScheduleObj = {
    id: classCustomId,
    startTime: editedDetails.startTime,
    endTime: editedDetails.endTime,
  };

  const scheduleStructure = {
    hallId: editedDetails.venue,
    day: editedDetails.day,
    classes: [newScheduleObj],
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

  return await Schedule.findOneAndUpdate(
    { hallId: editedDetails.venue, day: editedDetails.day },
    {
      $pull: {
        classes: {
          id: classCustomId,
          startTime: currentStartTime,
          endTime: currentEndTime,
        },
      },
    },
    { new: true }
  ).then(async (result) => {
    console.log(result);

    return Schedule.find({
      hallId: editedDetails.venue,
      day: editedDetails.day,
    }).then(async (data) => {
      // filter hall using hallId and day, if there is no data, then we can create a class directly without validation
      if (data.length !== 0) {
        //validate new class
        if (validateNewClass(data, nS, nE)) {
          // create schedule object and save in the database
          return Schedule.findOneAndUpdate(
            { hallId: editedDetails.venue, day: editedDetails.day },
            { $push: { classes: newScheduleObj } },
            { new: true }
          ).then(async (scheduleObj) => {
            // create class object and save and return saved class object
            return Class.findByIdAndUpdate(id, editedDetails, {
              new: true,
            }).then(async (data) => {
              await data.save();
              return data;
            });
          });
        } else {
          throw new Error("Timeslot is already alocated for another class");
        }
      } else {
        // create schedule object and save in the database
        return await Schedule.create(scheduleStructure).then(async (data) => {
          await data.save();
          // create class object and save and return saved class object
          return Class.findByIdAndUpdate(id, editedDetails).then(
            async (obj) => {
              await obj.save();
              return obj;
            }
          );
        });
      }
    });
  });

  // return await Class.findByIdAndUpdate(id, editedDetails, { new: true });
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
  ).then(async (result) => {
    const AttendanceObj = {
      classId: enrollmentData.classId,
      students: [
        {
          studentId: enrollmentData.studentID,
        },
      ],
    };
    await Attendance.find({ classId: enrollmentData.classId }).then(
      async (data) => {
        console.log(data);
        console.log(data.length);
        if (data.length > 0) {
          Attendance.findByIdAndUpdate(
            { _id: data[0]._id },
            { $push: { students: { studentId: enrollmentData.studentID } } },
            { new: true }
          ).then((data) => {
            console.log(data);
            console.log("Student added to Attendance Form Successfully!");
          });
        } else {
          await Attendance.create(AttendanceObj).then((data) => {
            data.save();
          });
        }
      }
    ).catch((error)=>{
      console.log(error)
    });
  });
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
  return await Class.findByIdAndUpdate(
    { _id: classId },
    { $pull: { students: studentId } },
    { new: true }
  )
    .populate("students")
    .then(async (data) => {
      if (data) {
        //send an unenrollment email to the student
        await classMails.sendUnenrollEmail(
          studentName,
          studentEmail,
          className
        );

        // delete class Attendance According to the relevent class and student
        await Attendance.find({ classId: classId }).then(async (data) => {
          await Attendance.findByIdAndUpdate(
            { _id: data[0]._id },
            { $pull: { students: { studentId: studentId } } },
            { new: true }
          )
            .then((data) => {
              console.log(data);
              console.log("Student removed from attendance form!");
            })
            .catch((error) => {
              console.log(error);
              console.log(error.message);
            });
        });

        return data.students;
      } else {
        throw new Error("Class not found");
      }
    })
    .catch((err) => {
      throw new Error(err.messasge);
    });
};

export const getHallScheduleService = async () => {
  return await Schedule.find()
    .then((data) => {
      // loop through all the schedules
      for (let i = 0; i < data.length; i++) {
        // sort classes in ascending order by its startTime
        data[i].classes.sort(({ startTime: a }, { startTime: b }) => {
          return new Date(a).toLocaleTimeString("en-Us", {
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          }) >
            new Date(b).toLocaleTimeString("en-Us", {
              hour: "numeric",
              minute: "numeric",
              hour12: false,
            })
            ? 1
            : new Date(a).toLocaleTimeString("en-Us", {
                hour: "numeric",
                minute: "numeric",
                hour12: false,
              }) <
              new Date(b).toLocaleTimeString("en-Us", {
                hour: "numeric",
                minute: "numeric",
                hour12: false,
              })
            ? -1
            : 0;
        });
      }
      // return sorted schedule details
      return data;
    })
    .catch((error) => {
      throw new Error("Error while fetching schedule details");
    });
};

export const getClassByDay = async (day) => {
  return await Class.find({ day: day })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error("There is an error while fetching class data");
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
  getHallScheduleService,
  getClassByDay,
};
