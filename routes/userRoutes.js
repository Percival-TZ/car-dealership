const express = require("express");

const {
    addFavorite,
    getFavorites,
    removeFavorite,
    getProfile
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// favorites
router.post(
    "/favorites/:carId",
    protect,
    addFavorite
);

router.get(
    "/favorites",
    protect,
    getFavorites
);

router.delete(
    "/favorites/:carId",
    protect,
    removeFavorite
);

// profile
router.get(
    "/profile",
    protect,
    getProfile
);

module.exports = router;