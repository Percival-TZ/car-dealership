const express = require("express");

const {
    addFavorite,
    getFavorites
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Add favorite
router.post(
    "/favorites/:carId",
    protect,
    addFavorite
);

// Get all favorites
router.get(
    "/favorites",
    protect,
    getFavorites
);

const {
    addFavorite,
    getFavorites,
    removeFavorite
} = require("../controllers/userController");

module.exports = router;