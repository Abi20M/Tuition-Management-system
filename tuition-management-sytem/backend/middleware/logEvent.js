
const {format} = require("date-fns");
const {v4 :uuid} = require("uuid");

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvent = async (message,name) =>{
    
    const dateTime = `${format(new Date(), 'yyyy/MM/dd\tHH:mm:ss')}`;
    const longItem = `${dateTime} \t $${uuid()}\t${message}\n`;
    console.log(longItem);

    try{
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){

            await fsPromises.mkdir(path.join(__dirname,'..','logs'))
        }
        await fsPromises.appendFile(path.join(__dirname,'..','logs',name,),longItem);
    }catch(err){
        console.error(err);
    }
}

//logger custom middleware for request Log
const logger =(req,res,next)=>{
    logEvent(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
  }

module.exports = {logger, logEvent};
