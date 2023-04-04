import { logEvent } from "./logEvent"

const errorHandler = (err,req,res,next)=>{
    logEvent(`${err.name}: ${err.message}`,'errLog.txt');
    console.log(err.stack);
    res.status(500).send(err.message);
    next();
}

module.exports = errorHandler;