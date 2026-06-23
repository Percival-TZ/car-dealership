const express = require("express");
const upload = require("../middleware/uploadMiddleware");

const {
    addCar,
    getCars,
    getCarById,
    updateCar,
    deleteCar
} = require("../controllers/carController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

// public routes
router.get("/", getCars);
router.get("/:id", getCarById);

// protected admin route
router.post(
    "/add",
    protect,
    adminOnly,
    upload.array("images", 5),
    addCar
);

// update car (admin only)
router.put("/:id", protect, adminOnly, upload.array("images", 5), updateCar);

// delete car (admin only)
router.delete("/:id", protect, adminOnly, deleteCar);

module.exports = router;