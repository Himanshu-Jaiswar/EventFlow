const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    action:{
        type:String,
        enum:['account_verification', 'event_booking']
    },
    createdAt:{
        type:Date,
        defualt:Date.now,
        expires:300
    }
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;