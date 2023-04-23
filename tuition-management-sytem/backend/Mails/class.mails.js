import mailgen from 'mailgen';
import 'dotenv/config';
import mailConfig  from '../configs/nodeMailer.config';


export const sendEnrollEmail = async (studentName, studentEmail, className) =>{
    
    //import mail configs
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
            intro: `We are pleased to inform you that you have been successfully enrolled in our tuition management system for ${className}! 
            You can now enjoy the benefits of our platform, including easy fee payments, attendance tracking, and progress reports.`,
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
    
    //convert mailgen body into HTML
    let mail = MailGenerator.generate(email);
    
    //nodemailer sending credentials
    let details = {
        from : process.env.CLIENT_EMAIL,
        to : `${studentEmail}`,
        subject : `You are enrolled in to the ${className}`,
        html : mail
    }
    
    //send mail through nodemailer
    await mailTransporter.sendMail(details).then((data) =>{
        return data;
    }).catch((error) =>{
        return error;
    })
        
}


export const sendUnenrollEmail = async (studentName, studentEmail, className) =>{
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
            intro: `We regret to inform you that you have been unenrolled from our tuition management system for ${className}.
            We apologize for any inconvenience this may have caused.`,
            action: {
                instructions: 'If you have any outstanding fees or attendance issues, please contact our support team at <b>sysroinfo@gmail.com</b> to resolve them',
                button: {
                    color: '#FF0000', // Optional action button color
                    text: 'Contact Us',
                    link: 'http://localhost:3000/'
                }
            },
            outro: 'We wish you all the best in your academic pursuits and hope to serve you again in the future.'
        }
    };
    
    let mail = MailGenerator.generate(email);
    
    let details = {
        from : "sysroinfo@gmail.com",
        to : `${studentEmail}`,
        subject : `You are Unenrolled from ${className}`,
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
    sendUnenrollEmail
}
