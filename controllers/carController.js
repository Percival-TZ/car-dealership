const Car = require("../models/Car");

// Add a car
const addCar = async (req, res) => {
    try {
        const car = await Car.create({
            ...req.body,
            createdBy: req.user.id
        });

        res.status(201).json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all cars
const getCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addCar,
    getCars
};