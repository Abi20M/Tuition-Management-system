import fee from "../models/fee.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

//generate Fee Id
const generateFeeId = async () => {
  //get last fee object, if there is a fee, then return that fee object, otherwise return empty array
  const lastFeeDetails = await fee.find().sort({ _id: -1 }).limit(1);
  
  //check if the result array is empty or not, if its empty then return first fee Id
  if (lastFeeDetails.length == 0) {
    return "PAY-001";
  }

  //if array is not null, last fee object id
  const feeId = lastFeeDetails.map((data) => {
    return data.id;
  });

  //then we get the Integer value from the last part of the ID
  const oldFeeId = parseInt(feeId[0].split("-")[1]);

  const newFeeId = oldFeeId + 1; //then we add 1 to the past value

  //then we return the id according to below conditions
  if (newFeeId >= 100) {
    return `PAY-${newFeeId}`;
  } else if (newFeeId >= 10) {
    return `PAY-0${newFeeId}`;
  } else {
    return `PAY-00${newFeeId}`;
  }
};

export const createFee = async (feeObj) => {
    // const emailExists = await fee.findOne({ email: feeObj.email});
    // if (emailExists) {
    //     throw new Error("Email already exists");

    // } else{

      //generate Fee Id
      const payId = await generateFeeId();

      //create new Fee obj with custom Fee ID
      const newFeeObj = {
        id : payId,
        name : feeObj.name,
      }
      
        return await fee
            .create(newFeeObj)
            .then(async (data) => {
                await data.save();
                return data;
            })
            .catch((err) => {
                throw new Error(err.message);
            });
    //}
};

export const getFee = async (id) => {
    return await fee
        .findById(id)
        .then((data) => {
            if(data) {
                    return data;
                }else {
                    throw new Error("Fee not found");
                }
        })
        .catch((err) => {
            throw new Error(err.message);
        });
};

export const getAllFees = async () => {
    return await fee
        .find()
        .then((data) => {
            return data;
        })
        .catch((err) => {
            throw new Error(err.message);
        });
};

export const updateFee = async (id, feeObj) => {
    return await fee
      .findByIdAndUpdate(id, feeObj, { new: true })
      .then((data) => {
        if (data) {
          return data;
        } else {
          throw new Error("ee not found");
        }
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  };

  export const deleteFee = async (id) => {
    return await fee
      .findByIdAndDelete(id)
      .then((data) => {
        if (data) {
          return data;
        } else {
          throw new Error("Fee not found");
        }
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  };
  export const getFeeCountService = async () =>{
    return await fee.countDocuments();
  }
  module.exports = {
    createFee,
    getFee,
    getAllFees,
    updateFee,
    deleteFee,
    getFeeCountService
  };

