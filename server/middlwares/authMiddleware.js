const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv')
dotenv.config()

const protect = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null;
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if(!req.user){
                res.status(400).json({message:"Invalid user"})
                return;
            }
            next();

        } catch (error) {
            console.log("Error in middleware or token is invalid", error);
            res.status(500).json({ message: "Error in middleware or token not valid" })
        }
    }
    else{
        return res.status(500).json({message: "Invalid Token"})
    }
}

const admin = (req, res, next) => {
    if(req.user && req.user.role === 'admin'){
        next();
    }
    else{
        return res.status(403).json({message: "Forbidden, admin access required"});
    }
}

module.exports = {protect, admin}