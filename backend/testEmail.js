require("dotenv").config({
    path: "./config/config.env"
});

console.log("__dirname =", __dirname);
console.log("cwd =", process.cwd());
console.log("email =", process.env.SMTP_EMAIL);
console.log("password =", process.env.SMTP_PASSWORD);const nodemailer = require("nodemailer");
console.log(process.env.SMTP_EMAIL);
console.log(process.env.SMTP_PASSWORD);

async function test() {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    await transporter.verify();
    console.log("SMTP Connected");

    const info = await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: process.env.SMTP_EMAIL,
        subject: "Test Email",
        text: "Hello from Shopnest",
    });

    console.log("Mail Sent:", info.messageId);
}

test().catch(console.error);