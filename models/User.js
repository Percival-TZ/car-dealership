const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["admin", "client"],
        default: "client"
    },

    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car"
        }
    ],

    isVerified: {
        type: Boolean,
        default: true
    },

    verifyToken: {
        type: String,
        default: null
    },

    verifyTokenExpiry: {
        type: Date,
        default: null
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("User", userSchema);