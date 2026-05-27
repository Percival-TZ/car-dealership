const Car = require("../models/Car");
const User = require("../models/User");

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

module.exports = {
    getDashboardStats
};