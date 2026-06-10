const express = require("express");

const {
    createBooking,
    getMyBookings,
    cancelMyBooking
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.delete("/:id", protect, cancelMyBooking);

module.exports = router;
