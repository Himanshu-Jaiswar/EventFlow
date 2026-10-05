const Event = require('../models/Event');
const OTP = require('../models/OTP');
const Booking = require('../models/Booking');
const { sendOtpEmail } = require('../utils/email');

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.sendBookingOtp = async (req, res) => {
    const otp = generateOtp();
    await OTP.findOneAndDelete({email: req.user.email, action:'event_booking'})
    await OTP.create({email:req.user.email, otp, action:'event_booking'})
    await sendOtpEmail(req.user.email, otp)
    res.json({message: "OTP sent to mail"})
}

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('eventId')
            .populate('userId', 'name email'); // Also pulls user name & email
            
        res.json(bookings);
    } catch (error) {
        console.log("Error fetching all bookings", error);
        res.status(500).json({message: "Server Error"});
    }
}

exports.bookEvent = async (req, res) => {
    const {eventId, otp} = req.body;
    try {
    const eventOtp = await OTP.findOne({email:req.user.email, otp, action:'event_booking'});
    if(!eventOtp){
        return res.status(400).json({message:"Invalid OTP"})
    }

    const event = await Event.findById(eventId)
    if(!event){
        return res.status(400).json({message: "Event not found"})
    }

    if(event <= 0){
        return res.status(400).json({message: "Seats are full"});
    }

    const existingBooking = await Booking.findOne({userId:req.user._id, eventId})
    if(existingBooking){
        return res.status(400).json({message: "You have already booked this event"});
    }

    const booking = await Booking.create({
        userId:req.user._id,
        eventId,
        status:'pending',
        paymentStatus:'non_paid',
        amount: event.ticketPrice
    });

    await OTP.deleteMany({email:req.user.email, action:'event_booking'})

    res.json({booking})

    } catch (error) {
        console.log("Error in bookEvent handler", error);
        res.status(500).json({message: error});
    }
}

exports.confirmBooking = async (req, res) => {
    const paymentStatus = req.body.paymentStatus;
    if(!['paid', 'non_paid'].includes(paymentStatus)){
        return res.status(400).json({message: "Invalid Payment Status"})
    }
    
    const booking = await Booking.findById(req.params.id).populate('eventId')
    if(!booking){
        return res.status(400).json({message: "Booking not found"})
    }

    if(booking.status === 'confirmed'){
        return res.status(400).json({message: "Booking status is already confirmed"})
    }

    const event = await Event.findById(booking.eventId._id)

    if(event.totalSeats <= 0){
        return res.status(400).json({message: "No seats are available"});
    }

    booking.status = 'confirmed';
    if(paymentStatus){
        booking.paymentStatus = paymentStatus;
    }

    await booking.save();
    event.totalSeats -= 1;
    await event.save();
 
    res.json({message: "Booking confirmed"})
}

exports.getMyBooking = async (req, res) => {
    const bookings = await Booking.find({userId:req.user._id}).populate('eventId')
    res.json(bookings);
}

exports.cancelBooking = async (req, res) => {
    const booking = await Booking.findById(req.params.id).populate('eventId');
    if(!booking){
        return res.status(400).json({message: "Booking not found"})
    }

  if(booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin'){
        return res.status(400).json({message: "Unauthorized"});
    }

    
    if(booking.status === 'confirmed'){
        const event = await Event.findById(booking.eventId._id);
        event.totalSeats += 1;
        await event.save();
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({message: "Booking cancelled"})
}