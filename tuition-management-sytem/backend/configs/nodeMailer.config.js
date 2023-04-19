import nodemailer from 'nodemailer';

export const mailConfigs = () =>{
    return nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : process.env.CLIENT_EMAIL,
            pass : process.env.CLIENT_PASSWORD
        }
    });
}

module.exports ={
    mailConfigs
};



