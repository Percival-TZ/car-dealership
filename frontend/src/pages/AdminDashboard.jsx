import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {

    const [activeTab, setActiveTab] = useState("cars");

    const [cars, setCars] = useState([]);
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        brand: "",
        year: "",
        price: ""
    });

    useEffect(() => {
        fetchCars();
        fetchUsers();
        fetchBookings();
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

    const fetchUsers = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:3000/api/admin/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUsers(response.data);

        } catch (error) {

            console.log(error);

        }
    };

    const fetchBookings = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:3000/api/admin/bookings",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setBookings(response.data);

        } catch (error) {

            console.log(error);

        }
    };

    const cancelBooking = async (id) => {

        const confirmCancel = window.confirm(
            "Cancel this booking?"
        );

        if (!confirmCancel) return;

        try {

            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:3000/api/admin/bookings/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setBookings(
                bookings.filter((booking) => booking._id !== id)
            );

        } catch (error) {

            console.log(error);

            alert("Failed to cancel booking");

        }
    };

    const clearBookings = async () => {

        const confirmClear = window.confirm(
            "Clear all bookings? This cannot be undone."
        );

        if (!confirmClear) return;

        try {

            const token = localStorage.getItem("token");

            await axios.delete(
                "http://localhost:3000/api/admin/bookings",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setBookings([]);

        } catch (error) {

            console.log(error);

            alert("Failed to clear bookings");

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

            <div className="admin-tabs">

                <button
                    className={activeTab === "cars" ? "admin-tab active" : "admin-tab"}
                    onClick={() => setActiveTab("cars")}
                >
                    Cars
                </button>

                <button
                    className={activeTab === "users" ? "admin-tab active" : "admin-tab"}
                    onClick={() => setActiveTab("users")}
                >
                    Users
                </button>

                <button
                    className={activeTab === "bookings" ? "admin-tab active" : "admin-tab"}
                    onClick={() => setActiveTab("bookings")}
                >
                    Bookings
                </button>

            </div>

            {activeTab === "cars" && (

                <>

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

                </>

            )}

            {activeTab === "users" && (

                <>

                    <h2>Registered Users</h2>

                    {users.length === 0 && (
                        <p>No users found.</p>
                    )}

                    {users.map((user) => (

                        <div
                            key={user._id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "15px",
                                marginBottom: "10px",
                                borderRadius: "8px"
                            }}
                        >

                            <h3>{user.username}</h3>

                            <p>
                                <strong>Email:</strong> {user.email}
                            </p>

                            <p>
                                <strong>Role:</strong> {user.role}
                            </p>

                        </div>

                    ))}

                </>

            )}

            {activeTab === "bookings" && (

                <>

                    <div className="admin-section-header">

                        <h2>Bookings</h2>

                        {bookings.length > 0 && (
                            <button onClick={clearBookings}>
                                Clear All
                            </button>
                        )}

                    </div>

                    {bookings.length === 0 && (
                        <p>No bookings found.</p>
                    )}

                    {bookings.map((booking) => (

                        <div
                            key={booking._id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "15px",
                                marginBottom: "10px",
                                borderRadius: "8px"
                            }}
                        >

                            <h3>{booking.car?.title || "Car removed"}</h3>

                            <p>
                                <strong>Customer:</strong> {booking.user?.username}
                                {" "}({booking.user?.email})
                            </p>

                            <p>
                                <strong>Date:</strong>{" "}
                                {new Date(booking.date).toLocaleString()}
                            </p>

                            <p>
                                <strong>Status:</strong> {booking.status}
                            </p>

                            {booking.notes && (
                                <p>
                                    <strong>Notes:</strong> {booking.notes}
                                </p>
                            )}

                            <button
                                onClick={() => cancelBooking(booking._id)}
                            >
                                Cancel
                            </button>

                        </div>

                    ))}

                </>

            )}

        </div>
    );
}

export default AdminDashboard;