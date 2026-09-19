const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    eventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Event',
        required: true
    },
    status:{
        type:String,
        enum:['pending', 'confirmed', 'cancelled'],
        required: true
    },
    paymentStatus:{
        type:String,
        enum:['non_paid', 'paid'],
        defualt:'paid'
    },
    amount:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('Booking', bookingSchema);