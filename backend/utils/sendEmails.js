// const nodemailer = require("nodemailer");

// const sendEmail = async (options) => {
//     try {
//         console.log("===== EMAIL DEBUG START =====");
//         console.log("SMTP_EMAIL:", process.env.SMTP_EMAIL);
//         console.log("Recipient:", options.email);

//         // const transporter = nodemailer.createTransport({
//         //     service: "gmail",
//         //     auth: {
//         //         user: process.env.SMTP_EMAIL,
//         //         pass: process.env.SMTP_PASSWORD
//         //     }
//         // });

//         const transporter = nodemailer.createTransport({
//             host: "smtp.gmail.com",
//             port: 587,
//             secure: false, // Must be false for port 587
//             auth: {
//                 user: process.env.SMTP_EMAIL,
//                 pass: process.env.SMTP_PASSWORD
//             },
//             tls: {
//                 rejectUnauthorized: false // Helps prevent local connection dropped errors
//             }
//         });

//         await transporter.verify();
//         console.log("SMTP Connection Successful");

//         const mailOptions = {
//             from: `Shopnest <${process.env.SMTP_EMAIL}>`,
//             to: options.email,
//             subject: options.subject,
//             text: options.message
//         };

//         const result = await transporter.sendMail(mailOptions);

//         console.log("Email Sent Successfully");
//         console.log("Message ID:", result.messageId);
//         console.log("Accepted:", result.accepted);
//         console.log("Rejected:", result.rejected);

//         console.log("===== EMAIL DEBUG END =====");

//         return result;
//     }
//     catch (error) {
//         console.error("EMAIL ERROR");
//         console.error(error);
//         throw error;
//     }
// };

// module.exports = sendEmail;

const { Resend } = require("resend");

const sendEmail = async (options) => {
    try 
    {
        console.log("===== EMAIL DEBUG START =====");
        console.log("Recipient:", options.email);

        // Initialize Resend with your API Key
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Send the email using Resend's API
        const { data, error } = await resend.emails.send({
            // NOTE: While testing, you MUST use this 'from' address until you verify a custom domain
            from: "Shopnest <onboarding@resend.dev>",
            to: options.email,
            subject: options.subject,
            text: options.message
        });

        if (error) {
            throw error;
        }

        console.log("Email Sent Successfully via Resend API");
        console.log("Message ID:", data.id);
        console.log("===== EMAIL DEBUG END =====");

        return data;
    }
    catch (error) {
        console.error("RESEND API ERROR");
        console.error(error);
        throw error;
    }
};

module.exports = sendEmail;

