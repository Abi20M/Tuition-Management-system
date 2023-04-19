import express from "express";
import "dotenv/config";
import cors from "cors";
import { logger } from "./middleware/logEvent";
import errorHandler from "./middleware/errorHandler";
import DB_Connect from "./utils/index";
import Routes from "./routes/index";
import responseHandler from './utils/response.handlers';

//initialize express
const app = express();

//set PORT
const PORT = process.env.PORT || 6000;

//custom middleware logger
app.use(logger);


//Cross Origin Resource Sharing Options
const whiteList = ["http://localhost:3000"];

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionSuccessStatus: 200,
}; //we setUp access restrict using CORS

//config middleware
app.use(cors(corsOptions));

//set middleware to handle form data, because of this we can pull the data as a parameter
app.use(express.urlencoded({ extended: false }));

//get json data to backend we use this middleware
app.use(express.json());

//use Error Handler to create error Log
app.use(errorHandler);

//inject error handlers to the Request chain
app.use((req,res,next) =>{
  req.handleResponse = responseHandler;
  next();
});

app.get("/",(req,res,next) =>{
  res.send("<h1>Sysro Student Mangement System</h1>");
});

//config server(start)
app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}!`);
  DB_Connect; //database connection
  Routes(app); //import routes

});
