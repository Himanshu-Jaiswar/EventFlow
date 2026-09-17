const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.USER_EMAIL,
        pass:process.env.USER_PASS
    }
})

exports.sendOtpEmail = async (email, otp, type) => {
    try {
        const mailOptions = {
            from:process.env.USER_EMAIL,
            to:email,
            subject:"Your OTP code",
            text:`Your OTP code is ${otp}`
        }

        await transporter.sendMail(mailOptions);
        console.log(`email has been sent to ${email} for`);
    } catch (error) {
        console.log("Error while senid email", error);
    }
}