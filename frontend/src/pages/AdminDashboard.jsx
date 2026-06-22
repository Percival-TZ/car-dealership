import { useEffect, useState } from "react";
import axios from "axios";

const NAV_ITEMS = [
    { key: "add-car",  label: "Add Car"  },
    { key: "cars",     label: "Cars"     },
    { key: "users",    label: "Users"    },
    { key: "bookings", label: "Bookings" },
];

const SECTION_TITLES = {
    "add-car":  "Add New Car",
    "cars":     "Available Cars",
    "users":    "Registered Users",
    "bookings": "Orders / Bookings",
};

function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("add-car");

    const [cars, setCars]         = useState([]);
    const [users, setUsers]       = useState([]);
    const [bookings, setBookings] = useState([]);
    const [formSuccess, setFormSuccess] = useState("");
    const [formError, setFormError]     = useState("");

    const [editingCarId, setEditingCarId]   = useState(null);
    const [editFormData, setEditFormData]   = useState({});
    const [editError, setEditError]         = useState("");

    const [formData, setFormData] = useState({
        title: "",
        brand: "",
        year: "",
        price: "",
        condition: "",
    });

    useEffect(() => {
        fetchCars();
        fetchUsers();
        fetchBookings();
    }, []);

    const token = () => localStorage.getItem("token");

    const fetchCars = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/cars");
            setCars(res.data.cars);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/admin/users", {
                headers: { Authorization: `Bearer ${token()}` },
            });
            setUsers(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/admin/bookings", {
                headers: { Authorization: `Bearer ${token()}` },
            });
            setBookings(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormSuccess("");
        setFormError("");
    };

    const createCar = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3000/api/cars/add", formData, {
                headers: { Authorization: `Bearer ${token()}` },
            });
            setFormSuccess("Car added successfully!");
            setFormData({ title: "", brand: "", year: "", price: "", condition: "" });
            fetchCars();
        } catch {
            setFormError("Failed to add car. Please try again.");
        }
    };

    const startEdit = (car) => {
        setEditingCarId(car._id);
        setEditFormData({
            title:     car.title,
            brand:     car.brand,
            year:      car.year,
            price:     car.price,
            condition: car.condition,
        });
        setEditError("");
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
        setEditError("");
    };

    const saveEdit = async (e, id) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:3000/api/cars/${id}`,
                editFormData,
                { headers: { Authorization: `Bearer ${token()}` } }
            );
            setEditingCarId(null);
            fetchCars();
        } catch {
            setEditError("Failed to save changes. Please try again.");
        }
    };

    const deleteCar = async (id) => {
        if (!window.confirm("Delete this car?")) return;
        try {
            await axios.delete(`http://localhost:3000/api/cars/${id}`, {
                headers: { Authorization: `Bearer ${token()}` },
            });
            setCars(cars.filter((c) => c._id !== id));
        } catch {
            alert("Failed to delete car.");
        }
    };

    const cancelBooking = async (id) => {
        if (!window.confirm("Cancel this order?")) return;
        try {
            await axios.delete(`http://localhost:3000/api/admin/bookings/${id}`, {
                headers: { Authorization: `Bearer ${token()}` },
            });
            setBookings(bookings.filter((b) => b._id !== id));
        } catch {
            alert("Failed to cancel order.");
        }
    };

    const clearBookings = async () => {
        if (!window.confirm("Clear ALL orders? This cannot be undone.")) return;
        try {
            await axios.delete("http://localhost:3000/api/admin/bookings", {
                headers: { Authorization: `Bearer ${token()}` },
            });
            setBookings([]);
        } catch {
            alert("Failed to clear orders.");
        }
    };

    const navigate = (section) => {
        setActiveSection(section);
        setSidebarOpen(false);
    };

    return (
        <div className="admin-layout">

            {/* Sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="sidebar-header">
                    <span className="sidebar-title">Admin Panel</span>
                    <button
                        className="sidebar-close-btn"
                        onClick={() => setSidebarOpen(false)}
                    >
                        &#10005;
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.key}
                            className={`sidebar-nav-item ${activeSection === item.key ? "active" : ""}`}
                            onClick={() => navigate(item.key)}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button
                        className="sidebar-logout-btn"
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            window.location.href = "/";
                        }}
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Top bar */}
            <div className="admin-topbar">
                <button
                    className="hamburger-btn"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open menu"
                >
                    <span />
                    <span />
                    <span />
                </button>
                <h1 className="admin-page-title">
                    {SECTION_TITLES[activeSection]}
                </h1>
            </div>

            {/* Main content */}
            <main className="admin-main">

                {/* ── ADD CAR ── */}
                {activeSection === "add-car" && (
                    <div className="admin-card">
                        {formSuccess && (
                            <p className="admin-success">{formSuccess}</p>
                        )}
                        {formError && (
                            <p className="admin-error">{formError}</p>
                        )}

                        <form onSubmit={createCar} className="admin-form">
                            <div className="admin-form-grid">
                                <div className="form-group">
                                    <label className="form-label">Car Title</label>
                                    <input
                                        className="form-input"
                                        type="text"
                                        name="title"
                                        placeholder="e.g. Toyota Corolla 2022"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Brand / Make</label>
                                    <input
                                        className="form-input"
                                        type="text"
                                        name="brand"
                                        placeholder="e.g. Toyota"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Year</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        name="year"
                                        placeholder="e.g. 2022"
                                        value={formData.year}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Price (TZS)</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        name="price"
                                        placeholder="e.g. 25000000"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Condition</label>
                                    <select
                                        className="form-input"
                                        name="condition"
                                        value={formData.condition}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select condition</option>
                                        <option value="new">New</option>
                                        <option value="used">Used</option>
                                    </select>
                                </div>
                            </div>

                            <button className="form-submit-btn" type="submit">
                                Add Car
                            </button>
                        </form>
                    </div>
                )}

                {/* ── CARS LIST ── */}
                {activeSection === "cars" && (
                    <div>
                        {cars.length === 0 ? (
                            <p className="admin-empty">No cars listed yet.</p>
                        ) : (
                            <div className="admin-cards-grid">
                                {cars.map((car) =>
                                    editingCarId === car._id ? (
                                        /* ── Edit form ── */
                                        <div key={car._id} className="admin-item-card admin-item-card--editing">
                                            <p className="editing-label">Editing car</p>
                                            {editError && (
                                                <p className="admin-error" style={{ marginBottom: "12px" }}>
                                                    {editError}
                                                </p>
                                            )}
                                            <form onSubmit={(e) => saveEdit(e, car._id)}>
                                                <div className="edit-form-fields">
                                                    <div className="form-group">
                                                        <label className="form-label">Title</label>
                                                        <input
                                                            className="form-input"
                                                            type="text"
                                                            name="title"
                                                            value={editFormData.title}
                                                            onChange={handleEditChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Brand</label>
                                                        <input
                                                            className="form-input"
                                                            type="text"
                                                            name="brand"
                                                            value={editFormData.brand}
                                                            onChange={handleEditChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Year</label>
                                                        <input
                                                            className="form-input"
                                                            type="number"
                                                            name="year"
                                                            value={editFormData.year}
                                                            onChange={handleEditChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Price (TZS)</label>
                                                        <input
                                                            className="form-input"
                                                            type="number"
                                                            name="price"
                                                            value={editFormData.price}
                                                            onChange={handleEditChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Condition</label>
                                                        <select
                                                            className="form-input"
                                                            name="condition"
                                                            value={editFormData.condition}
                                                            onChange={handleEditChange}
                                                            required
                                                        >
                                                            <option value="new">New</option>
                                                            <option value="used">Used</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="edit-form-actions">
                                                    <button className="form-submit-btn" type="submit">
                                                        Save
                                                    </button>
                                                    <button
                                                        className="admin-delete-btn"
                                                        type="button"
                                                        onClick={() => setEditingCarId(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        /* ── Display card ── */
                                        <div key={car._id} className="admin-item-card">
                                            <div className="admin-item-card-header">
                                                <h3>{car.title}</h3>
                                                <span className={`condition-badge ${car.condition}`}>
                                                    {car.condition === "new" ? "New" : "Used"}
                                                </span>
                                            </div>
                                            <p><strong>Brand:</strong> {car.brand}</p>
                                            <p><strong>Year:</strong> {car.year}</p>
                                            <p><strong>Price:</strong> TZS {car.price.toLocaleString()}</p>
                                            <div className="admin-card-actions">
                                                <button
                                                    className="admin-edit-btn"
                                                    onClick={() => startEdit(car)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="admin-delete-btn"
                                                    onClick={() => deleteCar(car._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ── USERS ── */}
                {activeSection === "users" && (
                    <div>
                        {users.length === 0 ? (
                            <p className="admin-empty">No registered users yet.</p>
                        ) : (
                            <div className="admin-cards-grid">
                                {users.map((user) => (
                                    <div key={user._id} className="admin-item-card">
                                        <h3>{user.username}</h3>
                                        <p><strong>Email:</strong> {user.email}</p>
                                        <p>
                                            <strong>Joined:</strong>{" "}
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── BOOKINGS ── */}
                {activeSection === "bookings" && (
                    <div>
                        {bookings.length === 0 ? (
                            <p className="admin-empty">No orders found.</p>
                        ) : (
                            <>
                                <div className="admin-bookings-header">
                                    <p>{bookings.length} order(s) total</p>
                                    <button
                                        className="admin-clear-btn"
                                        onClick={clearBookings}
                                    >
                                        Clear All
                                    </button>
                                </div>

                                <div className="orders-list">
                                    {bookings.map((booking) => (
                                        <div key={booking._id} className="order-card">
                                            <div className="order-card-header">
                                                <h3>
                                                    {booking.car?.title || "Car removed"}
                                                </h3>
                                                <span className={`status-badge ${booking.status}`}>
                                                    {booking.status.charAt(0).toUpperCase() +
                                                        booking.status.slice(1)}
                                                </span>
                                            </div>
                                            <p>
                                                <strong>Customer:</strong>{" "}
                                                {booking.user?.username}{" "}
                                                ({booking.user?.email})
                                            </p>
                                            <p>
                                                <strong>Date:</strong>{" "}
                                                {new Date(booking.date).toLocaleString()}
                                            </p>
                                            {booking.notes && (
                                                <p>
                                                    <strong>Notes:</strong> {booking.notes}
                                                </p>
                                            )}
                                            <button
                                                className="remove-btn"
                                                style={{ marginTop: "12px", maxWidth: "140px" }}
                                                onClick={() => cancelBooking(booking._id)}
                                            >
                                                Cancel Order
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

            </main>
        </div>
    );
}

export default AdminDashboard;
