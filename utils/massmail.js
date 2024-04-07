const nodemailer = require('nodemailer');

// Function to send email with student data to a recipient
export function sendEmailToRecipient(studentData, recipientEmail) {
    // Function to create the email body
    function createEmailBody(students) {
        let body = "<h2>Students interested in the course:</h2>";
        students.forEach(student => {
            body += `
                <p>Name: ${student.name}</p>
                <p>ID: ${student.id}</p>
                <p>Grade: ${student.grade}</p>
                <p>Email: ${student.email}</p>
                <p>Resume: <a href="${student.resumeLink}">View Resume</a></p>
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
        html: createEmailBody(studentData)
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

// Sample data of students interested in the course
const students = [
    {
        name: "Kenz Abdulla",
        id: "2021A7PS2664G",
        grade: "A",
        email: "f20212664@goa.bits-pilani.ac.in",
        resumeLink: "https://youtu.be/dQw4w9WgXcQ?si=tLNRiXN39vnR55Zs"
    },
    {
        name: "John Sebastian",
        id: "2021A8PS2919G",
        grade: "A-",
        email: "jf20212919@goa.bits-pilani.ac.in",
        resumeLink: "https://www.youtube.com/watch?v=rNjMrQvgqbY"
    }
    // Add more student data as needed
];

// Recipient email address
const recipientEmail = 'f20212664@goa.bits-pilani.ac.in'; // Faculty member's email address

// Call the function to send email to the recipient with student data
sendEmailToRecipient(students, recipientEmail);
