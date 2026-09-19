const Event = require('../models/Event');

exports.getAllEvents = async (req, res) => {
    try {

        const filters = {}
        if(req.query.category){
            filters.category = req.query.category
        }
        if(req.query.ticketPrice){
            filters.ticketPrice = req.query.ticketPrice
        }

        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({message: error})
    }
}

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if(!event){
            return res.status(400).json({message: "Event not found"});
        }
        res.json({event})
    } catch (error) {
        console.log("Error in get event by id controller", error);
        res.status(500).json({message: error});
    }
}

exports.createEvent = async (req, res) => {
    const {title, description, date, location, category, ticketPrice, totalSeats, availableSeats, imageUrl, createdBy} = req.body;
    try {
        const event = await Event.create({
            title,
            description,
            date,
            location,
            totalSeats,
            availableSeats,
            category,
            ticketPrice,
            imageUrl,
            createdBy
        });

        res.status(200).json(event)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

exports.updateEvent = async (req, res) => {
    const {title, description, date, location, category, ticketPrice, totalSeats, imageUrl} = req.body;
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, {
            title,
            description,
            date,
            location,
            category,
            ticketPrice,
            totalSeats,
            imageUrl
        });

        if(!event){
            res.status(400).json({message: "Event not found"});
        }
        res.status(200).json({message: "Event has been updated successfully"})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.deleteEvent = async (req, res) => {
    const event = await Event.findByIdAndDelete(req.params.id);
    if(!event){
        return res.status(400).json({message: "Event is not found"})
    }
    res.status(200).json({message: "Event has been deleted successfully"});
}