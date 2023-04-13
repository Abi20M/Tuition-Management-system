const mailgen = require("mailgen");
import 'dotenv/config';
import mailConfig  from '../configs/nodeMailer.config';


export const sendEnrollEmail = async (studentName, studentEmail, className) =>{
    
    let mailTransporter = mailConfig.mailConfigs();

    let MailGenerator = new mailgen({
        theme: "cerberus",
        product : {
            name: "Sysro Tuition Management System",
            link : 'http://localhost:3000/',
            logo : 'https://drive.google.com/file/d/10eK8LAzVgURg5ltLVhC2H88V2c8mG4BT/view?usp=share_link'
        }
    })
    
    var email = {
        body: {
            name: `${studentName}`,
            intro: `Welcome to ${className}! We\'re very excited to have you on board.`,
            action: {
                instructions: 'To get started with Sysro Tuition Management System, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Get Access Class Materials',
                    link: 'http://localhost:3000/student/login/'
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };
    
    let mail = MailGenerator.generate(email);
    
    let details = {
        from : "sysroinfo@gmail.com",
        to : `${studentEmail}`,
        subject : `You are enrolled in to the ${className}`,
        html : mail
    }
    
    await mailTransporter.sendMail(details).then((data) =>{
        return data;
    }).catch((error) =>{
        return error;
    })
        
}


module.exports = {
    sendEnrollEmail,
}
