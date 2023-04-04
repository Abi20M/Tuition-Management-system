import mongoose from 'mongoose';
import 'dotenv/config';


const DB_Connect = mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("💀 Database Synced");
}).catch((err)=>{
    console.log(`⚠️ ${err} did not connected!`);
});

module.exports = DB_Connect;