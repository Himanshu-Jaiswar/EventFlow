const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL required for production/Render
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS // Must be Google App Password (16 chars, no spaces)
    },
    tls: {
        rejectUnauthorized: false
    }
});

exports.sendOtpEmail = async (email, otp, type) => {
    try {
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to ${email}: ${info.response}`);
        return info;
    } catch (error) {
        console.error("Nodemailer transport error:", error);
        // Re-throw so controllers catch the failure and return 500 status to React
        throw new Error("Failed to send OTP email via SMTP");
    }
};