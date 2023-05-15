import mongoose from 'mongoose'



const hallScheduleModel = mongoose.Schema({
    hallId: {
        type : String,
        required : true
    },
    day : {
        type : String,
        required : true 
    },
    startTime : {
        type : Date,
        required : true
    },
    endTime :{
        type:Date,
        required : true
    }
},{timestamps:true})


const hallSchedule = mongoose.model("hallSchedules",hallScheduleModel);

export default hallSchedule;

