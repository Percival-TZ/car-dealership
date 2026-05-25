const User = require("../models/User");
const Car = require("../models/Car");

// Add car to favorites
const addFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const car = await Car.findById(req.params.carId);

        if (!car) {
            return res.status(404).json({
                message: "Car not found"
            });
        }

        // avoid duplicates
        if (user.favorites.includes(car._id)) {
            return res.status(400).json({
                message: "Car already in favorites"
            });
        }

        user.favorites.push(car._id);

        await user.save();

        res.json({
            message: "Car added to favorites",
            favorites: user.favorites
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get favorite cars
const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate("favorites");

        res.json(user.favorites);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const removeFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        user.favorites = user.favorites.filter(
            carId => carId.toString() !== req.params.carId
        );

        await user.save();

        res.json({
            message: "Car removed from favorites",
            favorites: user.favorites
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    addFavorite,
    getFavorites,
    removeFavorite
};