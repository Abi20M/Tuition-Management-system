import mailgen from "mailgen";
import "dotenv/config";
import mailConfig from "../configs/nodeMailer.config";

//Exam Notification for new exam
export const sendNewExamNotification = async (students, className, examObj) => {
  //import mail configs
  let mailTransporter = mailConfig.mailConfigs();

  let MailGenerator = new mailgen({
    theme: "cerberus",
    product: {
      name: "Sysro Tuition Management System",
      link: "http://localhost:3000/",
      logo: "https://drive.google.com/file/d/10eK8LAzVgURg5ltLVhC2H88V2c8mG4BT/view?usp=share_link",
    },
  });

  for (let i = 0; i < students.length; i++) {
    var email = {
      body: {
        name: `${students[i].name}`,
        intro: `New exam has been scheduled for ${className}!, Please check the exam details below.`,
        table: {
          data: [
            {
              item: "Name",
              description: `${examObj.name}`,
            },
            {
              item: "Date",
              description: `${examObj.date.toString().slice(0, 10)}`,
            },
            {
              item: "Time",
              description: `${examObj.time}`,
            },
          ],
          columns: {
            // Optionally, customize the column widths
            customWidth: {
              item: "20%",
              price: "15%",
            },
            // Optionally, change column text alignment
            customAlignment: {
              price: "right",
            },
          },
        },
        action: {
          instructions: "Go to Sysro Exam Portal to view more details",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Go to Exam Portal",
            link: "http://localhost:3000/exam-portal",
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    //convert mailgen body into HTML
    let mail = MailGenerator.generate(email);

    //nodemailer sending credentials
    let details = {
      from: process.env.CLIENT_EMAIL,
      to: `${students[i].email}`,
      subject: `New Exam Scheduled for ${className}`,
      html: mail,
    };

    //send mail through nodemailer
    await mailTransporter
      .sendMail(details)
      .then((data) => {
        console.log(students[i].email + "- New Exam Notification Sent");
      })
      .catch((error) => {
        console.log(
          students[i].email + "- New Exam Notification Failed-" + error
        );
      });
  }
};

//Exam Notification for exam update
export const sendExamUpdateNotification = async (
  students,
  className,
  examObj
) => {
  //import mail configs
  let mailTransporter = mailConfig.mailConfigs();

  let MailGenerator = new mailgen({
    theme: "cerberus",
    product: {
      name: "Sysro Tuition Management System",
      link: "http://localhost:3000/",
      logo: "https://drive.google.com/file/d/10eK8LAzVgURg5ltLVhC2H88V2c8mG4BT/view?usp=share_link",
    },
  });

  for (let i = 0; i < students.length; i++) {
    var email = {
      body: {
        name: `${students[i].name}`,
        intro: `Exam details has been updated in ${examObj.name} for ${className}!, Please check the exam details below.`,
        table: {
          data: [
            {
              item: "Name",
              description: `${examObj.name}`,
            },
            {
              item: "Date",
              description: `${examObj.date.toString().slice(0, 10)}`,
            },
            {
              item: "Time",
              description: `${examObj.time}`,
            },
          ],
          columns: {
            // Optionally, customize the column widths
            customWidth: {
              item: "20%",
              price: "15%",
            },
            // Optionally, change column text alignment
            customAlignment: {
              price: "right",
            },
          },
        },
        action: {
          instructions: "Go to Sysro Exam Portal to view more details",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Go to Exam Portal",
            link: "http://localhost:3000/exam-portal",
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    //convert mailgen body into HTML
    let mail = MailGenerator.generate(email);

    //nodemailer sending credentials
    let details = {
      from: process.env.CLIENT_EMAIL,
      to: `${students[i].email}`,
      subject: `Exam Updated for ${className}`,
      html: mail,
    };

    //send mail through nodemailer
    await mailTransporter
      .sendMail(details)
      .then((data) => {
        console.log(students[i].email + "- Update Exam Notification Sent");
      })
      .catch((error) => {
        console.log(
          students[i].email + "- Update Exam Notification Failed-" + error
        );
      });
  }
};

//Exam Notification for exam cancel
export const sendExamCancelNotification = async (
  students,
  className,
  examObj
) => {
  //import mail configs
  let mailTransporter = mailConfig.mailConfigs();

  let MailGenerator = new mailgen({
    theme: "cerberus",
    product: {
      name: "Sysro Tuition Management System",
      link: "http://localhost:3000/",
      logo: "https://drive.google.com/file/d/10eK8LAzVgURg5ltLVhC2H88V2c8mG4BT/view?usp=share_link",
    },
  });

  for (let i = 0; i < students.length; i++) {
    var email = {
      body: {
        name: `${students[i].name}`,
        intro: `Exam has been cancelled in ${examObj.name} for ${className}!, Please check the exam details below.`,
        table: {
          data: [
            {
              item: "Name",
              description: `${examObj.name}`,
            },
            {
              item: "Date",
              description: `${examObj.date.toString().slice(0, 10)}`,
            },
            {
              item: "Time",
              description: `${examObj.time}`,
            },
          ],
          columns: {
            // Optionally, customize the column widths
            customWidth: {
              item: "20%",
              price: "15%",
            },
            // Optionally, change column text alignment
            customAlignment: {
              price: "right",
            },
          },
        },
        action: {
          instructions: "Go to Sysro Exam Portal to view more details",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Go to Exam Portal",
            link: "http://localhost:3000/exam-portal",
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    //convert mailgen body into HTML
    let mail = MailGenerator.generate(email);

    //nodemailer sending credentials
    let details = {
      from: process.env.CLIENT_EMAIL,
      to: `${students[i].email}`,
      subject: `Exam Cancelled for ${className}`,
      html: mail,
    };

    //send mail through nodemailer
    await mailTransporter
      .sendMail(details)
      .then((data) => {
        console.log(students[i].email + "- Cancel Exam Notification Sent");
      })
      .catch((error) => {
        console.log(
          students[i].email + "- Cancel Exam Notification Failed-" + error
        );
      });
  }
};

//Exam Notification for results release
export const sendExamResultNotification = async (
  students,
  className,
  examObj
) => {
  //import mail configs
  let mailTransporter = mailConfig.mailConfigs();

  let MailGenerator = new mailgen({
    theme: "cerberus",
    product: {
      name: "Sysro Tuition Management System",
      link: "http://localhost:3000/",
      logo: "https://drive.google.com/file/d/10eK8LAzVgURg5ltLVhC2H88V2c8mG4BT/view?usp=share_link",
    },
  });

  for (let i = 0; i < students.length; i++) {
    var email = {
      body: {
        name: `${students[i].name}`,
        intro: `Exam results has been released in ${examObj.name} for ${className}!, Go to the exam portal to view your results.`,
        action: {
          instructions: "Go to Sysro Exam Portal to view results",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Go to Exam Portal",
            link: "http://localhost:3000/exam-portal",
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    //convert mailgen body into HTML
    let mail = MailGenerator.generate(email);

    //nodemailer sending credentials
    let details = {
      from: process.env.CLIENT_EMAIL,
      to: `${students[i].email}`,
      subject: `Exam Results Released for ${className}`,
      html: mail,
    };

    //send mail through nodemailer
    await mailTransporter
      .sendMail(details)
      .then((data) => {
        console.log(students[i].email + "- Exam Results Notification Sent");
      })
      .catch((error) => {
        console.log(
          students[i].email + "- Exam Results Notification Failed-" + error
        );
      });
  }
};

module.exports = {
  sendNewExamNotification,
  sendExamUpdateNotification,
  sendExamCancelNotification,
  sendExamResultNotification,
};
