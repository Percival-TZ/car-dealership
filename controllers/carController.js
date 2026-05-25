const Car = require("../models/Car");

const addCar = async (req, res) => {
    try {
        const car = await Car.create({
            ...req.body,
            images: req.files ? req.files.map(file => file.path) : [],
            createdBy: req.user.id
        });

        res.status(201).json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// READ ALL
const getCars = async (req, res) => {
    try {
        const filter = {};

        // brand filter
        if (req.query.brand) {
            filter.brand = req.query.brand;
        }

        // year filter
        if (req.query.year) {
            filter.year = Number(req.query.year);
        }

        // price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};

            if (req.query.minPrice) {
                filter.price.$gte = Number(req.query.minPrice);
            }

            if (req.query.maxPrice) {
                filter.price.$lte = Number(req.query.maxPrice);
            }
        }
            let query = Car.find(filter);

            // sorting
            if (req.query.sort) {
                query = query.sort(req.query.sort);
            } else {
                query = query.sort("-createdAt");
            }

            // pagination
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 5;

            const skip = (page - 1) * limit;

            query = query.skip(skip).limit(limit);

            const cars = await query;

            res.json({
            page,
            limit,
            results: cars.length,
            cars
            });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// READ ONE
const getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        res.json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE
const updateCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        res.json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE
const deleteCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);

        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        res.json({ message: "Car deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// EXPORT ONCE ONLY
module.exports = {
    addCar,
    getCars,
    getCarById,
    updateCar,
    deleteCar
};