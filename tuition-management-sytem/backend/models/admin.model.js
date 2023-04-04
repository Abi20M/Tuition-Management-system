import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true
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
    }
},{timestamps:true});//timestamps gives some data about when its created

const Admin = mongoose.model('Admin',adminSchema);

module.exports = Admin;