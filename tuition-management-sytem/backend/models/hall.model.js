import mongoose from "mongoose";

const hallSchema = new mongoose.Schema({
    hallID : {
        type : String,
        unique : true,
        required : true
    },
    capacity : {
        type : Number,
        required : true
    }
},{timestamps:true});

const Hall = mongoose.model("halls",hallSchema);

export default Hall;