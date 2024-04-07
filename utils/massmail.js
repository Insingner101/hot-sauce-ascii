const nodemailer = require('nodemailer');

// Function to send email with student data to a recipient
export function sendEmailToRecipient(students, recipientEmail) {
  // Function to create the email body
  function createEmailBody(students) {
    let body = "<h2>Students interested in the course:</h2>";
    students.forEach(student => {
      body += `
        <p>Name: ${student.name}</p>
        <p>Student ID: ${student.student_id}</p>
        <p>Course ID: ${student.course_id}</p>
        <p>Grade: ${student.grade}</p>
        <p>Email: ${student.email_id}</p>
        <p>Resume: <a href="${student.links}">View Resume</a></p>
        <hr>
      `;
    });
    return body;
  }

  // Email configuration
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bitspilanigoacampusadmn@gmail.com', // Your email address
      pass: 'ielm jeiy xgfm hlao' // Your generated app password
    }
  });

  // Email details
  const mailOptions = {
    from: 'bitspilanigoacampusadmn@gmail.com', // Your email address
    to: recipientEmail,
    subject: 'Students interested in your course',
    html: createEmailBody(students)
  };

  // Sending the email
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
