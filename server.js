const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Car Dealership API is running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const carRoutes = require("./routes/carRoutes");

app.use("/api/cars", carRoutes);