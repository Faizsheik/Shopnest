const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    // 1. Create the reusable transporter object using SMTP configuration from .env
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_EMAIL,     // Your Gmail: faizsheik008@gmail.com
            pass: process.env.SMTP_PASSWORD,  // Your Gmail App Password
        },
    });

    // 2. Define the routing setup cleanly using parameters passed in
    const mailOptions = {
        from: `Mini-Ecommerce <${process.env.SMTP_EMAIL}>`, 
        to: options.email,       // Dynamic destination parameter
        subject: options.subject, // Dynamic subject line
        text: options.message,   // Dynamic message body string
    };

    // 3. Send the message envelope
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;