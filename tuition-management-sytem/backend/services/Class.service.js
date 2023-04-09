import Class from "../models/class.model";
import Hall from "../models/hall.model";

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
    id : id,
    name : classobj.name,
    teacher : classobj.teacher,
    subject : classobj.subject,
    day : classobj.day,
    startTime : classobj.startTime,
    venue : classobj.venue,
    endTime : classobj.endTime,
    students : []    
  }

  return await Class.create(newClassObj).then(async (obj) =>{
      await obj.save();
      return obj;
  }).catch((error) =>{
    throw new Error(error.message);
  })
};

export const getAllClasses = async () =>{
  return await Class.find();
  
}

export const deleteClass = async(id) =>{
  return await Class.findByIdAndDelete(id);
}

// get hall details
export const getAllHallDetails = async()=>{
  return await Hall.find();
}

// edit class details
export const editClassDetails = async(id,editedDetails) =>{
  return await Class.findByIdAndUpdate(id,editedDetails,{new:true});
}


module.exports = {
  createClass,
  getAllClasses,
  deleteClass,
  getAllHallDetails,
  editClassDetails
};
