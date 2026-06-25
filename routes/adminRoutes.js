const express = require("express");

const {
    getDashboardStats,
    getUsers,
    getBookings,
    confirmBooking,
    cancelBooking,
    clearBookings
} = require("../controllers/adminController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/dashboard",
    protect,
    adminOnly,
    getDashboardStats
);

router.get(
    "/users",
    protect,
    adminOnly,
    getUsers
);

router.get(
    "/bookings",
    protect,
    adminOnly,
    getBookings
);

router.put(
    "/bookings/:id/confirm",
    protect,
    adminOnly,
    confirmBooking
);

router.delete(
    "/bookings/:id",
    protect,
    adminOnly,
    cancelBooking
);

router.delete(
    "/bookings",
    protect,
    adminOnly,
    clearBookings
);

module.exports = router;