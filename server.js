const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cors = require("cors");

dotenv.config();

connectDB();

const app = express();
app.use(cors());
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
const bookingRoutes = require("./routes/bookingRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");

app.use("/api/cars", carRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use(errorHandler);