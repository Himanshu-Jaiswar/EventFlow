const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { sendOtpEmail } = require("../utils/email");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
    const token = jwt.sign({id, role}, process.env.JWT_SECRET, {expiresIn:'7d'});
    return token;
}

const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400).json({message: "User already exists"})
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({name, email, password:hashedPassword, role:'user', isVerified:false});

        await OTP.deleteMany({ email, action: 'account_verification' });

        const otp = Math.floor(10000 + Math.random() * 900000).toString();
        await OTP.create({email, otp, action:'account_verification'})

        await sendOtpEmail(email, otp);


        res.status(201).json({
            message: "User resgistered successfully",
            email: user.email
        });

    } catch (error) {
        console.log("Error in auth controller", error);
        res.status(500).json({message: "Error in auth controller"})
    }
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email})
        if(!user){
            res.status(400).json({message: "User does not exists"})
            return;
        }

        const comparePass = await bcrypt.compare(password, user.password);
        if(!comparePass){
            res.status(400).json({message: "Invalid Password"});
            return;
        }

        if(!user.isVerified && user.role === 'user'){
            await OTP.deleteMany({email, action:'account_verification'});
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await OTP.create({email, otp, action:'account_verification'});
            await sendOtpEmail(email, otp);

            return res.status(400).json({message: "Email is not varified. OTP has been sent"})
        }

        res.status(200).json({
            message: "Login successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        })

    } catch (error) {
        console.log("Error in login handle", error);
        res.status(500).json({message: "Error in login handle"});
    }
}

const verifyOtp = async (req, res) => {
    const {email, otp} = req.body;
    try {
        const getOtp = await OTP.findOne({email, otp, action: 'account_verification'});
        if(!getOtp){
            return res.status(400).json({message:"Otp has been expired"});
        }

        const user = await User.findOneAndUpdate({email}, {isVerified:true});
        await OTP.deleteMany({email, action:'account_verification'})

        res.json({
            message: "Account varified successfully",
            name: user.name,
            _id: user._id,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        console.log("Error in otp verificatino", error);
        res.status(500).json({message:"Erron in otp verification"});
    }
}

module.exports = {
    registerUser,
    loginUser,
    verifyOtp
}