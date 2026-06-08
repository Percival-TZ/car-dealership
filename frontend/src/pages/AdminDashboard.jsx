import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {

    const [cars, setCars] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        brand: "",
        year: "",
        price: ""
    });

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {

        try {

            const response = await axios.get(
                "http://localhost:3000/api/cars"
            );

            setCars(response.data.cars);

        } catch (error) {

            console.log(error);

        }
    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const createCar = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:3000/api/cars/add",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Car added successfully!");

            setFormData({
                title: "",
                brand: "",
                year: "",
                price: ""
            });

            fetchCars();

        } catch (error) {

            console.log(error);

            alert("Failed to add car");

        }
    };

    const deleteCar = async (id) => {

        const confirmDelete = window.confirm(
            "Delete this car?"
        );

        if (!confirmDelete) return;

        try {

            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:3000/api/cars/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Car deleted!");

            fetchCars();

        } catch (error) {

            console.log(error);

            alert("Failed to delete car");

        }
    };

    return (
        <div className="container">

            <h1>Admin Dashboard</h1>

            <hr />

            <h2>Add New Car</h2>

            <form onSubmit={createCar}>

                <input
                    type="text"
                    name="title"
                    placeholder="Car Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="text"
                    name="brand"
                    placeholder="Brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="number"
                    name="year"
                    placeholder="Year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <button type="submit">
                    Add Car
                </button>

            </form>

            <hr />

            <h2>Available Cars</h2>

            {cars.map((car) => (

                <div
                    key={car._id}
                    style={{
                        border: "1px solid #ccc",
                        padding: "15px",
                        marginBottom: "10px",
                        borderRadius: "8px"
                    }}
                >

                    <h3>{car.title}</h3>

                    <p>
                        <strong>Brand:</strong> {car.brand}
                    </p>

                    <p>
                        <strong>Year:</strong> {car.year}
                    </p>

                    <p>
                        <strong>Price:</strong> {car.price}
                    </p>

                    <button
                        onClick={() => deleteCar(car._id)}
                    >
                        Delete
                    </button>

                </div>

            ))}

        </div>
    );
}

export default AdminDashboard;