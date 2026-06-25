const Car = require("../models/Car");
const User = require("../models/User");
const Booking = require("../models/Booking");

const getDashboardStats = async (req, res) => {
    try {
        const totalCars = await Car.countDocuments();

        const totalUsers = await User.countDocuments();

        const latestCars = await Car.find()
            .sort("-createdAt")
            .limit(5);

        res.json({
            totalCars,
            totalUsers,
            latestCars
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get all client accounts (excludes admin accounts)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: "admin" } })
            .select("-password")
            .sort("-createdAt");

        res.json(users);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get all bookings
const getBookings = async (req, res) => {
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

// Confirm a booking
const confirmBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        booking.status = "confirmed";
        await booking.save();

        res.json({ message: "Booking confirmed", booking });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Cancel (delete) a single booking
const cancelBooking = async (req, res) => {
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

// Clear all bookings
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
    getDashboardStats,
    getUsers,
    getBookings,
    confirmBooking,
    cancelBooking,
    clearBookings
};