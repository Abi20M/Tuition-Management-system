import mailgen from 'mailgen';
import 'dotenv/config';
import mailConfig  from '../configs/nodeMailer.config';


export const sendExceedMail = async (adminName, adminEmail) =>{
    
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
            name: `${adminName}`,
            intro: `This is send because of total amount of expense are exceeded fixed amount`,
            action: {
                instructions: 'To Login to the Sysro Tuition Management System, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Get Access to the expense portal',
                    link: 'http://localhost:3000/financial/login'
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
        to : `${adminEmail}`,
        subject : `Expense limit is exceeded`,
        html : mail
    }
    
    //send mail through nodemailer
    await mailTransporter.sendMail(details).then((data) =>{
        return data;
    }).catch((error) =>{
        return error;
    })
        
}


module.exports = {
    sendExceedMail,
    
}
