const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
        trim: true
    },

    brand: {
        type: String,
        required: true
    },

    year: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear() + 1
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    condition: {
        type: String,
        enum: ["new", "used"],
        required: true
    },

    images: {
        type: [String],
        default: []
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Car", carSchema);