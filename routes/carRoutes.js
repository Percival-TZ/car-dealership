const express = require("express");

const { addCar, getCars } = require("../controllers/carController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

// public route
router.get("/", getCars);

// protected + admin only route
router.post(
    "/add",
    protect,
    adminOnly,
    addCar
);

module.exports = router;