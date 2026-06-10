import { useState } from "react";
import axios from "axios";

function CarCard({ car }) {

    const [date, setDate] = useState("");

    const bookTestDrive = async () => {

        if (!date) {
            alert("Please choose a date and time first");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login to book a test drive");
            return;
        }

        try {

            await axios.post(
                "http://localhost:3000/api/bookings",
                {
                    carId: car._id,
                    date
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Test drive booked!");
            setDate("");

        } catch (error) {

            console.log(error);

            alert("Failed to book test drive");

        }
    };

    return (
        <div className="car-card">

            <h2>{car.title}</h2>

            <p>
                <strong>Brand:</strong> {car.brand}
            </p>

            <p>
                <strong>Year:</strong> {car.year}
            </p>

            <p>
                <strong>Price:</strong> TZS {car.price}
            </p>

            <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            <button onClick={bookTestDrive}>
                Book Test Drive
            </button>

        </div>
    );
}

export default CarCard;
