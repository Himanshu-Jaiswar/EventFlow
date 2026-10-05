const express = require("express");
const { protect, admin } = require("../middlwares/authMiddleware");
const { sendBookingOtp, bookEvent, getMyBooking, confirmBooking, cancelBooking, getAllBookings } = require("../controllers/bookingControllers");
const router = express.Router();

router.post('/', protect, bookEvent);
router.post('/send-otp', protect, sendBookingOtp);
router.get('/my', protect, getMyBooking);
router.put('/:id/confirm', protect, admin, confirmBooking);
router.delete('/:id', protect, cancelBooking);
router.get('/', protect, admin, getAllBookings);

module.exports = router;