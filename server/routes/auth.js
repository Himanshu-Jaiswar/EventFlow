const express = require("express");
const { registerUser, loginUser, verifyOtp } = require("../controllers/authControllers");
const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verifyotp', verifyOtp);

module.exports = router