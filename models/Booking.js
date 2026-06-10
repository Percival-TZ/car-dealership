const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    notes: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Booking", bookingSchema);
