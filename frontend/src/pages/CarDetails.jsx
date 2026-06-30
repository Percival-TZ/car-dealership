import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api, { getImageUrl } from "../services/Api";

function CarDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [orderDate, setOrderDate] = useState("");
    const [notes, setNotes] = useState("");
    const [favoriteMsg, setFavoriteMsg] = useState("");
    const [orderMsg, setOrderMsg] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await api.get(`/cars/${id}`);
                setCar(res.data);
            } catch {
                setCar(null);
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    const handleAddFavorite = async () => {
        try {
            await api.post(`/users/favorites/${id}`);
            setFavoriteMsg("Added to favorites!");
        } catch (err) {
            setFavoriteMsg(
                err.response?.data?.message || "Could not add to favorites."
            );
        }
    };

    const handleOrder = async (e) => {
        e.preventDefault();
        try {
            await api.post("/bookings", { carId: id, date: orderDate, notes });
            setOrderMsg("Order placed successfully!");
            setOrderDate("");
            setNotes("");
        } catch {
            setOrderMsg("Failed to place order. Please try again.");
        }
    };

    if (loading) return <div className="container"><p>Loading...</p></div>;
    if (!car) return <div className="container"><p>Car not found.</p></div>;

    const images = car.images && car.images.length > 0 ? car.images : [];

    return (
        <div className="car-details-page">
            <button className="back-btn" onClick={() => navigate(-1)}>
                &larr; Back
            </button>

            <div className="car-details-layout">
                {/* Gallery */}
                <div>
                    <div className="gallery-main">
                        {images.length > 0 ? (
                            <img
                                src={getImageUrl(images[selectedImage])}
                                alt={car.title}
                            />
                        ) : (
                            <div className="car-card-no-image" style={{ height: "100%" }}>
                                No Image Available
                            </div>
                        )}
                    </div>
                    {images.length > 1 && (
                        <div className="gallery-thumbs">
                            {images.map((img, i) => (
                                <img
                                    key={i}
                                    src={getImageUrl(img)}
                                    alt={`${car.title} ${i + 1}`}
                                    className={`gallery-thumb ${selectedImage === i ? "active" : ""}`}
                                    onClick={() => setSelectedImage(i)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="car-details-sidebar">
                    <div className="car-details-header">
                        <h1>{car.title}</h1>
                        <span className={`condition-badge ${car.condition}`}>
                            {car.condition === "new" ? "New" : "Used"}
                        </span>
                    </div>

                    <div className="car-details-price-block">
                        <p className="car-details-price-label">Price</p>
                        <p className="car-details-price">TZS {car.price.toLocaleString()}</p>
                    </div>

                    <div className="car-details-specs">
                        <div className="spec-item">
                            <span className="spec-label">Brand</span>
                            <span className="spec-value">{car.brand}</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-label">Year</span>
                            <span className="spec-value">{car.year}</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-label">Condition</span>
                            <span className="spec-value" style={{ textTransform: "capitalize" }}>
                                {car.condition}
                            </span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-label">Availability</span>
                            <span className={`spec-value ${car.quantity > 0 ? "stock-in" : "stock-out"}`}>
                                {car.quantity > 0 ? `${car.quantity} in stock` : "Out of stock"}
                            </span>
                        </div>

                        {car.customFields && car.customFields.map((field, i) => (
                            <div className="spec-item" key={i}>
                                <span className="spec-label">{field.label}</span>
                                <span className="spec-value">{field.value}</span>
                            </div>
                        ))}
                    </div>

                    {user && user.role === "client" && (
                        <>
                            <button className="favorite-btn" onClick={handleAddFavorite}>
                                &#9825; Add to Favorites
                            </button>
                            {favoriteMsg && <p className="action-msg">{favoriteMsg}</p>}
                        </>
                    )}

                    <div className="car-details-order">
                        <h2>Place an Order</h2>

                        {!user ? (
                            <p style={{ color: "var(--color-text-muted)" }}>
                                <Link to="/login" className="auth-link">Sign in</Link> to place an order.
                            </p>
                        ) : user.role === "admin" ? (
                            <p style={{ color: "var(--color-text-muted)" }}>
                                Admins cannot place orders.
                            </p>
                        ) : (
                            <>
                                {orderMsg && <p className="action-msg">{orderMsg}</p>}
                                <form onSubmit={handleOrder} className="order-form">
                                    <label className="auth-label" htmlFor="order-date">
                                        Preferred Date
                                    </label>
                                    <input
                                        id="order-date"
                                        className="auth-input"
                                        type="datetime-local"
                                        value={orderDate}
                                        onChange={(e) => setOrderDate(e.target.value)}
                                        min={new Date().toISOString().slice(0, 16)}
                                        required
                                    />

                                    <label className="auth-label" htmlFor="notes">
                                        Notes (optional)
                                    </label>
                                    <textarea
                                        id="notes"
                                        className="auth-input"
                                        placeholder="Any special requests..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                    />

                                    <button className="auth-button" type="submit">
                                        Confirm Order
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CarDetails;
