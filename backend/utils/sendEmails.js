const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    try {
        console.log("===== EMAIL DEBUG START =====");
        console.log("SMTP_EMAIL:", process.env.SMTP_EMAIL);
        console.log("Recipient:", options.email);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });

        await transporter.verify();
        console.log("SMTP Connection Successful");

        const mailOptions = {
            from: `Shopnest <${process.env.SMTP_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message
        };

        const result = await transporter.sendMail(mailOptions);

        console.log("Email Sent Successfully");
        console.log("Message ID:", result.messageId);
        console.log("Accepted:", result.accepted);
        console.log("Rejected:", result.rejected);

        console.log("===== EMAIL DEBUG END =====");

        return result;
    }
    catch (error) {
        console.error("EMAIL ERROR");
        console.error(error);
        throw error;
    }
};

module.exports = sendEmail;