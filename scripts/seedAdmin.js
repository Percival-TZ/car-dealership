require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existing = await User.findOne({ role: "admin" });
        if (existing) {
            console.log("Admin account already exists:", existing.email);
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);

        const admin = await User.create({
            username: "Admin",
            email: "admin@cardealership.com",
            password: hashedPassword,
            role: "admin",
        });

        console.log("Admin account created successfully!");
        console.log("Email:", admin.email);
        console.log("Password: admin123");
        console.log("IMPORTANT: Change this password after first login!");
    } catch (error) {
        console.error("Seed failed:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

seedAdmin();
