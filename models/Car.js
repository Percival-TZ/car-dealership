const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true
    },

    brand: {
        type: String,
        required: true
    },

    year: {
        type: Number,
        required: true
    },

    fuelType: {
        type: String
    },

    transmission: {
        type: String
    },

    description: {
        type: String
    },

       price: {
        type: Number,
        required: true
    },


    images: [{
        type: String
    }],

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