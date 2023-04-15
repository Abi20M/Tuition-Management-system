import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    id : {
        type : String,
        required : true,
        unique : true
    },
    email:{
        type : String,
        required : true,
        unique : true,
    },
    
    password:{
        type: String,
        required : true,
        min : 6
    },


    telephone:{
        type : String,
        required : true,
        unique : true
    },

    address:{
        type : String,
        required : true
    }
},{timestamps:true});//timestamps gives some data about when its created

const Admin = mongoose.model('Admin',adminSchema);

module.exports = Admin;
