const Booking = require("../models/Booking");

// Create a booking (user)
const createBooking = async (req, res) => {
    try {
        const { carId, date, notes } = req.body;

        const booking = await Booking.create({
            user: req.user.id,
            car: carId,
            date,
            notes
        });

        res.status(201).json({
            message: "Booking created successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get logged-in user's bookings
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate("car")
            .sort("-createdAt");

        res.json(bookings);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Cancel (delete) a booking belonging to the logged-in user
const cancelMyBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        await booking.deleteOne();

        res.json({
            message: "Booking cancelled"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get all bookings (admin)
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("car")
            .populate("user", "-password")
            .sort("-createdAt");

        res.json(bookings);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Cancel (delete) any booking (admin)
const adminCancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        await booking.deleteOne();

        res.json({
            message: "Booking cancelled"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Clear all bookings (admin)
const clearBookings = async (req, res) => {
    try {
        await Booking.deleteMany({});

        res.json({
            message: "All bookings cleared"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    cancelMyBooking,
    getAllBookings,
    adminCancelBooking,
    clearBookings
};
