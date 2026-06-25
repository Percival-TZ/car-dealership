import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api, { getImageUrl } from "../services/Api";

function CarDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
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

    return (
        <div className="container">
            <button className="back-btn" onClick={() => navigate(-1)}>
                &larr; Back
            </button>

            <div className="car-details-card">
                {car.images && car.images.length > 0 && (
                    <div className="car-images">
                        {car.images.map((img, i) => (
                            <img
                                key={i}
                                src={getImageUrl(img)}
                                alt={car.title}
                                className="car-detail-img"
                            />
                        ))}
                    </div>
                )}

                <div className="car-details-info">
                    <h1>{car.title}</h1>

                    <span className={`condition-badge ${car.condition}`}>
                        {car.condition === "new" ? "New" : "Used"}
                    </span>

                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="detail-label">Brand</span>
                            <span className="detail-value">{car.brand}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Year</span>
                            <span className="detail-value">{car.year}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Condition</span>
                            <span className="detail-value" style={{ textTransform: "capitalize" }}>
                                {car.condition}
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Price</span>
                            <span className="detail-value price-tag">
                                TZS {car.price.toLocaleString()}
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Availability</span>
                            <span className={`detail-value ${car.quantity > 0 ? "stock-in" : "stock-out"}`}>
                                {car.quantity > 0 ? `${car.quantity} in stock` : "Out of stock"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="car-actions">
                    {user && user.role === "client" && (
                        <div className="favorite-section">
                            <button
                                className="favorite-btn"
                                onClick={handleAddFavorite}
                            >
                                &#9825; Add to Favorites
                            </button>
                            {favoriteMsg && (
                                <p className="action-msg">{favoriteMsg}</p>
                            )}
                        </div>
                    )}

                    <div className="order-section">
                        <h2>Place an Order</h2>

                        {!user ? (
                            <p>
                                <Link to="/login">Log in</Link> to place an order.
                            </p>
                        ) : user.role === "admin" ? (
                            <p className="auth-subtitle">
                                Admins cannot place orders.
                            </p>
                        ) : (
                            <>
                                {orderMsg && (
                                    <p className="action-msg">{orderMsg}</p>
                                )}
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
